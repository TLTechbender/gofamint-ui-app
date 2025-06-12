import Link from "next/link";

import { ChevronRight, Clock, LocationEditIcon, Quote } from "lucide-react";
import Image from "next/image";
import JourneyPlanner from "@/components/journeyPlanner";
import { Homepage } from "@/sanity/interfaces/homePage";
import { homepageQuery } from "@/sanity/queries/homePage";
import { Metadata, ResolvingMetadata } from "next";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { homepageMetadataQuery } from "@/sanity/queries/homePageMetaData";
import { urlFor } from "@/sanity/sanityClient";
import { Sermon } from "@/sanity/interfaces/sermonsPage";
import { recentSermonsQuery } from "@/sanity/queries/sermonsPage";
import SermonComponent from "@/components/sermonComponent";

export async function generateMetadata(): Promise<Metadata> {
  const dynamicMetaData = await sanityFetchWrapper<Homepage>(
    homepageMetadataQuery
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
    verification: {
      google: "your-google-site-verification-code", // Replace with actual code
    },
    openGraph: {
      title,
      description,
      url: "https://gofamintui.org",
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
      canonical: "https://gofamintui.org",
    },
    other: {
      "theme-color": "#ffffff",
      "color-scheme": "light",
    },
    metadataBase: new URL("https://gofamintui.org"),
  };
}

