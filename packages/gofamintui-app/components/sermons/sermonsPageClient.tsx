"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import useInfiniteSermons from "@/hooks/useInfiniteSermons";
import InfiniteScrollContainer from "../infiniteScrollContainer";
import SermonComponent from "./sermonCard";
import { Sermon } from "@/sanity/interfaces/sermonsPage";
import { FiSearch, FiX, FiAlertTriangle, FiHeadphones } from "react-icons/fi";
import { motion } from "framer-motion";

export default function SermonsPageClient() {
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Single source of truth for search input
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );

  // Separate state for the actual search term used for API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    sermons,
    hasNextPage,
    isError,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteSermons({ searchTerm: debouncedSearchTerm });

  // Debounced search function - only updates search term, URL update is separate
  const debouncedSearch = useCallback(
    (searchValue: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        const trimmedSearch = searchValue.trim();
        setDebouncedSearchTerm(trimmedSearch);

        // Update URL without causing component re-render
        const params = new URLSearchParams();
        if (trimmedSearch) {
          params.set("search", trimmedSearch);
        }
        const newURL = `/sermons${params.toString() ? `?${params.toString()}` : ""}`;
        window.history.replaceState(null, "", newURL);
      }, 300);
    },
    [] // Empty deps to prevent re-creation
  );

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchInput(newValue);
    debouncedSearch(newValue);
  };

  // Handle form submission (Enter key)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    const trimmedSearch = searchInput.trim();
    setDebouncedSearchTerm(trimmedSearch);

    // Update URL directly
    const params = new URLSearchParams();
    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    }
    const newURL = `/sermons${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState(null, "", newURL);
  };

  // Clear search function
  const clearSearch = () => {
    setSearchInput("");
    setDebouncedSearchTerm("");

    // Update URL directly
    window.history.replaceState(null, "", "/sermons");

    // Focus the input after clearing
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Focus input on initial mount only
  useEffect(() => {
    if (searchInputRef.current && !searchParams.get("search")) {
      searchInputRef.current.focus();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isInitialLoading = isLoading && sermons.length === 0;
  const hasData = sermons.length > 0;

  if (isError) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 md:px-8 py-24 md:py-32">
          <ErrorState />
        </div>
      </div>
    );
  }

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 md:px-8 py-24 md:py-32">
          <SearchBarSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mt-20">
            {[...Array(6)].map((_, index) => (
              <SermonSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <div className="container mx-auto px-6 md:px-8 py-24 md:py-32">
        <SearchBar
          searchInput={searchInput}
          onChange={handleInputChange}
          onSubmit={handleSearchSubmit}
          isLoading={isLoading && sermons.length === 0}
          onClear={clearSearch}
          hasSearchTerm={!!searchInput}
          inputRef={searchInputRef}
        />

        {/* Search Results Header */}
        {debouncedSearchTerm && !isError && (
          <div className="mb-16 text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-px bg-blue-400"></div>
                <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                  Search Results
                </span>
              </div>
              <p className="text-black font-light text-lg mb-6 leading-relaxed">
                {hasData
                  ? `Found ${sermons.length} sermon${sermons.length !== 1 ? "s" : ""} for "${debouncedSearchTerm}"`
                  : `No sermons found for "${debouncedSearchTerm}"`}
              </p>
              <button
                onClick={clearSearch}
                className="text-blue-400 hover:text-blue-500 underline underline-offset-2 text-sm font-light transition-colors duration-200"
              >
                Clear search and browse all sermons
              </button>
            </motion.div>
          </div>
        )}

        {/* Empty States */}
        {!isLoading && !hasData && debouncedSearchTerm && (
          <NoResultsState
            onClear={clearSearch}
            searchTerm={debouncedSearchTerm}
          />
        )}

        {!isLoading && !hasData && !debouncedSearchTerm && <EmptyState />}

        {/* Sermons Grid */}
        {hasData && (
          <InfiniteScrollContainer
            onBottomReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                return fetchNextPage();
              }
              return;
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {sermons.map((sermon: Sermon, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(index * 0.05, 0.3),
                  }}
                >
                  <SermonComponent sermon={sermon} />
                </motion.div>
              ))}
            </div>
          </InfiniteScrollContainer>
        )}

        {/* Loading More Indicator */}
        {isFetchingNextPage && hasData && <LoadingMoreIndicator />}

        {/* End of Results */}
        {!hasNextPage && hasData && !isFetchingNextPage && <EndOfResults />}
      </div>
    </main>
  );
}

const SearchBar = ({
  searchInput,
  onChange,
  onSubmit,
  isLoading,
  onClear,
  hasSearchTerm,
  inputRef,
}: {
  searchInput: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onClear: () => void;
  hasSearchTerm: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) => (
  <div className="mb-20 max-w-3xl mx-auto">
    {/* Search Header */}
    <div className="text-center mb-12">
      <div className="flex items-center justify-center space-x-3 mb-6">
        <div className="w-8 h-px bg-blue-400"></div>
        <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
          Sermons Library
        </span>
      </div>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-6 leading-tight tracking-tight">
        {` Discover God's Word`}
      </h1>
      <p className="text-lg text-black font-light leading-relaxed max-w-2xl mx-auto">
        Search through our collection of sermons by title, preacher, or topic to
        find the message that speaks to you.
      </p>
    </div>

    {/* Search Form */}
    <form onSubmit={onSubmit} className="relative">
      <div className="relative border border-gray-200 bg-white transition-all duration-200 hover:border-blue-400 focus-within:border-blue-400 focus-within:shadow-lg focus-within:shadow-blue-400/10">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search sermons..."
          value={searchInput}
          onChange={onChange}
          className="w-full px-6 py-4 pr-20 border-0 focus:ring-0 focus:outline-none text-black placeholder-gray-400 font-light text-lg"
          disabled={isLoading}
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {hasSearchTerm && (
            <button
              type="button"
              onClick={onClear}
              className="p-2 text-gray-400 hover:text-black transition-colors duration-200 hover:bg-gray-50"
              aria-label="Clear search"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="p-2 text-blue-400 hover:text-blue-500 hover:bg-blue-50 disabled:opacity-50 transition-colors duration-200"
            title="Search"
            disabled={isLoading}
          >
            <FiSearch className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  </div>
);

const ErrorState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="max-w-md mx-auto text-center py-20"
  >
    <div className="flex items-center justify-center space-x-3 mb-8">
      <div className="w-8 h-px bg-blue-400"></div>
      <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
        Error
      </span>
    </div>
    <div className="w-16 h-16 mx-auto mb-8 bg-gray-50 flex items-center justify-center">
      <FiAlertTriangle className="w-8 h-8 text-red-400" />
    </div>
    <h3 className="text-2xl md:text-3xl font-light text-black mb-6 leading-tight">
      Unable to Load Sermons
    </h3>
    <p className="text-black font-light mb-8 leading-relaxed">
      We encountered an error while loading the sermons. Please check your
      connection and try again.
    </p>
    <button
      onClick={() => window.location.reload()}
      className="bg-blue-400 text-white px-8 py-3 hover:bg-blue-500 transition-colors duration-200 font-light tracking-wide"
    >
      Try Again
    </button>
  </motion.div>
);

