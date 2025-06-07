import { getBlogPost, incrementViews } from "@/actions/blogPage";
import { auth } from "@/auth";
import BlogPageClient from "@/components/blogPageClient";
import { notFound } from "next/navigation";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import {
  MessageCircle,
  Share2,
  Calendar,
  Clock,
  User,
  Eye,
  Tag,
} from "lucide-react";
import { LikePostButton } from "@/components/blogLikeButtons";
import { formatDate } from "@/lib/dateFormatters";
import Image from "next/image";
import { urlFor } from "@/sanity/sanityClient";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await getBlogPost(slug);
  console.log(slug);
  console.log(post);

  if (!post) {
    notFound();
  }

  const session = await auth();
  const currentUserId = session?.user?.id || null;

  const isLiked =
    currentUserId && post?.likes?.length > 0
      ? post.likes.some((like) => like?._id === currentUserId)
      : false;

  // Increment views on render
  incrementViews(post._id);

  const portableTextComponents: PortableTextComponents = {
    block: {
      // Default paragraph
      normal: ({ children }) => (
        <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
      ),
      // Headers
      h1: ({ children }) => (
        <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-4">
          {children}
        </h4>
      ),
      // Blockquote
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-6 italic text-gray-800 bg-blue-50 rounded-r-lg">
          {children}
        </blockquote>
      ),
    },
    types: {
      // Custom image component
      image: ({ value }) => {
        if (!value?.asset) return null;

        return (
          <div className="my-8">
            <img
              src={value.asset.url || "/api/placeholder/800/400"}
              alt={value.alt || ""}
              className="w-full rounded-lg shadow-lg"
            />
            {value.alt && (
              <p className="text-sm text-gray-600 mt-2 text-center italic">
                {value.alt}
              </p>
            )}
          </div>
        );
      },
      // Custom callout component (if you use it)
      callout: ({ value }) => (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6 rounded-r-lg">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{value.text}</p>
            </div>
          </div>
        </div>
      ),
      // Custom code block component (if you use it)
      code: ({ value }) => (
        <div className="my-6">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code className={`language-${value.language || "text"}`}>
              {value.code}
            </code>
          </pre>
          {value.filename && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              {value.filename}
            </p>
          )}
        </div>
      ),
    },
    marks: {
      // Bold text
      strong: ({ children }) => (
        <strong className="font-semibold text-gray-900">{children}</strong>
      ),
      // Italic text
      em: ({ children }) => <em className="italic">{children}</em>,
      // Links
      link: ({ value, children }) => {
        const target = (value?.href || "").startsWith("http")
          ? "_blank"
          : undefined;
        return (
          <a
            href={value?.href}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
            className="text-blue-600 hover:text-blue-800 underline transition-colors"
          >
            {children}
          </a>
        );
      },
      // Inline code
      code: ({ children }) => (
        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
          {children}
        </code>
      ),
    },
    list: {
      // Bullet lists
      bullet: ({ children }) => (
        <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
          {children}
        </ul>
      ),
      // Numbered lists
      number: ({ children }) => (
        <ol className="list-decimal list-inside mb-4 ml-4 space-y-2">
          {children}
        </ol>
      ),
    },
    listItem: {
      // List items
      bullet: ({ children }) => <li className="text-gray-700">{children}</li>,
      number: ({ children }) => <li className="text-gray-700">{children}</li>,
    },
  };

  return (
    <div>
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header Section */}
          <header className="mb-12">
            {/* Meta Information */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.views.toLocaleString()} views</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-700 leading-relaxed mb-8 border-l-4 border-blue-500 pl-6">
              {post.excerpt}
            </p>

            {/* Author Info */}
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl mb-8">
              <Image
                src={post.author.image?.asset?.url || "/api/placeholder/80/80"}
                alt={`${post.author.firstName} ${post.author.lastName}`}
                className="w-16 h-16 rounded-full object-cover"
                width={16}
                height={16}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">
                  {post.author.firstName} {post.author.lastName}
                </h3>
                <p className="text-blue-600 font-medium mb-2">
                  {post.authorInfo?.jobTitle}
                </p>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  {post.author.bio}
                </p>
                <div className="flex gap-3">
                  {post.authorInfo?.socialLinks?.instagram && (
                    <a
                      href={post.authorInfo.socialLinks.instagram}
                      className="text-pink-600 hover:text-pink-700 transition-colors"
                    >
                      Instagram
                    </a>
                  )}
                  {post.authorInfo?.socialLinks?.linkedin && (
                    <a
                      href={post.authorInfo.socialLinks.linkedin}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      LinkedIn
                    </a>
                  )}
                  {post.authorInfo?.socialLinks?.twitter && (
                    <a
                      href={post.authorInfo.socialLinks.twitter}
                      className="text-blue-400 hover:text-blue-500 transition-colors"
                    >
                      Twitter
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="mb-12">
                <Image
                  src={urlFor(post.featuredImage as any)
                    .width(1200)
                    .height(1200)
                    .fit("max")
                    .auto("format")
                    .url()}
                  alt={post.featuredImage.alt}
                  className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-xl"
                  width={800}
                  height={400}
                  blurDataURL={urlFor(post.featuredImage as any)
                    .width(20)
                    .height(20)
                    .blur(50)
                    .url()}
                />
                {post.featuredImage.alt && (
                  <p className="text-sm text-gray-600 mt-3 text-center italic">
                    {post.featuredImage.alt}
                  </p>
                )}
              </div>
            )}

            {/* Categories and Tags */}
          </header>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-12"></div>

          {/* Main Content with Portable Text */}
          <article className="mb-16 prose prose-lg max-w-none">
            <PortableText
              value={post.content}
              components={portableTextComponents}
            />
          </article>

          {/* Action Bar */}
          <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 mb-12">
            <div className="flex items-center gap-6">
              <LikePostButton
                userId={currentUserId}
                postId={post._id}
                initialIsLiked={isLiked}
                initialLikesCount={post.likes?.length || 0}
              />

              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">Comments</span>
              </button>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Share</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <BlogPageClient blogPostId={post._id} />
      </div>
    </div>
  );
}
