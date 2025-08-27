import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

//SSG for live for this page

export const metadata: Metadata = {
  title: "Become an Author | GSF UI Blog - Share Your Faith-Inspired Voice",
  description:
    "Join GSF UI Blog as a faith-driven writer. Share inspiring content that touches hearts and transforms lives. Apply to become part of our community of Christian authors and bloggers.",
  keywords: [
    "GSF UI Blog",
    "Christian author",
    "faith writer",
    "gospel writer",
    "Christian blog author",
    "faith-based content",
    "spiritual writing",
    "Gofamint Students Fellowship",
    "University of Ibadan",
    "Christian blogging platform",
    "gospel publishing",
    "faith community writer",
    "inspirational writing",
    "biblical content creation",
  ].join(", "),

  authors: [
    {
      name: "Gofamint Students' Fellowship UI Chapter",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    },
  ],
  creator: "Bolarinwa Paul Ayomide (https://github.com/TLTechbender)",
  publisher: "Gofamint Students' Fellowship UI",
  category: "Publishing",

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
    title: "Become an Author | GSF UI Blog - Share Your Faith-Inspired Voice",
    description:
      "Join our community of faith-driven writers and share inspiring content that touches hearts and transforms lives. Apply to become a Christian author with GSF UI Blog.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/publishing`,
    siteName: "GSF UI Blog",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/publishing1.jpg`,
        width: 1200,
        height: 630,
        alt: "GSF UI Blog - Become a Faith-Inspired Author and Writer",
        type: "image/jpeg",
      },
    ],
    locale: "en_NG",
    type: "website",
    countryName: "Nigeria",
  },

  twitter: {
    card: "summary_large_image",
    title: "Become an Author | GSF UI Blog - Share Your Faith-Inspired Voice",
    description:
      "Join our community of faith-driven writers. Share inspiring content that touches hearts and transforms lives through the power of God's word.",
    site: "@gofamintui",
    creator: "@gofamintui",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/publishing2.jpg`,
        alt: "GSF UI Blog - Become a Faith-Inspired Author",
      },
    ],
  },

  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/publishing`,
  },

  other: {
    "theme-color": "#3b82f6",
    "color-scheme": "light",
  },

  metadataBase: new URL(`${process.env.NEXT_PUBLIC_SITE_URL}`),
};

//SSG by default Jhoor
export default function PulishingLandingPage() {
  return (
    <>
      <div className="bg-black h-16 mb-2 w-full flex-shrink-0" />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-8 md:py-32 overflow-hidden">
          <div className="container mx-auto px-6 md:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
              {/* Left Content */}
              <div className="space-y-12">
                <div className="space-y-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-px bg-blue-400"></div>
                    <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                      Join Our Platform
                    </span>
                    <div className="w-12 h-px bg-blue-400"></div>
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-black leading-tight tracking-tight">
                    Share Your Voice on as inspired by the Holg Spirit
                    <br />
                    <span className="text-blue-500 font-medium">
                      GSF UI Blog
                    </span>
                  </h1>

                  <p className="text-xl md:text-2xl text-black font-light leading-relaxed">
                    Join our community of faith-driven writers and share
                    inspiring content that touches hearts and transforms lives.
                  </p>
                </div>

                {/* Key Benefits */}
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-black">
                        Reach a audience of people who are journeying in faith
                      </h3>
                      <p className="text-gray-600 font-light">
                        Connect with readers worldwide who seek meaningful,
                        faith-based content
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-black">
                        Easy Publishing Tools
                      </h3>
                      <p className="text-gray-600 font-light">
                        Simple, intuitive platform designed for writers, not
                        tech experts
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-black">
                        Supportive Community
                      </h3>
                      <p className="text-gray-600 font-light">
                        Join fellow believers who encourage and inspire one
                        another
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div>
                  <p className="text-black text-base leading-sm tracking-wide font-normal mb-4 captialize">
                    Want to want to serve in this vineyard?
                  </p>
                  <Link
                    href={`/publishing/author/apply`}
                    className="inline-flex items-center space-x-3 bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 px-8 transition-all duration-300 group hover:shadow-lg transform hover:-translate-y-1"
                  >
                    <p>Start Your Application</p>
                    <ArrowRight
                      size={24}
                      className="transition-all duration-300 group-hover:translate-x-2"
                    />
                  </Link>
                </div>
              </div>

              {/* Right Content - Publishing Visual, walahi I had a small idea, I describe am give claude, the werery cook this shock me sef, so sexy on desktop */}
              <div className="relative">
                <div className="relative bg-gradient-to-br from-blue-50 to-white p-8 md:p-12 shadow-2xl">
                  {/* Mock Publishing Interface */}
                  <div className="space-y-6">
                    {/* Header Bar */}
                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="ml-4 text-sm text-gray-500 font-medium">
                        GSF UI Blog Editor
                      </span>
                    </div>

                    {/* Editor Content */}
                    <div className="space-y-4">
                      <input
                        type="text"
                        value="Walking in Faith: A Journey of Trust"
                        readOnly
                        className="w-full text-2xl font-bold text-black bg-transparent border-none outline-none"
                      />

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>📝 Draft</span>
                        <span>👤 Author</span>
                        <span>📅 Today</span>
                      </div>

                      <div className="space-y-3">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>

                      <div className="bg-blue-50 p-4 border-l-4 border-blue-400">
                        <p className="text-sm text-blue-800 italic">
                          {` "Trust in the Lord with all your heart and lean not on
                          your own understanding..."`}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <button className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded">
                          Save Draft
                        </button>
                        <button className="text-xs bg-blue-500 text-white px-3 py-1 rounded">
                          Publish
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        Word count: 1,247
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-400 opacity-20"></div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-300 opacity-15"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Biblical Inspiration Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-6 md:px-8 max-w-4xl">
            <div className="text-center space-y-12">
              <div className="space-y-8">
                <blockquote className="text-2xl md:text-3xl text-black italic font-light leading-relaxed border-l-4 border-blue-400 pl-8">
                  {`"How beautiful on the mountains are the feet of those who
                  bring good news, who proclaim peace, who bring good tidings,
                  who proclaim salvation, who say to Zion, 'Your God reigns!'"`}
                </blockquote>
                <p className="text-sm text-blue-500 font-medium tracking-wide uppercase">
                  Isaiah 52:7
                </p>
              </div>

              <div className="pt-12 border-t border-gray-200">
                <blockquote className="text-2xl md:text-3xl text-black italic font-light leading-relaxed border-l-4 border-blue-400 pl-8">
                  {` "Go into all the world and preach the gospel to all creation."`}
                </blockquote>
                <p className="text-sm text-blue-500 font-medium tracking-wide uppercase mt-6">
                  Mark 16:15
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 md:px-8 max-w-3xl text-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-light text-black leading-tight">
                Ready to be a messenger of
                <span className="text-blue-500"> hope and truth</span>?
              </h2>

              <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
                {` Join our community of writers who are passionate about sharing
                God's love through powerful, inspiring content that makes a
                difference.`}
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
