import { Metadata } from "next";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    // Static metadata for events page
    const title = "Events Calendar | GSF UI";
    const description =
      "Stay updated with upcoming, current, and past events at Gofamint Students' Fellowship, University of Ibadan. Join our vibrant community for spiritual growth, fellowship, and inspiring gatherings.";

    const keywords = [
      "GSF UI events",
      "Gofamint Students Fellowship events",
      "University of Ibadan student events",
      "student fellowship calendar",
      "upcoming events",
      "spiritual gatherings",
      "student ministry",
      "fellowship activities",
      "Christian student events",
      "campus ministry",
      "student community",
      "faith-based events",
    ];

    // Free calendar image from Unsplash
    const featuredImageUrl =
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop&crop=center";
    const imageAlt =
      "GSF UI Events Calendar - Stay connected with upcoming events and gatherings";

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
      category: "Events",
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
        url: "https://gofamintui.org/events",
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
        canonical: "https://gofamintui.org/events",
      },
      other: {
        "theme-color": "#ffffff",
        "color-scheme": "light",
      },
      metadataBase: new URL("https://gofamintui.org"),
    };
  } catch (error) {
    console.error("Error generating events metadata:", error);

    // Fallback metadata if something goes wrong
    return {
      title: "Events Calendar | GSF UI",
      description:
        "Stay updated with upcoming, current, and past events at Gofamint Students' Fellowship, University of Ibadan.",
      keywords: [
        "GSF UI events",
        "Gofamint Students Fellowship events",
        "University of Ibadan student events",
        "student fellowship calendar",
      ],
      openGraph: {
        title: "Events Calendar | GSF UI",
        description:
          "Stay updated with upcoming, current, and past events at Gofamint Students' Fellowship, University of Ibadan.",
        type: "website",
        url: "https://gofamintui.org/events",
        siteName: "GSF UI",
      },
      twitter: {
        card: "summary",
        title: "Events Calendar | GSF UI",
        description:
          "Stay updated with upcoming, current, and past events at Gofamint Students' Fellowship, University of Ibadan.",
      },
    };
  }
}

const DynamicFellowshipCalendar = dynamic(
  () => import("@/components/calendarComponent"), // Adjust path as per your project structure
  {
    // ssr: false, // This is the key: disable server-side rendering for this component
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl shadow-2xl">
        <div className="text-center">
          {/* A simple loading indicator for the calendar */}
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading Calendar...</p>
        </div>
      </div>
    ),
  }
);

export default async function Events() {
  return (
    // Wrap the dynamic component in Suspense for better loading fallback
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl shadow-2xl">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-700">
              Preparing Events Calendar...
            </p>
          </div>
        </div>
      }
    >
      <div>
        <DynamicFellowshipCalendar />
      </div>
    </Suspense>
  );
}
