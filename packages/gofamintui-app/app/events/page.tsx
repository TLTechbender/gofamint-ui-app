import { Metadata } from "next";
import React, { Suspense } from "react";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { FellowshipEventsSeo } from "@/sanity/interfaces/fellowshipEvent";
import { fellowshipEventPageMetadataQuery } from "@/sanity/queries/fellowshipEventMetadata";
import DynamicFellowshpCalendar from "@/components/events/dynamicFellowshipCalendar";
export const dynamic = "force-dynamic";
//Deciding to hardcode the meta data this cos why not, To me it would feel too extra to put this
export async function generateMetadata(): Promise<Metadata> {
  const dynamicMetaData = await sanityFetchWrapper<FellowshipEventsSeo>(
    fellowshipEventPageMetadataQuery,
    {},
    [
      "fellowshipEvent",
      "whatsappContactWidget",
      "footer",
      "fellowshipEventMetadata",
    ]
  );

  const optimizedImageUrl = dynamicMetaData?.seo.ogImage?.asset?.url
    ? `${dynamicMetaData.seo.ogImage.asset.url}?w=1200&h=630&fit=crop&auto=format`
    : null;
  const title = dynamicMetaData?.seo.title || "Events Calendar | GSF UI";
  const description =
    dynamicMetaData.seo.description ||
    "Stay updated with upcoming, current, and past events at Gofamint Students' Fellowship, University of Ibadan. Join our vibrant community for spiritual growth, fellowship, and inspiring gatherings.";
  const keywords = dynamicMetaData?.seo.keywords || [
    "GSF UI events",
    "Gofamint Students Fellowship events",
    "University of Ibadan student events",
    "student fellowship calendar",
    "upcoming events",
    "spiritual gatherings",
    "student ministry",
    "fellowship activities",
    "Christian student events",
    "campus ministry",
    "student community",
    "faith-based events",
  ];

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
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/events`,
      siteName: "GSF UI",
      locale: "en_NG",
      type: "website",
      countryName: "Nigeria",

      images: optimizedImageUrl
        ? [
            {
              url: optimizedImageUrl,
              width: 1200,
              height: 630,
              alt: dynamicMetaData?.seo.ogImage?.alt || title,
              type: "image/jpeg",
            },
          ]
        : [],
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
              alt: dynamicMetaData?.seo.ogImage?.alt || title,
            },
          ]
        : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/events`,
    },
    other: {
      "theme-color": "#4169E1",
      "color-scheme": "light",
    },
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_SITE_URL}/events`),
  };
}

/**
 * Was this dynamic import necessary? No
 * Should I have done it? 50 | 50
 * Did I do it?  Yessssss
 *
 * -<OluwaBrimz/>
 */


export default async function Events() {
 

  return (
    <main className="overflow-hidden">
      <section className="relative bg-[#f4f4f4] ">
        <div className="bg-black h-18 mb-2 w-full flex-shrink-0" />
        <div className="container mx-auto px-6 py-10 md:px-8 max-w-6xl relative">
          <div className="text-center">
            {/* Section Label */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-px bg-blue-600"></div>
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                Stay Connected
              </span>
              <div className="w-8 h-px bg-blue-600"></div>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
              Events Calendar
            </h1>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-sm font-semibold">📅</span>
                </div>
                <h3 className="text-gray-900 font-medium mb-2">
                  Upcoming Events
                </h3>
                <p className="text-gray-600 text-sm font-light">
                  Weekly services, conferences, and special gatherings
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-sm font-semibold">⏰</span>
                </div>
                <h3 className="text-gray-900 font-medium mb-2">
                  Event Schedules
                </h3>
                <p className="text-gray-600 text-sm font-light">
                  Detailed timing and location information
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-sm font-semibold">🎯</span>
                </div>
                <h3 className="text-gray-900 font-medium mb-2">
                  Never Miss Out
                </h3>
                <p className="text-gray-600 text-sm font-light">
                  Stay up to date
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 uppercase tracking-wider">
                GSF UI Calendar
              </span>
              <div className="w-8 h-px bg-blue-400"></div>
            </div>

            <p className="text-gray-600 font-light max-w-2xl mx-auto">
              Browse upcoming events, mark your calendar, and be part of our
              growing community
            </p>
          </div>

          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-white rounded-xl shadow-sm p-8">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <p className="text-lg text-black font-light">
                    Preparing Events Calendar...
                  </p>
                </div>
              </div>
            }
          >
            {/**
             * Not gonna lie, I'm proud of how I was able to implement this fellowship calendar bro
             */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <DynamicFellowshpCalendar />
            </div>
          </Suspense>
        </div>
      </section>
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-6 h-px bg-blue-400"></div>
                <span className="text-xs font-medium text-blue-400 uppercase tracking-widest">
                  Fellowship Life
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-light text-black mb-6 leading-tight">
                Experience Community Like Never Before
              </h2>

              <p className="text-black mb-6 leading-relaxed font-light">
                {` Our events are more than gatherings—they're opportunities for
            spiritual growth, meaningful relationships, and discovering God's
            purpose for your life on campus.`}
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 mr-4 flex-shrink-0"></span>
                  <span className="text-black font-light">
                    Weekly worship services and Bible study
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 mr-4 flex-shrink-0"></span>
                  <span className="text-black font-light">
                    Annual conferences and special gatherings
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 mr-4 flex-shrink-0"></span>
                  <span className="text-black font-light">
                    Community outreach and service projects
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 mr-4 flex-shrink-0"></span>
                  <span className="text-black font-light">
                    Social events and fellowship activities
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
