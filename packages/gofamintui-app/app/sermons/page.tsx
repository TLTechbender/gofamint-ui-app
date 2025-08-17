import { Metadata } from "next";
import SermonsPageClient from "@/components/sermonsPageClient";
import { Sermons } from "@/sanity/interfaces/sermonsPage";
import { sermonsPageHeroSection } from "@/sanity/queries/sermonsPage";
import { urlFor } from "@/sanity/sanityClient";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { Suspense } from "react";
import Image from "next/image";

// Keep your existing generateMetadata function - it's perfect
export async function generateMetadata(): Promise<Metadata> {
  // Your existing metadata logic here
  try {
    const sermonsPageHero = await sanityFetchWrapper<Sermons>(
      sermonsPageHeroSection
    );

    const ogImageUrl = sermonsPageHero?.heroSection.backgroundImage
      ? urlFor(sermonsPageHero.heroSection.backgroundImage as any)
          .width(1200)
          .height(630)
          .format("webp")
          .quality(90)
          .url()
      : null;

    const title = sermonsPageHero?.heroSection.title || "Sermons";
    const subtitle = sermonsPageHero?.heroSection.subtitle || "";
    const description = subtitle
      ? `${subtitle} - Discover inspiring sermons and spiritual teachings.`
      : "Discover inspiring sermons, spiritual teachings, and messages of faith. Join us for meaningful worship and biblical insights.";

    return {
      title: `${title} | GSF UI`,
      description,
      keywords: [
        "sermons",
        "GSF UI",
        "Gofamint Students Fellowship",
        "spiritual teachings",
        "worship",
        "faith",
        "biblical messages",
        "christian sermons",
        "University of Ibadan",
        "student ministry",
      ],
      authors: [{ name: "Gofamint Students' Fellowship UI Chapter" }],
      creator: "Gofamint Students' Fellowship UI Chapter",
      publisher: "GSF UI",

      openGraph: {
        title: `${title} | GSF UI`,
        description,
        type: "website",
        url: "https://gsfui.org/sermons",
        siteName: "GSF UI",
        locale: "en_NG",
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

      twitter: {
        card: "summary_large_image",
        title: `${title} | GSF UI`,
        description,
        site: "@gsfui",
        creator: "@gsfui",
        images: ogImageUrl ? [ogImageUrl] : [],
      },

      alternates: {
        canonical: "https://gsfui.org/sermons",
      },

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
    };
  } catch (error) {
    console.error("Error generating sermons metadata:", error);

    return {
      title: "Sermons | GSF UI",
      description:
        "Discover inspiring sermons, spiritual teachings, and messages of faith from Gofamint Students' Fellowship, University of Ibadan.",
      openGraph: {
        title: "Sermons | GSF UI",
        description: "Discover inspiring sermons and spiritual teachings.",
        type: "website",
        url: "https://gsfui.org/sermons",
      },
    };
  }
}

export const dynamic = "force-dynamic";

// Clean Loading Component
const MinimalistLoader = () => (
  <div className="min-h-[40vh] flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div className="w-8 h-px bg-blue-400 animate-pulse"></div>
        <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
          Loading
        </span>
      </div>
      <div className="w-16 h-px bg-gray-200 animate-pulse"></div>
    </div>
  </div>
);

export default async function SermonsPage() {
  const sermonsPageHero = await sanityFetchWrapper<Sermons>(
    sermonsPageHeroSection
  );

  // Handle empty data state
  if (!sermonsPageHero?.heroSection) {
    return (
      <main className="bg-white">
        <section className="min-h-screen flex items-center justify-center">
          <div className="text-center px-4 max-w-md">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-12 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Coming Soon
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-black mb-6 leading-tight">
              Sermons & Messages
            </h1>
            <p className="text-black font-light leading-relaxed">
              Our sermon collection is being prepared. Check back soon for
              inspiring messages and spiritual teachings.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-white">
      {/* Minimalist Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Clean Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={urlFor(sermonsPageHero.heroSection.backgroundImage as any)
              .width(1920)
              .height(1080)
              .format("webp")
              .quality(95)
              .url()}
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
          {/* Minimal overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Clean Content Layout */}
        <div className="relative z-10 container mx-auto px-6 md:px-8">
          <div className="max-w-5xl mx-auto text-center">
            {/* Section Indicator */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-12 h-px bg-white/60"></div>
              <span className="text-sm font-medium text-white/80 tracking-widest uppercase">
                Spiritual Growth
              </span>
              <div className="w-12 h-px bg-white/60"></div>
            </div>

            {/* Hero Title */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-light text-white mb-8 leading-tight tracking-tight">
              {sermonsPageHero.heroSection.title}
            </h1>

            {/* Hero Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed max-w-3xl mx-auto">
              {sermonsPageHero.heroSection.subtitle}
            </p>

            {/* Optional CTA */}
            <div className="mt-12">
              <a
                href="#sermons"
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 hover:bg-blue-500 hover:text-white transition-all duration-300 group"
              >
                <span className="font-medium tracking-wide">
                  Explore Messages
                </span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Transition Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-8 max-w-4xl text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-8 h-px bg-blue-400"></div>
            <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
              Messages & Teachings
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-light text-black leading-tight tracking-tight mb-6">
            Discover Life-Changing Messages
          </h2>
          <p className="text-lg text-black font-light leading-relaxed max-w-2xl mx-auto">
            Explore our collection of sermons, teachings, and spiritual insights
            designed to strengthen your faith and guide your journey.
          </p>
        </div>
      </section>

      {/* Sermons Content Section */}
      <section id="sermons" className="bg-gray-50 py-20 md:py-24">
        <div className="container mx-auto px-6 md:px-8">
          <Suspense fallback={<MinimalistLoader />}>
            <SermonsPageClient />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
