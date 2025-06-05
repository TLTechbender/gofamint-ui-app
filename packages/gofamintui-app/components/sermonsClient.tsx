"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";

import { sanityFetchWrapper } from "@/sanity/sanityFetch";
import useInfiniteSermons from "@/hooks/useInfiniteSermons";
import InfiniteScrollContainer from "./infiniteScrollContainer";
import SermonComponent from "./sermonComponent";
import { Sermon } from "@/sanity/interfaces/sermonsPage";

export default function SermonsPage() {
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
  const initialPageParam = parseInt(searchParams.get("page") || "1");

  const itemsPerPage = 2;
 
    const { data, hasNextPage, isError, isLoading,fetchNextPage } = useInfiniteSermons({ searchTerm });

  console.log("Data:", data);
  

  // Debounced search function
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

  // Update URL with current page when fetching next page
  const updateUrlWithPage = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (pageNumber > 1) {
      params.set("page", pageNumber.toString());
    } else {
      params.delete("page");
    }
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }

    const newUrl = `/sermons${params.toString() ? `?${params.toString()}` : ""}`;
    router.replace(newUrl, { scroll: false });
  };

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

 
  const allSermons = useMemo(() => {
    if (!data?.pages) return [];

    return data.pages.flatMap(
      (page: any) => page.sermonsResponse || [] // Handle different response structures
    );
  }, [data?.pages]);
    
    
    console.log(allSermons);

  // Loading state for initial load
  if (isLoading && !data) {
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
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-gray-500 text-lg">Loading sermons...</div>
        </div>
      </div>
    );
  }

  // Error state
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
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Failed to Load Sermons
            </h2>
            <p className="text-gray-600 mb-6">
              We're having trouble loading the sermons right now. Please try
              again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
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
                placeholder="Search sermons... (auto-search as you type or press Enter)"
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

        <div>
          <InfiniteScrollContainer onBottomReached={() => fetchNextPage()}>
            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(350px,400px))] gap-9 mx-auto items-start justify-center w-full px-4">
              {allSermons.map((sermon: Sermon, index: number) => (
                <SermonComponent key={index} sermon={sermon} />
              ))}
            </div>
          </InfiniteScrollContainer>
        </div>
      </div>
    </div>
  );
}
