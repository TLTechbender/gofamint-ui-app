"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/sanityClient";
import useInfiniteGalleryList from "@/hooks/useGalleryList";
import InfiniteScrollContainer from "./infiniteScrollContainer";
import { GalleryListItem } from "@/sanity/interfaces/galleryListPage";

const GalleryListClient = () => {
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
  } = useInfiniteGalleryList({
    searchTerm: searchInput,
  });

  const allGalleryListItems = useMemo(() => {
    if (!data?.pages) return [];

    return data.pages.flatMap((page: any) => page.galleryListResponse || []);
  }, [data?.pages]);

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
          `/gallery${params.toString() ? `?${params.toString()}` : ""}`
        );
      }, 500); // 500ms delay
    },
    [searchTerm, router]
  );

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
    router.push(`/gallery${params.toString() ? `?${params.toString()}` : ""}`);
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
    router.push("/gallery");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search */}
      <div className="mb-8">
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search galleries..."
              value={searchInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={isLoading && allGalleryListItems.length === 0}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              title="Search now"
              disabled={isLoading && allGalleryListItems.length === 0}
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

      {/* Error State */}
      {isError && (
        <div className="max-w-md mx-auto mb-8">
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
              We couldn't load the galleries. Please check your connection and
              try again.
            </p>
          </div>
        </div>
      )}

      {/* First Load Loading State */}
      {isLoading && allGalleryListItems.length === 0 && !isError && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(350px,400px))] gap-9 mx-auto items-start justify-center w-full px-4">
            {[...Array(6)].map((_, index) => (
              <GallerySkeleton key={index} />
            ))}
          </div>
        </div>
      )}

      {/* Content - Only show when not in initial loading state */}
      {!isLoading || allGalleryListItems.length > 0 ? (
        <>
          {/* Search Results Info */}
          {searchTerm && !isError && (
            <div className="mb-6 text-center">
              <p className="text-gray-600">
                {allGalleryListItems.length > 0 ? (
                  <>
                    Found{" "}
                    <span className="font-semibold">
                      {allGalleryListItems.length}
                    </span>{" "}
                    result
                    {allGalleryListItems.length !== 1 ? "s" : ""} for "
                    {searchTerm}"
                  </>
                ) : (
                  <>No results found for "{searchTerm}"</>
                )}
              </p>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="mt-2 text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          <InfiniteScrollContainer
            onBottomReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                return fetchNextPage();
              }
              return;
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(350px,400px))] gap-9 mx-auto items-start justify-center w-full px-4">
              {allGalleryListItems.map(
                (listItem: GalleryListItem, index: number) => (
                  <GalleryCard
                    key={`${listItem._id || index}`}
                    gallery={listItem}
                  />
                )
              )}
            </div>
          </InfiniteScrollContainer>

          {/* Next Page Loading State */}
          {isFetchingNextPage && (
            <div className="flex justify-center items-center py-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span>Loading more galleries...</span>
              </div>
            </div>
          )}

          {/* Empty State for Search */}
          {!isLoading &&
            allGalleryListItems.length === 0 &&
            searchTerm &&
            !isError && (
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No galleries found
                </h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any galleries matching your search. Try using
                  different keywords or browse all galleries.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={clearSearch}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse All Galleries
                  </button>
                  <p className="text-sm text-gray-500">
                    Suggestions: Try shorter keywords, check spelling, or use
                    broader terms
                  </p>
                </div>
              </div>
            )}

          {/* Empty State for No Galleries at All */}
          {!isLoading &&
            allGalleryListItems.length === 0 &&
            !searchTerm &&
            !isError && (
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No galleries yet
                </h3>
                <p className="text-gray-600">
                  Check back later for new galleries!
                </p>
              </div>
            )}

          {/* End of Results Indicator */}
          {!hasNextPage &&
            allGalleryListItems.length > 0 &&
            !isFetchingNextPage && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">
                  You've reached the end of the galleries
                </p>
              </div>
            )}
        </>
      ) : null}
    </div>
  );
};

// Skeleton component for loading state
const GallerySkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] bg-gray-200"></div>

      {/* Content Skeleton */}
      <div className="p-6">
        {/* Date Skeleton */}
        <div className="text-center mb-4">
          <div className="h-8 bg-gray-200 rounded w-24 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>

        {/* Location Skeleton */}
        <div className="flex items-center justify-center mb-3">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>

        {/* Tags Skeleton */}
        <div className="flex flex-wrap gap-1 justify-center">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="h-6 bg-gray-200 rounded-full w-16"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface GalleryCardProps {
  gallery: GalleryListItem;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ gallery }) => {
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Link href={`/gallery/${gallery.slug.current}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={
              urlFor(gallery.featuredImage as any)
                .width(1920)
                .height(1080)
                .format("jpg")
                .quality(85)
                .url() || ""
            }
            alt={gallery.featuredImage.alt || gallery.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
           
           
          />

          {/* Category Badge */}
          {gallery.category && (
            <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md text-sm font-medium">
              {gallery.category}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Date */}
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-gray-800">
              {formatDate(gallery.eventDate)}
            </div>
            <div className="text-sm text-gray-600 uppercase tracking-wider mt-1">
              {gallery.title}
            </div>
          </div>

          {/* Location */}
          {gallery.location && (
            <div className="flex items-center justify-center text-gray-600 text-sm mb-3">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {gallery.location}
            </div>
          )}

          {/* Description */}
          {gallery.description && (
            <p className="text-gray-700 text-sm text-center line-clamp-2 mb-4">
              {gallery.description}
            </p>
          )}

          {/* Tags */}
          {gallery.tags && gallery.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center">
              {gallery.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {gallery.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{gallery.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default GalleryListClient;
