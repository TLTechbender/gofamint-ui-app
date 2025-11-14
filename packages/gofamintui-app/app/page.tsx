import Link from "next/link";
import { ChevronRight, Clock, LocationEditIcon, Quote } from "lucide-react";
import Image from "next/image";
import JourneyPlanner from "@/components/homePage/journeyPlanner";
import { homepageQuery } from "@/sanity/queries/homePage";
import { Metadata } from "next";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { homepageMetadataQuery } from "@/sanity/queries/homePageMetaData";
import { urlFor } from "@/sanity/sanityClient";
import { Sermon } from "@/sanity/interfaces/sermonsPage";
import { recentSermonsQuery } from "@/sanity/queries/sermonsPage";
import VideoBackground from "@/components/homePage/videoBackground";
import ImagesScrollingContainer from "@/components/homePage/imagesScollingContainer";
import SermonCard from "@/components/sermons/sermonCard";
import { Homepage } from "@/sanity/interfaces/homePage";
import UnderConstructionPage from "@/components/underConstructionPage";

export async function generateMetadata(): Promise<Metadata> {
  const dynamicMetaData = await sanityFetchWrapper<Homepage>(
    homepageMetadataQuery,
    {},
    ["homepage", "whatsappContactWidget", "footer"]
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
    "GSF UI, Gofamint Students' Fellowship, University of Ibadan, Christian Fellowship, Students Ministry, Nigeria";

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
      url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    },
    other: {
      "theme-color": "#ffffff",
      "color-scheme": "light",
    },
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_SITE_URL}`),
  };
}

export default async function Home() {
  // Not doing promise.all in case one fails
  const homepage = await sanityFetchWrapper<Homepage>(homepageQuery, {}, [
    "homepage",
    "whatsappContactWidget",
    "footer",
  ]);

  const mostRecentSermons = await sanityFetchWrapper<Sermon[]>(
    recentSermonsQuery,
    {},
    [
      "homepage",
      "whatsappContactWidget",
      "footer",
      "sermons",
      "sermon",
      "sermon",
      "sermonsPageMetadataAndHero",
    ]
  );

  //This is for the thumbnail
  function formatDuration(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  if (!homepage || Object.keys(homepage).length === 0) {
    return <UnderConstructionPage />;
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section id="hero">
        <div className="py-20 md:py-0 relative min-h-[90vh]">
          <VideoBackground
            imageSrc={urlFor(homepage.heroSection.backgroundImage)
              .width(1920)
              .height(1080)
              .format("webp")
              .quality(95)
              .url()}
            videoSrc={homepage.heroSection.backgroundVideo.asset.url}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40 z-0 overflow-hidden">
            {/* Animated particles */}
            <div className="absolute inset-0 opacity-30">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: `${Math.random() * 5 + 1}px`,
                    height: `${Math.random() * 5 + 1}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>
          {/**
           * Content section
           */}
          <div className="h-full min-h-screen  w-full flex justify-center items-center">
            <div className="min-h-screen flex flex-col lg:flex-row items-center justify-between relative z-10 px-8 py-12 lg:py-0">
              {/* Main content area */}
              <div className="flex-1 max-w-4xl lg:pr-12">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white mb-4">
                  {homepage.heroSection.title}
                </h1>

                <h3
                  className="text-xl lg:text-lg text-white/90 max-w-2xl leading-relaxed animate-slide-up mb-8"
                  style={{ animationDelay: "0.2s" }}
                >
                  {homepage.heroSection.subtitle}
                </h3>

                {/* Buttons */}
                <div
                  className="flex flex-col sm:flex-row gap-6 animate-slide-up"
                  style={{ animationDelay: "0.4s" }}
                >
                  <Link
                    href={homepage.heroSection.primaryButton.link}
                    className="relative w-fit h-fit px-10 py-3 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group overflow-hidden"
                  >
                    <span className="relative z-10">
                      {homepage.heroSection.primaryButton.text}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                  </Link>

                  <Link
                    href={homepage.heroSection.secondaryButton.link}
                    className="relative w-fit h-fit px-10 py-3 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-black transition-all duration-300 group overflow-hidden"
                  >
                    <span className="relative z-10">
                      {homepage.heroSection.secondaryButton.text}
                    </span>
                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                  </Link>
                </div>
              </div>

              {/* Last sermon section - YouTube embed size on mobile (inspiraton from the austin stone church) */}
              {mostRecentSermons &&
                mostRecentSermons.length > 0 &&
                mostRecentSermons[0]?.posterImage && (
                  <div className="flex flex-col gap-2 justify-center items-center mt-12 lg:mt-0 ">
                    <p className="text-white leading-relaxed tracking-wider text-sm md:text-xs">
                      Listen to our most recent sermon
                    </p>
                    <a
                      href={`${mostRecentSermons[0]?.googleDriveLink}`}
                      target="_blank"
                      className="w-full max-w-md mx-auto lg:max-w-none lg:w-96 flex items-center justify-center"
                    >
                      <div className="relative w-full aspect-video lg:w-80 lg:h-64 bg-black/30 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
                        <div className="absolute inset-0">
                          <Image
                            src={urlFor(mostRecentSermons[0].posterImage)
                              .width(400)
                              .height(400)
                              .format("webp")
                              .quality(95)
                              .url()}
                            className="w-full h-full object-contain opacity-20"
                            width={1920}
                            height={1080}
                            alt={`${mostRecentSermons[0].posterImage?.alt || "most recent sermon poster"}`}
                          />
                        </div>

                        {/* Video thumbnail/poster gradient overlay */}
                        <div className="absolute inset-0 bg-black opacity-30" />

                        {/* Play button */}
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 cursor-pointer group">
                            <svg
                              className="w-8 h-8 text-gray-800 ml-1 group-hover:text-black"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                          <h3 className="text-white text-sm font-medium">
                            {mostRecentSermons[0].title || "Latest Sermon"}
                          </h3>
                        </div>

                        <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 text-white text-xs rounded-md">
                          {formatDuration(mostRecentSermons[0].duration)}
                        </div>
                      </div>
                    </a>
                  </div>
                )}
            </div>
          </div>
        </div>
      </section>
      {/* Welcome Section */}
      <section id="welcome" className="py-20  bg-white">
        <div>
          <div>
            <ImagesScrollingContainer
              images={homepage.welcomeSection.imageSlider.map((imageAsset) =>
                urlFor(imageAsset.image)
                  .width(400)
                  .height(400)
                  .format("webp")
                  .quality(75)
                  .url()
              )}
            />
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section id="services" className="py-20 bg-[#f4f4f4]">
        <div className="container mx-auto px-4 animate-fade-in">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16">
              <div className="mb-6 md:mb-0">
                <h2 className="text-gray-900 text-4xl lg:text-5xl font-bold mb-4 capitalize">
                  {homepage.servicesSection.title}
                </h2>
                <p className="text-gray-600 text-lg capitalize">
                  {homepage.servicesSection.subtitle}
                </p>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <LocationEditIcon size={24} className="text-gray-900 " />
                <h4 className="font-medium capitalize">
                  {homepage.servicesSection.location}
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {homepage.servicesSection.services.map((service, index) => (
                <div
                  key={index}
                  className="group relative bg-white  overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200"
                >
                  {/* Image with overlay */}
                  <div className="relative h-80 md:h-72 lg:h-80 overflow-hidden">
                    <Image
                      src={urlFor(service.posterImage)
                        .width(600)
                        .height(500)
                        .format("webp")
                        .quality(95)
                        .url()}
                      sizes="360px"
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-2 drop-shadow-lg">
                        {service.title}
                      </h3>
                      <p className="text-gray-200 text-sm mb-3 line-clamp-2 drop-shadow-sm">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock size={16} />
                        <span className="text-sm font-medium">
                          {service.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Journey Planner Section */}
      <section id="journey-planner" className="py-20">
        {/**
         * Swr to God this was all Devqing's work, Never would I have thought of this in my entire life man,
         * This google maps integration is smart as fuck!!!!
         *
         * Shoutout to him, would definately be referencing this in future projects
         */}
        <div className="container mx-auto px-4 animate-fade-in">
          <JourneyPlanner />
        </div>
      </section>
      {/* Most recent Sermons Section */}
      <section id="sermons" className=" py-20">
        <div className="container mx-auto px-4 animate-fade-in">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16">
              <div className="mb-6 md:mb-0">
                <h2 className="black text-4xl lg:text-5xl font-bold mb-4">
                  Revisit Recent Messages
                </h2>
                <p className="text-black text-lg">
                  {` Catch Up on God's Word from his servants and remain blessed`}
                </p>
              </div>
              <Link
                href="/sermons"
                className="inline-flex items-center gap-2 px-6 py-3 border border-blue-700/30 rounded-lg text-blue-700 group hover:bg-blue-700 hover:text-yellow-100 hover:border-yellow-200 transition-all duration-300"
              >
                <span>View More</span>
                <ChevronRight
                  className="relative transition duration-300 group-hover:translate-x-[5px]"
                  size={20}
                />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mostRecentSermons &&
                mostRecentSermons.map((sermon, index) => (
                  <SermonCard key={index} sermon={sermon} />
                ))}
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url(${urlFor(
              homepage.testimonialsSection.backgroundImage
            )
              .width(1920)
              .height(1080)
              .format("webp")
              .quality(95)
              .url()})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80" />

        <div className="relative z-10 container mx-auto px-4 animate-fade-in">
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-white/40" />
              <Quote className="w-6 h-6 text-white/60" />
              <div className="w-12 h-px bg-white/40" />
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Testimonials
            </h2>

            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Hear from our Members about their transformative experiences
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid px-2 md:px-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homepage.testimonialsSection.testimonials.map(
              (testimonial, index) => (
                <div
                  key={index}
                  className="group relative bg-white/10 backdrop-blur-md rounded-tr-2xl rounded-b-2xl p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20"
                >
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-white/20 backdrop-blur-2xl rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                    <Quote className="w-4 h-4 text-white" />
                  </div>

                  <div className="mb-6">
                    <p className="text-white/90 italic">{`"${testimonial.text}"`}</p>
                  </div>
                  <div className="flex items-center gap-4 border-t border-white/20 pt-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">
                        {testimonial.name}
                      </h4>
                      <p className="text-white/60 text-sm">
                        {testimonial.position}
                      </p>
                    </div>
                  </div>

                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/20 rounded-br-lg opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
                </div>
              )
            )}
          </div>

          {/**For the nice chain effect */}

          <div className="text-center mt-16 lg:mt-20">
            <div className="inline-flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/40" />
              <div className="w-2 h-2 rounded-full bg-white/60" />
              <div className="w-24 h-px bg-white/40" />
              <div className="w-2 h-2 rounded-full bg-white/60" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/40" />
            </div>

            <p className="text-white/60 text-sm italic">
              {` "Let the redeemed of the Lord tell their story" - Psalm 107:2`}
            </p>
          </div>
        </div>
      </section>

      <section id="cta" className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl animate-fade-in">
          {/* Text Content */}
          <div className="hidden md:block text-left mb-16 relative z-10">
            <h2 className="text-gray-900 font-bold text-6xl lg:text-7xl xl:text-8xl leading-tight mb-8 max-w-4xl">
              {homepage.ctaSection.title}
            </h2>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed max-w-2xl">
              {homepage.ctaSection.description}
            </p>
          </div>

          {/* Image Container - Responsive: Clip path on desktop, split layout on mobile */}
          <div className="relative">
            {/* Desktop: Clipped corner design */}
            <div
              className="hidden md:block relative overflow-hidden"
              style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)" }}
            >
              <Image
                src={urlFor(homepage.ctaSection.ctaBigImage)
                  .width(800)
                  .height(400)
                  .format("webp")
                  .quality(95)
                  .url()}
                alt="Get Blessed"
                width={1200}
                height={600}
                className="w-full h-[500px] xl:h-[600px] object-cover"
              />
            </div>

            {/* Mobile: Split layout with text in the "clipped" area */}
            <div className="md:hidden">
              <div className="grid grid-rows-2 gap-0 rounded-2xl overflow-hidden shadow-xl">
                {/* Image section */}
                <div className="row-span-1">
                  <Image
                    src={urlFor(homepage.ctaSection.ctaBigImage)
                      .width(800)
                      .height(400)
                      .format("webp")
                      .quality(95)
                      .url()}
                    alt="Get Blessed"
                    width={800}
                    height={400}
                    className="w-full h-[300px] object-cover"
                  />
                </div>

                {/* Text section that replaces the "clipped" area */}
                <div className="bg-[#f4f4f4] text-black flex items-center justify-center p-8">
                  <div className="text-center max-w-sm">
                    <div className="w-12 h-12 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                      <div className={`relative w-8 h-12 `}>
                        {/**Tryna make a cross, Cssing it instead of downloading and extra image */}
                        {/* Vertical bar */}
                        <div className="absolute left-1/2 top-0 w-1.5 h-full bg-gray-900 transform -translate-x-1/2" />
                        {/* Horizontal bar */}
                        <div className="absolute top-1/3  left-0 w-full h-1.5 bg-gray-900 transform -translate-y-1/3" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {homepage.ctaSection.title}
                    </h3>
                    <p className=" text-sm leading-relaxed">
                      {homepage.ctaSection.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-20 right-10 w-32 h-32 bg-gray-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-gray-200 rounded-full opacity-30 blur-2xl"></div>
      </section>
    </div>
  );
}
