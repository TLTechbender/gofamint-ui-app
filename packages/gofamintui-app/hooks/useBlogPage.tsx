"use client";

import { CommentListItem } from "@/sanity/interfaces/blogComments";
import { buildCommentsCountQuery, buildCommentsListQuery } from "@/sanity/queries/blogPageComments";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";

const ITEMS_PER_PAGE = 10;

// Memoize the query function to prevent recreation on every render
const createCommentsListQueryFunction =
  () =>
  async ({
    start,
    end,
    blogPostId,
  }: {
    start: number;
    end: number;
    blogPostId: string;
  }) => {
    const params = {
      start,
      end,
      blogPostId,
    };

    const [commentsListResponse, totalCount] = await Promise.all([
      sanityFetchWrapper<CommentListItem[]>(buildCommentsListQuery(), params),
      sanityFetchWrapper<number>(buildCommentsCountQuery(), { blogPostId }),
    ]);

    const hasMore = end < totalCount;

    return {
      commentsListResponse,
      hasMore,
      totalCount,
      totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
    };
  };

// Create the query function once
const infiniteCommentsQueryFunction = createCommentsListQueryFunction();

export default function useInfiniteCommentsList({
  blogPostId,
}: {
  blogPostId: string;
}) {
  // Memoize the query function to prevent unnecessary re-creations
  const queryFn = useCallback(
    ({ pageParam = 1 }) => {
      const start = (pageParam - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      return infiniteCommentsQueryFunction({ blogPostId, start, end });
    },
    [blogPostId] // Only recreate when blogPostId changes
  );

  // Memoize getNextPageParam to prevent unnecessary re-creations
  const getNextPageParam = useCallback((lastPage: any, allPages: any[]) => {
    return lastPage.hasMore ? allPages.length + 1 : undefined;
  }, []);

  console.log(blogPostId);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["infinite", "comments", blogPostId],
    queryFn,
    getNextPageParam,
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes - comments might change more frequently
    gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!blogPostId, // Only run query if blogPostId exists
  });

  // Memoize flattened comments to prevent unnecessary recalculations
  const allComments = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.commentsListResponse || []);
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
    comments: allComments,
    metadata,
    // Loading states
    isLoading,
    isError,
    isFetchingNextPage,
    // Actions
    fetchNextPage: memoizedFetchNextPage,
    hasNextPage,
    refetch,
    // Utility
    isEmpty: allComments.length === 0 && !isLoading,
    totalComments: allComments.length,
  };
}
