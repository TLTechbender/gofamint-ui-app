import { Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { AppResponse } from '../../utils/appResponse';
import { prisma } from '../../database/prisma';
import { AuthRequest } from '../../common/constants';

// ============================================
// TYPES & INTERFACES
// ============================================

interface ApproveBlogRequest {
  blogId: string;
}

interface UnapproveBlogRequest {
  blogId: string;
  reason: string; // Why are we unapproving?
}

interface PendingBlogsQuery {
  page?: string;
  limit?: string;
  sortBy?: 'createdAt' | 'verifiedViewCount' | 'genericViewCount';
  order?: 'asc' | 'desc';
}

export interface PendingBlog {
  id: string;
  sanityId: string;
  sanitySlug: string;
  isPublishedInSanity: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  verifiedViewCount: number;
  genericViewCount: number;
  author: {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  _count: {
    likes: number;
    comments: number;
    reads: number;
  };
}

export interface PendingBlogsResponse {
  blogs: PendingBlog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================
// 1. APPROVE BLOG
// ============================================

/**
 * Approve a blog post
 * 
 * @route POST /api/admin/blogs/:blogId/approve
 * @access Admin only
 * 
 * Business Logic:
 * - Sets approvedBy to current admin
 * - Sets approvedAt to current timestamp
 * - Clears any previous unapproval data
 * - Logs action to AdminActivityLog
 */
export const approveBlog = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { blogId } = req.params;
    const adminId = req.user?.adminId; // Assuming you have admin info in req.user

    // Validation: Ensure admin is authenticated
    if (!adminId) {
      return AppResponse(res, 401, null, 'Admin authentication required');
    }

    // Check if blog exists
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: {
        id: true,
        sanitySlug: true,
        approvedBy: true,
        isDeleted: true,
        author: {
          select: {
            user: {
              select: { userName: true, email: true }
            }
          }
        }
      },
    });

    if (!blog) {
      return AppResponse(res, 404, null, 'Blog not found');
    }

    // Check if blog is soft-deleted
    if (blog.isDeleted) {
      return AppResponse(res, 400, null, 'Cannot approve a deleted blog');
    }

    // Check if already approved by this admin
    if (blog.approvedBy === adminId) {
      return AppResponse(res, 400, null, 'Blog is already approved by you');
    }

    // Approve the blog (transaction for atomicity)
    const [updatedBlog, activityLog] = await prisma.$transaction([
      // Update blog approval status
      prisma.blog.update({
        where: { id: blogId },
        data: {
          approvedBy: adminId,
          approvedAt: new Date(),
          // Clear any previous unapproval data
          lastUnapprovedBy: null,
          lastUnapprovedAt: null,
          unapprovalReason: null,
        },
        select: {
          id: true,
          sanitySlug: true,
          approvedBy: true,
          approvedAt: true,
          author: {
            select: {
              user: {
                select: { userName: true, firstName: true, lastName: true }
              }
            }
          }
        },
      }),

      // Log the action
      prisma.adminActivityLog.create({
        data: {
          adminId,
          action: 'APPROVED_BLOG',
          entity: 'Blog',
          entityId: blogId,
          metadata: {
            blogSlug: blog.sanitySlug,
            authorUsername: blog.author.user.userName,
          },
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        },
      }),
    ]);

    return AppResponse(
      res,
      200,
      {
        blog: updatedBlog,
        message: `Blog "${blog.sanitySlug}" approved successfully`,
      },
      'Blog approved successfully'
    );
  }
);

// ============================================
// 2. UNAPPROVE BLOG
// ============================================

/**
 * Unapprove a previously approved blog
 * 
 * @route POST /api/admin/blogs/:blogId/unapprove
 * @body { reason: string }
 * @access Admin only
 * 
 * Business Logic:
 * - Clears approvedBy and approvedAt
 * - Sets lastUnapprovedBy to current admin
 * - Sets lastUnapprovedAt to current timestamp
 * - Stores reason for unapproval
 * - Logs action to AdminActivityLog
 */
