"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useInfiniteSermons from "@/hooks/useInfiniteSermons";
import InfiniteScrollContainer from "./infiniteScrollContainer";
import SermonComponent from "./sermonCard";
import { Sermon } from "@/sanity/interfaces/sermonsPage";
import { FiSearch, FiX, FiAlertTriangle, FiHeadphones } from "react-icons/fi";
import { motion } from "framer-motion";

export default function SermonsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement | null>(null);
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
          `/sermons${params.toString() ? `?${params.toString()}` : ""}`
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
      `/sermons${params.toString() ? `?${params.toString()}` : ""}`
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
    router.replace("/sermons");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const allSermons = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page: any) => page.sermonsResponse || []);
  }, [data?.pages]);

  const isInitialLoading = isLoading && !data;
  const hasData = allSermons.length > 0;

  if (isError) {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader />
        <div className="container mx-auto px-6 md:px-8 py-20">
          <ErrorState />
        </div>
      </div>
    );
  }

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader />
        <div className="container mx-auto px-6 md:px-8 py-16">
          <SearchBarSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {[...Array(6)].map((_, index) => (
              <SermonSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader />

      <div className="container mx-auto px-6 md:px-8 py-16">
        <SearchBar
          searchInput={searchInput}
          onChange={handleInputChange}
          onSubmit={handleSearchSubmit}
          onKeyPress={handleKeyPress}
          isLoading={isLoading && allSermons.length === 0}
          onClear={clearSearch}
          hasSearchTerm={!!searchTerm}
          inputRef={searchInputRef}
        />

        {searchTerm && hasData && (
          <SearchResultsInfo
            count={allSermons.length}
            term={searchTerm}
            onClear={clearSearch}
          />
        )}

        {!isLoading && !hasData && searchTerm && (
          <NoResultsState onClear={clearSearch} />
        )}

        {!isLoading && !hasData && !searchTerm && <EmptyState />}

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
              {allSermons.map((sermon: Sermon, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <SermonComponent sermon={sermon} />
                </motion.div>
              ))}
            </div>
          </InfiniteScrollContainer>
        )}

        {isFetchingNextPage && hasData && <LoadingMoreIndicator />}
        {!hasNextPage && hasData && !isFetchingNextPage && <EndOfResults />}
      </div>
    </div>
  );
}

const PageHeader = () => (
  <div className="bg-white py-24 md:py-32 border-b border-gray-100">
    <div className="container mx-auto px-6 md:px-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="w-8 h-px bg-blue-400"></div>
          <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
            Audio Messages
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-black leading-tight tracking-tight">
          Sermons
        </h1>
        <p className="text-lg md:text-xl text-black font-light leading-relaxed max-w-2xl mx-auto">
          Explore our collection of inspiring sermons and teachings
        </p>
      </motion.div>
    </div>
  </div>
);

const SearchBar = ({
  searchInput,
  onChange,
  onSubmit,
  onKeyPress,
  isLoading,
  onClear,
  hasSearchTerm,
  inputRef,
}: {
  searchInput: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  onClear: () => void;
  hasSearchTerm: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) => (
  <div className="mb-16 max-w-2xl mx-auto">
    <form onSubmit={onSubmit} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search sermons by title, preacher, or topic..."
          value={searchInput}
          onChange={onChange}
          onKeyPress={onKeyPress}
          className="w-full px-6 py-4 pr-16 border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all font-light text-black placeholder-gray-500"
          disabled={isLoading}
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {hasSearchTerm && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 text-gray-400 hover:text-black transition-colors duration-200"
              aria-label="Clear search"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
          <button
            type="submit"
            className="p-1 text-blue-400 hover:text-blue-500 disabled:opacity-50 transition-colors duration-200"
            title="Search"
            disabled={isLoading}
          >
            <FiSearch className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  </div>
);

const SearchResultsInfo = ({
  count,
  term,
  onClear,
}: {
  count: number;
  term: string;
  onClear: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="mb-12 text-center"
  >
    <p className="text-black font-light mb-4">
      Showing <span className="font-medium">{count}</span> sermon
      {count !== 1 ? "s" : ""} for "{term}"
    </p>
    <button
      onClick={onClear}
      className="text-blue-400 hover:text-blue-500 underline text-sm font-light transition-colors duration-200"
    >
      Clear search and show all sermons
    </button>
  </motion.div>
);

const ErrorState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="max-w-md mx-auto text-center"
  >
    <div className="flex items-center justify-center space-x-3 mb-8">
      <div className="w-8 h-px bg-blue-400"></div>
      <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
        Error
      </span>
    </div>
    <div className="w-16 h-16 mx-auto mb-6 bg-red-50 flex items-center justify-center">
      <FiAlertTriangle className="w-8 h-8 text-red-500" />
    </div>
    <h3 className="text-2xl font-light text-black mb-4">
      Unable to Load Sermons
    </h3>
    <p className="text-black font-light mb-8 leading-relaxed">
      We encountered an error while loading the sermons. Please try again later.
    </p>
    <button
      onClick={() => window.location.reload()}
      className="bg-blue-400 text-white px-6 py-3 hover:bg-blue-500 transition-colors duration-200 font-light"
    >
      Try Again
    </button>
  </motion.div>
);

const NoResultsState = ({ onClear }: { onClear: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-20 max-w-md mx-auto"
  >
    <div className="flex items-center justify-center space-x-3 mb-8">
      <div className="w-8 h-px bg-blue-400"></div>
      <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
        No Results
      </span>
    </div>
    <div className="w-16 h-16 mx-auto mb-6 bg-gray-50 flex items-center justify-center">
      <FiSearch className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-2xl font-light text-black mb-4">
      No matching sermons found
    </h3>
    <p className="text-black font-light mb-8 leading-relaxed">
      We couldn't find any sermons matching your search criteria.
    </p>
    <div className="space-y-4">
      <button
        onClick={onClear}
        className="bg-blue-400 text-white px-6 py-3 hover:bg-blue-500 transition-colors duration-200 font-light"
      >
        Browse All Sermons
      </button>
      <p className="text-sm text-gray-500 font-light">
        Try different keywords or broader search terms
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
    <div className="w-16 h-16 mx-auto mb-6 bg-gray-50 flex items-center justify-center">
      <FiHeadphones className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-2xl font-light text-black mb-4">
      No sermons available yet
    </h3>
    <p className="text-black font-light leading-relaxed">
      New sermons will be added soon. Please check back later!
    </p>
  </motion.div>
);

const LoadingMoreIndicator = () => (
  <div className="flex justify-center items-center py-12">
    <div className="flex items-center space-x-3">
      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
      <span className="text-black font-light">Loading more sermons...</span>
    </div>
  </div>
);

const EndOfResults = () => (
  <div className="text-center py-12">
    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6"></div>
    <p className="text-gray-500 text-sm font-light">
      You've reached the end of our sermon collection
    </p>
  </div>
);

const SearchBarSkeleton = () => (
  <div className="mb-16 max-w-2xl mx-auto">
    <div className="w-full h-14 bg-gray-100 animate-pulse"></div>
  </div>
);

const SermonSkeleton = () => (
  <div className="bg-white border border-gray-100 overflow-hidden animate-pulse hover:shadow-md transition-shadow duration-300">
    <div className="aspect-[4/5] bg-gray-100"></div>
    <div className="p-6 space-y-4">
      <div className="h-5 bg-gray-100 w-3/4"></div>
      <div className="flex items-center space-x-4">
        <div className="h-4 bg-gray-100 w-20"></div>
        <div className="h-4 bg-gray-100 w-16"></div>
      </div>
    </div>
  </div>
);
