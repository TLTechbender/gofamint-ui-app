import { Response } from "express";
import { AuthRequest } from "../../common/constants";
import { catchAsync } from "../../utils/catchAsync";
import { acceptAdminInviteSchema } from "../../schemas/admin/acceptAdminInviteSchema";
import { formatZodErrors } from "../../utils/formatZodErrors";
import { AppError } from "../../utils/appError";
import { AppResponse } from "../../utils/appResponse";
import { prisma } from "../../database/prisma";

export const acceptAdminInvite = catchAsync(
  async (req: AuthRequest, res: Response) => {


    const validationResult = acceptAdminInviteSchema.safeParse(req.body);
        if (!validationResult.success) {
          const formattedErrors = formatZodErrors(validationResult.error);
          throw new AppError("Validation failed", 400, formattedErrors);
        }
    
    
    

    const { token } = validationResult.data;
    const userId = req.user?.id; 
    const userEmail = req.user?.email;

    
    if (!userId || !userEmail) {
      return AppResponse(res, 401, null, 'Authentication required');
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

   
    if (!invitation) {
     throw new AppError( 'Invalid invitation token', 400);

    }

    
    if (invitation.status === 'ACCEPTED') {
     throw new AppError( 'This invite has already been accepted', 400);
    }

  
    if (invitation.status === 'REVOKED') {
   throw new AppError( 'This invitation has already been revoked', 400);
    }

  
    if (invitation.expiresAt < new Date()) {
      // Auto-update status to EXPIRED
      await prisma.adminInvitation.update({
        where: { id: invitation.id },
        data: { status: 'EXPIRED' },
      });

  throw new AppError( 'Expired Invite, You can attempt to request a new one', 400);
    }


    if (invitation.email.toLowerCase() !== userEmail.toLowerCase()) {
    throw new AppError( "This invite ain't meant for you dawg", 400);
    }

   
    const existingAdmin = await prisma.admin.findUnique({
      where: { userId },
    });

    if (existingAdmin) {
   throw new AppError( "You is already an admin", 400);
    }

    
    const [admin, updatedInvitation] = await prisma.$transaction([
   
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

    
      prisma.adminInvitation.update({
        where: { id: invitation.id },
        data: {
          status: 'ACCEPTED',
          acceptedAt: new Date(),
          userId,
        },
      }),

    
      prisma.adminActivityLog.create({
        data: {
          adminId: invitation.invitedBy,
          action: 'ADMIN_INVITATION_ACCEPTED',
          entity: 'Admin',
          entityId: userId,
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


//Gbemi debe