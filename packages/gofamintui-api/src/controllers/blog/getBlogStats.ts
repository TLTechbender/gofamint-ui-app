
import { Request, Response } from "express";
import { prisma } from "../../database/prisma";
import { AppError } from "../../utils/appError";
import { AppResponse } from "../../utils/appResponse";
import { catchAsync } from "../../utils/catchAsync";
import { formatZodErrors } from "../../utils/formatZodErrors";
import { logger } from "../../utils/logger";
import { getBlogStatsSchema } from "../../schemas/blogs/getBlogStatsSchema";
import { AuthRequest } from "../../common/constants";


interface BlogStats {
  likesCount: number;
  viewsCount: number;
  commentsCount: number;
  isLiked: boolean;
}

export const getBlogStats = catchAsync(
  async (req: Request | AuthRequest, res: Response) => {
  
    const validationResult = getBlogStatsSchema.safeParse({
      blogId: req.params.blogId,
    });

    if (!validationResult.success) {
      const formattedErrors = formatZodErrors(validationResult.error);
      throw new AppError("Validation failed", 400, formattedErrors);
    }

    const { blogId } = validationResult.data;
    const userId = (req as AuthRequest).user?.id;
 

    // Check if blog exists
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: {
        id: true,
        isDeleted: true,
        isApproved: true,
      },
    });

    if (!blog || blog.isDeleted || !blog.isApproved) {
      throw new AppError("Blog not found", 404);
    }

 
    const [likesCount, viewsCount, commentsCount, userLike] =
      await Promise.all([
      
        prisma.blogLike.count({
          where: { blogId },
        }),

     
        prisma.blog
          .findUnique({
            where: { id: blogId },
            select: { genericViewCount: true },
          })
          .then((blog) => blog?.genericViewCount || 0),

    
        prisma.comment.count({
          where: {
            blogId,
            parentId: null,
            isDeleted: false,
          },
        }),

        // Check if current user liked this blog (only if logged in)
        userId
          ? prisma.blogLike.findUnique({
              where: {
                userId_blogId: {
                  userId,
                  blogId,
                },
              },
            })
          : null,
      ]);

    const stats: BlogStats = {
      likesCount,
      viewsCount,
      commentsCount,
      isLiked: !!userLike,
    };

    logger.info("Blog stats fetched successfully", {
      blogId,
      userId: userId || "guest",
    });

    return AppResponse(res, 200, stats, "Blog stats retrieved successfully");
  }
);