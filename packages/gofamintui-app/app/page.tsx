import Link from "next/link";
import heroImage from "../public/hero-img.jpg";
import message from "../public/message.png";
import {
  ChevronRight,
  Clock,
  LocateIcon,
  LocationEditIcon,
} from "lucide-react";
import Image from "next/image";
import JourneyPlanner from "@/components/journeyPlanner";
import { Homepage } from "@/sanity/interfaces/homePage";
import { homepageQuery } from "@/sanity/queries/homePage";
import { Metadata, ResolvingMetadata } from "next";
import { sanityFetchWrapper } from "@/sanity/sanityFetch";
import { homepageMetadataQuery } from "@/sanity/queries/homePageMetaData";
import { urlFor } from "@/sanity/sanityClient";
import { Sermon, Sermons } from "@/sanity/interfaces/sermonsPage";
import { recentSermonsQuery } from "@/sanity/queries/sermonsPage";
import SermonComponent from "@/components/sermonComponent";

// export const metadata = {
//   title: "GSF UI – Gofamint Students’ Fellowship, University of Ibadan",
//   description:
//     "Official page of the Gofamint Students’ Fellowship (GSF), University of Ibadan chapter. Raising fire-brand saints, promoting academic and spiritual excellence on campus.",
//   keywords: [
//     "GSF UI",
//     "Gofamint Students Fellowship",
//     "Gospel Faith Mission International",
//     "University of Ibadan",
//     "Christian Students UI",
//     "Campus Fellowship Nigeria",
//     "Academic excellence",
//     "Spiritual growth",
//     "Student ministry",
//     "Campus Fellowship Ibadan",
//     "Campus Fellowship UI",
//     "Gofamint in Campus",
//   ],
//   authors: [
//     {
//       name: "Gofamint Students’ Fellowship UI Chapter",
//       url: "https://gofamintui.org",
//     },
//   ],
//   creator: "GSF UI Media Team",
//   openGraph: {
//     title: "GSF UI – Gofamint Students’ Fellowship, University of Ibadan",
//     description:
//       "GSF UI is the official students’ ministry of GOFAMINT at the University of Ibadan. We promote spiritual growth, academic liberation, and impactful Christian living on campus.",
//     url: "https://gofamintui.org",
//     siteName: "GSF UI",
//     images: [
//       {
//         url: "https://gofamintui.org/og-image.jpg",
//         width: 1200,
//         height: 630,
//         alt: "GSF UI Official Banner",
//       },
//     ],
//     locale: "en_NG",
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "GSF UI – Gofamint Students’ Fellowship, University of Ibadan",
//     description:
//       "Experience the academic and spiritual transformation with GSF UI – The student arm of GOFAMINT at the University of Ibadan.",
//     site: "@gofamintui",
//     creator: "@gofamintui",
//     images: ["https://gofamintui.org/og-image.jpg"],
//   },
//   metadataBase: new URL("https://gofamintui.org"),
// };

export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
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

