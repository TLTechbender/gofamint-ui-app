import { Response } from 'express';
import { z } from 'zod';
import { catchAsync } from '../../utils/catchAsync';
import { AppResponse } from '../../utils/appResponse';
import { prisma } from '../../database/prisma';
import { AuthRequest } from '../../common/constants';


//advanced user type shit bro

// ============================================
// ZOD VALIDATION SCHEMAS
// ============================================

export const getUsersSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1, 'Page must be at least 1')),
  limit: z
    .string()
    .optional()
    .default('20')
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .int()
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit cannot exceed 100')
    ),
  search: z
    .string()
    .max(100, 'Search query too long')
    .optional()
    .transform((val) => (val ? val.trim() : undefined)),
  sortBy: z
    .enum(['createdAt', 'userName', 'email', 'firstName', 'lastName'])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  isVerified: z
    .string()
    .optional()
    .transform((val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      return undefined;
    }),
  isDeleted: z
    .string()
    .optional()
    .default('false')
    .transform((val) => val === 'true'),
  authProvider: z.enum(['LOCAL', 'GOOGLE']).optional(),
  role: z.enum(['user', 'author', 'admin']).optional(), // Filter by role
});

export const getUserByIdSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
});

// ============================================
// 1. GET ALL USERS (with search & filters)
// ============================================

/**
 * Get all users with advanced filtering, search, and pagination
 * 
 * @route GET /api/admin/users
 * @query page, limit, search, sortBy, sortOrder, isVerified, isDeleted, authProvider, role
 * @access Admin only
 * 
 * Search works on: firstName, lastName, userName, email
 * 
 * Examples:
 * - /api/admin/users?search=john
 * - /api/admin/users?isVerified=true&page=2
 * - /api/admin/users?authProvider=GOOGLE&sortBy=createdAt
 * - /api/admin/users?role=author
 */
export const getAllUsers = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const adminId = req.user?.adminId;

    if (!adminId) {
      return AppResponse(res, 401, null, 'Admin authentication required');
    }

    // Validate query params with Zod
    const validationResult = getUsersSchema.safeParse(req.query);

    if (!validationResult.success) {
      return AppResponse(
        res,
        400,
        { errors: validationResult.error.errors },
        'Invalid query parameters'
      );
    }

    const {
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      isVerified,
      isDeleted,
      authProvider,
      role,
    } = validationResult.data;

    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {
      isDeleted,
    };

    // Filter by verification status
    if (isVerified !== undefined) {
      whereClause.isVerified = isVerified;
    }

    // Filter by auth provider
    if (authProvider) {
      whereClause.authProvider = authProvider;
    }

    // Filter by role (user, author, or admin)
    if (role === 'author') {
      whereClause.author = { isNot: null };
    } else if (role === 'admin') {
      whereClause.admin = { isNot: null };
    } else if (role === 'user') {
      // Regular users (not authors, not admins)
      whereClause.author = null;
      whereClause.admin = null;
    }

    // Search functionality
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { userName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Execute queries in parallel
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          email: true,
          userName: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          bio: true,
          authProvider: true,
          isVerified: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          // Check if user is an author
          author: {
            select: {
              id: true,
              status: true,
              isSuspended: true,
              isDeleted: true,
              _count: {
                select: { blogs: true },
              },
            },
          },
          // Check if user is an admin
          admin: {
            select: {
              id: true,
              isActive: true,
              isSuspended: true,
              isDeleted: true,
            },
          },
          // Engagement stats
          _count: {
            select: {
              comments: true,
              blogLikes: true,
              commentLikes: true,
              blogReads: true,
            },
          },
        },
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    // Transform data for response
    const transformedUsers = users.map((user) => {
      // Determine user role(s)
      const roles: string[] = ['user'];
      if (user.author && !user.author.isDeleted) {
        roles.push('author');
      }
      if (user.admin && !user.admin.isDeleted) {
        roles.push('admin');
      }

      return {
        id: user.id,
        email: user.email,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        bio: user.bio,
        authProvider: user.authProvider,
        isVerified: user.isVerified,
        isDeleted: user.isDeleted,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
        roles,
        // Author info (if applicable)
        authorInfo: user.author
          ? {
              id: user.author.id,
              status: user.author.status,
              isSuspended: user.author.isSuspended,
              blogCount: user.author._count.blogs,
            }
          : null,
        // Admin info (if applicable)
        adminInfo: user.admin
          ? {
              id: user.admin.id,
              isActive: user.admin.isActive,
              isSuspended: user.admin.isSuspended,
            }
          : null,
        // Engagement stats
        engagement: {
          comments: user._count.comments,
          blogLikes: user._count.blogLikes,
          commentLikes: user._count.commentLikes,
          blogReads: user._count.blogReads,
        },
      };
    });

    const totalPages = Math.ceil(totalCount / limit);

    return AppResponse(
      res,
      200,
      {
        users: transformedUsers,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        filters: {
          search: search || null,
          isVerified: isVerified ?? null,
          isDeleted,
          authProvider: authProvider || null,
          role: role || null,
        },
      },
      `Retrieved ${transformedUsers.length} user(s)`
    );
  }
);

