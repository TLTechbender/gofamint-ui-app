import { Metadata } from "next";
import GalleryListClient from "@/components/galleryListClient";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import {
  buildGalleryListQuery,
  buildGalleryListCountQuery,
} from "@/sanity/queries/galleryListPage";
import { GalleryListPageData } from "@/sanity/interfaces/galleryListPage";
import { urlFor } from "@/sanity/sanityClient";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch initial gallery data for metadata generation
    const [galleryListResponse, totalCount] = await Promise.all([
      sanityFetchWrapper<GalleryListPageData[]>(buildGalleryListQuery(false), {
        start: 0,
        end: 3, // Get first 3 galleries for metadata
      }),
      sanityFetchWrapper<number>(buildGalleryListCountQuery(false), {}),
    ]);

    // Generate dynamic metadata based on actual data
    const totalText = totalCount === 1 ? "Gallery" : "Galleries";
    const baseTitle = `Photo ${totalText}`;

    // Create description based on available galleries
    let description = `Browse our collection of ${totalCount} photos and videos ${totalText.toLowerCase()}`;

    if (galleryListResponse && galleryListResponse.length > 0) {
      // Add context from actual gallery data
      const recentGallery = galleryListResponse[0];
      description += `. Latest: ${recentGallery.title || "Recent gallery"}`;

      if (recentGallery.description) {
        description += ` - ${recentGallery.description.substring(0, 100)}${recentGallery.description.length > 100 ? "..." : ""}`;
      }
    }

    // Get featured image for Open Graph
    const featuredImage = galleryListResponse?.[0]?.featuredImage;
    const ogImageUrl = featuredImage
      ? urlFor(featuredImage as any)
          .width(1200)
          .height(630)
          .format("jpg")
          .quality(80)
          .url()
      : null;

    return {
      title: `${baseTitle} | ${totalCount} ${totalText}`,
      description,
      keywords: [
        "photo gallery",
        "image collection",
        "photography",
        "pictures",
        "events",
        "memories",
      ],
      openGraph: {
        title: `${baseTitle} | ${totalCount} ${totalText}`,
        description,
        type: "website",
        ...(ogImageUrl && {
          images: [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt:
                galleryListResponse?.[0]?.title || "Gallery collection preview",
            },
          ],
        }),
      },
      twitter: {
        card: "summary_large_image",
        title: `${baseTitle} | ${totalCount} ${totalText}`,
        description,
        ...(ogImageUrl && {
          images: [ogImageUrl],
        }),
      },
      alternates: {
        canonical: "/gallery",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "Photo Galleries",
      description:
        "Browse our collection of photo galleries showcasing memorable moments and events.",
      openGraph: {
        title: "Photo Galleries",
        description:
          "Browse our collection of photo galleries showcasing memorable moments and events.",
        type: "website",
      },
      twitter: {
        card: "summary",
        title: "Photo Galleries",
        description:
          "Browse our collection of photo galleries showcasing memorable moments and events.",
      },
    };
  }
}
export const dynamic = "force-dynamic";
export default function GalleryListPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <GalleryListClient />
      </Suspense>
    </div>
  );
}
