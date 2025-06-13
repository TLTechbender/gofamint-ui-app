import { Metadata } from "next";
import LiveStreamComponent from "@/components/liveComponent";
import { LiveStream } from "@/sanity/interfaces/streaming";
import { getCurrentLiveStreams } from "@/sanity/queries/streaming";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";

// Generate metadata function
export async function generateMetadata(): Promise<Metadata> {
  try {
    const streamsData = await sanityFetchWrapper<LiveStream[]>(
      getCurrentLiveStreams
    );

    // Filter active live streams
    const currentLiveStreams =
      streamsData?.filter((stream) => stream.isLive) || [];
    const hasLiveStreams = currentLiveStreams.length > 0;

    // Get primary stream for metadata
    const primaryStream = currentLiveStreams[0];

    // Dynamic title and description based on live status
    const baseTitle = "Live Stream";
    const title = hasLiveStreams
      ? `🔴 LIVE: ${primaryStream?.title || "Church Service"} | Your Church Name`
      : `${baseTitle} | Your Church Name`;

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
              name: "Your Church Name",
            },
          },
        }
      : null;

    return {
      title,
      description,
      keywords,
      authors: [{ name: "Your Church Name" }],
      creator: "Your Church Name",
      publisher: "Your Church Name",

      // Open Graph metadata
      openGraph: {
        title,
        description,
        type: "website",
        url: "/live",
        siteName: "Your Church Name",
        locale: "en_US",
        images: [
          {
            url: "/images/live-stream-og.jpg", // Add your live stream thumbnail
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

      // Twitter Card metadata with live-specific enhancements
      twitter: {
        card: "summary_large_image",
        title,
        description,
        site: "@yourchurchtwitter",
        creator: "@yourchurchtwitter",
        images: ["/images/live-stream-og.jpg"],
      },

      // Additional metadata
      alternates: {
        canonical: "/live",
      },

      // Enhanced structured data and live-specific metadata
      other: {
        "og:type": "website",
        "og:video:type": hasLiveStreams ? "text/html" : '',
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
        google: "your-google-verification-code",
      },

      // Additional live-stream specific metadata
      ...(hasLiveStreams && {
        applicationName: "Your Church Name Live",
        category: "Religion & Spirituality",
        classification: "Live Streaming",
      }),

      // Refresh directive for live content
    
    };
  } catch (error) {
    console.error("Error generating live stream metadata:", error);

    // Fallback metadata
    return {
      title: "Live Stream | Your Church Name",
      description:
        "Join our live worship services online. Watch church services, prayer meetings, and special events as they happen.",
      keywords: [
        "live stream",
        "church service online",
        "live worship",
        "online church",
      ],

      openGraph: {
        title: "Live Stream | Your Church Name",
        description: "Join our live worship services online.",
        type: "website",
        url: "/live",
        images: [
          {
            url: "/images/live-stream-og.jpg",
            width: 1200,
            height: 630,
            alt: "Live Stream",
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title: "Live Stream | Your Church Name",
        description: "Join our live worship services online.",
        images: ["/images/live-stream-og.jpg"],
      },

      robots: {
        index: true,
        follow: true,
      },
    };
  }
}
export const dynamic = "force-dynamic";
export default async function Live() {
  const streamsData = await sanityFetchWrapper<LiveStream[]>(
    getCurrentLiveStreams
  );

  return <LiveStreamComponent streamsData={streamsData} />;
}
