import { getBlogPost, incrementViews } from "@/actions/blogPage";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { ArrowUp, Calendar, Clock, Eye, Tag } from "lucide-react";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) {
      return {
        title: "Blog Post Not Found | GSF UI",
        description: "The requested blog post could not be found.",
        robots: { index: false, follow: true },
      };
    }

    // Build dynamic title
    const title = `${post.title} | GSF UI`;

    // Build dynamic description
    let description = "";
    if (post.excerpt) {
      description = post.excerpt;
    } else if (post.seo?.metaDescription) {
      description = post.seo.metaDescription;
    } else {
      // Fallback description
      description = `Read this inspiring spiritual article by ${post.author.firstName} ${post.author.lastName} on Gofamint Students' Fellowship blog. Discover faith-building insights and spiritual growth content.`;
    }

    // Build dynamic keywords
    let keywords = [
      "GSF UI blog",
      "spiritual articles",
      "Christian blog",
      "faith-based content",
      "Gofamint Students Fellowship",
      "University of Ibadan Christian content",
      `${post.author.firstName} ${post.author.lastName}`,
    ];

    // Add post tags to keywords
    if (post.tags && post.tags.length > 0) {
      keywords = [...keywords, ...post.tags];
    }

    // Add SEO keywords if available
    if (post.seo?.keywords && post.seo.keywords.length > 0) {
      keywords = [...keywords, ...post.seo.keywords];
    }

    // Get featured image
    let featuredImageUrl = null;
    let imageAlt = title;

    if (post.featuredImage?.asset?.url) {
      featuredImageUrl = post.featuredImage.asset.url;
      imageAlt = post.featuredImage.alt || title;
    } else if (post.author.profileImage?.asset?.url) {
      // Fallback to author image
      featuredImageUrl = post.author.profileImage.asset.url;
      imageAlt = `${post.author.firstName} ${post.author.lastName} - ${post.title}`;
    }

    // Build author information
    const authorName = `${post.author.firstName} ${post.author.lastName}`;
    const publishedTime = post.publishedAt;
    const modifiedTime = post.updatedAt || post.publishedAt;

    return {
      title,
      description,
      keywords: keywords.slice(0, 15), // Limit to 15 keywords
      authors: [
        {
          name: authorName,
          url: post.author.socialLinks?.website || undefined,
        },
      ],
      creator: authorName,
      publisher: "Gofamint Students' Fellowship UI",
      category: "Spiritual Content",
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      openGraph: {
        title,
        description,
        url: `https://gofamintui.org/blog/${slug}`,
        siteName: "GSF UI",
        images: featuredImageUrl
          ? [
              {
                url: featuredImageUrl,
                width:
                  post.featuredImage?.asset?.metadata?.dimensions?.width ||
                  1200,
                height:
                  post.featuredImage?.asset?.metadata?.dimensions?.height ||
                  630,
                alt: imageAlt,
                type: "image/jpeg",
              },
            ]
          : [],
        locale: "en_NG",
        type: "article",
        countryName: "Nigeria",
        publishedTime,
        modifiedTime,
        authors: [authorName],
        tags: post.tags || [],
        section: "Spiritual Growth",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        site: "@gofamintui",
        creator: post.author.socialLinks?.twitter
          ? `@${post.author.socialLinks.twitter.replace("@", "")}`
          : "@gofamintui",
        images: featuredImageUrl
          ? [
              {
                url: featuredImageUrl,
                alt: imageAlt,
              },
            ]
          : [],
      },
      alternates: {
        canonical: `https://gofamintui.org/blog/${slug}`,
      },
      other: {
        "theme-color": "#ffffff",
        "color-scheme": "light",
        "article:author": authorName,
        "article:published_time": publishedTime || "",
        "article:modified_time": modifiedTime || "",
        "article:section": "Spiritual Growth",
        "article:tag": post.tags?.join(", ") || "",
        "reading-time": post.readingTime ? `${post.readingTime} minutes` : "",
      },
      metadataBase: new URL("https://gofamintui.org"),
    };
  } catch (error) {
    console.error("Error generating blog post metadata:", error);

    // Fallback metadata if data fetching fails
    return {
      title: "Spiritual Blog Post | GSF UI",
      description:
        "Read inspiring spiritual content from Gofamint Students' Fellowship, University of Ibadan.",
      keywords: [
        "GSF UI blog",
        "spiritual articles",
        "Christian blog",
        "Gofamint Students Fellowship",
      ],
      openGraph: {
        title: "Spiritual Blog Post | GSF UI",
        description:
          "Read inspiring spiritual content from Gofamint Students' Fellowship, University of Ibadan.",
        type: "article",
        url: "https://gofamintui.org/blog",
        siteName: "GSF UI",
      },
      twitter: {
        card: "summary",
        title: "Spiritual Blog Post | GSF UI",
        description:
          "Read inspiring spiritual content from Gofamint Students' Fellowship, University of Ibadan.",
      },
    };
  }
}

