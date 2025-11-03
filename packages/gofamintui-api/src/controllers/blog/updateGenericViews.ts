
import { Request, Response } from "express";
import { prisma } from "../../database/prisma";
import { AppError } from "../../utils/appError";
import { AppResponse } from "../../utils/appResponse";
import { catchAsync } from "../../utils/catchAsync";
import { formatZodErrors } from "../../utils/formatZodErrors";
import { logger } from "../../utils/logger";
import { AuthRequest } from "../../common/constants";
import { updateGenericViewCountSchema } from "../../schemas/blogs/updateGenericViewCountSchema";

interface GenericViewResult {
  sanitySlug: string;
  genericViewCount: number;
  blogId: string;
}

export const updateGenericViewCount = catchAsync(
  async (req: Request, res: Response) => {

    const validationResult = updateGenericViewCountSchema.safeParse(
      req.body
    );
    if (!validationResult.success) {
      const formattedErrors = formatZodErrors(validationResult.error);
      throw new AppError("Validation failed", 400, formattedErrors);
    }

    const { sanitySlug } = validationResult.data;

 
    const blog = await prisma.blog.findUnique({
      where: { sanitySlug },
      select: {
        id: true,
        sanitySlug: true,
        genericViewCount: true,
        isDeleted: true,
        isPublishedInSanity: true,
      },
    });

    if (!blog || blog.isDeleted || !blog.isPublishedInSanity) {
      throw new AppError("Blog post not found", 404);
    }

   
    const updatedBlog = await prisma.blog.update({
      where: { id: blog.id },
      data: {
        genericViewCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
        sanitySlug: true,
        genericViewCount: true,
      },
    });

    const result: GenericViewResult = {
      sanitySlug: updatedBlog.sanitySlug,
      genericViewCount: updatedBlog.genericViewCount,
      blogId: updatedBlog.id,
    };

    logger.info("Generic view count incremented", {
      blogId: updatedBlog.id,
      sanitySlug,
      newCount: updatedBlog.genericViewCount,
    });

    return AppResponse(
      res,
      200,
      result,
      "View count updated successfully"
    );
  }
);