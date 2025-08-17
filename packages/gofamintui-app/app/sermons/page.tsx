import { Metadata } from "next";
import SermonsPageClient from "@/components/sermonsPageClient";
import { Sermons } from "@/sanity/interfaces/sermonsPage";
import { sermonsPageHeroSection } from "@/sanity/queries/sermonsPage";
import { urlFor } from "@/sanity/sanityClient";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { Suspense } from "react";

// Generate metadata function
export async function generateMetadata(): Promise<Metadata> {
  try {
    const sermonsPageHero = await sanityFetchWrapper<Sermons>(
      sermonsPageHeroSection
    );

    // Generate optimized image URL for Open Graph
    const ogImageUrl = sermonsPageHero?.heroSection.backgroundImage
      ? urlFor(sermonsPageHero.heroSection.backgroundImage as any)
          .width(1200)
          .height(630)
          .format("webp")
          .quality(90)
          .url()
      : null;

    // Create dynamic title and description
    const title = sermonsPageHero?.heroSection.title || "Sermons";
    const subtitle = sermonsPageHero?.heroSection.subtitle || "";
    const description = subtitle
      ? `${subtitle} - Discover inspiring sermons and spiritual teachings.`
      : "Discover inspiring sermons, spiritual teachings, and messages of faith. Join us for meaningful worship and biblical insights.";

    return {
      title: `${title} | Your Church Name`,
      description,
      keywords: [
        "sermons",
        "church",
        "spiritual teachings",
        "worship",
        "faith",
        "biblical messages",
        "christian sermons",
        "religious content",
        "ministry",
        "preaching",
      ],
      authors: [{ name: "Your Church Name" }],
      creator: "Your Church Name",
      publisher: "Your Church Name",

      // Open Graph metadata
      openGraph: {
        title: `${title} | Your Church Name`,
        description,
        type: "website",
        url: "/sermons",
        siteName: "Your Church Name",
        locale: "en_US",
        images: ogImageUrl
          ? [
              {
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: title,
                type: "image/webp",
              },
            ]
          : [],
      },

      // Twitter Card metadata
      twitter: {
        card: "summary_large_image",
        title: `${title} | GofamintUi`,
        description,
        site: "@yourchurchtwitter", // Replace with your Twitter handle
        creator: "@yourchurchtwitter",
        images: ogImageUrl ? [ogImageUrl] : [],
      },

      // Additional metadata
      alternates: {
        canonical: "/sermons",
      },

      // Structured data hints
      other: {
        "og:type": "website",
        "article:section": "Religion & Spirituality",
        "article:tag": "sermons, church, faith, worship",
      },

      // Robots directive
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

      // App-specific metadata
      appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: title,
      },

      // Verification (add your verification codes)
      verification: {
        google: "your-google-verification-code",
        // yandex: "your-yandex-verification-code",
        // yahoo: "your-yahoo-verification-code",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata in case of error
    return {
      title: "Sermons | Your Church Name",
      description:
        "Discover inspiring sermons, spiritual teachings, and messages of faith. Join us for meaningful worship and biblical insights.",
      keywords: [
        "sermons",
        "church",
        "faith",
        "worship",
        "spiritual teachings",
      ],

      openGraph: {
        title: "Sermons | Your Church Name",
        description: "Discover inspiring sermons and spiritual teachings.",
        type: "website",
        url: "/sermons",
      },

      twitter: {
        card: "summary",
        title: "Sermons | Your Church Name",
        description: "Discover inspiring sermons and spiritual teachings.",
      },
    };
  }
}

export const dynamic = "force-dynamic";

export default async function SermonsPage() {
  const sermonsPageHero = await sanityFetchWrapper<Sermons>(
    sermonsPageHeroSection
  );

  return (
    <div>
      <div>
        <section id="hero">
          <div>
            <div
              className="relative min-h-[80vh] bg-fixed bg-center bg-cover flex items-center justify-center md:justify-start"
              style={{
                backgroundImage: `url(${urlFor(
                  sermonsPageHero?.heroSection.backgroundImage as any
                )
                  .width(1920)
                  .height(1080)
                  .format("webp")
                  .quality(95)
                  .url()})`,
              }}
            >
              <div className="absolute inset-0 bg-black/60 z-0"></div>

              <div className="relative z-10 w-full px-4 md:ml-6 lg:ml-16 flex flex-col gap-3 h-full text-center  justify-center  items-center ">
                <h1 className="text-white text-3xl md:text-4xl lg:text-6xl font-bold mb-4">
                  {sermonsPageHero?.heroSection.title}
                </h1>
                <h3 className="text-white text-xl lg:text-2xl ">
                  {sermonsPageHero?.heroSection.subtitle}
                </h3>
              </div>
            </div>
          </div>
        </section>

        <section id="second">
          <Suspense fallback={<div>Loading...</div>}>
            <SermonsPageClient />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
