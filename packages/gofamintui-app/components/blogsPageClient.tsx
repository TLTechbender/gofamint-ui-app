// packages/gofamintui-app/components/blogsPageClient.tsx
"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/sanityClient";
import useBlogPosts from "@/hooks/useBlogPages";
import InfiniteScrollContainer from "./infiniteScrollContainer";
import { BlogPost } from "@/sanity/interfaces/blogPosts";
import {
  Search,
  XCircle,
  AlertTriangle,
  Newspaper,
  Eye,
  Heart,
  ArrowRight,
  Loader2, // Added for a cooler loading spinner
} from "lucide-react";
import { motion } from "framer-motion";

// Animation variants for card entrance
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

const BlogsPageClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchParamValue = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchParamValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearchInput(searchParamValue);
  }, [searchParamValue]);

  const {
    hasNextPage,
    isError,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    blogPosts,
  } = useBlogPosts({
    searchTerm: searchParamValue,
  });

  const debouncedUrlUpdate = useCallback(
    (value: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        const trimmedValue = value.trim();
        if (trimmedValue !== searchParamValue) {
          const params = new URLSearchParams();
          if (trimmedValue) {
            params.set("search", trimmedValue);
          }
          router.replace(
            `/blog${params.toString() ? `?${params.toString()}` : ""}`
          );
        }
      }, 150);
    },
    [router, searchParamValue] // Depend on router and current search param value
  );

  // Handle input change: update local state and trigger debounced URL update
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchInput(newValue); // Update local input state immediately
    debouncedUrlUpdate(newValue); // Trigger debounced URL update
  };

  // Handle explicit search form submission (e.g., pressing Enter or clicking search button)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Clear any pending debounced URL updates
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmedInput = searchInput.trim();
    // Force immediate URL update if the input content is different from the current URL param
    if (trimmedInput !== searchParamValue) {
      const params = new URLSearchParams();
      if (trimmedInput) {
        params.set("search", trimmedInput);
      }
      router.replace(
        `/blog${params.toString() ? `?${params.toString()}` : ""}`
      );
    }
    // If input content is same as URL param, no action needed, maintain focus.
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e as any); // Call the form submission handler
    }
  };

  // Clear search function
  const clearSearch = () => {
    // Clear any pending debounced URL updates
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    setSearchInput(""); // Clear local input state
    router.replace("/blog"); // Update URL to clear search parameter
  };

  return (
    // Main container with updated padding and subtle background color
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Search Input Section */}
        <div className="mb-12">
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto">
            <div className="relative flex items-center bg-white rounded-xl shadow-lg border border-blue-100 focus-within:ring-3 focus-within:ring-blue-300 transition-all duration-300 ease-in-out">
              <Search className="absolute left-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search inspiring stories..."
                value={searchInput} // Controlled by local state
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                // Updated input styles using native Tailwind colors
                className="w-full pl-12 pr-16 py-3.5 bg-transparent rounded-xl text-gray-800 placeholder-gray-500 outline-none"
                disabled={isLoading && blogPosts.length === 0}
              />
              {searchInput && ( // Show clear button if search input has value
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 p-1 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                  title="Clear search"
                >
                  <XCircle className="w-5 h-5" /> {/* Lucide XCircle icon */}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Error State */}
        {isError && (
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center shadow-md">
              <div className="w-14 h-14 mx-auto mb-5 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-600" />{" "}
                {/* Lucide AlertTriangle icon */}
              </div>
              <h3 className="text-xl font-semibold text-red-900 mb-3">
                Something went wrong
              </h3>
              <p className="text-red-700 mb-5 leading-relaxed">
                We couldn&apos;t load the blog posts. Please check your internet
                connection and try again.
              </p>
            </div>
          </div>
        )}

        {/* First Load Loading State (Skeletons) */}
        {isLoading && blogPosts.length === 0 && !isError && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto w-full">
              {[...Array(6)].map((_, index) => (
                <BlogPostSkeleton key={index} />
              ))}
            </div>
          </div>
        )}

        {/* Content - Only show when not in initial loading state or when data is available */}
        {!isLoading || blogPosts.length > 0 ? (
          <>
            {/* Search Results Info */}
            {searchParamValue && !isError && blogPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10 text-center text-gray-700"
              >
                <p className="text-lg md:text-xl font-medium">
                  Found{" "}
                  <span className="font-bold text-blue-600">
                    {blogPosts.length}
                  </span>{" "}
                  result{blogPosts.length !== 1 ? "s" : ""} for &quot;
                  <span className="font-bold text-blue-800">
                    {searchParamValue}
                  </span>
                  &quot;
                </p>
                {searchParamValue && (
                  <button
                    onClick={clearSearch}
                    className="mt-3 text-blue-600 hover:text-blue-800 underline text-base font-medium transition-colors duration-200"
                  >
                    Clear search
                  </button>
                )}
              </motion.div>
            )}

            <InfiniteScrollContainer
              onBottomReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  return fetchNextPage();
                }
                return;
              }}
            >
              {/* Blog Post Grid - Added Framer Motion for staggered entrance */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto w-full"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.08, // Slightly faster stagger
                    },
                  },
                }}
              >
                {blogPosts.map((blogPost: BlogPost, index: number) => (
                  // Each card animates individually
                  <motion.div
                    key={blogPost._id || index}
                    variants={cardVariants}
                  >
                    <BlogPostCard blogPost={blogPost} />
                  </motion.div>
                ))}
              </motion.div>
            </InfiniteScrollContainer>

            {/* Next Page Loading State */}
            {isFetchingNextPage && (
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center space-x-3 text-gray-600 font-medium">
                  <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
                  <span>Loading more posts...</span>
                </div>
              </div>
            )}

            {/* Empty State for Search (No results found) */}
            {!isLoading &&
              blogPosts.length === 0 &&
              searchParamValue &&
              !isError && (
                <div className="text-center py-16 max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center shadow-inner">
                    <Search className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    No posts found
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    We couldn&apos;t find any blog posts matching your search
                    for &quot;
                    <span className="font-semibold text-blue-700">
                      {searchParamValue}
                    </span>
                    &quot;. Try using different keywords or browse all posts.
                  </p>
                  <div className="space-y-4">
                    <button
                      onClick={clearSearch}
                      className="w-full sm:w-auto bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                    >
                      Browse All Posts
                    </button>
                    <p className="text-sm text-gray-500">
                      Suggestions: Try shorter keywords, check spelling, or use
                      broader terms.
                    </p>
                  </div>
                </div>
              )}

            {/* Empty State for No Posts at All (no content in CMS) */}
            {!isLoading &&
              blogPosts.length === 0 &&
              !searchParamValue &&
              !isError && (
                <div className="text-center py-16 max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center shadow-inner">
                    <Newspaper className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    No blog posts yet
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    It looks like there aren&apos;t any blog posts published at
                    the moment. Check back later for new content from the
                    fellowship!
                  </p>
                </div>
              )}

            {/* End of Results Indicator */}
            {!hasNextPage && blogPosts.length > 0 && !isFetchingNextPage && (
              <div className="text-center py-12 text-gray-500 font-medium border-t border-gray-200 mt-8">
                <p className="text-base">
                  You&apos;ve reached the end of the posts.
                </p>
                <p className="text-sm">More inspiring content coming soon!</p>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

// Skeleton component for loading state
const BlogPostSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[16/9] bg-gray-200"></div>

      {/* Content Skeleton */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Meta Information Skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
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
        <div className="space-y-3 mb-4">
          <div className="h-6 bg-gray-200 rounded w-full"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* Excerpt Skeleton */}
        <div className="space-y-2 mb-6 flex-1">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Author Skeleton */}
        <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-auto">
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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const authorName = `${blogPost.author.firstName} ${blogPost.author.lastName}`;

  // Fallback for author avatar (using provided placeholder)
  const authorAvatarUrl = "https://placehold.net/avatar-5.svg";

  return (
    <Link
      href={`/blog/${blogPost.slug.current}`}
      className="block group h-full"
    >
      <article className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 transform group-hover:scale-[1.02] group-hover:shadow-2xl h-full flex flex-col">
        {/* Featured Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
          <Image
            src={
              urlFor(blogPost.featuredImage as any)
                .width(800)
                .height(450)
                .format("webp")
                .quality(85)
                .url() ||
              `https://placehold.co/800x450/DBEAFE/1E40AF?text=No+Image`
            }
            alt={blogPost.featuredImage?.alt || blogPost.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            placeholder="blur"
            blurDataURL={
              blogPost.featuredImage?.asset?.metadata?.lqip ||
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            }
          />

          {/* Featured Badge */}
          {blogPost.featured && (
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md z-10">
              Featured
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-3">
              <span className="font-medium text-blue-700">
                {formatDate(blogPost.publishedAt)}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-600">
                {blogPost.readingTime} min read
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-gray-600">
                <Eye className="w-4 h-4 text-blue-400" />
                <span>{blogPost.viewsCount}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <Heart className="w-4 h-4 text-red-400" />
                <span>{blogPost.viewsCount || 0}</span>{" "}
                {/* Assuming viewsCount for likes if not available */}
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
            {blogPost.title}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-700 text-base leading-relaxed mb-5 flex-1 line-clamp-3">
            {blogPost.excerpt}
          </p>

          {/* Author */}
          <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-auto">
            <div className="flex items-center space-x-3">
              <Image
                src={authorAvatarUrl}
                alt={authorName}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover border-2 border-blue-300 shadow-sm"
              />
              <span className="text-blue-800 font-semibold">{authorName}</span>
            </div>

            {/* Read More Arrow */}
            <div className="text-blue-600 group-hover:translate-x-2 transition-transform duration-300">
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogsPageClient;
