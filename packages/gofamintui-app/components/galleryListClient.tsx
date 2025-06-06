"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
  const loadingRef = useRef(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  const { data, hasNextPage, isError, isLoading, fetchNextPage } =
    useInfiniteGalleryList({
      searchTerm: searchInput,
    });
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

  const allGalleryListItems = useMemo(() => {
    if (!data?.pages) return [];

    return data.pages.flatMap(
      (page: any) => page.galleryListResponse || [] // Handle different response structures
    );
  }, [data?.pages]);

  console.log(allGalleryListItems);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search */}
      <div className="mb-8">
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search galleries... (auto-search as you type or press Enter)"
              value={searchInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              title="Search now"
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

      {/* Content */}
      <InfiniteScrollContainer
        onBottomReached={() => {
          if (hasNextPage) {
            return fetchNextPage();
          }

          return;
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(350px,400px))] gap-9 mx-auto items-start justify-center w-full px-4">
          {allGalleryListItems.map(
            (listItem: GalleryListItem, index: number) => (
              <GalleryCard key={index} gallery={listItem} />
            )
          )}
        </div>
      </InfiniteScrollContainer>
    </div>
  );
};

export default GalleryListClient;

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/sanityClient";

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
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg">
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
            placeholder="blur"
             blurDataURL={gallery.featuredImage.asset.metadata.lqip}
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
