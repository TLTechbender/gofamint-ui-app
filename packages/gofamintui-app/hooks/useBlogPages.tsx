"use client";

import { BlogPost } from "@/sanity/interfaces/blogPosts";
import {
  buildBlogPostsCountQuery,
  buildBlogPostsQuery,
} from "@/sanity/queries/blogsPage";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";

const ITEMS_PER_PAGE = 2;

// Define types for better type safety
interface BlogPostsQueryParams {
  start: number;
  end: number;
  searchTerm?: string;
}

interface BlogPostsQueryResponse {
  blogPostsResponse: BlogPost[];
  hasMore: boolean;
  totalCount: number;
  totalPages: number;
}

interface UseBlogPostsParams {
  searchTerm?: string;
}

// Memoize the query function to prevent recreation on every render
const createBlogPostsQueryFunction =
  () =>
  async ({
    start,
    end,
    searchTerm,
  }: BlogPostsQueryParams): Promise<BlogPostsQueryResponse> => {
    const hasSearch = searchTerm ? searchTerm.trim().length > 0 : false;

    const params = {
      start,
      end,
      ...(hasSearch && { search: searchTerm }),
    };

    const [blogPostsResponse, totalCount] = await Promise.all([
      sanityFetchWrapper<BlogPost[]>(buildBlogPostsQuery(hasSearch), params),
      sanityFetchWrapper<number>(
        buildBlogPostsCountQuery(hasSearch),
        hasSearch ? { search: searchTerm } : {}
      ),
    ]);

    const hasMore = end < totalCount;


    return {
      blogPostsResponse,
      hasMore,
      totalCount,
      totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
    };
  };

// Create the query function once
const infiniteBlogPostsQueryFunction = createBlogPostsQueryFunction();

export default function useBlogPosts({ searchTerm }: UseBlogPostsParams) {
  // Memoize the query function to prevent unnecessary re-creations
  const queryFn = useCallback(
    ({ pageParam = 1 }: { pageParam?: number }) => {
      const start = (pageParam - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      return infiniteBlogPostsQueryFunction({ searchTerm, start, end });
    },
    [searchTerm] // Only recreate when searchTerm changes
  );

  // Memoize getNextPageParam to prevent unnecessary re-creations
  const getNextPageParam = useCallback(
    (lastPage: BlogPostsQueryResponse, allPages: BlogPostsQueryResponse[]) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    []
  );

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["infinite", "blogs", searchTerm?.trim() || ""],
    queryFn,
    getNextPageParam,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes - prevents unnecessary refetches
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Prevent refetch on component mount if data exists
  });

  // Memoize flattened blog posts to prevent unnecessary recalculations
  const allBlogPosts = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.blogPostsResponse || []);
  }, [data?.pages]);

  // Memoize metadata to prevent unnecessary recalculations
  const metadata = useMemo(() => {
    if (!data?.pages?.[0]) return null;

    const firstPage = data.pages[0];
    return {
      totalCount: firstPage.totalCount,
      totalPages: firstPage.totalPages,
    };
  }, [data?.pages]);

  // Memoize the fetchNextPage function to prevent unnecessary recreations
  const memoizedFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return {
    // Raw data (if needed for debugging)
    data,
    // Processed data
    blogPosts: allBlogPosts, // Renamed from galleries to blogPosts for consistency
    metadata,
    // Loading states
    isLoading,
    isError,
    isFetchingNextPage,
    // Actions
    fetchNextPage: memoizedFetchNextPage,
    hasNextPage,
    // Utility
    isEmpty: allBlogPosts.length === 0 && !isLoading,
    totalBlogPosts: allBlogPosts.length, // Renamed from totalGalleries
  };
}
