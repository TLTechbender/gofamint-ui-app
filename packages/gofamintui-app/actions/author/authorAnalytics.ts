"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma/prisma";

export type AuthorAnalytics = {
  totalPosts: number;
  totalLikes: number;
  totalVerifiedViews: number;
  totalGenericViews: number;
};

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function getAuthorAnalytics(): Promise<
  ActionResult<AuthorAnalytics>
> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    const author = await prisma.author.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            userName: true,
            email: true,
          },
        },

        blogs: {
          where: {
            isPublishedInSanity: true,
          },
          include: {
            likes: true,
            reads: true,
            _count: {
              select: {
                likes: true,
                reads: true,
              },
            },
          },
        },
      },
    });

    if (!author) {
      return {
        success: false,
        error: "User is not an author",
      };
    }

    const totalPosts = author.blogs.length;

    // Sum all likes across all blog posts
    const totalLikes = author.blogs.reduce(
      (sum, blog) => sum + blog.likes.length,
      0
    );

    // Sum all verified views (BlogRead records) across all blog posts
    const totalVerifiedViews = author.blogs.reduce(
      (sum, blog) => sum + blog.reads.length,
      0
    );

    // Sum all generic views across all blog posts
    const totalGenericViews = author.blogs.reduce(
      (sum, blog) => sum + blog.genericViewCount,
      0
    );

    const analytics: AuthorAnalytics = {
      totalPosts,
      totalLikes,
      totalVerifiedViews,
      totalGenericViews,
    };

    return {
      success: true,
      data: analytics,
    };
  } catch (error) {
    console.error("Error fetching author analytics:", error);
    return {
      success: false,
      error: "Failed to fetch analytics",
    };
  }
}
