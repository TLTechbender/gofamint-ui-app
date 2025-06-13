"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useInfiniteSermons from "@/hooks/useInfiniteSermons";
import InfiniteScrollContainer from "./infiniteScrollContainer";
import SermonComponent from "./sermonComponent";
import { Sermon } from "@/sanity/interfaces/sermonsPage";

export default function SermonsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    data,
    hasNextPage,
    isError,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteSermons({ searchTerm });

  const debouncedSearch = useCallback(
    (searchValue: string) => {
      // Clear existing timeout
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Set new timeout
      debounceRef.current = setTimeout(() => {
        const trimmedSearch = searchValue.trim();
        if (trimmedSearch === searchTerm) return;

        setSearchTerm(trimmedSearch);

        // Update URL (reset to page 1 for new search)
        const params = new URLSearchParams();
        if (trimmedSearch) {
          params.set("search", trimmedSearch);
        }
        router.push(
          `/sermons${params.toString() ? `?${params.toString()}` : ""}`
        );
      }, 500); // 500ms delay
    },
    [searchTerm, router]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Handle search form submission (immediate search)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any pending debounced search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmedSearch = searchInput.trim();
    if (trimmedSearch === searchTerm) return;

    setSearchTerm(trimmedSearch);

    // Update URL (reset to page 1 for new search)
    const params = new URLSearchParams();
    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    }
    router.push(`/sermons${params.toString() ? `?${params.toString()}` : ""}`);
  };

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchInput(newValue);

    // Trigger debounced search
    debouncedSearch(newValue);
  };

  // Handle Enter key press (immediate search)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e as any);
    }
  };

  // Clear search function
  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    router.push("/sermons");
  };

  const allSermons = useMemo(() => {
    if (!data?.pages) return [];

    return data.pages.flatMap(
      (page: any) => page.sermonsResponse || [] // Handle different response structures
    );
  }, [data?.pages]);

  const isInitialLoading = isLoading && !data;
  const hasData = allSermons.length > 0;

  // Enhanced Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Sermons</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our collection of inspiring sermons and teachings
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Something went wrong
              </h3>
              <p className="text-red-700 mb-4">
                We couldn't load the sermons. Please check your connection and
                try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Initial loading state with skeletons
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Sermons</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our collection of inspiring sermons and teachings
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          {/* Search Skeleton */}
          <div className="mb-8">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Sermon Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(350px,400px))] gap-9 mx-auto items-start justify-center w-full px-4">
            {[...Array(6)].map((_, index) => (
              <SermonSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sermons</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of inspiring sermons and teachings
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8">
          <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search sermons..."
                value={searchInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={isLoading && allSermons.length === 0}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                title="Search now"
                disabled={isLoading && allSermons.length === 0}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Search Results Info */}
        {searchTerm && hasData && (
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              Found <span className="font-semibold">{allSermons.length}</span>{" "}
              sermon
              {allSermons.length !== 1 ? "s" : ""} for "{searchTerm}"
            </p>
            <button
              onClick={clearSearch}
              className="mt-2 text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Search No Results */}
        {!isLoading && !hasData && searchTerm && (
          <div className="text-center py-12 max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No sermons found
            </h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any sermons matching your search. Try using
              different keywords or browse all sermons.
            </p>
            <div className="space-y-2">
              <button
                onClick={clearSearch}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse All Sermons
              </button>
              <p className="text-sm text-gray-500">
                Suggestions: Try shorter keywords, check spelling, or use
                broader terms
              </p>
            </div>
          </div>
        )}

        {/* Empty State for No Sermons at All */}
        {!isLoading && !hasData && !searchTerm && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a5 5 0 1110 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No sermons available yet
            </h3>
            <p className="text-gray-600">
              Check back later for inspiring sermons and teachings!
            </p>
          </div>
        )}

        {/* Results */}
        {hasData && (
          <InfiniteScrollContainer
            onBottomReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                return fetchNextPage();
              }
              return;
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(350px,400px))] gap-9 mx-auto items-start justify-center w-full px-4">
              {allSermons.map((sermon: Sermon, index: number) => (
                <SermonComponent key={index} sermon={sermon} />
              ))}
            </div>
          </InfiniteScrollContainer>
        )}

        {/* Next Page Loading State */}
        {isFetchingNextPage && hasData && (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span>Loading more sermons...</span>
            </div>
          </div>
        )}

        {/* End of Results Indicator */}
        {!hasNextPage && hasData && !isFetchingNextPage && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">
              You've reached the end of the sermons
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Skeleton component for sermon cards
const SermonSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      {/* Image/Video Skeleton */}
      <div className="relative aspect-video bg-gray-200"></div>

      {/* Content Skeleton */}
      <div className="p-6">
        {/* Title Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-6 bg-gray-200 rounded w-full"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* Meta Information Skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-4"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Tags/Categories Skeleton */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex space-x-2">
          <div className="h-10 bg-gray-200 rounded w-24"></div>
          <div className="h-10 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};
