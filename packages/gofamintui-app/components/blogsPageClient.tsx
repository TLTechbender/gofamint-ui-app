"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/sanityClient";
import useBlogPosts from "@/hooks/useBlogPages";
import InfiniteScrollContainer from "./infiniteScrollContainer";
import { BlogPost } from "@/sanity/interfaces/blogPosts";

const BlogsPageClient = () => {
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
    hasNextPage,
    isError,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    blogPosts,
   
  } = useBlogPosts({
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
          `/blog${params.toString() ? `?${params.toString()}` : ""}`
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
    router.push(`/blog${params.toString() ? `?${params.toString()}` : ""}`);
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
    router.push("/blog");
  };

  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search */}
      <div className="mb-8">
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={isLoading && blogPosts.length === 0}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              title="Search now"
              disabled={isLoading && blogPosts.length === 0}
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
              We couldn't load the blog posts. Please check your connection and
              try again.
            </p>
           
          </div>
        </div>
      )}

      {/* First Load Loading State */}
      {isLoading && blogPosts.length === 0 && !isError && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6 mx-auto w-full max-w-6xl">
            {[...Array(6)].map((_, index) => (
              <BlogPostSkeleton key={index} />
            ))}
          </div>
        </div>
      )}

      {/* Content - Only show when not in initial loading state */}
      {!isLoading || blogPosts.length > 0 ? (
        <>
          {/* Search Results Info */}
          {searchTerm && !isError && (
            <div className="mb-6 text-center">
              <p className="text-gray-600">
                {blogPosts.length > 0 ? (
                  <>
                    Found{" "}
                    <span className="font-semibold">{blogPosts.length}</span>{" "}
                    result
                    {blogPosts.length !== 1 ? "s" : ""} for "{searchTerm}"
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
            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6 mx-auto w-full max-w-6xl">
              {blogPosts.map((blogPost: BlogPost, index: number) => (
                <BlogPostCard key={blogPost._id || index} blogPost={blogPost} />
              ))}
            </div>
          </InfiniteScrollContainer>

          {/* Next Page Loading State */}
          {isFetchingNextPage && (
            <div className="flex justify-center items-center py-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span>Loading more posts...</span>
              </div>
            </div>
          )}

          {/* Empty State for Search */}
          {!isLoading && blogPosts.length === 0 && searchTerm && !isError && (
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
                No posts found
              </h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any blog posts matching your search. Try using
                different keywords or browse all posts.
              </p>
              <div className="space-y-2">
                <button
                  onClick={clearSearch}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse All Posts
                </button>
                <p className="text-sm text-gray-500">
                  Suggestions: Try shorter keywords, check spelling, or use
                  broader terms
                </p>
              </div>
            </div>
          )}

          {/* Empty State for No Posts at All */}
          {!isLoading && blogPosts.length === 0 && !searchTerm && !isError && (
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
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No blog posts yet
              </h3>
              <p className="text-gray-600">Check back later for new content!</p>
            </div>
          )}

          {/* End of Results Indicator */}
          {!hasNextPage && blogPosts.length > 0 && !isFetchingNextPage && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                You've reached the end of the posts
              </p>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

// Skeleton component for loading state
const BlogPostSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[16/9] bg-gray-200"></div>

      {/* Content Skeleton */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Meta Information Skeleton */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-4"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-4 bg-gray-200 rounded w-8"></div>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </div>
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-6 bg-gray-200 rounded w-full"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* Excerpt Skeleton */}
        <div className="space-y-2 mb-4 flex-1">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Author Skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="h-5 bg-gray-200 rounded w-5"></div>
        </div>
      </div>
    </div>
  );
};

interface BlogPostCardProps {
  blogPost: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ blogPost }) => {
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get author full name
  const authorName = `${blogPost.author.firstName} ${blogPost.author.lastName}`;

  return (
    <Link href={`/blog/${blogPost.slug.current}`} className="block group">
      <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 h-full flex flex-col">
        {/* Featured Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
          <Image
            src={
              urlFor(blogPost.featuredImage as any)
                .width(800)
                .height(450)
                .format("jpg")
                .quality(85)
                .url() || ""
            }
            alt={blogPost.featuredImage.alt || blogPost.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            placeholder="blur"
            blurDataURL={blogPost.featuredImage.asset.metadata.lqip}
          />

          {/* Featured Badge */}
          {blogPost.featured && (
            <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-4">
              <span>{formatDate(blogPost.publishedAt)}</span>
              <span>•</span>
              <span>{blogPost.readingTime} min read</span>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>{blogPost.viewsCount}</span>
              </div>
              <div className="flex items-center space-x-1">
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {blogPost.title}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-600 text-base leading-relaxed mb-4 flex-1 line-clamp-3">
            {blogPost.excerpt}
          </p>

          {/* Author */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {blogPost.author.firstName.charAt(0)}
                {blogPost.author.lastName.charAt(0)}
              </div>
              <span className="text-gray-700 font-medium">{authorName}</span>
            </div>

            {/* Read More Arrow */}
            <div className="text-blue-500 group-hover:translate-x-1 transition-transform">
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogsPageClient;
