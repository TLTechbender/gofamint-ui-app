import { Metadata } from "next";
import { ExcecutivesPageData } from "@/sanity/interfaces/excecutivesPage";
import { excecutivesPageQuery } from "@/sanity/queries/excecutivesPage";
import { urlFor } from "@/sanity/sanityClient";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import Image from "next/image";
import UnderConstructionPage from "@/components/underConstructionPage";

export async function generateMetadata(): Promise<Metadata> {
  const dynamicMetaData = await sanityFetchWrapper<ExcecutivesPageData>(
    excecutivesPageQuery,
    {},
    ["executives"]
  );

  const optimizedImageUrl = dynamicMetaData?.seo?.ogImage?.asset?.url
    ? `${dynamicMetaData.seo.ogImage.asset.url}?w=1200&h=630&fit=crop&auto=format`
    : null;

  // Fallback values
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
    keywords,
    authors: [
      {
        name: "Gofamint Students' Fellowship UI Chapter",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
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
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/excecutives`,
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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/excecutives`,
    },
    other: {
      "theme-color": "#ffffff",
      "color-scheme": "light",
    },
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_SITE_URL}/excecutives`),
  };
}

export default async function Executives() {
  const excosPageData = await sanityFetchWrapper<ExcecutivesPageData>(
    excecutivesPageQuery,
    {},
    ["executives"]
  );

  if (!excosPageData || Object.keys(excosPageData).length === 0) {
    return <UnderConstructionPage />;
  }

  return (
    <main className="bg-white">
      {/* Professional Split Hero Section */}
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Mobile: Full overlay design */}
        <div className="pt-20 mb-2 bg-black h-16 w-full" />
        <div className="md:hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={urlFor(excosPageData.heroSection?.image)
                ?.width(1080)
                .height(1920)
                .format("webp")
                .quality(95)
                .url()}
              alt=""
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative z-10 min-h-[90vh] flex items-center justify-center px-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight tracking-tight">
                {excosPageData.heroSection?.title}
              </h1>
              <p className="text-xl text-white/90 font-light max-w-md mx-auto leading-relaxed">
                {excosPageData.heroSection?.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Desktop: Split layout with clipped image */}
        <div className="hidden bg-[#f4f4f4] md:flex min-h-[80vh] pt-8">
          {/* Content Side - Left */}
          <div className="flex-1  flex items-center justify-end pr-8 lg:pr-16 xl:pr-24">
            <div className="max-w-lg text-right">
              <div className="flex items-center justify-end space-x-3 mb-8">
                <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                  Leadership Team
                </span>
                <div className="w-12 h-px bg-blue-400"></div>
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light text-black mb-8 leading-tight tracking-tight">
                {excosPageData.heroSection?.title}
              </h1>

              <p className="text-lg lg:text-xl text-black font-light leading-relaxed mb-10">
                {excosPageData.heroSection?.subtitle}
              </p>
            </div>
          </div>

          {/* Image Side - Right with Clipping */}
          <div className="flex-1 relative">
            {/* Main clipped image container */}
            <div
              className="absolute inset-0 bg-gray-100"
              style={{
                clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)",
              }}
            >
              <Image
                src={urlFor(excosPageData.heroSection?.image)
                  ?.width(1200)
                  .height(1080)
                  .format("webp")
                  .quality(95)
                  .url()}
                alt=""
                fill
                className="object-cover object-center"
                priority
              />

              {/* Subtle gradient overlay for depth */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"
                style={{
                  clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)",
                }}
              />
            </div>

            {/* Decorative accent line */}
            <div
              className="absolute inset-y-0 bg-blue-400 w-1 z-10"
              style={{
                left: "15%",
                transform: "translateX(-50%)",
              }}
            />
          </div>
        </div>
      </section>

      {/* Clean Info Section */}
      <section className="bg-white py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-start">
            <div className="md:col-span-5">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-px bg-blue-400"></div>
                <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                  Leadership
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-black leading-tight tracking-tight">
                {excosPageData.infoSection?.title}
              </h2>
            </div>
            <div className="md:col-span-7">
              <p className="text-lg md:text-xl text-black font-light leading-relaxed">
                {excosPageData.infoSection?.subTitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Overall Head Section - Minimalist */}
      <section className="bg-gray-50 py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-center">
            {/* Sharp-edged Image */}
            <div className="md:col-span-5 group">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={urlFor(excosPageData.overallHead.posterImage)
                    ?.width(600)
                    .height(750)
                    .format("webp")
                    .quality(95)
                    .url()}
                  alt="Overall Head"
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </div>
            </div>

            {/* Clean Content */}
            <div className="md:col-span-7 space-y-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-px bg-blue-400"></div>
                <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                  Leadership Excellence
                </span>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-light text-black leading-tight tracking-tight">
                  Guiding Our Organization Forward
                </h2>

                <p className="text-lg text-black font-light leading-relaxed max-w-2xl">
                  Our leadership team brings decades of combined experience and
                  unwavering commitment to excellence, driving innovation and
                  success across all organizational levels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executives Grid - Clean Minimalist */}
      <section className="bg-white py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          {/* Section Header */}
          <div className="mb-20 md:mb-24">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Our Team
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-8 leading-tight tracking-tight">
              {excosPageData.excosSection?.title || "Executive Team"}
            </h1>
            <p className="text-lg md:text-xl text-black font-light leading-relaxed max-w-3xl">
              {excosPageData.excosSection?.subTitle ||
                "Meet the dedicated professionals leading our organization with vision, expertise, and commitment to excellence."}
            </p>
          </div>

          {/* Clean Executive Cards */}
          {excosPageData.excosSection?.excos &&
          excosPageData.excosSection.excos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
              {excosPageData.excosSection.excos.map((exco, index) => (
                <div
                  key={index}
                  className="group bg-white transition-all duration-300"
                >
                  {/* Sharp Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden mb-6">
                    <Image
                      src={urlFor(exco.picture)
                        ?.width(400)
                        .height(500)
                        .format("webp")
                        .quality(95)
                        .url()}
                      alt={`${exco.name} - ${exco.operatingCapacity}`}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                  </div>

                  {/* Minimal Content */}
                  <div className="space-y-2">
                    <h3 className="text-lg md:text-xl font-medium text-black group-hover:text-blue-500 transition-colors duration-300">
                      {exco.name}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 font-light tracking-wide uppercase">
                      {exco.operatingCapacity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="w-8 h-px bg-blue-400"></div>
                <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                  Coming Soon
                </span>
              </div>
              <h3 className="text-2xl font-light text-black mb-4">
                Executive Profiles
              </h3>
              <p className="text-black font-light">
                Executive information will be displayed here when available.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