const NoResultsState = ({
  onClear,
  searchTerm,
}: {
  onClear: () => void;
  searchTerm: string;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-20 max-w-lg mx-auto"
  >
    <div className="flex items-center justify-center space-x-3 mb-8">
      <div className="w-8 h-px bg-blue-400"></div>
      <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
        No Results
      </span>
    </div>
    <div className="w-16 h-16 mx-auto mb-8 bg-gray-50 flex items-center justify-center">
      <FiSearch className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-2xl md:text-3xl font-light text-black mb-6 leading-tight">
      No Sermons Found
    </h3>
    <p className="text-black font-light mb-8 leading-relaxed">
      {`  We couldn't find any sermons matching{" "}`}
      <span className="font-medium">{`"${searchTerm}"`}</span>. Try different
      keywords or browse our complete collection.
    </p>
    <div className="space-y-4">
      <button
        onClick={onClear}
        className="bg-blue-400 text-white px-8 py-3 hover:bg-blue-500 transition-colors duration-200 font-light tracking-wide"
      >
        Browse All Sermons
      </button>
      <p className="text-sm text-gray-500 font-light">
        Search suggestions: preacher names, topics, or scripture references
      </p>
    </div>
  </motion.div>
);

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-20"
  >
    <div className="flex items-center justify-center space-x-3 mb-8">
      <div className="w-8 h-px bg-blue-400"></div>
      <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
        Coming Soon
      </span>
    </div>
    <div className="w-16 h-16 mx-auto mb-8 bg-gray-50 flex items-center justify-center">
      <FiHeadphones className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-2xl md:text-3xl font-light text-black mb-6 leading-tight">
      Sermon Library Coming Soon
    </h3>
    <p className="text-black font-light leading-relaxed max-w-lg mx-auto">
      {`We're currently building our sermon collection. New messages will be
      available soon. Check back regularly for inspiring content!`}{" "}
    </p>
  </motion.div>
);

const LoadingMoreIndicator = () => (
  <div className="flex justify-center items-center py-16">
    <div className="flex items-center space-x-4">
      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
      <span className="text-black font-light">Loading more sermons...</span>
    </div>
  </div>
);

const EndOfResults = () => (
  <div className="text-center py-16">
    <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent mb-8"></div>
    <div className="flex items-center justify-center space-x-3 mb-4">
      <div className="w-6 h-px bg-blue-400"></div>
      <span className="text-xs font-medium text-blue-400 tracking-widest uppercase">
        End of Collection
      </span>
    </div>
    <p className="text-gray-500 text-sm font-light">
      {`You've explored our entire sermon library`}
    </p>
  </div>
);

const SearchBarSkeleton = () => (
  <div className="mb-20 max-w-3xl mx-auto">
    <div className="text-center mb-12">
      <div className="w-32 h-4 bg-gray-100 mx-auto mb-6 animate-pulse"></div>
      <div className="w-80 h-8 bg-gray-100 mx-auto mb-4 animate-pulse"></div>
      <div className="w-96 h-5 bg-gray-100 mx-auto animate-pulse"></div>
    </div>
    <div className="w-full h-16 bg-gray-100 animate-pulse"></div>
  </div>
);

const SermonSkeleton = () => (
  <div className="bg-white border border-gray-100 overflow-hidden animate-pulse group hover:shadow-md transition-shadow duration-300">
    <div className="aspect-[4/5] bg-gray-100"></div>
    <div className="p-6 space-y-4">
      <div className="h-5 bg-gray-100 w-3/4"></div>
      <div className="flex items-center space-x-4">
        <div className="h-4 bg-gray-100 w-20"></div>
        <div className="h-4 bg-gray-100 w-16"></div>
      </div>
      <div className="h-4 bg-gray-100 w-full"></div>
      <div className="h-4 bg-gray-100 w-2/3"></div>
    </div>
  </div>
);
