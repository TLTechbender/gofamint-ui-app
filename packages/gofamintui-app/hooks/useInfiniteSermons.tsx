"use client";
import { Sermon } from "@/sanity/interfaces/sermonsPage";
import {
  buildSermonsCountQuery,
  buildSermonsQuery,
} from "@/sanity/queries/sermonsPage";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";

const ITEMS_PER_PAGE = 5;

interface SermonQueryParams {
  start: number;
  end: number;
  searchTerm?: string;
}

interface SermonQueryResponse {
  sermonsResponse: Sermon[];
  hasMore: boolean;
  totalCount: number;
  totalPages: number;
}

const createInfiniteSermonQueryFunction =
  () =>
  async ({
    start,
    end,
    searchTerm,
  }: SermonQueryParams): Promise<SermonQueryResponse> => {
    const hasSearch = searchTerm ? searchTerm.trim().length > 0 : false;

    const params = {
      start,
      end,
      ...(hasSearch && { search: searchTerm }),
    };

    const [sermonsResponse, totalCount] = await Promise.all([
      sanityFetchWrapper<Sermon[]>(buildSermonsQuery(hasSearch), params),
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

const infiniteSermonQueryFunction = createInfiniteSermonQueryFunction();

interface UseInfiniteSermonsParams {
  searchTerm?: string;
}

interface UseInfiniteSermonsReturn {
  data: any;
  sermons: Sermon[];
  metadata: {
    totalCount: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isEmpty: boolean;
  totalSermons: number;
}

export default function useInfiniteSermons({
  searchTerm,
}: UseInfiniteSermonsParams): UseInfiniteSermonsReturn {
  const queryFn = useCallback(
    ({ pageParam = 1 }: { pageParam?: number }) => {
      const start = (pageParam - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      return infiniteSermonQueryFunction({ searchTerm, start, end });
    },
    [searchTerm]
  );

  const getNextPageParam = useCallback(
    (lastPage: SermonQueryResponse, allPages: SermonQueryResponse[]) => {
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
    queryKey: ["infinite", "sermons", searchTerm?.trim() || ""],
    queryFn,
    getNextPageParam,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const allSermons = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.sermonsResponse || []);
  }, [data?.pages]);

  const metadata = useMemo(() => {
    if (!data?.pages?.[0]) return null;

    const firstPage = data.pages[0];
    return {
      totalCount: firstPage.totalCount,
      totalPages: firstPage.totalPages,
    };
  }, [data?.pages]);

  const memoizedFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return {
    data,
    sermons: allSermons,
    metadata,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage: memoizedFetchNextPage,
    hasNextPage,
    isEmpty: allSermons.length === 0 && !isLoading,
    totalSermons: allSermons.length,
  };
}
