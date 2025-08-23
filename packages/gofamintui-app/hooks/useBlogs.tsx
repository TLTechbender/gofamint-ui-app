"use client";

import { BlogPost } from "@/sanity/interfaces/blog";
import {
  buildBlogPostsCountQuery,
  buildBlogPostsQuery,
} from "@/sanity/queries/blogs";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const ITEMS_PER_PAGE = 3;

const fetchBlogPosts = async ({
  start,
  end,
  searchTerm,
}: {
  start: number;
  end: number;
  searchTerm?: string;
}) => {
  const hasSearch = (searchTerm && searchTerm.trim().length > 0) || false;

  const params = {
    start,
    end,
    ...(hasSearch && { search: searchTerm }),
  };

  try {
    const [blogPostsResponse, totalCount] = await Promise.all([
      sanityFetchWrapper<BlogPost[]>(buildBlogPostsQuery(hasSearch), params),
      sanityFetchWrapper<number>(
        buildBlogPostsCountQuery(hasSearch),
        hasSearch ? { search: searchTerm } : {}
      ),
    ]);

    const hasMore = end < totalCount;

    return {
      blogPostsResponse: blogPostsResponse || [],
      hasMore,
      totalCount: totalCount || 0,
      totalPages: Math.ceil((totalCount || 0) / ITEMS_PER_PAGE),
    };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }
};

export default function useBlogPosts() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["blogPosts", searchTerm],
    queryFn: ({ pageParam = 1 }) => {
      const start = (pageParam - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      return fetchBlogPosts({
        searchTerm,
        start,
        end,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const allBlogPosts =
    data?.pages?.flatMap((page) => page.blogPostsResponse || []) || [];

  const metadata = data?.pages?.[0]
    ? {
        totalCount: data.pages[0].totalCount,
        totalPages: data.pages[0].totalPages,
      }
    : null;

  return {
    blogPosts: allBlogPosts,
    metadata,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    hasNextPage,
    isEmpty: allBlogPosts.length === 0 && !isLoading,
    totalBlogPosts: allBlogPosts.length,
  };
}
