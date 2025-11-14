import { Metadata } from "next";
import LiveStreamComponent from "@/components/live/liveStreamComponent";
import { LiveStream } from "@/sanity/interfaces/liveStream";
import { getCurrentLiveStreams } from "@/sanity/queries/liveStream";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";

// Generate metadata function
export async function generateMetadata(): Promise<Metadata> {
  try {
    const streamsData = await sanityFetchWrapper<LiveStream[]>(
      getCurrentLiveStreams,
      {},
      ["liveStream"]
    );

    // Filter active live streams
    const currentLiveStreams =
      streamsData?.filter((stream) => stream.isLive) ||
      streamsData?.filter(
        (stream) =>
          new Date(stream.scheduledEnd!).getTime() < new Date().getTime()
      ) ||
      [];
    const hasLiveStreams = currentLiveStreams.length > 0;

    // Get primary stream for metadata
    const primaryStream = currentLiveStreams[0];

    const baseTitle = "Live Stream";
    const title = hasLiveStreams
      ? `🔴 LIVE: ${primaryStream?.title || "Church Service"} | GSF UI`
      : `${baseTitle} | GSF UI`;

    const description = hasLiveStreams
      ? `Watch live now: ${primaryStream?.title}${primaryStream?.description ? ` - ${primaryStream.description}` : ""}. Join our online worship service and be part of our community.`
      : "Join our live worship services online. Watch church services, prayer meetings, Bible studies, and special events as they happen.";

    // Generate dynamic keywords based on current streams
    const streamKeywords = currentLiveStreams
      .map((stream) => [
        stream.title?.toLowerCase(),
        stream.category,
        stream.pastor?.toLowerCase(),
      ])
      .flat()
      .filter(
        (keyword): keyword is string =>
          Boolean(keyword) && typeof keyword === "string"
      );

    const keywords: string[] = [
      "live stream",
      "church service online",
      "live worship",
      "online church",
      "live service",
      "streaming worship",
      "church broadcast",
      "live ministry",
      "online worship service",
      "church live",
      "Live gofamint ui",
      "online brethren",
      "Gofamint Streaming University Of Ibadan",
      ...streamKeywords,
    ];

    // Create structured data for live events
    const structuredData = hasLiveStreams
      ? {
          "@context": "https://schema.org",
          "@type": "BroadcastEvent",
          name: primaryStream?.title,
          description: primaryStream?.description,
          startDate: primaryStream?.scheduledStart,
          endDate: primaryStream?.scheduledEnd,
          isLiveBroadcast: true,
          broadcastOfEvent: {
            "@type": "Event",
            name: primaryStream?.title,
            location: {
              "@type": "Place",
              name: "GSF UI",
            },
          },
        }
      : null;

    return {
      title,
      description,
      keywords,
      authors: [{ name: "Gofamint UI, Bolarinwa Paul Ayomide" }],
      creator: "Bolarinwa Paul Ayomide (https://github.com/TLTechbender)",
      publisher: "Gofamint Students' Fellowship UI",
      // Open Graph metadata
      openGraph: {
        title,
        description,
        type: "website",
        url: `process.env.NEXT_PUBLIC_SITE_URL/live`,
        siteName: "",
        locale: "en_US",
        images: [
          {
            url: `${hasLiveStreams ? `process.env.NEXT_PUBLIC_SITE_URL/liveStreamSeo.jpg` : `process.env.NEXT_PUBLIC_SITE_URL/calendarSeo.jpg`}`,
            width: 1200,
            height: 630,
            alt: hasLiveStreams
              ? `Live: ${primaryStream?.title}`
              : "Live Stream",
            type: "image/jpeg",
          },
        ],
        // Add live-specific Open Graph tags
        ...(hasLiveStreams && {
          "article:published_time": primaryStream?.scheduledStart,
          "article:section": "Live Events",
          "article:tag": currentLiveStreams
            .map((s) => s.category)
            .filter(Boolean)
            .join(", "),
        }),
      },

      //Todo: SEO bro
      twitter: {
        card: "summary_large_image",
        title,
        description,
        site: "@churchtwitter",
        creator: "@churchtwitter",
        images: `${hasLiveStreams ? `process.env.NEXT_PUBLIC_SITE_URL/liveStreamSeo.jpg` : `process.env.NEXT_PUBLIC_SITE_URL/calendarSeo.jpg`}`,
      },

      // Additional metadata
      alternates: {
        canonical: "/live",
      },

      // Enhanced structured data and live-specific metadata
      other: {
        "og:type": "website",
        "og:video:type": hasLiveStreams ? "text/html" : "",
        "article:section": "Live Events",
        "article:tag": keywords.slice(0, 10).join(", "),
        ...(hasLiveStreams && {
          "og:video": primaryStream?.streamUrl,
          "video:duration": "0", // Live stream has no fixed duration
          "video:release_date": primaryStream?.scheduledStart,
        }),
        // Structured data JSON-LD
        ...(structuredData && {
          "application/ld+json": JSON.stringify(structuredData),
        }),
      },

      // Robots directive with live-specific considerations
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
          // Refresh more frequently for live content
        },
      },

      // App-specific metadata
      appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: hasLiveStreams ? `🔴 LIVE` : "Live Stream",
      },

      // Verification codes
      verification: {
        google: `${process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE}`,
      },

      ...(hasLiveStreams && {
        applicationName: "Gofamint UI Live",
        category: "Religion & Spirituality",
        classification: "Live Streaming",
      }),
    };
  } catch (error) {
    console.error("Error generating live stream metadata:", error);

    return {
      title: "Live Stream | Gofamint UI",
      description:
        "Join our live worship services online. Watch church services, prayer meetings, and special events as they happen.",
      keywords: [
        "live stream",
        "church service online",
        "live worship",
        "online church",
      ],

      openGraph: {
        title: "Live Stream | GSF UI",
        description: "Join our live worship services online.",
        type: "website",
        url: "/live",
        images: [
          {
            url: `process.env.NEXT_PUBLIC_SITE_URL/calendarSeo.jpg`,
            width: 1200,
            height: 630,
            alt: "Live Stream",
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title: "Live Stream | Gofamint UI",
        description: "Join our live worship services online.",
        images: [`process.env.NEXT_PUBLIC_SITE_URL/calendarSeo.jpg`],
      },

      robots: {
        index: true,
        follow: true,
      },
    };
  }
}

export default async function Live() {
  const streamsData = await sanityFetchWrapper<LiveStream[]>(
    getCurrentLiveStreams,
    {},
    ["liveStream"]
  );

  return (
    <>
      <div className="bg-black h-18 mb-2 w-full flex-shrink-0" />
      <LiveStreamComponent streamsData={streamsData} />
    </>
  );
}
