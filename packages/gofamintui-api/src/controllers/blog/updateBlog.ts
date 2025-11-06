import { Response } from "express";
import { prisma } from "../../database/prisma";
import { AppError } from "../../utils/appError";
import { AppResponse } from "../../utils/appResponse";
import { catchAsync } from "../../utils/catchAsync";
import { formatZodErrors } from "../../utils/formatZodErrors";
import { logger } from "../../utils/logger";
import { AuthRequest } from "../../common/constants";
import { updateBlogSchema } from "../../schemas/blogs/updateBlogSchema";

export const updateBlog = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  const { blogId } = req.params;
  if (!blogId) {
    throw new AppError("Blog ID is required", 400);
  }


  const validationResult = updateBlogSchema.safeParse(req.body);
  if (!validationResult.success) {
    const formattedErrors = formatZodErrors(validationResult.error);
    throw new AppError("Validation failed", 400, formattedErrors);
  }

  const { sanitySlug, publishedAt, sanityUpdatedAt } = validationResult.data;

  
  const existingBlog = await prisma.blog.findUnique({
    where: { id: blogId },
    select: {
      id: true,
      isDeleted: true,
      sanitySlug: true,
    },
  });

  if (!existingBlog || existingBlog.isDeleted) {
    throw new AppError("Blog not found", 404);
  }

  // If updating slug, check for conflicts
  if (sanitySlug && sanitySlug !== existingBlog.sanitySlug) {
    const slugConflict = await prisma.blog.findUnique({
      where: { sanitySlug },
    });

    if (slugConflict) {
      throw new AppError("A blog with this slug already exists", 409);
    }
  }

  // Update the blog - only updatable fields
  const updatedBlog = await prisma.blog.update({
    where: { id: blogId },
    data: {
      ...(sanitySlug && { sanitySlug }),
      ...(publishedAt && { publishedAt: new Date(publishedAt) }),
      ...(sanityUpdatedAt && { sanityUpdatedAt: new Date(sanityUpdatedAt) }),
      lastSyncedAt: new Date(),
      lastSyncedBy: userId,
    },
    include: {
      author: {
        select: {
          id: true,
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
  });

  logger.info("Blog updated successfully", {
    blogId: updatedBlog.id,
    updatedFields: Object.keys(validationResult.data),
    updatedBy: userId,
  });

  return AppResponse(res, 200, updatedBlog, "Blog updated successfully");
});