export const unapproveBlog = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { blogId } = req.params;
    const { reason } = req.body as UnapproveBlogRequest;
    const adminId = req.user?.adminId;

    // Validation: Ensure admin is authenticated
    if (!adminId) {
      return AppResponse(res, 401, null, 'Admin authentication required');
    }

    // Validation: Reason is required
    if (!reason || reason.trim().length === 0) {
      return AppResponse(
        res,
        400,
        null,
        'Unapproval reason is required'
      );
    }

    if (reason.trim().length < 10) {
      return AppResponse(
        res,
        400,
        null,
        'Unapproval reason must be at least 10 characters'
      );
    }

    // Check if blog exists and is approved
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: {
        id: true,
        sanitySlug: true,
        approvedBy: true,
        isDeleted: true,
        author: {
          select: {
            user: {
              select: { userName: true, email: true }
            }
          }
        }
      },
    });

    if (!blog) {
      return AppResponse(res, 404, null, 'Blog not found');
    }

    // Check if blog is soft-deleted
    if (blog.isDeleted) {
      return AppResponse(res, 400, null, 'Cannot unapprove a deleted blog');
    }

    // Check if blog is actually approved
    if (!blog.approvedBy) {
      return AppResponse(
        res,
        400,
        null,
        'Blog is not currently approved'
      );
    }

    // Unapprove the blog (transaction for atomicity)
    const [updatedBlog, activityLog] = await prisma.$transaction([
      // Update blog to unapproved state
      prisma.blog.update({
        where: { id: blogId },
        data: {
          // Clear approval
          approvedBy: null,
          approvedAt: null,
          // Set unapproval tracking
          lastUnapprovedBy: adminId,
          lastUnapprovedAt: new Date(),
          unapprovalReason: reason.trim(),
        },
        select: {
          id: true,
          sanitySlug: true,
          lastUnapprovedBy: true,
          lastUnapprovedAt: true,
          unapprovalReason: true,
          author: {
            select: {
              user: {
                select: { userName: true, firstName: true, lastName: true }
              }
            }
          }
        },
      }),

      // Log the action
      prisma.adminActivityLog.create({
        data: {
          adminId,
          action: 'UNAPPROVED_BLOG',
          entity: 'Blog',
          entityId: blogId,
          metadata: {
            blogSlug: blog.sanitySlug,
            reason: reason.trim(),
            authorUsername: blog.author.user.userName,
            previouslyApprovedBy: blog.approvedBy,
          },
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        },
      }),
    ]);

    // TODO: Send notification to author about unapproval
    // await sendUnapprovalNotification(blog.author.user.email, reason);

    return AppResponse(
      res,
      200,
      {
        blog: updatedBlog,
        message: `Blog "${blog.sanitySlug}" unapproved`,
      },
      'Blog unapproved successfully'
    );
  }
);

// ============================================
// 3. GET PENDING BLOGS (For Polling)
// ============================================

/**
 * Get all pending blogs that haven't been approved/unapproved yet
 * 
 * @route GET /api/admin/blogs/pending
 * @query page, limit, sortBy, order
 * @access Admin only
 * 
 * Business Logic:
 * - Returns blogs where approvedBy is null AND lastUnapprovedBy is null
 * - Supports pagination
 * - Supports sorting by createdAt, views, etc.
 * - Includes author info and engagement metrics
 */