// ============================================
// 2. GET USER BY ID (Detailed View)
// ============================================

/**
 * Get detailed information about a specific user
 * 
 * @route GET /api/admin/users/:userId
 * @access Admin only
 * 
 * Returns full user details including:
 * - Basic info
 * - Author status and blogs
 * - Admin status
 * - Recent activity
 * - Engagement metrics
 */
export const getUserById = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const adminId = req.user?.adminId;

    if (!adminId) {
      return AppResponse(res, 401, null, 'Admin authentication required');
    }

    // Validate userId
    const validationResult = getUserByIdSchema.safeParse(req.params);

    if (!validationResult.success) {
      return AppResponse(
        res,
        400,
        { errors: validationResult.error.errors },
        'Invalid user ID'
      );
    }

    const { userId } = validationResult.data;

    // Fetch user with all related data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        userName: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        bio: true,
        authProvider: true,
        googleId: true,
        isVerified: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        // Author details
        author: {
          select: {
            id: true,
            authorBio: true,
            profilePic: true,
            status: true,
            appliedAt: true,
            approvedAt: true,
            rejectedAt: true,
            rejectionReason: true,
            isSuspended: true,
            isDeleted: true,
            socials: {
              select: {
                platform: true,
                url: true,
                handle: true,
              },
            },
            blogs: {
              where: { isDeleted: false },
              select: {
                id: true,
                sanitySlug: true,
                isPublishedInSanity: true,
                publishedAt: true,
                verifiedViewCount: true,
                genericViewCount: true,
                approvedBy: true,
                _count: {
                  select: {
                    likes: true,
                    comments: true,
                  },
                },
              },
              orderBy: { createdAt: 'desc' },
              take: 10, // Last 10 blogs
            },
            _count: {
              select: { blogs: true },
            },
          },
        },
        // Admin details
        admin: {
          select: {
            id: true,
            invitedAt: true,
            isActive: true,
            isSuspended: true,
            suspendedAt: true,
            suspensionReason: true,
            lastActiveAt: true,
            isDeleted: true,
            inviter: {
              select: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    userName: true,
                  },
                },
              },
            },
          },
        },
        // Recent comments
        comments: {
          where: { isDeleted: false },
          select: {
            id: true,
            content: true,
            createdAt: true,
            blog: {
              select: {
                sanitySlug: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        // Engagement counts
        _count: {
          select: {
            comments: true,
            blogLikes: true,
            commentLikes: true,
            blogReads: true,
            sessions: true,
          },
        },
      },
    });

    if (!user) {
      return AppResponse(res, 404, null, 'User not found');
    }

    // Determine roles
    const roles: string[] = ['user'];
    if (user.author && !user.author.isDeleted) {
      roles.push('author');
    }
    if (user.admin && !user.admin.isDeleted) {
      roles.push('admin');
    }

    // Format response
    const userDetails = {
      id: user.id,
      email: user.email,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      bio: user.bio,
      authProvider: user.authProvider,
      googleId: user.googleId,
      isVerified: user.isVerified,
      isDeleted: user.isDeleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      roles,
      // Author section
      author: user.author
        ? {
            id: user.author.id,
            bio: user.author.authorBio,
            profilePic: user.author.profilePic,
            status: user.author.status,
            appliedAt: user.author.appliedAt,
            approvedAt: user.author.approvedAt,
            rejectedAt: user.author.rejectedAt,
            rejectionReason: user.author.rejectionReason,
            isSuspended: user.author.isSuspended,
            socials: user.author.socials,
            totalBlogs: user.author._count.blogs,
            recentBlogs: user.author.blogs.map((blog) => ({
              id: blog.id,
              slug: blog.sanitySlug,
              published: blog.isPublishedInSanity,
              publishedAt: blog.publishedAt,
              views: blog.verifiedViewCount,
              likes: blog._count.likes,
              comments: blog._count.comments,
              isApproved: blog.approvedBy !== null,
            })),
          }
        : null,
      // Admin section
      admin: user.admin
        ? {
            id: user.admin.id,
            invitedAt: user.admin.invitedAt,
            isActive: user.admin.isActive,
            isSuspended: user.admin.isSuspended,
            suspendedAt: user.admin.suspendedAt,
            suspensionReason: user.admin.suspensionReason,
            lastActiveAt: user.admin.lastActiveAt,
            invitedBy: user.admin.inviter
              ? `${user.admin.inviter.user.firstName} ${user.admin.inviter.user.lastName}`
              : null,
          }
        : null,
      // Activity section
      activity: {
        recentComments: user.comments.map((comment) => ({
          id: comment.id,
          content:
            comment.content.length > 100
              ? comment.content.substring(0, 100) + '...'
              : comment.content,
          createdAt: comment.createdAt,
          blogSlug: comment.blog.sanitySlug,
        })),
        totalComments: user._count.comments,
        totalBlogLikes: user._count.blogLikes,
        totalCommentLikes: user._count.commentLikes,
        totalBlogReads: user._count.blogReads,
        totalSessions: user._count.sessions,
      },
    };

    return AppResponse(
      res,
      200,
      { user: userDetails },
      'User details retrieved successfully'
    );
  }
);

