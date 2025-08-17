import { Metadata } from "next";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Events Calendar | GSF UI";
  const description =
    "Stay updated with upcoming, current, and past events at Gofamint Students' Fellowship, University of Ibadan. Join our vibrant community for spiritual growth, fellowship, and inspiring gatherings.";
  const keywords = [
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
        url: "https://gofamintui.org",
      },
    ],
    creator: "Bolarinwa Paul Ayomide (https://github.com/TLTechbender)",
    publisher: "Gofamint Students' Fellowship UI",
    category: "Events",
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
      url: "https://gofamintui.org/events",
      siteName: "GSF UI",
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
    },
    alternates: {
      canonical: "https://gofamintui.org/events",
    },
    other: {
      "theme-color": "#4169E1",
      "color-scheme": "light",
    },
    metadataBase: new URL("https://gofamintui.org"),
  };
}

const DynamicFellowshipCalendar = dynamic(
  () => import("@/components/calendarComponent"),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-white p-8">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-lg text-black font-light">
            Loading Events Calendar...
          </p>
        </div>
      </div>
    ),
  }
);

const EventsHero = () => (
  <section className="relative bg-[#f4f4f4] pt-24 pb-16 md:pt-32 md:pb-20">
    {/* Navigation spacer for absolute nav */}
    <div className="absolute top-0 left-0 right-0 h-16 bg-gray-800"></div>

    <div className="container mx-auto px-6 md:px-8 max-w-6xl relative">
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
            <h3 className="text-gray-900 font-medium mb-2">Upcoming Events</h3>
            <p className="text-gray-600 text-sm font-light">
              Weekly services, conferences, and special gatherings
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-sm font-semibold">⏰</span>
            </div>
            <h3 className="text-gray-900 font-medium mb-2">Event Schedules</h3>
            <p className="text-gray-600 text-sm font-light">
              Detailed timing and location information
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-sm font-semibold">🎯</span>
            </div>
            <h3 className="text-gray-900 font-medium mb-2">Never Miss Out</h3>
            <p className="text-gray-600 text-sm font-light">Stay up to date</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const EventsOutro = () => (
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
);

export default async function Events() {
  return (
    <main className="overflow-hidden">
      <EventsHero />
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 uppercase tracking-wider">
                Interactive Calendar
              </span>
              <div className="w-8 h-px bg-blue-400"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-black mb-4">
              Plan Your Fellowship Journey
            </h2>
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <DynamicFellowshipCalendar />
            </div>
          </Suspense>
        </div>
      </section>
      <EventsOutro />

      {/* Calendar Section */}
    </main>
  );
}
