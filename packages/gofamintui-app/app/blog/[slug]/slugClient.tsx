"use client";

import { PortableText, PortableTextComponents } from "@portabletext/react";
import {  Share2, Clock, Eye } from "lucide-react";
import { formatDate } from "@/lib/dateFormatters";
import Image from "next/image";
import { urlFor } from "@/sanity/sanityClient";

import { BlogPost } from "@/sanity/interfaces/blog";
import ViewTracker from "./viewsTracker";
import { useEffect, useState } from "react";
import { getGenericViewCount } from "@/actions/blog/viewCount";
import LikeAndCommentsInteractionsClient from "./likeandCommentsInteractionsClient";
import { getBlogId } from "@/actions/blog/getBlogId";

import { toast } from "react-toastify";

const SlugClient = ({ blogPost }: { blogPost: BlogPost }) => {
  // NYT-Style Portable Text Components
  const portableTextComponents: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p className="mb-6 text-black leading-8 font-light text-lg tracking-wide">
          {children}
        </p>
      ),
      h1: ({ children }) => (
        <h1 className="text-2xl md:text-3xl font-light text-black mb-8 mt-12 leading-tight tracking-tight border-b border-gray-200 pb-4">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-xl md:text-2xl font-light text-black mb-6 mt-10 leading-tight tracking-tight">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-lg md:text-xl font-medium text-black mb-4 mt-8 leading-tight">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-base md:text-lg font-medium text-black mb-3 mt-6 leading-tight">
          {children}
        </h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className="relative my-10 py-4">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-blue-400"></div>
          <div className="pl-8 italic text-lg md:text-xl font-light text-black leading-relaxed">
            {children}
          </div>
        </blockquote>
      ),
    },
    types: {
      image: ({ value }) => {
        if (!value?.asset) return null;
   
        return (
          <figure className="my-1.5">
            <Image
              src={urlFor(value.asset).quality(75).format("webp").url()}
              alt={value.alt || "Blog post image"}
              width={value.asset.metadata?.dimensions?.width || 800}
              height={value.asset.metadata?.dimensions?.height || 600}
              className="w-full h-auto rounded-lg"
              
            />
          </figure>
        );
      },
      code: ({ value }) => (
        <div className="my-10">
          <pre className="bg-gray-50 border border-gray-200 p-6 text-sm font-mono leading-relaxed overflow-x-auto">
            <code className={`language-${value?.language || "text"}`}>
              {value?.code || ""}
            </code>
          </pre>
          {value?.filename && (
            <p className="text-xs text-gray-500 mt-2 font-light tracking-wide">
              {value.filename}
            </p>
          )}
        </div>
      ),
    },
    marks: {
      strong: ({ children }) => (
        <strong className="font-semibold text-black">{children}</strong>
      ),
      em: ({ children }) => <em className="italic font-light">{children}</em>,
      link: ({ value, children }) => {
        const href = value?.href;
        if (!href) return <span>{children}</span>;

        const target = href.startsWith("http") ? "_blank" : undefined;
        return (
          <a
            href={href}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
            className="text-blue-600 hover:text-blue-700 underline underline-offset-2 decoration-1 transition-colors font-medium"
          >
            {children}
          </a>
        );
      },
      code: ({ children }) => (
        <code className="bg-gray-100 text-black px-2 py-0.5 text-sm font-mono border border-gray-200">
          {children}
        </code>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="mb-8 space-y-3 ml-0">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="mb-8 space-y-3 ml-0">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="text-black font-light text-lg leading-8 flex items-start">
          <span className="inline-block w-1 h-1 bg-blue-400 rounded-full mt-4 mr-6 flex-shrink-0"></span>
          <span className="flex-1">{children}</span>
        </li>
      ),
      number: ({ children }) => (
        <li className="text-black font-light text-lg leading-8 list-decimal ml-6">
          {children}
        </li>
      ),
    },
  };

  // Safe author image URL generation
  const getAuthorImageUrl = () => {
    try {
      if (blogPost.author?.profilePic?.asset) {
        return urlFor(blogPost.author.profilePic.asset)
          .width(100)
          .height(100)
          .fit("max")
          .auto("format")
          .url();
      }
      return "/api/placeholder/48/48"; // Fallback image, all in the name of making typescript happy, fuck!!!
    } catch (error) {
  
      return "/api/placeholder/48/48";
    }
  };

  // Safe featured image URL generation
  const getFeaturedImageUrl = () => {
    try {
      if (blogPost.featuredImage?.asset) {
        return urlFor(blogPost.featuredImage.asset)
          .width(1400)
          .height(900)
          .fit("max")
          .auto("format")
          .url();
      }
      return null;
    } catch (error) {
   
      return null;
    }
  };

  // Safe social links handling
  const getAuthorSocialLink = (platform: string) => {
    try {
      const social = blogPost.author?.socials?.find(
        (s) => s.platform === platform
      );
      return social?.url || null;
    } catch (error) {
     
      return null;
    }
  };

  const featuredImageUrl = getFeaturedImageUrl();
  const authorImageUrl = getAuthorImageUrl();
  const twitterUrl = getAuthorSocialLink("twitter");
  const linkedinUrl = getAuthorSocialLink("linkedin");
  //todo add for all patforms

  // Simple author info for the comments component
  const blogAuthorInfo = {
    userId: blogPost.author.userId!,
    profilePictureUrl: authorImageUrl,
    firstName: blogPost.author.firstName,
    lastName: blogPost.author.lastName,
  };

  function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState<number>(0);
  const [isBlogIdLoading, setIsBlogIdLoading] = useState(false);
  const [isBlogIdError, setIsBlogIdError] = useState<string | null>(null);
  const [blogId, setBlogId] = useState<string>("");

 
  const fetchStats = async () => {
    if (!blogPost.slug) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("sanitySlug", blogPost.slug.current);

      const result = await getGenericViewCount(formData);
    
      if (result.success && result.data) {
        setViewCount(
          (result.data as unknown as { genericViewCount?: number })
            ?.genericViewCount ?? 0
        );
      } else {
        const errorMsg =
          result.error?.toString() || result.message || "Failed to fetch stats";
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogId = async () => {
    if (!blogPost.slug) {
      return;
    }

    setIsBlogIdLoading(true);
    setIsBlogIdError(null);
    try {
      const formData = new FormData();
      formData.append("sanitySlug", blogPost.slug.current);
      const result = await getBlogId(formData);
      if (result.success && result.blogId) {
        setBlogId(result.blogId);
      } else {
        const errorMsg =
          result.error?.toString() ||
          result.message ||
          "Failed to fetch blog id bro";
        setIsBlogIdError(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setIsBlogIdError(errorMsg);
    } finally {
      setIsBlogIdLoading(false);
    }
  };

  
  useEffect(() => {
    fetchStats();
    fetchBlogId();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="bg-black h-16 mb-2 w-full flex-shrink-0" />
      <ViewTracker
        sanitySlug={blogPost.slug?.current || ""}
        threshold={0.1} // Track when 10% of the tracker is visible
        delay={
          blogPost.readingTime
            ? clamp(0.05 * blogPost.readingTime * 60_000, 7_000, 60_000)
            : 5000
        } // Wait based on interaction
      />
      <div className="min-h-screen bg-white">
        {/* NYT-Style Header */}
        <div className="border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 md:px-8 py-8">
            {/* Article Meta */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-px bg-blue-400"></div>
                <span>
                  <p className="text-xs font-medium text-black uppercase tracking-widest">
                    published on:{" "}
                  </p>

                  <time className="text-xs font-medium text-blue-400 uppercase tracking-widest">
                    {blogPost.publishedAt
                      ? formatDate(blogPost.publishedAt)
                      : ""}
                  </time>
                </span>
              </div>

              <div className="flex items-center gap-6 text-xs text-gray-500 font-light tracking-wide uppercase mb-8">
                <span className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {blogPost.readingTime || 5} min read
                </span>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Eye className="w-3 h-3 text-gray-400 animate-pulse" />
                    <span className="h-3 w-10 bg-gray-300 rounded animate-pulse" />
                  </span>
                ) : error ? (
                  <></>
                ) : (
                  <span className="flex items-center gap-2">
                    <Eye className="w-3 h-3" />
                    <p>{viewCount}</p>
                    {`Read ${viewCount == 1 ? "" : "s"}`}
                  </span>
                )}
              </div>
            </div>

            {/* NYT-Style Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black leading-tight tracking-tight mb-8 max-w-4xl">
              {blogPost.title || "Untitled Post"}
            </h1>

            {/* Subtitle/Excerpt */}
            {blogPost.excerpt && (
              <p className="text-lg md:text-xl text-gray-700 font-light leading-relaxed mb-12 max-w-3xl border-l-2 border-blue-400 pl-6">
                {blogPost.excerpt}
              </p>
            )}
          </div>
        </div>

        {/* Featured Image - NYT Style */}
        {featuredImageUrl && (
          <div className="mb-12">
            <div className="max-w-5xl mx-auto px-6 md:px-8">
              <figure>
                <div className="relative aspect-video md:aspect-[16/10] overflow-hidden">
                  <Image
                    src={featuredImageUrl}
                    alt={blogPost.featuredImage?.alt || "Featured image"}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 1400px"
                 
                  />
                </div>
                {blogPost.featuredImage?.alt && (
                  <figcaption className="mt-4 text-sm text-gray-600 font-light tracking-wide leading-relaxed max-w-3xl">
                    {blogPost.featuredImage.alt}
                  </figcaption>
                )}
              </figure>
            </div>
          </div>
        )}

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-6 md:px-8 mb-16">
          {/* Author Byline - NYT Style */}
          {blogPost.author && (
            <div className="flex items-start gap-4 py-8 mb-12 border-y border-gray-100">
              <Image
                src={authorImageUrl}
                alt={
                  `${blogPost.author.firstName || ""} ${blogPost.author.lastName || ""}`.trim() ||
                  "Author"
                }
                className="w-12 h-12 object-cover rounded-full"
                width={48}
                height={48}
             
              />
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xs uppercase tracking-widest font-medium text-gray-500">
                    By
                  </span>
                  <h3 className="font-medium text-black">
                    {blogPost.author.firstName && blogPost.author.lastName
                      ? `${blogPost.author.firstName} ${blogPost.author.lastName}`
                      : blogPost.author.userName || "Anonymous"}
                  </h3>
                </div>

                {blogPost.author.authorBio && (
                  <p className="text-sm text-gray-700 font-light leading-relaxed mb-3">
                    {blogPost.author.authorBio}
                  </p>
                )}

                {/* Social Links - Minimal */}
                <div className="flex gap-4 text-xs">
                  {twitterUrl && (
                    <a
                      href={twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 transition-colors font-medium"
                    >
                      Twitter
                    </a>
                  )}
                  {linkedinUrl && (
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 transition-colors font-medium"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Article Content */}
          <div className="prose prose-lg max-w-5xl">
            {blogPost.content && blogPost.content.length > 0 ? (
              <PortableText
                value={blogPost.content}
                components={portableTextComponents}
              />
            ) : (
              <p className="text-gray-500 italic">No content available</p>
            )}
          </div>
        </article>

        {/* NYT-Style Action Bar */}
        <div className="max-w-4xl mx-auto px-6 md:px-8 mb-16">
          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  window !== undefined
                    ? navigator.share({
                        url: blogPost.slug.current,
                      })
                    : toast.error("window object not available");
                }}
                className="group flex items-center gap-2 text-gray-600 
             hover:text-black hover:bg-gray-50 shadow-lg hover:shadow-2xl hover:scale-105
             focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none 
             focus:bg-blue-50 focus:text-blue-700 focus:scale-105
             active:scale-95 active:bg-gray-100
             transition-all duration-200 ease-out
             text-base font-light px-4 py-3 rounded-lg"
              >
                <Share2 className="w-5 h-5 group-hover:rotate-12 group-focus:rotate-12 transition-transform duration-200" />
                <span className="group-hover:translate-x-0.5 group-focus:translate-x-0.5 transition-transform duration-200">
                  Share post
                </span>
              </button>
            </div>
          </div>
        </div>

        <div>
          {isBlogIdLoading ? null : isBlogIdError ? null : (
            <LikeAndCommentsInteractionsClient
              blogAuthorInfo={blogAuthorInfo}
              blogId={blogId}
            />
          )}
        </div>

        {/* Article Footer */}
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-px bg-blue-400"></div>
                <span className="text-xs font-medium text-blue-400 uppercase tracking-widest">
                  GSF UI Blog
                </span>
                <div className="w-8 h-px bg-blue-400"></div>
              </div>
              <p className="text-sm text-gray-600 font-light">
                {`Thoughts, stories and ideas from the Gofamint Students'
                Fellowship community`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SlugClient;
