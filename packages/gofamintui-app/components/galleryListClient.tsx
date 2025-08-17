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
    <div className="min-h-screen">
      <div className="pt-20 mb-2 bg-black h-16 w-full" />
      <div className="container mx-auto px-6 md:px-8 py-16 md:py-20 max-w-7xl">
        {/* Clean Search Section */}
        <div className="mb-16 md:mb-20">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Gallery
              </span>
              <div className="w-8 h-px bg-blue-400"></div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-6 leading-tight tracking-tight">
              Photo Galleries
            </h1>
            <p className="text-lg text-black font-light leading-relaxed">
              Explore moments and memories from our community events
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
            <div className="relative border border-gray-200 transition-all duration-200 hover:border-blue-400 focus-within:border-blue-400">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search galleries by title, date, or description..."
                value={searchInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full px-6 py-4 pr-16 border-0 focus:ring-0 focus:outline-none text-black placeholder-gray-500 font-light"
                disabled={isLoading && allGalleryListItems.length === 0}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                {searchInput && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="p-2 text-gray-400 hover:text-black transition-colors"
                    aria-label="Clear search"
                  >
                    <svg
                      className="w-4 h-4"
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
                  className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
                  disabled={isLoading && allGalleryListItems.length === 0}
                  aria-label="Search"
                >
                  <svg
                    className="w-4 h-4"
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
          <div className="max-w-2xl mx-auto mb-16 text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-6 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Error
              </span>
              <div className="w-6 h-px bg-blue-400"></div>
            </div>
            <h3 className="text-2xl font-light text-black mb-6">
              Unable to Load Galleries
            </h3>
            <p className="text-black font-light mb-8 leading-relaxed">
              We encountered an issue while loading the galleries. This might be
              a temporary problem.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-blue-400 text-white font-medium hover:bg-blue-500 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && allGalleryListItems.length === 0 && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
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
              <div className="mb-12 text-center">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-6 h-px bg-blue-400"></div>
                  <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                    Search Results
                  </span>
                  <div className="w-6 h-px bg-blue-400"></div>
                </div>
                <h2 className="text-2xl md:text-3xl font-light text-black mb-4">
                  {allGalleryListItems.length > 0
                    ? `Found ${allGalleryListItems.length} ${allGalleryListItems.length === 1 ? "gallery" : "galleries"}`
                    : "No Results Found"}
                </h2>
                <p className="text-black font-light mb-6">
                  {allGalleryListItems.length > 0
                    ? `Galleries matching "${searchTerm}"`
                    : `No galleries found for "${searchTerm}"`}
                </p>
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="text-blue-400 hover:text-blue-600 font-light flex items-center justify-center mx-auto transition-colors"
                  >
                    Clear search and view all galleries
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
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
              <div className="flex justify-center my-16">
                <div className="flex items-center space-x-3 text-blue-400">
                  <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-light">Loading more galleries...</span>
                </div>
              </div>
            )}

            {/* Empty States */}
            {!isLoading && allGalleryListItems.length === 0 && (
              <div className="text-center py-20">
                <div className="flex items-center justify-center space-x-3 mb-8">
                  <div className="w-8 h-px bg-blue-400"></div>
                  <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                    {searchTerm ? "No Results" : "Coming Soon"}
                  </span>
                  <div className="w-8 h-px bg-blue-400"></div>
                </div>
                <h3 className="text-3xl md:text-4xl font-light text-black mb-6">
                  {searchTerm
                    ? "No matching galleries"
                    : "No galleries available"}
                </h3>
                <p className="text-lg text-black font-light mb-8 max-w-lg mx-auto leading-relaxed">
                  {searchTerm
                    ? "Try different search terms or browse all galleries."
                    : "Check back later for new gallery additions."}
                </p>
                {searchTerm ? (
                  <button
                    onClick={clearSearch}
                    className="px-8 py-3 bg-blue-400 text-white font-medium hover:bg-blue-500 transition-colors"
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
                <div className="text-center py-16">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
                  <div className="flex items-center justify-center mt-8 space-x-3">
                    <div className="w-6 h-px bg-blue-400"></div>
                    <span className="text-sm font-light text-black tracking-wide">
                      End of results
                    </span>
                    <div className="w-6 h-px bg-blue-400"></div>
                  </div>
                </div>
              )}
          </>
        ) : null}
      </div>
    </div>
  );
};

// Clean Skeleton Loader
const GallerySkeleton = () => (
  <div className="bg-white animate-pulse">
    <div className="aspect-[4/3] bg-gray-100"></div>
    <div className="pt-6 space-y-4">
      <div className="h-5 bg-gray-100 w-3/4 mx-auto"></div>
      <div className="h-3 bg-gray-100 w-1/2 mx-auto"></div>
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-gray-100 w-full"></div>
        <div className="h-3 bg-gray-100 w-4/5 mx-auto"></div>
      </div>
    </div>
  </div>
);

// Minimalist Gallery Card
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
      className="block group transition-all duration-300 hover:opacity-90"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="bg-white h-full">
        {/* Sharp Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={urlFor(gallery.featuredImage as any)
              .width(800)
              .height(600)
              .quality(85)
              .url()}
            alt={gallery.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Clean Content */}
        <div className="pt-6">
          <div className="text-center space-y-3">
            <h3 className="text-lg md:text-xl font-medium text-black group-hover:text-blue-500 transition-colors duration-300">
              {gallery.title}
            </h3>
            <time className="text-sm text-gray-600 font-light tracking-wide">
              {formatDate(gallery._createdAt)}
            </time>
            {gallery.description && (
              <p className="text-black font-light text-sm leading-relaxed line-clamp-2 max-w-xs mx-auto">
                {gallery.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

export default GalleryListClient;
