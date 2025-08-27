import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { urlFor } from "@/sanity/sanityClient";
import { BlogPost } from "@/sanity/interfaces/blog";
import { SearchInput } from "./blogsClient/searchInput";
import BlogsPageClient from "./blogsClient/blogsPageClient";
import { getMostRecentBlogPostQuery } from "@/sanity/queries/mostRecentblogpost";
import { blogsPageMetadataAndHeroQuery } from "@/sanity/queries/blogsPageMetaDataAndHero";
import { Metadata } from "next";
import { BlogsPageMetadataAndHero } from "@/sanity/interfaces/blogsPageMetadataAndHero";

export async function generateMetadata(): Promise<Metadata> {
  const dynamicMetaData = await sanityFetchWrapper<BlogsPageMetadataAndHero>(
    blogsPageMetadataAndHeroQuery,
    {},
    ["blogsPage"]
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

const BlogsPageSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search skeleton */}
      <div className="mb-8">
        <div className="max-w-md mx-auto">
          <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6 mx-auto w-full max-w-6xl">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="aspect-[16/9] bg-gray-200 animate-pulse"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default async function BlogsPage() {
  const blogsPageDataForHeroSection =
    await sanityFetchWrapper<BlogsPageMetadataAndHero>(
      blogsPageMetadataAndHeroQuery,
      {},
      ["blogsPage"]
    );

  const latestPost = await sanityFetchWrapper<BlogPost>(
    getMostRecentBlogPostQuery,
    {},
    ["blogsPage"]
  );

  return (
    <>
      <main className="bg-white">
        {/* Compact Hero Section with Enhanced Featured Post */}

        <section className="relative min-h-[60vh] h-full max-h-[100vh] flex items-center overflow-hidden">
          <div className="bg-black h-16 mb-2 w-full flex-shrink-0 absolute top-0 z-10" />

          {/* Background Image with Clean Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src={urlFor(
                blogsPageDataForHeroSection.heroSection.backgroundImage.asset
              )
                .quality(80)
                .width(1920)
                .height(1080)
                .url()}
              alt={`${blogsPageDataForHeroSection.heroSection.backgroundImage.alt || `background page hero image`}`}
              fill
              className="object-cover absolute inset-0 z-0"
              priority
            />
            {/* Clean overlay for text readability */}
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Hero Content - Clean Layout */}
          <div className="relative z-10 w-full py-16 md:py-20">
            <div className="container mx-auto px-6 md:px-8 max-w-6xl">
              <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-center">
                {/* Left side - Main title */}
                <div className="md:col-span-6 space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-px bg-blue-400"></div>
                    <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                      {blogsPageDataForHeroSection.heroSection.title}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight tracking-tight">
                    {blogsPageDataForHeroSection.heroSection.subtitle}
                  </h1>
                </div>

                {/* Right side - Clean Featured post */}
                {latestPost && (
                  <div className="md:col-span-6">
                    <Link
                      href={`/blog/${latestPost.slug.current}`}
                      className="group block"
                    >
                      <div className="bg-white p-8 md:p-10 transition-all duration-300 hover:shadow-lg">
                        {/* Featured badge - Clean version */}
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-6 h-px bg-blue-400"></div>
                          <span className="text-xs font-medium text-blue-400 tracking-widest uppercase">
                            Latest Article
                          </span>
                        </div>

                        {/* Title - Clean typography */}
                        <h3 className="text-xl md:text-2xl font-light text-black group-hover:text-blue-500 transition-colors duration-300 mb-4 leading-tight line-clamp-2">
                          {latestPost.title}
                        </h3>

                        {/* Excerpt - Clean styling */}
                        <p className="text-black font-light text-base leading-relaxed line-clamp-3 mb-6">
                          {latestPost.excerpt}
                        </p>

                        {/* Meta info - Minimalist */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-400 flex items-center justify-center">
                              <span className="text-xs font-medium text-white">
                                {latestPost.author.firstName.charAt(0)}
                                {latestPost.author.lastName.charAt(0)}
                              </span>
                            </div>
                            <span className="text-gray-600 text-sm font-light">
                              {latestPost.author.firstName}{" "}
                              {latestPost.author.lastName}
                            </span>
                          </div>
                          <span className="text-blue-400 text-sm font-medium">
                            {latestPost.readingTime} min read
                          </span>
                        </div>

                        {/* Clean hover indicator */}
                        <div className="flex items-center justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-sm font-medium text-blue-400 mr-2">
                            Read Article
                          </span>
                          <ArrowRight size={16} className="text-blue-400" />
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* Main Content Container */}
        <div className="flex flex-col ">
          {/* Search & Filter Section - Sticky */}
          <section className="sticky top-0 z-20 bg-white py-6 md:py-8 border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-6 md:px-8 max-w-6xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-light text-black mb-2">
                    Articles
                  </h2>
                </div>

                {/* Static Search Bar - For demo purposes */}
                <div className="relative max-w-md w-full">
                  <SearchInput />
                </div>
              </div>
            </div>
          </section>

          {/* Blog Posts Grid - Scrollable Container */}
          <>
            <section className="flex-1 bg-white h-screen overflow-y-scroll">
              <Suspense fallback={<BlogsPageSkeleton />}>
                <BlogsPageClient />
              </Suspense>
            </section>
          </>
        </div>
      </main>
    </>
  );
}