// ============================================
// 3. GET USER STATISTICS
// ============================================

/**
 * Get aggregate statistics about users
 * 
 * @route GET /api/admin/users/stats
 * @access Admin only
 * 
 * Returns counts and breakdown by various categories
 */
export const getUserStatistics = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const adminId = req.user?.adminId;

    if (!adminId) {
      return AppResponse(res, 401, null, 'Admin authentication required');
    }

    const [
      totalUsers,
      verifiedUsers,
      unverifiedUsers,
      deletedUsers,
      localUsers,
      googleUsers,
      usersWithAuthorRole,
      usersWithAdminRole,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isVerified: true, isDeleted: false } }),
      prisma.user.count({ where: { isVerified: false, isDeleted: false } }),
      prisma.user.count({ where: { isDeleted: true } }),
      prisma.user.count({ where: { authProvider: 'LOCAL', isDeleted: false } }),
      prisma.user.count({ where: { authProvider: 'GOOGLE', isDeleted: false } }),
      prisma.user.count({
        where: {
          author: { isNot: null, isDeleted: false },
          isDeleted: false,
        },
      }),
      prisma.user.count({
        where: {
          admin: { isNot: null, isDeleted: false },
          isDeleted: false,
        },
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          isDeleted: false,
        },
      }),
    ]);

    return AppResponse(
      res,
      200,
      {
        total: totalUsers,
        verified: verifiedUsers,
        unverified: unverifiedUsers,
        deleted: deletedUsers,
        byProvider: {
          local: localUsers,
          google: googleUsers,
        },
        byRole: {
          authors: usersWithAuthorRole,
          admins: usersWithAdminRole,
          regularUsers: totalUsers - usersWithAuthorRole - usersWithAdminRole,
        },
        recentSignups: {
          last7Days: recentUsers,
        },
      },
      'User statistics retrieved successfully'
    );
  }
);