import { Metadata } from "next";
import BlogsPageClient from "@/components/blogsPageClient";
import { Suspense } from "react";
import { Search } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  try {
    // Static metadata for blogs page
    const title = "Spiritual Blogs | GSF UI";
    const description =
      "Read our spirit-filled blogs and inspiring articles from Gofamint Students' Fellowship, University of Ibadan. Discover profound spiritual insights, testimonies, and faith-building content that will strengthen your walk with God.";

    const keywords = [
      "GSF UI blogs",
      "spiritual blogs",
      "spirit-filled articles",
      "Christian student blogs",
      "faith-based content",
      "spiritual insights",
      "testimonies",
      "inspirational articles",
      "Gofamint Students Fellowship blogs",
      "University of Ibadan Christian content",
      "devotional content",
      "spiritual growth articles",
      "faith testimonies",
      "Christian inspiration",
      "spiritual encouragement",
    ];

    // Free spiritual/reading image from Unsplash
    const featuredImageUrl =
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=630&fit=crop&crop=center";
    const imageAlt =
      "GSF UI Spiritual Blogs - Read spirit-filled articles and testimonies";

    return {
      title,
      description,
      keywords,
      authors: [
        {
          name: "Gofamint Students' Fellowship UI Chapter",
          url: "https://gofamintui.org",
        },
      ],
      creator: "Bolarinwa Paul Ayomide (https://github.com/TLTechbender)",
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
        url: "https://gofamintui.org/blogs",
        siteName: "GSF UI",
        images: [
          {
            url: featuredImageUrl,
            width: 1200,
            height: 630,
            alt: imageAlt,
            type: "image/jpeg",
          },
        ],
        locale: "en_NG",
        type: "website",
        countryName: "Nigeria",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        site: "@gofamintui",
        creator: "@gofamintui",
        images: [
          {
            url: featuredImageUrl,
            alt: imageAlt,
          },
        ],
      },
      alternates: {
        canonical: "https://gofamintui.org/blogs",
      },
      other: {
        "theme-color": "#ffffff",
        "color-scheme": "light",
      },
      metadataBase: new URL("https://gofamintui.org"),
    };
  } catch (error) {
    console.error("Error generating blogs metadata:", error);

    // Fallback metadata if something goes wrong
    return {
      title: "Spiritual Blogs | GSF UI",
      description:
        "Read our spirit-filled blogs and inspiring articles from Gofamint Students' Fellowship, University of Ibadan.",
      keywords: [
        "GSF UI blogs",
        "spiritual blogs",
        "spirit-filled articles",
        "Christian student blogs",
        "Gofamint Students Fellowship blogs",
      ],
      openGraph: {
        title: "Spiritual Blogs | GSF UI",
        description:
          "Read our spirit-filled blogs and inspiring articles from Gofamint Students' Fellowship, University of Ibadan.",
        type: "website",
        url: "https://gofamintui.org/blogs",
        siteName: "GSF UI",
      },
      twitter: {
        card: "summary",
        title: "Spiritual Blogs | GSF UI",
        description:
          "Read our spirit-filled blogs and inspiring articles from Gofamint Students' Fellowship, University of Ibadan.",
      },
    };
  }
}

export const dynamic = "force-dynamic";
const BlogPostSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col animate-pulse">
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

// Fallback component for the Suspense boundary during initial load
const BlogsPageLoadingFallback = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Search Input Skeleton */}
        <div className="mb-10 max-w-xl mx-auto">
          <div className="relative h-12 bg-gray-200 rounded-lg animate-pulse shadow-sm">
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Skeleton grid for blog posts */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto w-full">
            {[...Array(6)].map((_, index) => (
              <BlogPostSkeleton key={index} />
            ))}
          </div>
        </div>

        {/* Loading text for infinite scroll */}
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center space-x-3 text-gray-600 font-medium">
            <div className="animate-spin rounded-full h-7 w-7 border-b-3 border-blue-500"></div>
            <span>Loading initial posts...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default async function BlogsPage() {
  return (
    <Suspense fallback={<BlogsPageLoadingFallback />}>
      <div>
        <BlogsPageClient />
      </div>
    </Suspense>
  );
}