export const dynamic = "force-dynamic";
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

  // Increment views on render
  incrementViews(post._id);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
    <div className="min-h-screen bg-white">
      {/* Back to Top Button */}
      <button
        // onClick={() => scrollToTop()}
        className="fixed bottom-8 right-8 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        {/* Header Section */}
        <header className="mb-12 animate-slide-up">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2 transition-all duration-300 hover:text-blue-600">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post?.publishedAt || "")}</span>
            </div>
            {post.readingTime && (
              <div className="flex items-center gap-2 transition-all duration-300 hover:text-blue-600">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime} min read</span>
              </div>
            )}
            <div className="flex items-center gap-2 transition-all duration-300 hover:text-blue-600">
              <Eye className="w-4 h-4" />
              <span>{(post?.views || 0).toLocaleString()} views</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6 transition-all duration-300 hover:text-blue-700">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-700 leading-relaxed mb-8 border-l-4 border-blue-500 pl-6 transition-all duration-500 hover:border-blue-700 hover:pl-8">
              {post.excerpt}
            </p>
          )}

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-12 overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl">
              <Image
                src={post.featuredImage.asset.url}
                alt={post.featuredImage.alt || post.title}
                className="w-full h-64 md:h-96 object-cover transition-transform duration-500 hover:scale-105"
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
              <Tag className="w-4 h-4 text-gray-500 transition-all duration-300 hover:text-blue-600" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, _) => (
                  <span
                    key={_}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium transition-all duration-300 hover:bg-blue-200 hover:text-blue-900"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Divider with animation */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-12 transition-all duration-500 hover:via-blue-400"></div>

        {/* Main Content */}
        <article className="mb-16 prose prose-lg max-w-none">
          <PortableText
            value={post.content}
            components={portableTextComponents}
          />
        </article>

        {/* SEO Keywords */}
        {post.seo?.keywords && post.seo.keywords.length > 0 && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Topics:
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.seo.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded transition-all duration-300 hover:bg-gray-300"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 mb-12 transition-all duration-300 hover:border-blue-300">
          <ShareButton
            url={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`}
            title={post.title}
          />
        </div>

        {/* Author Section */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-8 border border-gray-100 transition-all duration-500 hover:shadow-lg hover:border-blue-200">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Author Profile Image */}
            <div className="flex-shrink-0">
              {post.author.profileImage?.asset?.url ? (
                <div className="overflow-hidden rounded-full border-4 border-white shadow-lg transition-all duration-500 hover:shadow-xl hover:border-blue-200">
                  <Image
                    src={post.author.profileImage.asset.url}
                    alt={
                      post.author.profileImage.alt ||
                      `${post.author.firstName} ${post.author.lastName}`
                    }
                    className="w-20 h-20 object-cover transition-transform duration-500 hover:scale-110"
                    width={80}
                    height={80}
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center border-4 border-white shadow-lg transition-all duration-500 hover:shadow-xl hover:from-blue-500 hover:to-blue-700">
                  <FaUser className="w-8 h-8 text-white" />
                </div>
              )}
            </div>

            {/* Author Details */}
            <div className="flex-1">
              <h4 className="text-gray-700 text-xl mb-2">Written by</h4>
              <div className="mb-3">
                <h3 className="text-xl font-bold text-gray-900 mb-1 transition-all duration-300 hover:text-blue-700">
                  {post.author.firstName} {post.author.lastName}
                </h3>
                {post.author.jobTitle && (
                  <p className="text-blue-600 font-semibold text-sm transition-all duration-300 hover:text-blue-800">
                    {post.author.jobTitle}
                  </p>
                )}
              </div>

              {post.author.bio && (
                <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.author.bio}
                </p>
              )}

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
                              className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-200 text-sm font-medium ${getSocialColor(platform)} hover:scale-105`}
                              title={`Follow on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
                            >
                              {getSocialIcon(platform)}
                              <span className="capitalize hidden sm:inline">
                                {platform === "website" ? "Website" : platform}
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
  );
}
