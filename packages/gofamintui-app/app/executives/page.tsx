import { Metadata } from "next";
import { ExcecutivesPageData } from "@/sanity/interfaces/excecutivesPage";
import { excecutivesPageQuery } from "@/sanity/queries/excecutivesPage";
import { urlFor } from "@/sanity/sanityClient";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const excosPageData =
      await sanityFetchWrapper<ExcecutivesPageData>(excecutivesPageQuery);

    // Handle case where no data is available
    if (!excosPageData || Object.keys(excosPageData).length === 0) {
      return {
        title: "Executive Team | GSF UI",
        description:
          "Meet the executive team of Gofamint Students' Fellowship, University of Ibadan.",
        robots: { index: false, follow: true },
      };
    }

    // Build dynamic metadata from actual data
    const heroTitle = excosPageData.heroSection?.title || "Executive Team";
    const heroSubtitle = excosPageData.heroSection?.subtitle || "";
    const infoTitle = excosPageData.infoSection?.title || "";
    const infoSubtitle = excosPageData.infoSection?.subTitle || "";

    // Count executives
    const execsCount = excosPageData.excosSection?.excos?.length || 0;
    const execsText = execsCount === 1 ? "executive" : "executives";

    // Build title
    const title = `${heroTitle} | GSF UI`;

    // Build description from available content
    let description = "";
    if (heroSubtitle) {
      description = heroSubtitle;
    } else if (infoSubtitle) {
      description = infoSubtitle;
    } else {
      description = `Meet the ${execsCount} dedicated ${execsText} leading Gofamint Students' Fellowship, University of Ibadan.`;
    }

    // Add executive count context if we have executives
    if (execsCount > 0 && !description.includes(execsCount.toString())) {
      description += ` Our team consists of ${execsCount} experienced leaders committed to excellence.`;
    }

    // Get featured image (hero image or first executive's photo)
    let featuredImageUrl = null;
    let imageAlt = title;

    if (excosPageData.heroSection?.image) {
      featuredImageUrl = urlFor(excosPageData.heroSection.image as any)
        .width(1200)
        .height(630)
        .format("jpg")
        .quality(80)
        .url();
      imageAlt = heroTitle;
    } else if (excosPageData.overallHead?.posterImage) {
      featuredImageUrl = urlFor(excosPageData.overallHead.posterImage as any)
        .width(1200)
        .height(630)
        .format("jpg")
        .quality(80)
        .url();
      imageAlt = "GSF UI Leadership";
    } else if (excosPageData.excosSection?.excos?.[0]?.picture) {
      featuredImageUrl = urlFor(
        excosPageData.excosSection.excos[0].picture as any
      )
        .width(1200)
        .height(630)
        .format("jpg")
        .quality(80)
        .url();
      imageAlt = `${excosPageData.excosSection.excos[0].name} - Executive Team`;
    }

    // Generate keywords from executive positions
    const executivePositions = excosPageData.excosSection?.excos
      ?.map((exco) => exco.operatingCapacity)
      .filter(Boolean)
      .slice(0, 5) // Take first 5 positions
      .join(", ");

    const keywords = [
      "GSF UI executives",
      "Gofamint Students Fellowship leadership",
      "University of Ibadan student executives",
      "GSF UI leadership team",
      "student organization executives",
      ...(executivePositions ? [executivePositions] : []),
    ];

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
      category: "Religious Organization",
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
        url: "https://gofamintui.org/executives",
        siteName: "GSF UI",
        images: featuredImageUrl
          ? [
              {
                url: featuredImageUrl,
                width: 1200,
                height: 630,
                alt: imageAlt,
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
        images: featuredImageUrl
          ? [
              {
                url: featuredImageUrl,
                alt: imageAlt,
              },
            ]
          : [],
      },
      alternates: {
        canonical: "https://gofamintui.org/executives",
      },
      other: {
        "theme-color": "#ffffff",
        "color-scheme": "light",
      },
      metadataBase: new URL("https://gofamintui.org"),
    };
  } catch (error) {
    console.error("Error generating executives metadata:", error);

    // Fallback metadata if data fetching fails
    return {
      title: "Executive Team | GSF UI",
      description:
        "Meet the executive team of Gofamint Students' Fellowship, University of Ibadan. Our dedicated leaders are committed to spiritual growth and community service.",
      keywords: [
        "GSF UI executives",
        "Gofamint Students Fellowship leadership",
        "University of Ibadan student executives",
        "student organization leadership",
      ],
      openGraph: {
        title: "Executive Team | GSF UI",
        description:
          "Meet the executive team of Gofamint Students' Fellowship, University of Ibadan.",
        type: "website",
        url: "https://gofamintui.org/executives",
        siteName: "GSF UI",
      },
      twitter: {
        card: "summary",
        title: "Executive Team | GSF UI",
        description:
          "Meet the executive team of Gofamint Students' Fellowship, University of Ibadan.",
      },
    };
  }
}
export const dynamic = "force-dynamic";
export default async function Executives() {
  const excosPageData =
    await sanityFetchWrapper<ExcecutivesPageData>(excecutivesPageQuery);

  // Handle empty or null data
  if (!excosPageData || Object.keys(excosPageData).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 animate-fade-in">
        <div className="text-center px-4 max-w-md animate-slide-up">
          <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-12 h-12 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Executive Team Coming Soon
          </h2>
          <p className="text-gray-600">
            We're currently finalizing our executive team information. Please
            check back soon or contact us for details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section id="hero" className="relative">
        <div
          className="relative min-h-[90vh] bg-fixed bg-center bg-cover flex items-center justify-center"
          style={{
            backgroundImage: `url(${urlFor(
              excosPageData.heroSection?.image as any
            )
              ?.width(1920)
              .height(1080)
              .format("webp")
              .quality(95)
              .url()})`,
          }}
        >
          <div className="absolute inset-0 bg-black/60 z-0"></div>
          <div className="relative z-10 w-full px-4 text-center animate-slide-up">
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {excosPageData.heroSection?.title}
            </h1>
            <h3 className="text-white text-xl lg:text-2xl max-w-2xl mx-auto">
              {excosPageData.heroSection?.subtitle}
            </h3>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section id="info" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center max-w-6xl mx-auto gap-12">
            <div className="lg:basis-1/2 animate-slide-right">
              <h2 className="text-gray-900 font-bold text-4xl lg:text-5xl leading-tight mb-6">
                {excosPageData.infoSection?.title}
              </h2>
            </div>
            <div className="lg:basis-1/2 animate-slide-left">
              <p className="text-lg text-gray-700 leading-relaxed">
                {excosPageData.infoSection?.subTitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Overall Head Section */}
      <section id="boss" className="bg-white py-20">
        <div className="container mx-auto px-4 animate-fade-in">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              {/* Image Container */}
              <div className="lg:basis-2/5 animate-slide-right">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                  <Image
                    width={500}
                    height={600}
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                    alt="Overall Head"
                    src={urlFor(excosPageData.overallHead.posterImage as any)
                      ?.width(500)
                      .height(600)
                      .format("webp")
                      .quality(95)
                      .url()}
                  />
                </div>
              </div>

              {/* Content Container */}
              <div className="lg:basis-3/5 animate-slide-left">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                      Leadership Excellence
                    </h2>
                    <h3 className="text-2xl text-blue-600 font-medium">
                      Guiding Our Organization Forward
                    </h3>
                  </div>

                  <p className="text-lg text-gray-700 leading-relaxed">
                    Our leadership team brings decades of combined experience
                    and unwavering commitment to excellence, driving innovation
                    and success across all organizational levels.
                  </p>

                  <div className="pt-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executives Grid Section */}
      <section
        id="executives"
        className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20"
      >
        <div className="container mx-auto px-4 animate-fade-in">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16 animate-slide-up">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {excosPageData.excosSection?.title || "Our Executive Team"}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {excosPageData.excosSection?.subTitle ||
                  "Meet the dedicated professionals leading our organization with vision, expertise, and commitment to excellence."}
              </p>
            </div>

            {/* Executives Grid */}
            {excosPageData.excosSection?.excos &&
            excosPageData.excosSection.excos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                {excosPageData.excosSection.excos.map((exco, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden max-w-sm w-full transform hover:-translate-y-2 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden h-80">
                      <Image
                        width={300}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={`${exco.name} - ${exco.operatingCapacity}`}
                        src={urlFor(exco.picture as any)
                          ?.width(300)
                          .height(400)
                          .format("webp")
                          .quality(95)
                          .url()}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {exco.name}
                      </h3>
                      <p className="text-blue-600 font-medium text-sm uppercase tracking-wide">
                        {exco.operatingCapacity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 animate-slide-up">
                <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-md">
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Executives Available
                </h3>
                <p className="text-gray-500">
                  Executive information will be displayed here when available.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
