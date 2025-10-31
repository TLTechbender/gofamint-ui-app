"use client";
import { GalleryListPageData } from "@/sanity/interfaces/galleryListPage";
import {
  buildGalleryListCountQuery,
  buildGalleryListQuery,
} from "@/sanity/queries/galleryListPage";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";

const ITEMS_PER_PAGE = 5;

interface GalleryQueryResponse {
  galleryListResponse: GalleryListPageData[];
  hasMore: boolean;
  totalCount: number;
  totalPages: number;
}

interface GalleryQueryParams {
  start: number;
  end: number;
  searchTerm?: string;
}

interface UseInfiniteGalleryListParams {
  searchTerm?: string;
}

interface UseInfiniteGalleryListReturn {
  data: any; // Raw React Query data
  galleries: GalleryListPageData[];
  metadata: {
    totalCount: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isEmpty: boolean;
  totalGalleries: number;
}

// Memoize the query function to prevent recreation on every render
const createGalleryListQueryFunction =
  () =>
  async ({
    start,
    end,
    searchTerm,
  }: GalleryQueryParams): Promise<GalleryQueryResponse> => {
    const hasSearch = searchTerm ? searchTerm.trim().length > 0 : false;

    const params = {
      start,
      end,
      ...(hasSearch && { search: searchTerm?.trim() }),
    };

    const [galleryListResponse, totalCount] = await Promise.all([
      sanityFetchWrapper<GalleryListPageData[]>(
        buildGalleryListQuery(hasSearch),
        params
      ),
      sanityFetchWrapper<number>(
        buildGalleryListCountQuery(hasSearch),
        hasSearch ? { search: searchTerm?.trim() } : {}
      ),
    ]);

    const hasMore = end < totalCount;

    return {
      galleryListResponse,
      hasMore,
      totalCount,
      totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
    };
  };

// Create the query function once
const infiniteGalleryQueryFunction = createGalleryListQueryFunction();

export default function useInfiniteGalleryList({
  searchTerm,
}: UseInfiniteGalleryListParams): UseInfiniteGalleryListReturn {
  // Memoize the query function to prevent unnecessary re-creations
  const queryFn = useCallback(
    ({ pageParam = 1 }: { pageParam?: number }) => {
      const start = (pageParam - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      return infiniteGalleryQueryFunction({ searchTerm, start, end });
    },
    [searchTerm] // Only recreate when searchTerm changes
  );

  const getNextPageParam = useCallback(
    (
      lastPage: GalleryQueryResponse,
      allPages: GalleryQueryResponse[]
    ): number | undefined => {
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
  } = useInfiniteQuery<
    GalleryQueryResponse,
    Error,
    {
      pages: GalleryQueryResponse[];
      pageParams: number[];
    },
    string[],
    number
  >({
    queryKey: ["infinite", "galleries", searchTerm?.trim() || ""],
    queryFn,
    getNextPageParam,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes - prevents unnecessary refetches
    gcTime: 10 * 60 * 1000, // 10 minutes - keeps data in cache longer
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Prevent refetch on component mount if data exists
  });

  const allGalleries = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.galleryListResponse || []);
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
    data,

    galleries: allGalleries,
    metadata,

    isLoading,
    isError,
    isFetchingNextPage,

    fetchNextPage: memoizedFetchNextPage,
    hasNextPage: hasNextPage ?? false,

    isEmpty: allGalleries.length === 0 && !isLoading,
    totalGalleries: allGalleries.length,
  };
}
