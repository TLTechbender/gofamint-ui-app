"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { urlFor } from "@/sanity/sanityClient";
import useInfiniteGalleryList from "@/hooks/useGalleryList";
import InfiniteScrollContainer from "./infiniteScrollContainer";
import { GalleryListPageData } from "@/sanity/interfaces/galleryListPage";

const GalleryListClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
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
  } = useInfiniteGalleryList({
    searchTerm: searchInput,
  });

  const allGalleryListItems = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page: any) => page.galleryListResponse || []);
  }, [data?.pages]);

  // Focus the input on mount and after search
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchTerm]);

  const debouncedSearch = useCallback(
    (searchValue: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        const trimmedSearch = searchValue.trim();
        if (trimmedSearch === searchTerm) return;

        setSearchTerm(trimmedSearch);
        const params = new URLSearchParams();
        if (trimmedSearch) {
          params.set("search", trimmedSearch);
        }
        router.replace(
          `/gallery${params.toString() ? `?${params.toString()}` : ""}`
        );
      }, 300);
    },
    [searchTerm, router]
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    const trimmedSearch = searchInput.trim();
    setSearchTerm(trimmedSearch);

    const params = new URLSearchParams();
    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    }
    router.replace(
      `/gallery${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchInput(newValue);
    debouncedSearch(newValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e as any);
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    router.replace("/gallery");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Search Section */}
      <div className="mb-10">
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
          <div className="relative shadow-sm rounded-lg">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search galleries by title, date, or description..."
              value={searchInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="w-full px-5 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:shadow-md focus:shadow-lg"
              disabled={isLoading && allGalleryListItems.length === 0}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-1 text-gray-400 hover:text-gray-600 mr-1 transition-colors"
                  aria-label="Clear search"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                disabled={isLoading && allGalleryListItems.length === 0}
                aria-label="Search"
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
          </div>
        </form>
      </div>

      {/* Error State */}
      {isError && (
        <div className="max-w-2xl mx-auto mb-10 bg-white rounded-xl shadow-sm border border-red-200 p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
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
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Unable to Load Galleries
          </h3>
          <p className="text-gray-600 mb-5">
            We encountered an issue while loading the galleries. This might be a
            temporary problem.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && allGalleryListItems.length === 0 && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <GallerySkeleton key={index} />
          ))}
        </div>
      )}

      {/* Content Section */}
      {!isLoading || allGalleryListItems.length > 0 ? (
        <>
          {/* Search Results Header */}
          {searchTerm && !isError && (
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {allGalleryListItems.length > 0
                  ? `Search Results (${allGalleryListItems.length})`
                  : "No Results Found"}
              </h2>
              <p className="text-gray-600">
                {allGalleryListItems.length > 0
                  ? `Showing galleries matching "${searchTerm}"`
                  : `No galleries found for "${searchTerm}"`}
              </p>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="mt-3 text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center mx-auto"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* Gallery Grid */}
          <InfiniteScrollContainer
            onBottomReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {allGalleryListItems.map(
                (listItem: GalleryListPageData, index: number) => (
                  <GalleryCard
                    key={`${listItem._id || index}`}
                    gallery={listItem}
                  />
                )
              )}
            </div>
          </InfiniteScrollContainer>

          {/* Loading More Indicator */}
          {isFetchingNextPage && (
            <div className="flex justify-center my-10">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                Loading more galleries...
              </div>
            </div>
          )}

          {/* Empty States */}
          {!isLoading && allGalleryListItems.length === 0 && (
            <div className="text-center py-12 max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
              <div className="w-20 h-20 mx-auto mb-5 bg-blue-50 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {searchTerm
                  ? "No matching galleries"
                  : "No galleries available"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "Try different search terms or browse all galleries."
                  : "Check back later for new gallery additions."}
              </p>
              {searchTerm ? (
                <button
                  onClick={clearSearch}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  View All Galleries
                </button>
              ) : null}
            </div>
          )}

          {/* End of Results */}
          {!hasNextPage &&
            allGalleryListItems.length > 0 &&
            !isFetchingNextPage && (
              <div className="text-center py-10">
                <div className="inline-flex items-center text-gray-500">
                  <span className="h-px w-16 bg-gray-300 mr-3"></span>
                  <span className="text-sm">End of results</span>
                  <span className="h-px w-16 bg-gray-300 ml-3"></span>
                </div>
              </div>
            )}
        </>
      ) : null}
    </div>
  );
};

// Skeleton Loader Component
const GallerySkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-gray-100"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-100 rounded w-3/4 mx-auto mb-4"></div>
      <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto mb-6"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded w-full"></div>
        <div className="h-3 bg-gray-100 rounded w-5/6 mx-auto"></div>
      </div>
      <div className="flex justify-center gap-2 mt-6">
        <div className="h-6 bg-gray-100 rounded-full w-16"></div>
        <div className="h-6 bg-gray-100 rounded-full w-16"></div>
      </div>
    </div>
  </div>
);

// Gallery Card Component
const GalleryCard: React.FC<{ gallery: GalleryListPageData }> = ({
  gallery,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <a
      href={gallery.googleDriveFolder}
      className="block group transform hover:-translate-y-1 transition-transform duration-300"
    >
      <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={urlFor(gallery.featuredImage as any)
              .width(800)
              .height(600)
              .quality(85)
              .url()}
            alt={gallery.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {gallery.title}
            </h3>
            <time className="text-sm text-gray-500">
              {formatDate(gallery._createdAt)}
            </time>
          </div>
          {gallery.description && (
            <p className="text-gray-600 text-sm text-center line-clamp-2 mb-4">
              {gallery.description}
            </p>
          )}
          <div className="flex justify-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              View Gallery
            </span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default GalleryListClient;
