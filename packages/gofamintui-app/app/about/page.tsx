import { AboutPage } from "@/sanity/interfaces/aboutPage";
import { aboutPageQuery } from "@/sanity/queries/aboutPage";
import { aboutPageMetadataQuery } from "@/sanity/queries/aboutPageMetaData";
import { Metadata } from "next";
import { urlFor } from "@/sanity/sanityClient";
import Image from "next/image";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { SanityImage } from "@/sanity/interfaces/sanityImage";
import UnderConstructionPage from "@/components/underConstructionPage";

/**
 * The more you go through this page the more that you can tell that it came from a hardcoded place, walahi!!
 * No inspiration and when I asked, tumex was like just do something, anuthing I did was nice
 *
 * --- <OluwaBrimz/>
 */

const HeroSection = ({
  title,
  subtitle,
  backgroundImage,
}: {
  title: string;
  subtitle: string;
  backgroundImage: SanityImage;
}) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-12 bg-black/60 " />

      <div className="absolute inset-0 z-0 md:hidden">
        <Image
          src={urlFor(backgroundImage).width(1080).height(1920).url()}
          alt=""
          fill
          className="object-cover object-top"
          priority
        />
        {/* Stronger overlay for mobile readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Desktop: Pill-shaped layout (hidden on mobile) looked good to me whe I was doing it sha, wanted a different vibe */}
      <div className="absolute inset-0 z-0 bg-gray-900 hidden md:block">
        {/* Large pill-shaped image container - Left side */}
        <div className="absolute left-0 top-0 bottom-0 w-3/5 lg:w-2/3 z-[1]">
          <div className="relative h-full rounded-r-[150px] lg:rounded-r-[200px] overflow-hidden shadow-2xl">
            <Image
              src={urlFor(backgroundImage).width(1920).height(1080).url()}
              alt=""
              fill
              className="object-cover"
              priority
            />
            {/* Subtle overlay for desktop */}
            <div className="absolute inset-0 bg-black/30" />
          </div>
        </div>

        {/* Right side background gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-2/5 lg:w-1/3 bg-gradient-to-r from-gray-900/0 via-gray-900/80 to-gray-900 z-[1]" />
      </div>

      <div className="container mx-auto px-4 z-10 relative">
        <div className="w-full md:ml-auto md:max-w-2xl">
          <div className="text-center md:text-left md:ml-8 lg:ml-16 xl:ml-32">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg">
              {title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 drop-shadow-md max-w-lg mx-auto md:mx-0">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 top-1/2 transform -translate-y-1/2 w-px h-32 bg-white/20 z-[2] hidden lg:block" />
    </section>
  );
};

const ImageTextSection = ({
  sections,
}: {
  sections: AboutPage["imageTextSections"];
}) => (
  <section className="bg-white">
    {sections.map((section, index) => {
      const isImageLeft = section.imagePosition === "left";

      return (
        <div key={index} className="py-20 md:py-28">
          <div className="container mx-auto px-6 md:px-8 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center">
              {/* Image Column - Always controlled positioning, didn't want to manually alternate, you can do this in the sanity schema */}
              <div
                className={`${isImageLeft ? "md:order-1" : "md:order-2"} w-full`}
              >
                <div className="group">
                  <div className="relative w-full aspect-[16/10] overflow-hidden shadow-lg">
                    <Image
                      src={urlFor(section.image).width(1200).height(750).url()}
                      alt={section.image.alt || "Conference Image"}
                      fill
                      className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0}
                    />
                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent group-hover:from-black/10 transition-all duration-500" />
                  </div>
                </div>
              </div>

              {/* Content Column - Controlled spacing and alignment */}
              <div
                className={`${isImageLeft ? "md:order-2" : "md:order-1"} w-full flex flex-col justify-center space-y-6`}
              >
                {/* Conference indicator with consistent spacing */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-px bg-blue-400 flex-shrink-0"></div>
                  <span className="text-sm font-medium text-blue-400 tracking-widest uppercase whitespace-nowrap">
                    Conference {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Title with consistent sizing */}
                {section.title && (
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-black leading-tight tracking-tight">
                    {section.title}
                  </h2>
                )}

                {/* Subtitle with proper spacing */}
                {section.subtitle && (
                  <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed">
                    {section.subtitle}
                  </p>
                )}

                {/* Content with controlled line height and spacing */}
                <div className="prose prose-base max-w-none">
                  <div className="text-black leading-relaxed text-sm md:text-base font-light space-y-4">
                    {/* Handle content as paragraphs if it contains line breaks */}
                    {section.content.split("\n\n").map((paragraph, pIndex) => (
                      <p key={pIndex} className="mb-4 last:mb-0">
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clean section divider, devil is in the details, clean but you don't notice */}
          {index < sections.length - 1 && (
            <div className="container mx-auto px-6 md:px-8 max-w-7xl mt-20 md:mt-28">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>
          )}
        </div>
      );
    })}
  </section>
);

