import { Metadata } from "next";
import GalleryListClient from "@/components/gallery/galleryListClient";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import {
  buildGalleryListQuery,
  buildGalleryListCountQuery,
} from "@/sanity/queries/galleryListPage";
import { GalleryListPageData } from "@/sanity/interfaces/galleryListPage";
import { urlFor } from "@/sanity/sanityClient";
import { Suspense } from "react";

//Smart metadata here, they don't have to be setting it
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
      ? urlFor(featuredImage)
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
        "gsf ui photos",
        "gsf ui events",
        "camera gsf ui",
        "media gsf ui",
      ],
      authors: [
        {
          name: "Gofamint Students' Fellowship UI Chapter",
          url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
        },
      ],
      creator: "Bolarinwa Paul Ayomide (https://github.com/TLTechbender)",
      publisher: "Gofamint Students' Fellowship UI",
      category: "Church",
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

const GalleryListSkeleton = () => {
  return (
    <div className="min-h-screen">
      <div className="pt-20 mb-2 bg-black h-16 w-full" />
      <div className="container mx-auto px-6 md:px-8 py-16 md:py-20 max-w-7xl">
        {/* Header Section Skeleton */}
        <div className="mb-16 md:mb-20">
          <div className="max-w-2xl mx-auto text-center mb-12">
            {/* Gallery label skeleton */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-px bg-gray-200 animate-pulse"></div>
              <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-8 h-px bg-gray-200 animate-pulse"></div>
            </div>

            {/* Title skeleton */}
            <div className="h-10 md:h-12 lg:h-14 bg-gray-200 animate-pulse rounded mb-6 max-w-md mx-auto"></div>

            {/* Description skeleton */}
            <div className="h-5 bg-gray-200 animate-pulse rounded max-w-lg mx-auto"></div>
          </div>

          {/* Search Input Skeleton */}
          <div className="max-w-2xl mx-auto">
            <div className="relative border border-gray-200">
              <div className="w-full h-14 bg-gray-50 animate-pulse px-6 py-4 pr-16"></div>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <div className="w-4 h-4 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {[...Array(6)].map((_, index) => (
            <GalleryCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};


const GalleryCardSkeleton = () => (
  <div className="bg-white animate-pulse">
    {/* Image skeleton */}
    <div className="aspect-[4/3] bg-gray-200"></div>

    {/* Content skeleton */}
    <div className="pt-6 space-y-4">
      {/* Title skeleton */}
      <div className="h-5 bg-gray-200 w-3/4 mx-auto rounded"></div>

      {/* Date skeleton */}
      <div className="h-3 bg-gray-200 w-1/2 mx-auto rounded"></div>

      {/* Description skeleton */}
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-gray-200 w-full rounded"></div>
        <div className="h-3 bg-gray-200 w-4/5 mx-auto rounded"></div>
      </div>
    </div>
  </div>
);

export default function GalleryListPage() {
  return (
    <div>
      <Suspense fallback={<GalleryListSkeleton />}>
        <GalleryListClient />
      </Suspense>
    </div>
  );
}
