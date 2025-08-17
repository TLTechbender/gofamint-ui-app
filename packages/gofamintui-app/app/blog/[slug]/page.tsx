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
          <figure className="my-12 md:my-16">
            <div className="relative aspect-video md:aspect-[16/10] overflow-hidden">
              <Image
                src={value.asset.url || "/api/placeholder/1200/800"}
                alt={value.alt || ""}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
            {value.alt && (
              <figcaption className="mt-4 text-sm text-gray-600 font-light tracking-wide leading-relaxed border-t border-gray-100 pt-3">
                {value.alt}
              </figcaption>
            )}
          </figure>
        );
      },
      code: ({ value }) => (
        <div className="my-10">
          <pre className="bg-gray-50 border border-gray-200 p-6 text-sm font-mono leading-relaxed overflow-x-auto">
            <code className={`language-${value.language || "text"}`}>
              {value.code}
            </code>
          </pre>
          {value.filename && (
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
        const target = (value?.href || "").startsWith("http")
          ? "_blank"
          : undefined;
        return (
          <a
            href={value?.href}
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

  return (
    <div className="min-h-screen bg-white">
      {/* NYT-Style Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 md:px-8 py-8">
          {/* Article Meta */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-px bg-blue-400"></div>
              <time className="text-xs font-medium text-blue-400 uppercase tracking-widest">
                {formatDate(post.publishedAt)}
              </time>
            </div>

            <div className="flex items-center gap-6 text-xs text-gray-500 font-light tracking-wide uppercase mb-8">
              <span className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                {post.readingTime} min read
              </span>
              <span className="flex items-center gap-2">
                <Eye className="w-3 h-3" />
                {post.views.toLocaleString()} views
              </span>
            </div>
          </div>

          {/* NYT-Style Headline */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black leading-tight tracking-tight mb-8 max-w-4xl">
            {post.title}
          </h1>

          {/* Subtitle/Excerpt */}
          <p className="text-lg md:text-xl text-gray-700 font-light leading-relaxed mb-12 max-w-3xl border-l-2 border-blue-400 pl-6">
            {post.excerpt}
          </p>
        </div>
      </div>

      {/* Featured Image - NYT Style */}
      {post.featuredImage && (
        <div className="mb-12">
          <div className="max-w-5xl mx-auto px-6 md:px-8">
            <figure>
              <div className="relative aspect-video md:aspect-[16/10] overflow-hidden">
                <Image
                  src={urlFor(post.featuredImage as any)
                    .width(1400)
                    .height(900)
                    .fit("max")
                    .auto("format")
                    .url()}
                  alt={post.featuredImage.alt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 1400px"
                />
              </div>
              {post.featuredImage.alt && (
                <figcaption className="mt-4 text-sm text-gray-600 font-light tracking-wide leading-relaxed max-w-3xl">
                  {post.featuredImage.alt}
                </figcaption>
              )}
            </figure>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-6 md:px-8 mb-16">
        {/* Author Byline - NYT Style */}
        <div className="flex items-start gap-4 py-8 mb-12 border-y border-gray-100">
          <Image
            src={post.author.image?.asset?.url || "/api/placeholder/60/60"}
            alt={`${post.author.firstName} ${post.author.lastName}`}
            className="w-12 h-12 object-cover"
            width={48}
            height={48}
          />
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-xs uppercase tracking-widest font-medium text-gray-500">
                By
              </span>
              <h3 className="font-medium text-black">
                {post.author.firstName} {post.author.lastName}
              </h3>
            </div>
            {post.authorInfo?.jobTitle && (
              <p className="text-sm text-gray-600 font-light mb-2">
                {post.authorInfo.jobTitle}
              </p>
            )}
            {post.author.bio && (
              <p className="text-sm text-gray-700 font-light leading-relaxed mb-3">
                {post.author.bio}
              </p>
            )}
            {/* Social Links - Minimal */}
            <div className="flex gap-4 text-xs">
              {post.authorInfo?.socialLinks?.twitter && (
                <a
                  href={post.authorInfo.socialLinks.twitter}
                  className="text-blue-500 hover:text-blue-600 transition-colors font-medium"
                >
                  Twitter
                </a>
              )}
              {post.authorInfo?.socialLinks?.linkedin && (
                <a
                  href={post.authorInfo.socialLinks.linkedin}
                  className="text-blue-500 hover:text-blue-600 transition-colors font-medium"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Main Article Content */}
        <div className="prose prose-lg max-w-none">
          <PortableText
            value={post.content}
            components={portableTextComponents}
          />
        </div>
      </article>

      {/* NYT-Style Action Bar */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 mb-16">
        <div className="border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <LikePostButton
                userId={currentUserId}
                postId={post._id}
                initialIsLiked={isLiked}
                initialLikesCount={post.likes?.length || 0}
              />

              <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors text-sm font-light">
                <MessageCircle className="w-4 h-4" />
                <span>Comments</span>
              </button>
            </div>

            <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors text-sm font-light">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Article Footer */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 md:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-xs font-medium text-blue-400 uppercase tracking-widest">
                GSF UI Blog
              </span>
              <div className="w-8 h-px bg-blue-400"></div>
            </div>
            <p className="text-sm text-gray-600 font-light">
              Thoughts, stories and ideas from the Gofamint Students' Fellowship
              community
            </p>
          </div>
        </div>
      </div>

      <BlogPageClient blogPostId={post._id} />
    </div>
  );
}
