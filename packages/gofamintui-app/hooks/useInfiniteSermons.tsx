"use client";
import { Sermons, SermonsCountResponse } from "@/sanity/interfaces/sermonsPage";
import {
  buildSermonsCountQuery,
  buildSermonsQuery,
} from "@/sanity/queries/sermonsPage";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";

const ITEMS_PER_PAGE = 2;

// Memoize the query function to prevent recreation on every render
const createInfiniteSermonQueryFunction =
  () =>
  async ({
    start,
    end,
    searchTerm,
  }: {
    start: number;
    end: number;
    searchTerm?: string;
  }) => {
    const hasSearch = searchTerm ? searchTerm.trim().length > 0 : false;

    const params = {
      start,
      end,
      ...(hasSearch && { search: searchTerm }),
    };

    const [sermonsResponse, totalCount] = await Promise.all([
      sanityFetchWrapper<Sermons>(buildSermonsQuery(hasSearch), params),
      sanityFetchWrapper<number>(
        buildSermonsCountQuery(hasSearch),
        hasSearch ? { search: searchTerm } : {}
      ),
    ]);

    const hasMore = end < totalCount;

    return {
      sermonsResponse,
      hasMore,
      totalCount,
      totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
    };
  };

// Create the query function once
const infiniteSermonQueryFunction = createInfiniteSermonQueryFunction();

export default function useInfiniteSermons({
  searchTerm,
}: {
  searchTerm?: string;
}) {
  // Memoize the query function to prevent unnecessary re-creations
  const queryFn = useCallback(
    ({ pageParam = 1 }) => {
      const start = (pageParam - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      return infiniteSermonQueryFunction({ searchTerm, start, end });
    },
    [searchTerm] // Only recreate when searchTerm changes
  );

  // Memoize getNextPageParam to prevent unnecessary re-creations
  const getNextPageParam = useCallback((lastPage: any, allPages: any[]) => {
    return lastPage.hasMore ? allPages.length + 1 : undefined;
  }, []);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["infinite", "sermons", searchTerm?.trim() || ""], // Normalize searchTerm
    queryFn,
    getNextPageParam,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes - prevents unnecessary refetches
    gcTime: 10 * 60 * 1000, // 10 minutes - keeps data in cache longer
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Prevent refetch on component mount if data exists
  });

  // Memoize flattened sermons to prevent unnecessary recalculations
  const allSermons = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.sermonsResponse || []);
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
    sermons: allSermons,
    metadata,
    // Loading states
    isLoading,
    isError,
    isFetchingNextPage,
    // Actions
    fetchNextPage: memoizedFetchNextPage,
    hasNextPage,
    // Utility
    isEmpty: allSermons.length === 0 && !isLoading,
    totalSermons: allSermons.length,
  };
}
