"use server";
import { prisma } from "@/lib/prisma/prisma";
import { auth } from "@/auth";

interface AuthorPostAnalytics {
  sanityId: string;
  sanitySlug: string;
  genericViewCount: number;
  likesCount: number;
  publishedAt: Date | null;
}

interface PaginatedAuthorPostsAnalytics {
  posts: AuthorPostAnalytics[];
  hasMore: boolean;
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export async function getAuthorPostsAnalytics(
  authorId: string,
  page: number = 1,
  limit: number = 6
): Promise<{
  success: boolean;
  data?: PaginatedAuthorPostsAnalytics;
  error?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        error: "Access denied - authentication required",
      };
    }

    if (!authorId) {
      return {
        success: false,
        error: "Author ID is required",
      };
    }

    // Validate pagination params
    if (page < 1) page = 1;
    if (limit < 1 || limit > 10) limit = 6; // Cap at 10 for performance

    const skip = (page - 1) * limit;

    // Get total count for pagination calculations
    const totalCount = await prisma.blog.count({
      where: {
        authorId: authorId,
        isPublishedInSanity: true,
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    // Get paginated blog analytics with like counts PER POST
    const blogs = await prisma.blog.findMany({
      where: {
        authorId: authorId,
        isPublishedInSanity: true,
      },
      select: {
        sanityId: true,
        sanitySlug: true,
        genericViewCount: true,
        publishedAt: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: [
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      skip,
      take: limit,
    });

    // Transform data to match expected format
    const posts: AuthorPostAnalytics[] = blogs.map((blog) => ({
      sanityId: blog.sanityId,
      sanitySlug: blog.sanitySlug,
      genericViewCount: blog.genericViewCount,
      likesCount: blog._count.likes,
      publishedAt: blog.publishedAt,
    }));

    return {
      success: true,
      data: {
        posts,
        hasMore,
        totalCount,
        totalPages,
        currentPage: page,
      },
    };
  } catch (error) {
    console.error("Error fetching author posts analytics:", error);
    return {
      success: false,
      error: "Failed to fetch author posts analytics",
    };
  }
}

// Alternative version if you want to remove authentication check entirely
export async function getAuthorPostsAnalyticsPublic(
  authorId: string,
  page: number = 1,
  limit: number = 6
): Promise<{
  success: boolean;
  data?: PaginatedAuthorPostsAnalytics;
  error?: string;
}> {
  try {
    if (!authorId) {
      return {
        success: false,
        error: "Author ID is required",
      };
    }

    // Validate pagination params
    if (page < 1) page = 1;
    if (limit < 1 || limit > 10) limit = 6;

    const skip = (page - 1) * limit;

    // Get total count
    const totalCount = await prisma.blog.count({
      where: {
        authorId: authorId,
        isPublishedInSanity: true,
      },
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    // Get individual posts with their individual stats
    const blogs = await prisma.blog.findMany({
      where: {
        authorId: authorId,
        isPublishedInSanity: true,
      },
      select: {
        sanityId: true,
        sanitySlug: true,
        genericViewCount: true, // Per post
        publishedAt: true,
        _count: {
          select: {
            likes: true, // Per post
          },
        },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    });

    const posts: AuthorPostAnalytics[] = blogs.map((blog) => ({
      sanityId: blog.sanityId,
      sanitySlug: blog.sanitySlug,
      genericViewCount: blog.genericViewCount,
      likesCount: blog._count.likes,
      publishedAt: blog.publishedAt,
    }));

    return {
      success: true,
      data: {
        posts,
        hasMore,
        totalCount,
        totalPages,
        currentPage: page,
      },
    };
  } catch (error) {
    console.error("Error fetching author posts analytics:", error);
    return {
      success: false,
      error: "Failed to fetch author posts analytics",
    };
  }
}
