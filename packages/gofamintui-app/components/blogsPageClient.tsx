"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  const loadingRef = useRef(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  const { data, hasNextPage, isError, isLoading, fetchNextPage, blogPosts } =
    useBlogPosts({
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
          `/blogs${params.toString() ? `?${params.toString()}` : ""}`
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
    router.push(`/blogs${params.toString() ? `?${params.toString()}` : ""}`);
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

  console.log(blogPosts);

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
                  console.log(hasNextPage);
                  if (hasNextPage) {
              console.log('i don reach')
            return fetchNextPage();
          }
          return;
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6 mx-auto w-full max-w-6xl">
          {blogPosts.map((blogPost: BlogPost, index) => (
            <BlogPostCard key={index} blogPost={blogPost} />
          ))}
        </div>
      </InfiniteScrollContainer>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && blogPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No blog posts found.</p>
        </div>
      )}
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

  // Handle likes count - it can be null, number, or array of references
  const getLikesCount = () => {
    if (blogPost.likes === null || blogPost.likes === undefined) {
      return 0;
    }
    if (typeof blogPost.likes === "number") {
      return blogPost.likes;
    }
    if (Array.isArray(blogPost.likes)) {
      return blogPost.likes.length;
    }
    return 0;
  };

  // Handle views count - can be null
  const getViewsCount = () => {
    return blogPost.viewsCount || 0;
  };

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

        {/* Content Section - This takes up more space */}
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
                <span>{getViewsCount()}</span>
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
                <span>{getLikesCount()}</span>
              </div>
            </div>
          </div>

          {/* Title - Prominent */}
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {blogPost.title}
          </h2>

          {/* Excerpt - More space given to text content */}
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