export default async function Home() {
  const [homepage, mostRecentSermons] = await Promise.all([
    sanityFetchWrapper<Homepage>(homepageQuery),
    sanityFetchWrapper<Sermon[]>(recentSermonsQuery),
  ]);

  return (
    <div>
      <div>
        <section id="hero">
          <div
            className="relative min-h-[90vh] bg-fixed bg-center bg-cover flex items-center justify-center md:justify-start"
            style={{
              backgroundImage: `url(${urlFor(
                homepage.heroSection.backgroundImage as any
              )
                .width(1920)
                .height(1080)
                .format("webp")
                .quality(95)
                .url()})`,
            }}
          >
            <div className="absolute inset-0 bg-black/60 z-0"></div>

            <div className="relative z-10 w-full px-4 md:ml-6 lg:ml-16 flex flex-col gap-3 h-full text-center md:text-left justify-center md:items-start items-center lg:basis-1/2">
              <h1 className="text-white text-3xl md:text-4xl lg:text-6xl font-bold mb-4">
                {homepage.heroSection.title}
              </h1>
              <h3 className="text-white text-xl lg:text-2xl ">
                {homepage.heroSection.subtitle}
              </h3>
              <span className="flex gap-4 mt-4">
                <Link
                  href={homepage.heroSection.primaryButton.link}
                  className="text-black bg-white px-4 md:px-8 md:py-3.5 py-2 text-base md:text-lg rounded capitalize transition duration-200 hover:bg-gray-100 hover:animate-bounce"
                >
                  {homepage.heroSection.primaryButton.text}
                </Link>

                <Link
                  href={homepage.heroSection.secondaryButton.link}
                  className="text-white border border-white px-4 md:px-6 md:py-3.5 py-2  text-base md:text-lg capitalize rounded transition duration-200 hover:bg-white hover:text-black"
                >
                  {homepage.heroSection.secondaryButton.text}
                </Link>
              </span>
            </div>
          </div>
        </section>

        <section id="second">
          <div>
            <span className="flex flex-col gap-4 lg:gap-0 lg:flex-row lg:px-6 lg:w-[70%] mx-auto items-center py-24.5 px-4.5">
              <h2 className="text-[#1A202C] lg:basis-1/2 font-bold capitalize text-3xl md:text-4xl lg:text-6xl leading-16 text-center lg:text-left ">
                {homepage.welcomeSection.title}
              </h2>
              <h4 className="leading-8 text-base text-[#1A202C] lg:basis-1/2  text-center lg:text-left ">
                {homepage.welcomeSection.description}
              </h4>
            </span>
          </div>
        </section>
        <section id="third">
          <div className="bg-[#212121] py-24 flex flex-col gap-10">
            <div className="flex items-center justify-between mx-auto w-full max-w-[1280px] px-4">
              <span className="text-white flex flex-col gap-2 ">
                <h2 className="text-5xl capitalize font-bold">
                  {homepage.servicesSection.title}
                </h2>
                <h4 className="text-base capitalize">
                  {homepage.servicesSection.subtitle}
                </h4>
              </span>

              <span className="text-white">
                <h3 className="flex items-center justify-center gap-1">
                  <LocationEditIcon size={20} className="text-orange-700" />{" "}
                  {homepage.servicesSection.location}
                </h3>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(280px,345px))] gap-9 mx-auto items-start justify-center w-full px-4 ">
              {homepage.servicesSection.services.map((service, index) => (
                <div
                  key={index}
                  className=" rounded-3xl  flex gap-5  md:flex-col"
                >
                  <picture className="w-full basis-1/2 aspect-[345/202] overflow-hidden rounded-lg">
                    <Image
                      src={urlFor(service.posterImage as any)
                        .width(345)
                        .height(250)
                        .format("webp")
                        .quality(95)
                        .url()}
                      width={345}
                      height={220}
                      alt="poster image"
                      className="w-full h-full object-cover"
                    />
                  </picture>
                  <div className="flex flex-col gap-4.5 basis-1/2 text-white">
                    <h3 className="font-bold text-4xl">{service.title}</h3>
                    <h3 className="leading-8 font-normal text-sm">
                      {service.description}
                    </h3>
                    <span className="flex gap-1.5 items-center text-base md:text-xl">
                      <Clock size={20} />
                      <p>{service.time}</p>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="fourth">
          <div className="my-4 py-8">
            <JourneyPlanner />
          </div>
        </section>

        <section
          style={{
            background: "rgb(33, 33, 33)",
          }}
          className="py-16 md:py-20"
          id="fifth"
        >
          {/* Header with Better Spacing */}
          <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div className="space-y-3">
                <h2 className="text-white text-3xl md:text-4xl font-bold capitalize leading-tight">
                  Revisit Recent Messages
                </h2>
                <p className="text-gray-300 text-base md:text-lg max-w-md leading-relaxed">
                  Catch Up on God's Word from his servants and remain blessed
                </p>
              </div>

              <a
                href="/sermons"
                className="group inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40 hover:shadow-lg hover:shadow-white/10 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent text-white self-start"
              >
                <span className="text-sm font-medium capitalize transition-colors duration-300 group-hover:text-white/90">
                  view more
                </span>
                <ChevronRight
                  size={20}
                  className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110"
                />
              </a>
            </div>

            {/* Grid with Enhanced Spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {mostRecentSermons.map((sermon, index) => (
                <SermonComponent key={index} sermon={sermon} />
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&h=1080&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {homepage.testimonialsSection.testimonials.map(
                (testimonial, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20"
                  >
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                      <Quote className="w-4 h-4 text-white" />
                    </div>

                    <div className="space-y-6">
                      <p className="text-white/90 text-base leading-relaxed font-light">
                        "{testimonial.text}"
                      </p>

                      <div className="flex items-center gap-4 pt-4 border-t border-white/20">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center group-hover:from-white/40 group-hover:to-white/20 transition-all duration-300">
                          <span className="text-white font-semibold text-sm">
                            {testimonial.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-base">
                            {testimonial.name}
                          </h4>
                          <p className="text-white/60 text-sm">
                            {testimonial.position}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/20 rounded-br-lg opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
                  </div>
                )
              )}
            </div>

            <div className="text-center mt-16 lg:mt-20">
              <div className="inline-flex items-center justify-center gap-4 mb-8">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/40" />
                <div className="w-2 h-2 rounded-full bg-white/60" />
                <div className="w-24 h-px bg-white/40" />
                <div className="w-2 h-2 rounded-full bg-white/60" />
                <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/40" />
              </div>

              <p className="text-white/60 text-sm italic">
                "Let the redeemed of the Lord tell their story" - Psalm 107:2
              </p>
            </div>
          </div>
        </section>

        <section id="seventh">
          <div>
            <span className="flex flex-col gap-4 lg:gap-0 lg:flex-row lg:px-6 lg:w-[70%] mx-auto items-center py-24.5 px-4.5">
              <h2 className="text-[#1A202C] lg:basis-1/2 font-bold capitalize text-3xl md:text-4xl lg:text-6xl leading-16 text-center lg:text-left ">
                {homepage.ctaSection.title}
              </h2>
              <div className="flex flex-col gap-3 justify-start lg:basis-1/2">
                <h4 className="leading-8 text-base text-[#1A202C]   text-center lg:text-left ">
                  {homepage.ctaSection.description}
                </h4>

                <span className="flex gap-4 mt-4">
                  <Link
                    href={homepage.ctaSection.primaryButton.link}
                    className="text-white bg-black px-4 py-2.5 text-base md:text-lg rounded capitalize transition duration-200 hover:bg-black/80 hover:scale-105"
                  >
                    {homepage.ctaSection.primaryButton.text}
                  </Link>

                  <Link
                    href={homepage.ctaSection.secondaryButton.link}
                    className="text-black border border-black px-4 py-2.5 text-base md:text-lg capitalize rounded transition duration-200 hover:bg-black hover:text-white"
                  >
                    {homepage.ctaSection.secondaryButton.text}
                  </Link>
                </span>
              </div>
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
