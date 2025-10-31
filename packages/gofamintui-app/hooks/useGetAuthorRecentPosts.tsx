"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { getAuthorPostsAnalytics } from "@/actions/author/authorRecentPosts";

// Types
interface AuthorPostAnalytics {
  sanityId: string;
  sanitySlug: string;
  genericViewCount: number;
  likesCount: number;
  publishedAt: Date | null;
}

interface SanityPostData {
  _id: string;
  title: string;
  excerpt?: string;
  featuredImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  } | null;
  slug: {
    current: string;
  };
  publishedAt: string;
}

interface AuthorPost {
  sanityId: string;
  sanitySlug: string;
  title: string;
  excerpt?: string;
  featuredImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  } | null;
  genericViewCount: number;
  likesCount: number;
  publishedAt: Date | null;
}

interface PaginatedAuthorPostsResponse {
  posts: AuthorPost[];
  hasMore: boolean;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  // Removed totalViews and totalLikes since your server action doesn't return them
}

// Server action return type (matching your actual server action)
interface ServerActionResponse {
  success: boolean;
  data?: {
    posts: AuthorPostAnalytics[];
    hasMore: boolean;
    totalCount: number;
    totalPages: number;
    currentPage: number;
   
  };
  error?: string;
}

const POSTS_PER_PAGE = 6;

// Fetch Sanity posts by IDs
const fetchSanityPostsByIds = async (
  sanityIds: string[]
): Promise<SanityPostData[]> => {
  if (sanityIds.length === 0) return [];

  const query = `
    *[_type == "blogPost" && _id in $ids && isApprovedToBePublished == true] {
      _id,
      title,
      excerpt,
      slug,
      featuredImage {
        asset-> {
          url
        },
        alt
      },
      publishedAt
    }
  `;

  try {
    const posts = await sanityFetchWrapper<SanityPostData[]>(query, {
      ids: sanityIds,
    });
    return posts || [];
  } catch (error) {
    console.error("Error fetching Sanity posts:", error);
    // Return fallback data structure to prevent complete failure
    return sanityIds.map((id) => ({
      _id: id,
      title: "Post Title Unavailable",
      excerpt: "Content temporarily unavailable",
      slug: { current: "unavailable" },
      featuredImage: null,
      publishedAt: new Date().toISOString(),
    }));
  }
};

// Main fetch function that combines both data sources
const fetchAuthorPosts = async ({
  authorId,
  page,
  limit = POSTS_PER_PAGE,
}: {
  authorId: string;
  page: number;
  limit?: number;
}): Promise<PaginatedAuthorPostsResponse> => {
  try {
    // First fetch analytics data from Prisma via server action
    const analyticsResult: ServerActionResponse = await getAuthorPostsAnalytics(
      authorId,
      page,
      limit
    );

    if (!analyticsResult.success || !analyticsResult.data) {
      throw new Error(
        analyticsResult.error || "Failed to fetch author posts analytics"
      );
    }

    const { posts: analyticsData, ...metadata } = analyticsResult.data;

    // Extract Sanity IDs from analytics data
    const sanityIds = analyticsData.map((post) => post.sanityId);

    // Now fetch Sanity content with the IDs we have
    const sanityPostsData = await fetchSanityPostsByIds(sanityIds);

    // Merge the data together
    const mergedPosts: AuthorPost[] = analyticsData.map((analyticsPost) => {
      const sanityPost = sanityPostsData.find(
        (post) => post._id === analyticsPost.sanityId
      );

      return {
        sanityId: analyticsPost.sanityId,
        sanitySlug: analyticsPost.sanitySlug,
        title: sanityPost?.title || "Untitled Post",
        excerpt: sanityPost?.excerpt,
        featuredImage: sanityPost?.featuredImage || null,
        genericViewCount: analyticsPost.genericViewCount,
        likesCount: analyticsPost.likesCount,
        publishedAt: analyticsPost.publishedAt,
      };
    });

    return {
      posts: mergedPosts,
      ...metadata,
    };
  } catch (error) {
    console.error("Error fetching author posts:", error);
    throw error;
  }
};


export const useGetAuthorRecentPosts = (authorId: string) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["author-posts-infinite", authorId],
    queryFn: ({ pageParam = 1 }) => {
      return fetchAuthorPosts({
        authorId,
        page: pageParam as number,
        limit: POSTS_PER_PAGE,
      });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!authorId, // Only run if we have an authorId
  });

  // Flatten all posts from all pages
  const allPosts = data?.pages?.flatMap((page) => page.posts || []) || [];

  // Get metadata from the first page
  const metadata = data?.pages?.[0]
    ? {
        totalCount: data.pages[0].totalCount,
        totalPages: data.pages[0].totalPages,
        // Calculate totals from the actual loaded posts since server doesn't provide aggregates
        totalViews: allPosts.reduce(
          (sum, post) => sum + post.genericViewCount,
          0
        ),
        totalLikes: allPosts.reduce((sum, post) => sum + post.likesCount, 0),
      }
    : null;

  return {
    posts: allPosts,
    metadata,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    fetchNextPage: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    hasNextPage,
    isEmpty: allPosts.length === 0 && !isLoading,
    totalPosts: allPosts.length,
    refetch,
    // Additional helper methods
    getPostBySlug: (slug: string) =>
      allPosts.find((post) => post.sanitySlug === slug),
    getPostById: (id: string) => allPosts.find((post) => post.sanityId === id),
  };
};

export type {
  AuthorPost,
  AuthorPostAnalytics,
  SanityPostData,
  PaginatedAuthorPostsResponse,
};
