import { Metadata } from "next";
import BlogsPageClient from "@/components/blogsPageClient";
import { Suspense } from "react";

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
export default async function BlogsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <BlogsPageClient />
      </div>
    </Suspense>
  );
}
