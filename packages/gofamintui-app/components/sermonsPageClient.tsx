"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useInfiniteSermons from "@/hooks/useInfiniteSermons";
import InfiniteScrollContainer from "./infiniteScrollContainer";
import SermonComponent from "./sermonComponent";
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
      <div className="min-h-screen bg-gray-50">
        <PageHeader />
        <div className="container mx-auto px-4 py-12">
          <ErrorState />
        </div>
      </div>
    );
  }

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader />
        <div className="container mx-auto px-4 py-8">
          <SearchBarSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
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
      <PageHeader />

      <div className="container mx-auto px-4 py-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
  <div className="bg-white py-16 text-black">
    <div className="container mx-auto px-4 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-4"
      >
        Sermons
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-lg max-w-2xl mx-auto text-gray-600"
      >
        Explore our collection of inspiring sermons and teachings
      </motion.p>
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
  <div className="mb-8 max-w-2xl mx-auto">
    <form onSubmit={onSubmit} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search sermons by title, preacher, or topic..."
          value={searchInput}
          onChange={onChange}
          onKeyPress={onKeyPress}
          className="w-full px-5 py-3 pr-12 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          disabled={isLoading}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
          {hasSearchTerm && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 text-gray-400 hover:text-gray-600 mr-1"
              aria-label="Clear search"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
          <button
            type="submit"
            className="p-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
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
    className="mb-8 text-center"
  >
    <p className="text-gray-600">
      Showing <span className="font-semibold">{count}</span> sermon
      {count !== 1 ? "s" : ""} for "{term}"
    </p>
    <button
      onClick={onClear}
      className="mt-2 text-blue-600 hover:text-blue-800 underline text-sm"
    >
      Clear search and show all sermons
    </button>
  </motion.div>
);

const ErrorState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 text-center"
  >
    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
      <FiAlertTriangle className="w-8 h-8 text-red-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      Unable to Load Sermons
    </h3>
    <p className="text-gray-600 mb-4">
      We encountered an error while loading the sermons. Please try again later.
    </p>
    <button
      onClick={() => window.location.reload()}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Try Again
    </button>
  </motion.div>
);

const NoResultsState = ({ onClear }: { onClear: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-12 max-w-md mx-auto"
  >
    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
      <FiSearch className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      No matching sermons found
    </h3>
    <p className="text-gray-600 mb-4">
      We couldn't find any sermons matching your search criteria.
    </p>
    <div className="space-y-2">
      <button
        onClick={onClear}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Browse All Sermons
      </button>
      <p className="text-sm text-gray-500">
        Try different keywords or broader search terms
      </p>
    </div>
  </motion.div>
);

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-12"
  >
    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
      <FiHeadphones className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      No sermons available yet
    </h3>
    <p className="text-gray-600">
      New sermons will be added soon. Please check back later!
    </p>
  </motion.div>
);

const LoadingMoreIndicator = () => (
  <div className="flex justify-center items-center py-8">
    <div className="flex items-center space-x-2 text-gray-600">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      <span>Loading more sermons...</span>
    </div>
  </div>
);

const EndOfResults = () => (
  <div className="text-center py-8">
    <p className="text-gray-500 text-sm">
      You've reached the end of our sermon collection
    </p>
  </div>
);

const SearchBarSkeleton = () => (
  <div className="mb-8 max-w-2xl mx-auto">
    <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
  </div>
);

const SermonSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="aspect-[4/5] bg-gray-200"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="flex items-center space-x-4">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </div>
);
