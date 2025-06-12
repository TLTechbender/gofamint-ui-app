import { getBlogPost, incrementViews } from "@/actions/blogPage";

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

// React Icons imports
import {
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaGlobe,
  FaWhatsapp,
  FaUser,
} from "react-icons/fa";

import { formatDate } from "@/lib/dateFormatters";
import Image from "next/image";
import { urlFor } from "@/sanity/sanityClient";
import ShareButton from "@/components/shareButtonComponent";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await getBlogPost(slug);

  console.log(post);

  if (!post) {
    notFound();
  }

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
      // Custom image component - Updated to use new structure
      image: ({ value }) => {
        if (!value?.asset) return null;

        // Handle both old and new image structures
        const imageUrl = value.asset.url || urlFor(value).url();

        return (
          <div className="my-8">
            <Image
              src={imageUrl}
              alt={value.alt || ""}
              className="w-full rounded-lg shadow-lg"
              width={800}
              height={400}
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

  // Helper function to get social media icon using react-icons
  const getSocialIcon = (platform: string) => {
    const iconProps = { className: "w-5 h-5" };

    switch (platform) {
      case "instagram":
        return <FaInstagram {...iconProps} />;
      case "linkedin":
        return <FaLinkedin {...iconProps} />;
      case "twitter":
        return <FaTwitter {...iconProps} />;
      case "facebook":
        return <FaFacebook {...iconProps} />;
      case "website":
        return <FaGlobe {...iconProps} />;
      case "whatsapp":
        return <FaWhatsapp {...iconProps} />;
      default:
        return <FaGlobe {...iconProps} />;
    }
  };

  // Helper function to get social media colors
  const getSocialColor = (platform: string) => {
    switch (platform) {
      case "instagram":
        return "text-pink-600 hover:text-pink-700 border-pink-200 hover:border-pink-300 hover:bg-pink-50";
      case "linkedin":
        return "text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 hover:bg-blue-50";
      case "twitter":
        return "text-blue-400 hover:text-blue-500 border-blue-200 hover:border-blue-300 hover:bg-blue-50";
      case "facebook":
        return "text-blue-800 hover:text-blue-900 border-blue-200 hover:border-blue-300 hover:bg-blue-50";
      case "website":
        return "text-gray-600 hover:text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50";
      case "whatsapp":
        return "text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 hover:bg-green-50";
      default:
        return "text-gray-600 hover:text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50";
    }
  };

  // Helper function to format social URL
  const formatSocialUrl = (platform: string, url: string) => {
    switch (platform) {
      case "whatsapp":
        // Remove any existing whatsapp formatting and add wa.me
        const cleanNumber = url.replace(/[^\d+]/g, "");
        return `https://wa.me/${cleanNumber}`;
      case "instagram":
        return url.startsWith("http")
          ? url
          : `https://instagram.com/${url.replace("@", "")}`;
      case "twitter":
        return url.startsWith("http")
          ? url
          : `https://twitter.com/${url.replace("@", "")}`;
      case "linkedin":
        return url.startsWith("http") ? url : `https://linkedin.com/in/${url}`;
      case "facebook":
        return url.startsWith("http") ? url : `https://facebook.com/${url}`;
      default:
        return url.startsWith("http") ? url : `https://${url}`;
    }
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
                <span>{formatDate(post?.publishedAt || "")}</span>
              </div>
              {post.readingTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readingTime} min read</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{(post?.views || 0).toLocaleString()} views</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-700 leading-relaxed mb-8 border-l-4 border-blue-500 pl-6">
                {post.excerpt}
              </p>
            )}

            {/* Enhanced Author Info Section */}

            {/* Featured Image - Updated to use new structure */}
            {post.featuredImage && (
              <div className="mb-12">
                <Image
                  src={post.featuredImage.asset.url}
                  alt={post.featuredImage.alt || post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-xl"
                  width={
                    post.featuredImage.asset.metadata?.dimensions?.width || 800
                  }
                  height={
                    post.featuredImage.asset.metadata?.dimensions?.height || 400
                  }
                  priority
                />
                {post.featuredImage.alt && (
                  <p className="text-sm text-gray-600 mt-3 text-center italic">
                    {post.featuredImage.alt}
                  </p>
                )}
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2 mb-8">
                <Tag className="w-4 h-4 text-gray-500" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
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

          {/* SEO Keywords (if you want to display them) */}
          {post.seo?.keywords && post.seo.keywords.length > 0 && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Topics:
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.seo.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 mb-12">
            <ShareButton
              url={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`}
              title={post.title}
            />
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-8 border border-gray-100">
            <div className="flex items-start gap-6">
              {/* Author Profile Image */}
              <div className="flex-shrink-0">
                {post.author.profileImage?.asset?.url ? (
                  <Image
                    src={post.author.profileImage.asset.url}
                    alt={
                      post.author.profileImage.alt ||
                      `${post.author.firstName} ${post.author.lastName}`
                    }
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    width={80}
                    height={80}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center border-4 border-white shadow-lg">
                    <FaUser className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>

              {/* Author Details */}
              <div>
                <h4 className="text-gray-700 text-xl">Written by</h4>
                <div className="flex-1 min-w-0">
                  {/* Author Name and Title */}
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {post.author.firstName} {post.author.lastName}
                    </h3>
                    {post.author.jobTitle && (
                      <p className="text-blue-600 font-semibold text-sm">
                        {post.author.jobTitle}
                      </p>
                    )}
                  </div>

                  {/* Author Bio */}
                  {post.author.bio && (
                    <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.author.bio}
                    </p>
                  )}

                  {/* Social Links */}
                  {post.author.socialLinks &&
                    Object.entries(post.author.socialLinks).some(
                      ([_, url]) => url
                    ) && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Connect with {post.author.firstName}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {Object.entries(post.author.socialLinks).map(
                            ([platform, url]) => {
                              if (!url) return null;

                              return (
                                <a
                                  key={platform}
                                  href={formatSocialUrl(platform, url)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-200 text-sm font-medium ${getSocialColor(platform)}`}
                                  title={`Follow on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
                                >
                                  {getSocialIcon(platform)}
                                  <span className="capitalize hidden sm:inline">
                                    {platform === "website"
                                      ? "Website"
                                      : platform}
                                  </span>
                                </a>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
