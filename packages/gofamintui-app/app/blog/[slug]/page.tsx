import { notFound } from "next/navigation";

// import { LikePostButton } from "@/components/blogLikeButtons";

import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { BlogPost } from "@/sanity/interfaces/blog";
import { buildSingleBlogPostQuery } from "@/sanity/queries/blog";
import SlugClient from "./slugClient";
import { PageProps } from "@/.next/types/app/page";
import { BlogMetadata } from "@/sanity/interfaces/blogMetaData";
import { blogsPageMetadataQuery } from "@/sanity/queries/blogsPageMetaData";
import { urlFor } from "@/sanity/sanityClient";


export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  try {
    const dynamicMetaData = await sanityFetchWrapper<BlogMetadata>(
      blogsPageMetadataQuery,
      {
        slug: slug,
      }
    );

    if (!dynamicMetaData) {
      return { title: "Post Not Found" };
    }
    const optimizedImageUrl = dynamicMetaData?.seo?.ogImage?.asset?.url
      ? `${urlFor(dynamicMetaData.seo.ogImage.asset).width(400).height(400).format('webp')}?`
      : null;
    const title =
      dynamicMetaData?.seo?.title ||
      "GSF UI – Gofamint Students' Fellowship, University of Ibadan";
    const description =
      dynamicMetaData?.seo?.description ||
      "Join us at Gofamint Students' Fellowship, University of Ibadan for spiritual growth, fellowship, and community service.";
    const keywords =
      "GSF UI Blog, Gofamint Students Fellowship, University of Ibadan, Christian Fellowship, Students Ministry, Nigeria";
 console.log(dynamicMetaData)
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
      category: "Religious Organization",
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
      verification: {
        google: "your-google-site-verification-code", // Replace with actual code
      },
      openGraph: {
        title,
        description,
        url: "https://gofamintui.org",
        siteName: "GSF UI",
        images: optimizedImageUrl
          ? [
              {
                url: optimizedImageUrl,
                width: 1200,
                height: 630,
                alt: dynamicMetaData?.seo?.ogImage?.alt || title,
                type: "image/jpeg",
              },
            ]
          : [],
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
        images: optimizedImageUrl
          ? [
              {
                url: optimizedImageUrl,
                alt: dynamicMetaData?.seo?.ogImage?.alt || title,
              },
            ]
          : [],
      },
      alternates: {
        canonical: "https://gofamintui.org",
      },
      other: {
        "theme-color": "#ffffff",
        "color-scheme": "light",
      },
      metadataBase: new URL("https://gofamintui.org"),
    };
  } catch (error) {
    return;
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Validate slug
  if (!slug || typeof slug !== "string") {
    notFound();
  }
//I could promise.all but sinice I dey await each nothing spoil
  const post = await sanityFetchWrapper<BlogPost>(buildSingleBlogPostQuery(), {
    slug,
  });

  if (!post) {
    notFound();
  }

  return <SlugClient   blogPost={post} />;
}