export const getPendingBlogs = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const adminId = req.user?.adminId;

    // Validation: Ensure admin is authenticated
    if (!adminId) {
      return AppResponse(res, 401, null, 'Admin authentication required');
    }

    // Parse query parameters
    const {
      page = '1',
      limit = '20',
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query as PendingBlogsQuery;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 per page
    const skip = (pageNum - 1) * limitNum;

    // Validate sortBy and order
    const validSortFields = ['createdAt', 'verifiedViewCount', 'genericViewCount'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 'asc' : 'desc';

    // Build where clause
    const whereClause = {
      approvedBy: null, // Not approved
      lastUnapprovedBy: null, // Not unapproved
      isDeleted: false, // Not deleted
    };

    // Execute queries in parallel
    const [blogs, totalCount] = await Promise.all([
      prisma.blog.findMany({
        where: whereClause,
        skip,
        take: limitNum,
        orderBy: { [sortField]: sortOrder },
        select: {
          id: true,
          sanityId: true,
          sanitySlug: true,
          isPublishedInSanity: true,
          publishedAt: true,
          createdAt: true,
          verifiedViewCount: true,
          genericViewCount: true,
          author: {
            select: {
              id: true,
              user: {
                select: {
                  userName: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
              reads: true,
            },
          },
        },
      }),
      prisma.blog.count({ where: whereClause }),
    ]);

    // Transform data for response
    const transformedBlogs: PendingBlog[] = blogs.map((blog) => ({
      id: blog.id,
      sanityId: blog.sanityId,
      sanitySlug: blog.sanitySlug,
      isPublishedInSanity: blog.isPublishedInSanity,
      publishedAt: blog.publishedAt,
      createdAt: blog.createdAt,
      verifiedViewCount: blog.verifiedViewCount,
      genericViewCount: blog.genericViewCount,
      author: {
        id: blog.author.id,
        userName: blog.author.user.userName,
        firstName: blog.author.user.firstName,
        lastName: blog.author.user.lastName,
        email: blog.author.user.email,
      },
      _count: blog._count,
    }));

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNext = pageNum < totalPages;
    const hasPrev = pageNum > 1;

    const response: PendingBlogsResponse = {
      blogs: transformedBlogs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages,
        hasNext,
        hasPrev,
      },
    };

    return AppResponse(
      res,
      200,
      response,
      `Retrieved ${transformedBlogs.length} pending blog(s)`
    );
  }
);

// ============================================
// 4. GET BLOG APPROVAL STATUS
// ============================================

/**
 * Get detailed approval status of a specific blog
 * 
 * @route GET /api/admin/blogs/:blogId/approval-status
 * @access Admin only
 * 
 * Useful for showing blog history in admin panel
 */
export const getBlogApprovalStatus = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { blogId } = req.params;
    const adminId = req.user?.adminId;

    if (!adminId) {
      return AppResponse(res, 401, null, 'Admin authentication required');
    }

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: {
        id: true,
        sanitySlug: true,
        approvedBy: true,
        approvedAt: true,
        lastUnapprovedBy: true,
        lastUnapprovedAt: true,
        unapprovalReason: true,
        isDeleted: true,
        createdAt: true,
        approver: {
          select: {
            user: {
              select: { userName: true, firstName: true, lastName: true }
            }
          }
        },
        lastUnapprover: {
          select: {
            user: {
              select: { userName: true, firstName: true, lastName: true }
            }
          }
        },
        author: {
          select: {
            user: {
              select: { userName: true, firstName: true, lastName: true }
            }
          }
        }
      },
    });

    if (!blog) {
      return AppResponse(res, 404, null, 'Blog not found');
    }

    // Determine current status
    let status: 'APPROVED' | 'UNAPPROVED' | 'PENDING';
    if (blog.approvedBy) {
      status = 'APPROVED';
    } else if (blog.lastUnapprovedBy) {
      status = 'UNAPPROVED';
    } else {
      status = 'PENDING';
    }

    return AppResponse(res, 200, {
      blog: {
        id: blog.id,
        slug: blog.sanitySlug,
        status,
        author: blog.author.user,
        createdAt: blog.createdAt,
        isDeleted: blog.isDeleted,
      },
      approval: blog.approvedBy ? {
        approvedBy: blog.approver?.user,
        approvedAt: blog.approvedAt,
      } : null,
      unapproval: blog.lastUnapprovedBy ? {
        unapprovedBy: blog.lastUnapprover?.user,
        unapprovedAt: blog.lastUnapprovedAt,
        reason: blog.unapprovalReason,
      } : null,
    }, 'Blog approval status retrieved');
  }
);

// ============================================
// 5. BULK APPROVE BLOGS
// ============================================

/**
 * Approve multiple blogs at once
 * 
 * @route POST /api/admin/blogs/bulk-approve
 * @body { blogIds: string[] }
 * @access Admin only
 */
export const bulkApproveBlogs = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { blogIds } = req.body as { blogIds: string[] };
    const adminId = req.user?.adminId;

    if (!adminId) {
      return AppResponse(res, 401, null, 'Admin authentication required');
    }

    // Validation
    if (!Array.isArray(blogIds) || blogIds.length === 0) {
      return AppResponse(res, 400, null, 'blogIds array is required');
    }

    if (blogIds.length > 50) {
      return AppResponse(res, 400, null, 'Maximum 50 blogs per bulk operation');
    }

    // Approve all blogs in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update all blogs
      const updateResult = await tx.blog.updateMany({
        where: {
          id: { in: blogIds },
          isDeleted: false,
        },
        data: {
          approvedBy: adminId,
          approvedAt: new Date(),
          lastUnapprovedBy: null,
          lastUnapprovedAt: null,
          unapprovalReason: null,
        },
      });

      // Log each approval
      const logs = blogIds.map(blogId => ({
        adminId,
        action: 'APPROVED_BLOG',
        entity: 'Blog',
        entityId: blogId,
        metadata: { bulkOperation: true },
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      }));

      await tx.adminActivityLog.createMany({ data: logs });

      return updateResult;
    });

    return AppResponse(
      res,
      200,
      { approvedCount: result.count },
      `Bulk approved ${result.count} blog(s)`
    );
  }
);