export async function generateMetadata(): Promise<Metadata> {
  const dynamicMetaData = await sanityFetchWrapper<AboutPage>(
    aboutPageMetadataQuery,
    {},
    ["aboutPage", "whatsappContactWidget", "footer"]
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
      },
    ],
    creator: "Bolarinwa Paul Ayomide (https://github.com/TLTechbender)",
    publisher: "Gofamint Students' Fellowship UI",
    category: "Chruch",
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
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
    },
    other: {
      "theme-color": "#ffffff",
      "color-scheme": "light",
    },
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_SITE_URL}/about`),
  };
}

export default async function About() {
  const aboutPage = await sanityFetchWrapper<AboutPage>(aboutPageQuery, {}, [
    "aboutPage",
    "whatsappContactWidget",
    "footer",
  ]);

  if (!aboutPage || Object.keys(aboutPage).length === 0) {
    return <UnderConstructionPage />;
  }

  return (
    <main className="overflow-hidden ">
      <HeroSection
        title={aboutPage.heroSection.title}
        subtitle={aboutPage.heroSection.subtitle}
        backgroundImage={aboutPage.heroSection.backgroundImage}
      />

      <section className="relative h-[40vh] shadow-2xl bg-gray-200 flex flex-col justify-center items-start overflow-hidden">
        <div className="flex flex-col gap-8 justify-center items-start max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-px bg-blue-400"></div>
            <h3 className="text-blue-400 text-sm lg:text-base font-medium tracking-widest uppercase">
              {aboutPage.establishedSection.yearLabel}
            </h3>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-black leading-tight max-w-5xl">
            {aboutPage.establishedSection.title}
          </h1>
        </div>
      </section>

      <section className="bg-[#f4f4f4] relative min-h-[40vh] py-20 flex flex-col justify-center items-start overflow-hidden">
        <div className="flex flex-col gap-8 justify-center items-start max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-px bg-blue-400"></div>
            <h3 className="text-blue-400 text-sm lg:text-base font-medium tracking-widest uppercase">
              {aboutPage.whoWeAreSection.label}
            </h3>
          </div>

          <h1 className="text-black text-2xl md:text-3xl font-light leading-tight max-w-5xl">
            {aboutPage.whoWeAreSection.content}
          </h1>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="mb-16 md:mb-20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-px bg-blue-400"></div>
            <p className="text-sm font-medium text-blue-400 uppercase tracking-wider">
              {aboutPage.beliefsSection.sectionLabel}
            </p>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black leading-tight">
            {aboutPage.beliefsSection.title}
          </h1>
        </div>

        {/* Our Convictions Section */}
        <div className="mb-20 md:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-2xl md:text-3xl font-light text-black mb-8 lg:mb-0">
                {aboutPage.beliefsSection.convictionsTitle}
              </h2>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <ul className="space-y-4">
                  {aboutPage.beliefsSection.convictions
                    .slice(0, 4)
                    .map((conviction, index) => (
                      <li
                        key={index}
                        className="text-black leading-relaxed flex items-start"
                      >
                        <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 mr-4 flex-shrink-0"></span>
                        <span>{conviction}</span>
                      </li>
                    ))}
                </ul>
              </div>

              <div>
                <ul className="space-y-4">
                  {aboutPage.beliefsSection.convictions
                    .slice(4)
                    .map((conviction, index) => (
                      <li
                        key={index}
                        className="text-black leading-relaxed flex items-start"
                      >
                        <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 mr-4 flex-shrink-0"></span>
                        <span>{conviction}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent mb-20 md:mb-24"></div>

        {/* Affirmation of Faith Section */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-6 h-px bg-blue-400"></div>
                <span className="text-xs font-medium text-blue-400 uppercase tracking-widest">
                  {aboutPage.beliefsSection.faithLabel}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-black mb-8 lg:mb-0">
                {aboutPage.beliefsSection.faithTitle}
              </h2>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <ul className="space-y-6">
                  {aboutPage.beliefsSection.faithPoints
                    .slice(0, 5)
                    .map((point, index) => (
                      <li
                        key={index}
                        className="text-black leading-relaxed flex items-start"
                      >
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-400 text-white text-xs font-medium rounded-full mr-4 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                </ul>
              </div>

              <div>
                <ul className="space-y-6">
                  {aboutPage.beliefsSection.faithPoints
                    .slice(5)
                    .map((point, index) => (
                      <li
                        key={index}
                        className="text-black leading-relaxed flex items-start"
                      >
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-400 text-white text-xs font-medium rounded-full mr-4 mt-0.5 flex-shrink-0">
                          {index + 6}
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/**
       *
       * Hard coded this part in cos I could think of no other way to do it, it's an about page and I was give no directions bro
       * so I was like fuck it, I'ma hard code this and mention in the sanity schema
       */}
      <section className="bg-[#f4f4f4] py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Events & Conferences
              </span>
              <div className="w-8 h-px bg-blue-400"></div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-black leading-tight tracking-tight mb-6">
              Our Notable Events
            </h2>
            <p className="text-lg md:text-xl text-black font-light leading-relaxed max-w-3xl mx-auto">
              {` Discover the transformative conferences and gatherings that define
              our fellowship's journey throughout the years.`}
            </p>
          </div>
        </div>
      </section>

      <ImageTextSection sections={aboutPage.imageTextSections} />
    </main>
  );
}
