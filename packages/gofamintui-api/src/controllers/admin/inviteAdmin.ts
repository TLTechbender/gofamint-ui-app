import { Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { AppResponse } from '../../utils/appResponse';
import { prisma } from '../../database/prisma';
import { AuthRequest } from '../../common/constants';
import crypto from 'crypto';

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate secure random token for invitation
 */
const generateInvitationToken = (): string => {
  return crypto.randomBytes(32).toString('hex'); // 64 character hex string
};

/**
 * Send invitation email (implement based on your email service)
 */
const sendInvitationEmail = async (
  email: string,
  token: string,
  inviterName: string
) => {
  // TODO: Implement with your email service (SendGrid, AWS SES, etc.)
  const inviteUrl = `${process.env.FRONTEND_URL}/admin/accept-invitation?token=${token}`;
  
  console.log(`
    📧 INVITATION EMAIL
    To: ${email}
    From: ${inviterName}
    Link: ${inviteUrl}
    Token: ${token}
  `);

  // Example with nodemailer or your email service:
  /*
  await emailService.send({
    to: email,
    subject: 'Admin Invitation',
    template: 'admin-invitation',
    data: {
      inviterName,
      inviteUrl,
      expiresIn: '7 days',
    },
  });
  */
};

// ============================================
// 1. SEND ADMIN INVITATION
// ============================================

/**
 * Send invitation to make a user an admin
 * 
 * @route POST /api/admin/invitations/send
 * @body { email: string }
 * @access Admin only
 * 
 * Business Logic:
 * - Checks if user exists with that email
 * - Checks if user is already an admin
 * - Creates invitation with secure token
 * - Sends invitation email
 * - Sets expiration (7 days)
 */
export const sendAdminInvitation = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { email } = req.body;
    const adminId = req.user?.adminId;
    const inviterName = req.user?.firstName + ' ' + req.user?.lastName;

    // Validation: Admin must be authenticated
    if (!adminId) {
      return AppResponse(res, 401, null, 'Admin authentication required');
    }

    // Validation: Email is required
    if (!email || !email.trim()) {
      return AppResponse(res, 400, null, 'Email is required');
    }

    // Validation: Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return AppResponse(res, 400, null, 'Invalid email format');
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isDeleted: true,
        admin: {
          select: {
            id: true,
            isActive: true,
            isSuspended: true,
            isDeleted: true,
          },
        },
      },
    });

    // User must exist in the system first
    if (!user) {
      return AppResponse(
        res,
        404,
        null,
        'No user found with this email. User must create an account first.'
      );
    }

    // Check if user is deleted
    if (user.isDeleted) {
      return AppResponse(res, 400, null, 'Cannot invite a deleted user');
    }

    // Check if user is already an admin
    if (user.admin) {
      if (user.admin.isDeleted) {
        return AppResponse(
          res,
          400,
          null,
          'This user was previously an admin. Contact support to restore access.'
        );
      }
      if (user.admin.isSuspended) {
        return AppResponse(
          res,
          400,
          null,
          'This user is a suspended admin. Unsuspend them instead of sending a new invitation.'
        );
      }
      return AppResponse(res, 400, null, 'User is already an admin');
    }

    // Check for existing pending invitation
    const existingInvitation = await prisma.adminInvitation.findFirst({
      where: {
        email: normalizedEmail,
        status: 'PENDING',
        expiresAt: { gte: new Date() }, // Not expired
      },
    });

    if (existingInvitation) {
      return AppResponse(
        res,
        400,
        null,
        'A pending invitation already exists for this email'
      );
    }

    // Generate secure token
    const token = generateInvitationToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

    // Create invitation
    const invitation = await prisma.adminInvitation.create({
      data: {
        email: normalizedEmail,
        token,
        invitedBy: adminId,
        expiresAt,
        status: 'PENDING',
      },
      select: {
        id: true,
        email: true,
        sentAt: true,
        expiresAt: true,
        inviter: {
          select: {
            user: {
              select: { firstName: true, lastName: true, email: true },
            },
          },
        },
      },
    });

    // Send invitation email
    try {
      await sendInvitationEmail(normalizedEmail, token, inviterName);
    } catch (error) {
      console.error('Failed to send invitation email:', error);
      // Don't fail the request - invitation is created, email can be resent
    }

    // Log the action
    await prisma.adminActivityLog.create({
      data: {
        adminId,
        action: 'SENT_ADMIN_INVITATION',
        entity: 'AdminInvitation',
        entityId: invitation.id,
        metadata: {
          inviteeEmail: normalizedEmail,
          expiresAt: invitation.expiresAt,
        },
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    return AppResponse(
      res,
      200,
      {
        invitation: {
          id: invitation.id,
          email: invitation.email,
          sentAt: invitation.sentAt,
          expiresAt: invitation.expiresAt,
        },
      },
      'Admin invitation sent successfully'
    );
  }
);

// ============================================
// 2. ACCEPT ADMIN INVITATION
// ============================================

/**
 * Accept an admin invitation (user endpoint, not admin-only)
 * 
 * @route POST /api/admin/invitations/accept
 * @body { token: string }
 * @access Authenticated user only (not admin-only)
 * 
 * Business Logic:
 * - Validates token
 * - Checks expiration
 * - Verifies user email matches invitation
 * - Creates Admin record
 * - Updates invitation status
 */
export const acceptAdminInvitation = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { token } = req.body;
    const userId = req.user?.id; // Regular user ID, not admin
    const userEmail = req.user?.email;

    // Validation: User must be authenticated
    if (!userId || !userEmail) {
      return AppResponse(res, 401, null, 'Authentication required');
    }

    // Validation: Token is required
    if (!token || !token.trim()) {
      return AppResponse(res, 400, null, 'Invitation token is required');
    }

    // Find invitation
    const invitation = await prisma.adminInvitation.findUnique({
      where: { token: token.trim() },
      select: {
        id: true,
        email: true,
        userId: true,
        status: true,
        expiresAt: true,
        invitedBy: true,
        acceptedAt: true,
        revokedAt: true,
      },
    });

    // Check if invitation exists
    if (!invitation) {
      return AppResponse(res, 404, null, 'Invalid invitation token');
    }

    // Check if already accepted
    if (invitation.status === 'ACCEPTED') {
      return AppResponse(
        res,
        400,
        null,
        'This invitation has already been accepted'
      );
    }

    // Check if revoked
    if (invitation.status === 'REVOKED') {
      return AppResponse(
        res,
        400,
        null,
        'This invitation has been revoked'
      );
    }

    // Check if expired
    if (invitation.expiresAt < new Date()) {
      // Auto-update status to EXPIRED
      await prisma.adminInvitation.update({
        where: { id: invitation.id },
        data: { status: 'EXPIRED' },
      });

      return AppResponse(
        res,
        400,
        null,
        'This invitation has expired. Request a new one.'
      );
    }

    // Verify email matches
    if (invitation.email.toLowerCase() !== userEmail.toLowerCase()) {
      return AppResponse(
        res,
        403,
        null,
        'This invitation was sent to a different email address'
      );
    }

    // Check if user is already an admin
    const existingAdmin = await prisma.admin.findUnique({
      where: { userId },
    });

    if (existingAdmin) {
      return AppResponse(res, 400, null, 'You are already an admin');
    }

    // Accept invitation - create admin record
    const [admin, updatedInvitation] = await prisma.$transaction([
      // Create admin record
      prisma.admin.create({
        data: {
          userId,
          invitedBy: invitation.invitedBy,
          isActive: true,
        },
        select: {
          id: true,
          userId: true,
          invitedAt: true,
          isActive: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              userName: true,
            },
          },
        },
      }),

      // Update invitation status
      prisma.adminInvitation.update({
        where: { id: invitation.id },
        data: {
          status: 'ACCEPTED',
          acceptedAt: new Date(),
          userId,
        },
      }),

      // Log the action (using the inviter's admin ID)
      prisma.adminActivityLog.create({
        data: {
          adminId: invitation.invitedBy,
          action: 'ADMIN_INVITATION_ACCEPTED',
          entity: 'Admin',
          entityId: userId, // Will be the new admin's user ID
          metadata: {
            invitationId: invitation.id,
            newAdminEmail: userEmail,
          },
        },
      }),
    ]);

    return AppResponse(
      res,
      200,
      {
        admin: {
          id: admin.id,
          user: admin.user,
          invitedAt: admin.invitedAt,
        },
      },
      'Admin invitation accepted successfully. You are now an admin!'
    );
  }
);

