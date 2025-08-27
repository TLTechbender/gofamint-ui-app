import { Metadata } from "next";
import SermonsPageClient from "@/components/sermons/sermonsPageClient";
import { SermonsMetadataAndHero } from "@/sanity/interfaces/sermonsPage";
import { sermonsPageHeroMetaDataAndHeroSection } from "@/sanity/queries/sermonsPage";
import { urlFor } from "@/sanity/sanityClient";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import Image from "next/image";
import UnderConstructionPage from "@/components/underConstructionPage";
import { ChevronDown } from "lucide-react";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const dynamicMetaData = await sanityFetchWrapper<SermonsMetadataAndHero>(
    sermonsPageHeroMetaDataAndHeroSection,
    {},
    ["sermons", "sermon", "sermonsPageMetadataAndHero"]
  );

  const optimizedImageUrl = dynamicMetaData?.seo?.ogImage?.asset?.url
    ? `${dynamicMetaData.seo.ogImage.asset.url}?w=1200&h=630&fit=crop&auto=format`
    : null;
  const title =
    dynamicMetaData?.seo?.title ||
    "GSF UI – Gofamint Students' Fellowship, University of Ibadan";
  const description =
    dynamicMetaData?.seo?.description ||
    "Join us at Gofamint Students' Fellowship, University of Ibadan for spiritual growth, fellowship, and community service.";
  const keywords =
    dynamicMetaData?.seo?.keywords ||
    "GSF UI, Gofamint Students Fellowship, University of Ibadan, Christian Fellowship, Students Ministry, Nigeria";

  return {
    title,
    description,
    keywords: keywords || [
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
    authors: [
      {
        name: "Gofamint Students' Fellowship UI Chapter",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/sermons`,
      },
    ],
    creator: "Bolarinwa Paul Ayomide (https://github.com/TLTechbender)",
    publisher: "Gofamint Students' Fellowship UI",

    category: "Church",
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
      google: `${process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE}`,
    },
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/sermons`,
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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/sermons`,
    },
    other: {
      "theme-color": "#ffffff",
      "color-scheme": "light",
    },
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_SITE_URL}/sermons`),
  };
}

const SermonsPageSkeleton = () => {
  return (
    <main className="bg-white min-h-screen">
      <div className="container mx-auto px-6 md:px-8 py-24 md:py-32">
        {/* Search Bar Section Skeleton */}
        <div className="mb-20 max-w-3xl mx-auto">
          {/* Header skeleton */}
          <div className="text-center mb-12">
            {/* Blue accent line with label */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-px bg-gray-200 animate-pulse"></div>
              <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-8 h-px bg-gray-200 animate-pulse"></div>
            </div>

            {/* Title skeleton */}
            <div className="h-10 md:h-12 lg:h-14 bg-gray-200 animate-pulse rounded mb-6 max-w-sm mx-auto"></div>

            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 animate-pulse rounded max-w-2xl mx-auto"></div>
              <div className="h-5 bg-gray-200 animate-pulse rounded max-w-lg mx-auto"></div>
            </div>
          </div>

          {/* Search Input Skeleton */}
          <div className="relative border border-gray-200 bg-white">
            <div className="w-full h-16 bg-gray-50 animate-pulse px-6 py-4 pr-20"></div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>

        {/* Sermons Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {[...Array(6)].map((_, index) => (
            <SermonCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </main>
  );
};

// Individual sermon card skeleton that matches your design
const SermonCardSkeleton = () => (
  <div className="bg-white border border-gray-100 overflow-hidden animate-pulse">
    {/* Image skeleton - aspect ratio [4/5] to match your sermon cards */}
    <div className="aspect-[4/5] bg-gray-200"></div>

    {/* Content skeleton */}
    <div className="p-6 space-y-4">
      {/* Title skeleton */}
      <div className="h-5 bg-gray-200 w-3/4 rounded"></div>

      {/* Meta information skeleton (date, duration, etc.) */}
      <div className="flex items-center space-x-4">
        <div className="h-4 bg-gray-200 w-20 rounded"></div>
        <div className="h-4 bg-gray-200 w-16 rounded"></div>
      </div>

      {/* Description skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 w-full rounded"></div>
        <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
      </div>
    </div>
  </div>
);

export default async function SermonsPage() {
  const sermonsPageHero = await sanityFetchWrapper<SermonsMetadataAndHero>(
    sermonsPageHeroMetaDataAndHeroSection,
    {},
    ["sermons", "sermon", "sermonsPageMetadataAndHero"]
  );

  if (!sermonsPageHero?.heroSection) {
    return <UnderConstructionPage />;
  }

  return (
    <>
      <div className="bg-black h-16  w-full flex-shrink-0 relative  top-0 z-10" />
      <main className="bg-white">
        <section className="relative min-h-[95vh] overflow-hidden">
          {/* Mobile: Full background with overlay */}
          <div className="absolute inset-0 z-0 md:hidden">
            <Image
              src={urlFor(sermonsPageHero.heroSection.backgroundImage)
                .width(1080)
                .height(1920)
                .format("webp")
                .quality(95)
                .url()}
              alt=""
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Desktop: Creative asymmetric layout */}
          <div className="absolute inset-0 z-0 bg-white hidden md:block">
            {/* Large diagonal image section - Takes up 60% with diagonal cut */}
            <div className="absolute left-0 top-0 bottom-0 w-3/5 lg:w-2/3">
              <div
                className="relative h-full overflow-hidden"
                style={{
                  clipPath: "polygon(0 0, 85% 0, 70% 100%, 0 100%)",
                }}
              >
                <Image
                  src={urlFor(sermonsPageHero.heroSection.backgroundImage)
                    .width(1440)
                    .height(1080)
                    .format("webp")
                    .quality(95)
                    .url()}
                  alt=""
                  fill
                  className="object-cover scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            </div>

            {/* Right content area with enhanced background */}
            <div className="absolute right-0 top-0 bottom-0 w-2/5 lg:w-1/3 bg-gradient-to-br from-white via-gray-50/95 to-gray-100/90" />
          </div>

          {/* Content Container */}
          <div className="relative z-10 container mx-auto px-6 md:px-8 h-full flex items-center">
            {/* Mobile: Centered content */}
            <div className="w-full md:hidden text-center">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="w-8 h-px bg-white/70"></div>
                <span className="text-sm font-medium text-white/90 tracking-widest uppercase">
                  Messages
                </span>
                <div className="w-8 h-px bg-white/70"></div>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                {sermonsPageHero.heroSection.title}
              </h1>

              <p className="text-lg sm:text-xl text-white/90 font-semibold leading-relaxed mb-10 max-w-md mx-auto">
                {sermonsPageHero.heroSection.subtitle}
              </p>

              <a
                href="#sermons"
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 hover:bg-blue-500 transition-all duration-300 group"
              >
                <span className="font-medium">Explore Messages</span>
                <ChevronDown size={24} />
              </a>
            </div>

            {/* Desktop: Right-aligned content with better positioning */}
            <div className="hidden md:block ml-auto w-full max-w-none">
              <div className="flex h-full min-h-[95vh] items-center justify-end pr-8 lg:pr-16">
                <div className="text-right max-w-lg lg:max-w-xl xl:max-w-2xl">
                  {/* Category label */}
                  <div className="flex items-center justify-end space-x-3 mb-6 lg:mb-8">
                    <span className="text-sm font-semibold text-blue-600 tracking-widest uppercase">
                      Spiritual Messages
                    </span>
                    <div className="w-12 h-px bg-blue-600"></div>
                  </div>

                  {/* Main title - Much larger and bolder */}
                  <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 lg:mb-8 leading-tight tracking-tight">
                    {sermonsPageHero.heroSection.title}
                  </h1>

                  {/* Subtitle - Larger and bolder */}
                  <p className="text-xl lg:text-2xl xl:text-3xl text-gray-800 font-semibold leading-relaxed mb-10 lg:mb-12">
                    {sermonsPageHero.heroSection.subtitle}
                  </p>

                  {/* CTA Button */}
                  <a
                    href="#sermons"
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 text-lg font-semibold hover:bg-blue-700 transition-all duration-300 group shadow-lg hover:shadow-xl"
                  >
                    <span>Explore Messages</span>
                    <ChevronDown size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced floating elements */}
          <div className="absolute top-1/4 left-8 w-3 h-3 bg-blue-500/40 rounded-full hidden lg:block animate-pulse"></div>
          <div
            className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-400/60 rounded-full hidden lg:block animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-1/4 right-12 w-4 h-4 bg-blue-600/30 rounded-full hidden lg:block animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </section>

        {/* Clean Introduction Section */}
        <section id="about-sermons" className="bg-gray-50 py-24 md:py-32">
          <div className="container mx-auto px-6 md:px-8 max-w-6xl">
            <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-start">
              <div className="md:col-span-4">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-px bg-blue-400"></div>
                  <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                    Our Messages
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-light text-black leading-tight tracking-tight">
                  Life-Changing Teachings
                </h2>
              </div>
              <div className="md:col-span-8 space-y-6">
                <p className="text-lg md:text-xl text-black font-light leading-relaxed">
                  Explore our collection of sermons, teachings, and spiritual
                  insights designed to strengthen your faith and guide your
                  spiritual journey. Each message is carefully crafted to
                  provide practical wisdom and biblical truth.
                </p>
                <p className="text-base md:text-lg text-black font-light leading-relaxed">
                  {` Whether you're seeking encouragement, looking for answers, or wanting to 
                grow deeper in your relationship with God, you'll find messages that speak 
                to your heart and transform your perspective.`}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sermons Content Section */}
        <section id="sermons" className="bg-gray-50 py-24 md:py-32">
          <div className="container mx-auto px-6 md:px-8">
            <div className="mb-16 md:mb-20 text-center">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="w-8 h-px bg-blue-400"></div>
                <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                  Latest Messages
                </span>
                <div className="w-8 h-px bg-blue-400"></div>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-black leading-tight tracking-tight">
                Recent Sermons
              </h2>
            </div>
            <Suspense fallback={<SermonsPageSkeleton />}>
              <SermonsPageClient />
            </Suspense>
          </div>
        </section>
      </main>
    </>
  );
}
