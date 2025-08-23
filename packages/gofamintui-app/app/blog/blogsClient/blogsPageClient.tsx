"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import InfiniteScrollContainer from "@/components/infiniteScrollContainer";
import useBlogPosts from "@/hooks/useBlogs";
import { urlFor } from "@/sanity/sanityClient";

const BlogsPageClient = () => {
  const {
    blogPosts,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isEmpty,
  } = useBlogPosts();

  // Helper functions
  const getAuthorInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleFetchNextPage = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Loading state - Medium style
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="space-y-12">
            {/* Header skeleton */}
            <div className="space-y-4">
              <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded w-96 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-80 animate-pulse"></div>
            </div>

            {/* Cards skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[2/1] bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 mx-auto">
            <div className="w-6 h-6 bg-red-500 rounded-full"></div>
          </div>
          <h2 className="text-2xl font-medium text-gray-900 mb-3">
            Something went wrong
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We couldn't load the articles right now. Please try again in a
            moment.
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 mx-auto">
            <BookOpen className="w-6 h-6 text-gray-400" />
          </div>
          <h2 className="text-2xl font-medium text-gray-900 mb-3">
            No stories yet
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We're working on some great content. Check back soon for our latest
            articles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
        {/* Header - Medium style */}
        <header className="mb-16 lg:mb-20">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-6 h-px bg-gray-900"></div>
              <span className="text-sm font-medium text-gray-900 tracking-wide uppercase">
                Stories
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
              Latest from our writers
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed font-light">
              Insights, ideas, and stories from our community of thinkers and
              creators.
            </p>
          </div>
        </header>

        {/* Blog Grid - Medium-inspired layout */}
        <InfiniteScrollContainer
          onBottomReached={() => {
            if (hasNextPage) {
              return handleFetchNextPage();
            }
            return;
          }}
        >
          <div className="space-y-16">
            {blogPosts.map((post, index) => {
              // Featured post (first one)
              if (index === 0) {
                return (
                  <article
                    key={post._id}
                    className="group pb-16 border-b border-gray-100"
                  >
                    <Link href={`/blog/${post.slug.current}`}>
                      <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 order-2 lg:order-1">
                          {/* Author info */}
                          <div className="flex items-center space-x-3">
                            {post.author.profilePic ? (
                              <Image
                                src={urlFor(post.author.profilePic.asset)
                                  .width(48)
                                  .height(48)
                                  .url()}
                                alt={`${post.author.firstName} ${post.author.lastName}`}
                                width={48}
                                height={48}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-base font-medium">
                                {getAuthorInitials(
                                  post.author.firstName,
                                  post.author.lastName
                                )}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">
                                {post.author.firstName} {post.author.lastName}
                              </p>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>{formatDate(post.publishedAt)}</span>
                                {post.readingTime && (
                                  <>
                                    <span>·</span>
                                    <div className="flex items-center space-x-1">
                                      <Clock size={14} />
                                      <span>{post.readingTime} min read</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="space-y-4">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-300">
                              {post.title}
                            </h2>
                            {post.excerpt && (
                              <p className="text-lg text-gray-600 leading-relaxed line-clamp-3">
                                {post.excerpt}
                              </p>
                            )}
                          </div>

                          {/* Read more */}
                          <div className="flex items-center space-x-2 text-gray-900 font-medium group/link">
                            <span>Read more</span>
                            <ArrowRight
                              size={16}
                              className="group-hover/link:translate-x-1 transition-transform duration-300"
                            />
                          </div>
                        </div>

                        {/* Featured image */}
                        <div className="order-1 lg:order-2">
                          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                            {post.featuredImage ? (
                              <Image
                                src={urlFor(post.featuredImage.asset)
                                  .width(800)
                                  .height(600)
                                  .format("webp")
                                  .quality(85)
                                  .url()}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                                <span className="text-8xl font-light text-gray-300">
                                  {post.title.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              }

              // Regular posts
              return (
                <article key={post._id} className="group">
                  <Link href={`/blog/${post.slug.current}`}>
                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                      {/* Content - Takes up 2/3 on large screens */}
                      <div className="lg:col-span-2 space-y-6">
                        {/* Author info */}
                        <div className="flex items-center space-x-3">
                          {post.author.profilePic ? (
                            <Image
                              src={urlFor(post.author.profilePic.asset)
                                .width(40)
                                .height(40)
                                .url()}
                              alt={`${post.author.firstName} ${post.author.lastName}`}
                              width={40}
                              height={40}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {getAuthorInitials(
                                post.author.firstName,
                                post.author.lastName
                              )}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {post.author.firstName} {post.author.lastName}
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <span>{formatDate(post.publishedAt)}</span>
                              {post.readingTime && (
                                <>
                                  <span>·</span>
                                  <div className="flex items-center space-x-1">
                                    <Clock size={12} />
                                    <span>{post.readingTime} min</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Title and excerpt */}
                        <div className="space-y-3">
                          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-gray-600 leading-relaxed line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Image - Takes up 1/3 on large screens */}
                      <div className="lg:col-span-1">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                          {post.featuredImage ? (
                            <Image
                              src={urlFor(post.featuredImage.asset)
                                .width(400)
                                .height(300)
                                .format("webp")
                                .quality(85)
                                .url()}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                              sizes="(max-width: 1024px) 100vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                              <span className="text-4xl font-light text-gray-300">
                                {post.title.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>

          {/* Loading more state */}
          {isFetchingNextPage && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
              <p className="text-gray-600 text-sm">Loading more stories...</p>
            </div>
          )}

          {/* End of results */}
          {!hasNextPage && blogPosts.length > 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
              <div className="text-center space-y-2">
                <p className="text-gray-900 font-medium">That's all for now</p>
                <p className="text-gray-600 text-sm">
                  You've read all our latest stories. Check back soon for more.
                </p>
              </div>
            </div>
          )}
        </InfiniteScrollContainer>
      </div>
    </div>
  );
};

export default BlogsPageClient;
