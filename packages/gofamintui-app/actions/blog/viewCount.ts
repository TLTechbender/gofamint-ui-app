"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma/prisma";
import { type Blog, type BlogRead } from "@prisma/client";

type ActionResponse = {
  status: number;
  success: boolean;
  message: string;
  error?: string | string[];
  //antying to get typescript off my black ass man
  data?:
    | Record<string, string>
    | Record<string, boolean>
    | Blog
    | BlogRead
    | unknown;
};

export async function updateGenericViewCount(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const sanitySlug = formData.get("sanitySlug") as string;

    if (!sanitySlug) {
      return {
        status: 400,
        success: false,
        message: "Missing sanitySlug parameter",
        error: "sanitySlug is required",
      };
    }

    const updateCount = await prisma.blog.update({
      where: {
        sanitySlug: sanitySlug,
      },
      data: {
        genericViewCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
        genericViewCount: true,
        sanitySlug: true,
      },
    });

    return {
      status: 200,
      success: true,
      message: "Generic view count updated successfully",
      data: updateCount,
    };
  } catch (error) {
    console.error("Error updating generic view count:", error);

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("Record to update not found")) {
        return {
          status: 404,
          success: false,
          message: "Blog post not found",
          error: "The specified blog post does not exist",
        };
      }
    }

    return {
      status: 500,
      success: false,
      message: "Failed to update generic view count",
      error: "An unexpected error occurred",
    };
  }
}

export async function updateVerifiedViewCount(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        status: 401,
        success: false,
        message: "User not authenticated",
        error: "Authentication required to track verified views",
      };
    }

    const sanitySlug = formData.get("sanitySlug") as string;
    if (!sanitySlug) {
      return {
        status: 400,
        success: false,
        message: "Missing sanitySlug parameter",
        error: "sanitySlug is required",
      };
    }

    const userId = session.user.id;

    // Get blog details
    const getBlogDetails = await prisma.blog.findUnique({
      where: {
        sanitySlug: sanitySlug,
      },
      select: {
        id: true,
        sanitySlug: true,
      },
    });

    if (!getBlogDetails) {
      return {
        status: 404,
        success: false,
        message: "Blog post not found",
        error: "The specified blog post does not exist",
      };
    }

    const blogId = getBlogDetails.id;

    // Check if user has already read this blog
    const hasUserReadThisBefore = await prisma.blogRead.findUnique({
      where: {
        userId_blogId: {
          userId: userId,
          blogId: blogId,
        },
      },
    });

    if (hasUserReadThisBefore) {
      return {
        status: 200,
        success: true,
        message: "User has already read this blog",
        data: { alreadyRead: true, readAt: hasUserReadThisBefore.readAt },
      };
    }

    // Create new blog read record
    const blogRead = await prisma.blogRead.create({
      data: {
        userId: userId,
        blogId: blogId,
      },
      select: {
        id: true,
        readAt: true,
        userId: true,
        blogId: true,
      },
    });

    return {
      status: 201,
      success: true,
      message: "Verified view count updated successfully",
      data: { ...blogRead, alreadyRead: false },
    };
  } catch (error) {
    console.error("Error updating verified view count:", error);

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint failed")) {
        return {
          status: 409,
          success: false,
          message: "View already recorded",
          error: "This view has already been recorded for this user",
        };
      }
    }

    return {
      status: 500,
      success: false,
      message: "Failed to update verified view count",
      error: "An unexpected error occurred",
    };
  }
}
export async function getGenericViewCount(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const sanitySlug = formData.get("sanitySlug") as string;

    if (!sanitySlug) {
      return {
        status: 400,
        success: false,
        message: "Missing sanitySlug parameter",
        error: "sanitySlug is required",
      };
    }

    const blogDetails = await prisma.blog.findUnique({
      where: {
        sanitySlug: sanitySlug,
      },
      select: {
        id: true,
        sanitySlug: true,
        genericViewCount: true,
      },
    });

    if (!blogDetails) {
      return {
        status: 404,
        success: false,
        message: "Blog post not found",
        error: "The specified blog post does not exist",
      };
    }

    return {
      status: 200,
      success: true,
      message: "View count retrieved successfully",
      data: {
        sanitySlug: blogDetails.sanitySlug,
        genericViewCount: blogDetails.genericViewCount,

        blogId: blogDetails.id,
      },
    };
  } catch (error) {
    console.error("Error retrieving view count:", error);

    return {
      status: 500,
      success: false,
      message: "Failed to retrieve view count",
      error: "An unexpected error occurred",
    };
  }
}
