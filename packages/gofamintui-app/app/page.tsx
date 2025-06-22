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
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section id="hero" className="relative">
        {/* Background with parallax effect */}
        <div
          className="fixed inset-0 bg-center bg-cover bg-no-repeat -z-10"
          style={{
            backgroundImage: `url(${urlFor(
              homepage.heroSection.backgroundImage as any
            )
              .width(1920)
              .height(1080)
              .format("webp")
              .quality(95)
              .url()})`,
            transform: "translate3d(0,0,0)", // Enables GPU acceleration
          }}
        ></div>

        {/* Gradient overlay with animated particles */}
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

        {/* Content container with glass morphism effect */}
        <div className="relative min-h-[80vh] flex items-center justify-start px-4">
          <div className="relative z-10 w-full max-w-3xl p-8 md:p-12 lg:p-20 shadow-2xl animate-fade-in">
            <div className="text-center md:text-left space-y-8">
              {/* Animated title with gradient text */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white animate-text-shine">
                {homepage.heroSection.title}
              </h1>

              {/* Subtitle with subtle animation */}
              <h3
                className="text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto md:mx-0 leading-relaxed animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                {homepage.heroSection.subtitle}
              </h3>

              {/* Buttons with interactive effects */}
              <div
                className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start animate-slide-up"
                style={{ animationDelay: "0.4s" }}
              >
                <Link
                  href={homepage.heroSection.primaryButton.link}
                  className="relative px-10 py-3 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group overflow-hidden"
                >
                  <span className="relative z-10">
                    {homepage.heroSection.primaryButton.text}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                </Link>

                <Link
                  href={homepage.heroSection.secondaryButton.link}
                  className="relative px-10 py-3 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-black transition-all duration-300 group overflow-hidden"
                >
                  <span className="relative z-10">
                    {homepage.heroSection.secondaryButton.text}
                  </span>
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section id="welcome" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl animate-fade-in">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:basis-1/2 animate-slide-right">
              <h2 className="text-gray-900 font-bold text-4xl lg:text-5xl leading-tight mb-6">
                {homepage.welcomeSection.title}
              </h2>
            </div>
            <div className="lg:basis-1/2 animate-slide-left">
              <p className="text-lg text-gray-700 leading-relaxed">
                {homepage.welcomeSection.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-gray-900 py-20">
        <div className="container mx-auto px-4 animate-fade-in">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16">
              <div className="mb-6 md:mb-0">
                <h2 className="text-white text-4xl lg:text-5xl font-bold mb-4">
                  {homepage.servicesSection.title}
                </h2>
                <p className="text-gray-300 text-lg">
                  {homepage.servicesSection.subtitle}
                </p>
              </div>
              <div className="flex items-center gap-2 text-white">
                <LocationEditIcon size={24} className="text-orange-500" />
                <span>{homepage.servicesSection.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {homepage.servicesSection.services.map((service, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={urlFor(service.posterImage as any)
                        .width(600)
                        .height(400)
                        .format("webp")
                        .quality(95)
                        .url()}
                      alt={service.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-white text-2xl font-bold mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-300 mb-4">{service.description}</p>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={20} />
                      <span>{service.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Journey Planner Section */}
      <section id="journey-planner" className="py-20 bg-white">
        <div className="container mx-auto px-4 animate-fade-in">
          <JourneyPlanner />
        </div>
      </section>

      {/* Sermons Section */}
      <section id="sermons" className="bg-gray-900 py-20">
        <div className="container mx-auto px-4 animate-fade-in">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16">
              <div className="mb-6 md:mb-0">
                <h2 className="text-white text-4xl lg:text-5xl font-bold mb-4">
                  Revisit Recent Messages
                </h2>
                <p className="text-gray-300 text-lg">
                  Catch Up on God's Word from his servants and remain blessed
                </p>
              </div>
              <Link
                href="/sermons"
                className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
              >
                <span>View More</span>
                <ChevronRight size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mostRecentSermons.map((sermon, index) => (
                <SermonComponent key={index} sermon={sermon} />
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
            backgroundImage:
              "url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&h=1080&fit=crop')",
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    <p className="text-white/90 italic">"{testimonial.text}"</p>
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

      {/* CTA Section */}
      <section id="cta" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl animate-fade-in">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:basis-1/2 animate-slide-right">
              <h2 className="text-gray-900 font-bold text-4xl lg:text-5xl leading-tight mb-6">
                {homepage.ctaSection.title}
              </h2>
            </div>
            <div className="lg:basis-1/2 animate-slide-left">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {homepage.ctaSection.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={homepage.ctaSection.primaryButton.link}
                  className="px-8 py-3.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-300"
                >
                  {homepage.ctaSection.primaryButton.text}
                </Link>
                <Link
                  href={homepage.ctaSection.secondaryButton.link}
                  className="px-8 py-3.5 border-2 border-black text-black rounded-lg font-medium hover:bg-black hover:text-white transition-all duration-300"
                >
                  {homepage.ctaSection.secondaryButton.text}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