export const dynamic = "force-dynamic";

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
            className="relative min-h-[80vh] bg-fixed bg-center bg-cover flex items-center justify-center md:justify-start"
            style={{
              backgroundImage: `url(${urlFor(
                homepage.heroSection.backgroundImage as any
              )
                .width(1920)
                .height(1080)
                .format("webp")
                .quality(85)
                .url()})`,
            }}
          >
            <div className="absolute inset-0 bg-black/60 z-0"></div>

            <div className="relative z-10 w-full px-4 md:px-6 lg:px-8 flex flex-col gap-3 h-full text-center md:text-left justify-center md:items-start items-center lg:basis-1/2">
              <h1 className="text-white text-3xl md:text-4xl lg:text-6xl font-bold mb-4">
                {homepage.heroSection.title}
              </h1>
              <h3 className="text-white text-xl lg:text-2xl ">
                {homepage.heroSection.subtitle}
              </h3>
              <span className="flex gap-4 mt-4">
                <Link
                  href={homepage.heroSection.primaryButton.link}
                  className="text-black bg-white px-4 py-2.5 text-base md:text-lg rounded capitalize transition duration-200 hover:bg-gray-100 hover:animate-bounce"
                >
                  {homepage.heroSection.primaryButton.text}
                </Link>

                <Link
                  href={homepage.heroSection.secondaryButton.link}
                  className="text-white border border-white px-4 py-2.5  text-base md:text-lg capitalize rounded transition duration-200 hover:bg-white hover:text-black"
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
          <div className="bg-[#212121] py-24 flex flex-col gap-6">
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

            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(320px,450px))] gap-9 mx-auto items-start justify-center w-full px-4 ">
              {homepage.servicesSection.services.map((service, index) => (
                <div
                  key={index}
                  className=" rounded-3xl  flex gap-5  md:flex-col"
                >
                  <picture className="w-full basis-1/2 aspect-[345/202] overflow-hidden rounded-lg">
                    <Image
                      src={urlFor(service.posterImage as any)
                        .width(1920)
                        .height(1080)
                        .format("webp")
                        .quality(85)
                        .url()}
                      width={345}
                      height={220}
                      alt="poster image"
                      className="w-full h-full object-cover"
                    />
                  </picture>
                  <div className="flex flex-col gap-3.5 basis-1/2 text-white">
                    <h3 className="font-bold text-4xl">{service.title}</h3>
                    <h3 className="leading-8 font-normal text-sm">
                      {service.description}
                    </h3>
                    <span className="flex gap-1.5 items-center text-lg md:text-2xl">
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
          <JourneyPlanner />
        </section>

        <section id="fifth">
          <div
            style={{
              background: "rgb(33, 33, 33)",
            }}
          >
            <div className="flex items-center justify-between mx-auto w-full max-w-[1280px] px-4">
              <span className="text-white flex flex-col gap-2">
                <h2 className="text-3xl capitalize font-bold">
                  Revisit Recent Messages
                </h2>
                <h4 className="text-base capitalize">
                  Catch Up on God's Word from his servants and remain blessed
                </h4>
              </span>

              <span className="text-white">
                <Link
                  href={`/sermons`}
                  className="group flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40 hover:shadow-lg hover:shadow-white/10 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
                >
                  <span className="text-sm font-medium capitalize transition-colors duration-300 group-hover:text-white/90">
                    view more
                  </span>
                  <ChevronRight
                    size={20}
                    className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110"
                  />
                </Link>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(350px,400px))] gap-9 mx-auto items-start justify-center w-full px-4">
              {mostRecentSermons &&
                mostRecentSermons.map((message, index) => (
                  <SermonComponent key={index} sermon={message} />
                ))}
            </div>
          </div>
        </section>

        <section id="sixth">
          <div
            className="relative min-h-[80vh] bg-fixed bg-center bg-cover flex items-center justify-center md:justify-start"
            style={{
              background: `url(${urlFor(
                homepage.testimonialsSection.backgroundImage as any
              )
                .width(1920)
                .height(1080)
                .format("jpg")
                .quality(85)
                .url()})`,
            }}
          >
            <div className="absolute inset-0 bg-black/60 z-0"></div>
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-block">
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                  {homepage.testimonialsSection.title}
                </h2>
                <div className="h-1 w-24 bg-white mx-auto mb-6"></div>
                <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                  {homepage.testimonialsSection.subtitle}
                </p>
              </div>
            </div>

            {/* Testimonials Grid */}
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {homepage.testimonialsSection.testimonials.map(
                  (testimonial, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-8 hover:bg-white/10 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-white/10"
                    >
                      {/* Quote icon */}
                      <div className="absolute -top-4 -left-4 text-white/20 text-8xl font-serif leading-none">
                        "
                      </div>

                      {/* Testimonial text */}
                      <div className="relative z-10">
                        <p className="text-white text-lg leading-relaxed mb-6 font-light">
                          {testimonial.text}
                        </p>

                        {/* Name with elegant styling */}
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4 group-hover:bg-white/30 transition-colors duration-300">
                            <span className="text-white font-bold text-lg">
                              {testimonial.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold text-lg">
                              {testimonial.name}
                            </h4>
                            <div className="w-16 h-px bg-white/40 mt-1"></div>
                          </div>
                        </div>
                      </div>

                      {/* Decorative corner elements */}
                      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-lg"></div>
                      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/30 rounded-bl-lg"></div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Bottom decorative element */}
            <div className="text-center mt-20">
              <div className="inline-flex items-center gap-4">
                <div className="w-16 h-px bg-white/40"></div>
                <div className="w-3 h-3 rounded-full bg-white/60"></div>
                <div className="w-24 h-px bg-white/40"></div>
                <div className="w-3 h-3 rounded-full bg-white/60"></div>
                <div className="w-16 h-px bg-white/40"></div>
              </div>
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
