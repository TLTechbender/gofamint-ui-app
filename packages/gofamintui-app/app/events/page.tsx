import { Metadata } from "next";
import FellowshipCalendar from "@/components/calendarComponent";



export const dynamic = "force-dynamic";

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


export default async function Events() {
  return (
    <div>
      <FellowshipCalendar />
    </div>
  );
}