// ============================================
// 3. REVOKE ADMIN INVITATION
// ============================================

/**
 * Revoke a pending invitation
 * 
 * @route POST /api/admin/invitations/:invitationId/revoke
 * @body { reason?: string }
 * @access Admin only
 */
export const revokeAdminInvitation = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { invitationId } = req.params;
    const { reason } = req.body;
    const adminId = req.user?.adminId;

    if (!adminId) {
      return AppResponse(res, 401, null, 'Admin authentication required');
    }

    // Find invitation
    const invitation = await prisma.adminInvitation.findUnique({
      where: { id: invitationId },
      select: {
        id: true,
        email: true,
        status: true,
        invitedBy: true,
      },
    });

    if (!invitation) {
      return AppResponse(res, 404, null, 'Invitation not found');
    }

    // Check if already accepted
    if (invitation.status === 'ACCEPTED') {
      return AppResponse(
        res,
        400,
        null,
        'Cannot revoke an accepted invitation. Remove admin access instead.'
      );
    }

    // Check if already revoked
    if (invitation.status === 'REVOKED') {
      return AppResponse(res, 400, null, 'Invitation is already revoked');
    }

    // Revoke the invitation
    const [updatedInvitation] = await prisma.$transaction([
      prisma.adminInvitation.update({
        where: { id: invitationId },
        data: {
          status: 'REVOKED',
          revokedAt: new Date(),
          revokedBy: adminId,
          revokeReason: reason?.trim() || null,
        },
      }),

      // Log the action
      prisma.adminActivityLog.create({
        data: {
          adminId,
          action: 'REVOKED_ADMIN_INVITATION',
          entity: 'AdminInvitation',
          entityId: invitationId,
          metadata: {
            inviteeEmail: invitation.email,
            reason: reason?.trim() || 'No reason provided',
          },
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        },
      }),
    ]);

    return AppResponse(
      res,
      200,
      { invitation: updatedInvitation },
      'Admin invitation revoked successfully'
    );
  }
);

// ============================================
// 4. RESEND ADMIN INVITATION
// ============================================

/**
 * Resend an invitation email (generates new token)
 * 
 * @route POST /api/admin/invitations/:invitationId/resend
 * @access Admin only
 */
export const resendAdminInvitation = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { invitationId } = req.params;
    const adminId = req.user?.adminId;
    const inviterName = req.user?.firstName + ' ' + req.user?.lastName;

    if (!adminId) {
      return AppResponse(res, 401, null, 'Admin authentication required');
    }

    // Find invitation
    const invitation = await prisma.adminInvitation.findUnique({
      where: { id: invitationId },
      select: {
        id: true,
        email: true,
        status: true,
        expiresAt: true,
      },
    });

    if (!invitation) {
      return AppResponse(res, 404, null, 'Invitation not found');
    }

    // Can only resend pending invitations
    if (invitation.status !== 'PENDING') {
      return AppResponse(
        res,
        400,
        null,
        `Cannot resend ${invitation.status.toLowerCase()} invitation`
      );
    }

    // Generate new token and extend expiration
    const newToken = generateInvitationToken();
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7);

    // Update invitation
    const updatedInvitation = await prisma.adminInvitation.update({
      where: { id: invitationId },
      data: {
        token: newToken,
        expiresAt: newExpiresAt,
        sentAt: new Date(), // Update sent timestamp
      },
    });

    // Resend email
    try {
      await sendInvitationEmail(invitation.email, newToken, inviterName);
    } catch (error) {
      console.error('Failed to resend invitation email:', error);
    }

    // Log the action
    await prisma.adminActivityLog.create({
      data: {
        adminId,
        action: 'RESENT_ADMIN_INVITATION',
        entity: 'AdminInvitation',
        entityId: invitationId,
        metadata: {
          inviteeEmail: invitation.email,
        },
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    return AppResponse(
      res,
      200,
      {
        invitation: {
          id: updatedInvitation.id,
          email: updatedInvitation.email,
          sentAt: updatedInvitation.sentAt,
          expiresAt: updatedInvitation.expiresAt,
        },
      },
      'Invitation resent successfully'
    );
  }
);

// ============================================
// 5. GET ALL INVITATIONS (with filters)
// ============================================

/**
 * Get all admin invitations with filtering
 * 
 * @route GET /api/admin/invitations
 * @query status, page, limit
 * @access Admin only
 */
export const getAdminInvitations = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const adminId = req.user?.adminId;

    if (!adminId) {
      return AppResponse(res, 401, null, 'Admin authentication required');
    }

    const {
      status,
      page = '1',
      limit = '20',
    } = req.query as {
      status?: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
      page?: string;
      limit?: string;
    };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    // Get invitations with pagination
    const [invitations, totalCount] = await Promise.all([
      prisma.adminInvitation.findMany({
        where: whereClause,
        skip,
        take: limitNum,
        orderBy: { sentAt: 'desc' },
        select: {
          id: true,
          email: true,
          status: true,
          sentAt: true,
          expiresAt: true,
          acceptedAt: true,
          revokedAt: true,
          revokeReason: true,
          inviter: {
            select: {
              user: {
                select: { firstName: true, lastName: true, userName: true },
              },
            },
          },
          user: {
            select: { firstName: true, lastName: true, userName: true },
          },
        },
      }),
      prisma.adminInvitation.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    return AppResponse(
      res,
      200,
      {
        invitations,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1,
        },
      },
      'Admin invitations retrieved successfully'
    );
  }
);

// ============================================
// 6. GET INVITATION BY TOKEN (public check)
// ============================================

/**
 * Get invitation details by token (for invitation page)
 * 
 * @route GET /api/admin/invitations/token/:token
 * @access Public (no auth required)
 * 
 * Used by frontend to show invitation details before user logs in
 */
export const getInvitationByToken = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { token } = req.params;

    if (!token || !token.trim()) {
      return AppResponse(res, 400, null, 'Token is required');
    }

    const invitation = await prisma.adminInvitation.findUnique({
      where: { token: token.trim() },
      select: {
        id: true,
        email: true,
        status: true,
        sentAt: true,
        expiresAt: true,
        inviter: {
          select: {
            user: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
    });

    if (!invitation) {
      return AppResponse(res, 404, null, 'Invalid invitation token');
    }

    // Check if expired
    const isExpired = invitation.expiresAt < new Date();

    return AppResponse(
      res,
      200,
      {
        email: invitation.email,
        status: isExpired ? 'EXPIRED' : invitation.status,
        invitedBy: `${invitation.inviter.user.firstName} ${invitation.inviter.user.lastName}`,
        sentAt: invitation.sentAt,
        expiresAt: invitation.expiresAt,
        isValid: invitation.status === 'PENDING' && !isExpired,
      },
      'Invitation details retrieved'
    );
  }
);