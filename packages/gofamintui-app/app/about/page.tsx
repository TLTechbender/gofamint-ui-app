import { AboutPage } from "@/sanity/interfaces/aboutPage";
import { aboutPageQuery } from "@/sanity/queries/aboutPage";
import { aboutPageMetadataQuery } from "@/sanity/queries/aboutPageMetaData";
import { Metadata } from "next";
import { urlFor } from "@/sanity/sanityClient";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";

// ==========================================
// PORTABLE TEXT COMPONENTS (Tailwind-only version)
// ==========================================

const lightTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset?._ref) return null;

      const imageUrl = urlFor(value)
        .width(800)
        .height(600)
        .fit("max")
        .auto("format")
        .url();

      return (
        <div className="relative w-full h-96 my-8 transition-all duration-300 hover:scale-[1.01]">
          <Image
            src={imageUrl}
            alt={value.alt || "Content image"}
            fill
            className="object-contain rounded-lg shadow-md"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          {value.caption && (
            <p className="text-gray-600 text-sm mt-3 text-center italic transition-opacity duration-300">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="text-gray-900 text-4xl font-bold mb-8 leading-tight transition-all duration-300">
        {children}
      </h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-gray-800 text-3xl font-bold mt-12 mb-6 leading-tight transition-all duration-300">
        {children}
      </h2>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-gray-700 mb-6 leading-relaxed text-lg transition-all duration-300">
        {children}
      </p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="text-gray-700 border-l-4 border-blue-500 pl-6 my-8 bg-gray-50 py-4 rounded-r-lg transition-all duration-300 hover:bg-gray-100">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children?: React.ReactNode;
      value?: any;
    }) => {
      const rel = !value?.href?.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      return (
        <a
          href={value?.href || "#"}
          rel={rel}
          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 font-medium"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc ml-6 mb-6 text-gray-700 space-y-2 transition-all duration-300">
        {children}
      </ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal ml-6 mb-6 text-gray-700 space-y-2 transition-all duration-300">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-gray-700 leading-relaxed transition-all duration-300 hover:pl-1">
        {children}
      </li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-gray-700 leading-relaxed transition-all duration-300 hover:pl-1">
        {children}
      </li>
    ),
  },
};

const darkTextComponents: PortableTextComponents = {
  ...lightTextComponents,
  block: {
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="text-white text-4xl font-bold mb-8 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-white text-3xl font-bold mt-12 mb-6 leading-tight">
        {children}
      </h2>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-gray-100 mb-6 leading-relaxed text-lg">{children}</p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="text-gray-200 border-l-4 border-blue-400 pl-6 my-8 bg-gray-800/50 py-4 rounded-r-lg hover:bg-gray-800/70">
        {children}
      </blockquote>
    ),
  },
  marks: {
    ...lightTextComponents.marks,
    link: ({
      children,
      value,
    }: {
      children?: React.ReactNode;
      value?: any;
    }) => {
      const rel = !value?.href?.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      return (
        <a
          href={value?.href || "#"}
          rel={rel}
          className="text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200 font-medium"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc ml-6 mb-6 text-gray-100 space-y-2">
        {children}
      </ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal ml-6 mb-6 text-gray-100 space-y-2">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-gray-100 leading-relaxed hover:pl-1 transition-all duration-300">
        {children}
      </li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-gray-100 leading-relaxed hover:pl-1 transition-all duration-300">
        {children}
      </li>
    ),
  },
};

const LightPortableText = ({ value }: { value: any }) => (
  <div className="prose prose-lg max-w-none">
    <PortableText value={value} components={lightTextComponents} />
  </div>
);

const DarkPortableText = ({ value }: { value: any }) => (
  <div className="prose prose-lg max-w-none">
    <PortableText value={value} components={darkTextComponents} />
  </div>
);

const ContentSection = ({ sections }: { sections: any[] }) => (
  <>
    {sections.map((section, index) => (
      <div
        key={section.sectionId || index}
        id={section.sectionId}
        className="group bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg"
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-50">
          {section.title && (
            <h3 className="text-xl md:text-2xl font-light text-[#282828] mb-2 group-hover:text-black transition-colors duration-300">
              {section.title}
            </h3>
          )}
          {section.subtitle && (
            <p className="text-sm md:text-base text-gray-600 font-light tracking-wide">
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="prose prose-sm md:prose-base max-w-none prose-gray">
            <PortableText
              value={section.content}
              components={minimalTextComponents}
            />
          </div>
        </div>
      </div>
    ))}
  </>
);

// Updated section implementation for your main component
const HistorySection = ({ sections }: { sections: any[] }) => (
  <section className="bg-[#f9f9f9] py-20">
    <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
      {/* Section Header */}
      <div className="mb-16">
        <h3 className="text-gray-800 text-sm lg:text-base font-light tracking-widest uppercase mb-4">
          Our history
        </h3>
        <h1 className="text-[#282828] text-2xl md:text-3xl font-light leading-tight max-w-3xl">
          How it all began and where we're heading
        </h1>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <ContentSection sections={sections} />
      </div>
    </div>
  </section>
);

// Minimal text components that match your design aesthetic
const minimalTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset?._ref) return null;

      const imageUrl = urlFor(value)
        .width(600)
        .height(400)
        .fit("max")
        .auto("format")
        .url();

      return (
        <div className="relative w-full aspect-video my-6 overflow-hidden rounded-sm">
          <Image
            src={imageUrl}
            alt={value.alt || "Content image"}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {value.caption && (
            <p className="text-gray-500 text-xs mt-2 font-light tracking-wide uppercase">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="text-2xl md:text-3xl font-light text-[#282828] mb-6 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-xl md:text-2xl font-light text-[#282828] mt-8 mb-4 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-lg md:text-xl font-light text-[#282828] mt-6 mb-3 leading-tight">
        {children}
      </h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-gray-700 mb-4 leading-relaxed text-sm md:text-base font-light">
        {children}
      </p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-2 border-gray-300 pl-4 my-6 text-gray-600 italic font-light">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children?: React.ReactNode;
      value?: any;
    }) => {
      const rel = !value?.href?.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      return (
        <a
          href={value?.href || "#"}
          rel={rel}
          className="text-[#282828] underline hover:text-black transition-colors duration-200 font-normal"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-medium text-[#282828]">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic text-gray-700">{children}</em>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="ml-4 mb-4 space-y-1 text-gray-700">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="ml-4 mb-4 space-y-1 text-gray-700 list-decimal">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-sm md:text-base font-light leading-relaxed marker:text-gray-400">
        {children}
      </li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-sm md:text-base font-light leading-relaxed">
        {children}
      </li>
    ),
  },
};
const HeroSection = ({
  title,
  subtitle,
  backgroundImage,
}: {
  title: string;
  subtitle: string;
  backgroundImage: any;
}) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Nav-friendly dark overlay at top */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-black/60 " />

      {/* Mobile: Full background image with overlay */}
      <div className="absolute inset-0 z-0 md:hidden">
        {/*todo: pass the url instead bro */}
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

      {/* Desktop: Pill-shaped layout (hidden on mobile) */}
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

      {/* Content with responsive positioning */}
      <div className="container mx-auto px-4 z-10 relative">
        <div className="w-full md:ml-auto md:max-w-2xl">
          {/* Mobile: Centered content */}
          {/* Desktop: Right-aligned content */}
          <div className="text-center md:text-left md:ml-8 lg:ml-16 xl:ml-32">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg">
              {title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 drop-shadow-md max-w-lg mx-auto md:mx-0">
              {subtitle}
            </p>

            <div className="mt-8 md:mt-12">
              <a
                href="#contentSections"
                className="inline-block px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-full border border-white/20 hover:bg-[#4169E1] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Explore More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative line (desktop only) */}
      <div className="absolute left-1/2 top-1/2 transform -translate-y-1/2 w-px h-32 bg-white/20 z-[2] hidden lg:block" />
    </section>
  );
};

// ==========================================
// PAGE SECTIONS (Tailwind-only animations)
// ==========================================
//Swrs there's a lot of nonsense code here

// Minimalist ImageTextSection - Clean white background with royal blue accents
// Conference ImageTextSection - Image-first design for showcasing events
const ImageTextSection = ({ sections }: { sections: any[] }) => (
  <section className="bg-white">
    {sections.map((section, index) => {
      const isImageLeft = section.imagePosition === "left";

      return (
        <div
          key={section.sectionId || index}
          id={section.sectionId}
          className="py-20 md:py-28"
        >
          <div className="container mx-auto px-6 md:px-8 max-w-8xl">
            <div
              className={`grid md:grid-cols-12 gap-8 md:gap-12 items-center ${
                isImageLeft ? "" : "md:grid-flow-col-dense"
              }`}
            >
              {/* Hero Image Column - Now the star */}
              <div
                className={`md:col-span-7 ${
                  isImageLeft ? "" : "md:col-start-5"
                } group`}
              >
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg shadow-xl">
                  <Image
                    src={urlFor(section.image).width(1200).height(750).url()}
                    alt={section.image.alt}
                    fill
                    className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 70vw"
                    priority={index === 0} // Prioritize first conference image
                  />
                  {/* Enhanced overlay with gradient for better visual impact */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent group-hover:from-black/20 transition-all duration-500" />
                </div>
              </div>

              {/* Compact Content Column - Supporting role */}
              <div
                className={`md:col-span-5 ${
                  isImageLeft ? "" : "md:col-start-1"
                } space-y-6`}
              >
                {/* Title - More prominent but not overwhelming */}
                {section.title && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-px bg-blue-400"></div>
                    <h2 className="text-lg font-medium text-blue-400 tracking-widest uppercase">
                      {section.title}
                    </h2>
                  </div>
                )}

                {/* Subtitle - Brief and impactful */}
                {section.subtitle && (
                  <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed">
                    {section.subtitle}
                  </p>
                )}

                {/* Content - Condensed version for conference details */}
                <div className="prose prose-base max-w-none">
                  <PortableText
                    value={section.content}
                    components={compactTextComponents}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subtle section divider */}
          {index < sections.length - 1 && (
            <div className="container mx-auto px-6 md:px-8 max-w-8xl mt-20 md:mt-28">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>
          )}
        </div>
      );
    })}
  </section>
);

// Compact text components optimized for conference descriptions
const compactTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset?._ref) return null;

      const imageUrl = urlFor(value)
        .width(600)
        .height(400)
        .fit("max")
        .auto("format")
        .url();

      return (
        <div className="relative w-full my-6 group">
          <div className="relative w-full aspect-video overflow-hidden rounded">
            <Image
              src={imageUrl}
              alt={value.alt || "Conference moment"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-102"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
          {value.caption && (
            <p className="text-gray-500 text-xs mt-2 font-light tracking-wide text-center">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="text-xl md:text-2xl font-medium text-black mb-4 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-lg md:text-xl font-medium text-black mt-6 mb-3 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-base md:text-lg font-medium text-black mt-4 mb-2 leading-tight">
        {children}
      </h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-black mb-4 leading-relaxed text-sm md:text-base font-light">
        {children}
      </p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-2 border-blue-400 pl-4 my-4 text-black italic font-light text-sm md:text-base leading-relaxed">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children?: React.ReactNode;
      value?: any;
    }) => {
      const rel = !value?.href?.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      return (
        <a
          href={value?.href || "#"}
          rel={rel}
          className="text-blue-500 hover:text-blue-600 underline underline-offset-1 decoration-1 transition-colors duration-200"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-black">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic text-black">{children}</em>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="ml-0 mb-4 space-y-2 text-black list-none">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="ml-0 mb-4 space-y-2 text-black">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-sm md:text-base font-light leading-relaxed text-black flex items-start">
        <span className="inline-block w-1 h-1 bg-blue-400 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
        <span className="flex-1">{children}</span>
      </li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-sm md:text-base font-light leading-relaxed text-black">
        {children}
      </li>
    ),
  },
};
// ==========================================
// METADATA GENERATION
// ==========================================

export async function generateMetadata(): Promise<Metadata> {
  const dynamicMetaData = await sanityFetchWrapper<AboutPage>(
    aboutPageMetadataQuery
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
      google: "your-google-site-verification-code",
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

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default async function About() {
  const aboutPage = await sanityFetchWrapper<AboutPage>(aboutPageQuery);

  return (
    <main className="overflow-hidden ">
      <HeroSection
        title={aboutPage.heroSection.title}
        subtitle={aboutPage.heroSection.subtitle}
        backgroundImage={aboutPage.heroSection.backgroundImage}
      />

      <section className="relative h-[40vh] shadow-2xl bg-gray-200 flex flex-col justify-center items-start overflow-hidden">
        <div className="flex flex-col gap-8 justify-center items-start max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-20">
          {/* Blue accent line with label */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-px bg-blue-400"></div>
            <h3 className="text-blue-400 text-sm lg:text-base font-medium tracking-widest uppercase">
              Established in 2002
            </h3>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-black leading-tight max-w-5xl">
            We all young, energetic dudes who love God
          </h1>
        </div>
      </section>

      <section className="bg-[#f4f4f4] relative min-h-[40vh] py-20 flex flex-col justify-center items-start overflow-hidden">
        <div className="flex flex-col gap-8 justify-center items-start max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-20">
          {/* Blue accent line with label */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-px bg-blue-400"></div>
            <h3 className="text-blue-400 text-sm lg:text-base font-medium tracking-widest uppercase">
              Who We Are
            </h3>
          </div>

          <h1 className="text-black text-2xl md:text-3xl font-light leading-tight max-w-5xl">
            GOFAMINT UI Student Fellowship (GSF UI) is the student arm of the
            Gospel Faith Mission International at the University of Ibadan. We
            exist to honor and proclaim the supremacy of the name and purpose of
            Jesus. Rooted in the truth of Christ's life, death, and
            resurrection, we are committed to His plan of healing and redemption
            in our campus and beyond.
          </h1>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-20">
        {/* Header Section */}
        <div className="mb-16 md:mb-20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-px bg-blue-400"></div>
            <p className="text-sm font-medium text-blue-400 uppercase tracking-wider">
              WHAT WE BELIEVE
            </p>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black leading-tight">
            Our Foundational Beliefs
          </h1>
        </div>

        {/* Our Convictions Section */}
        <div className="mb-20 md:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Section Title */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl md:text-3xl font-light text-black mb-8 lg:mb-0">
                Our Convictions
              </h2>
            </div>

            {/* Convictions Lists - 2 columns on desktop, stacked on mobile */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* First Column */}
              <div>
                <ul className="space-y-4">
                  <li className="text-black leading-relaxed flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 mr-4 flex-shrink-0"></span>
                    <span>Ruled by God's Word</span>
                  </li>
                  <li className="text-black leading-relaxed flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 mr-4 flex-shrink-0"></span>
                    <span>Christ-Centered in Focus</span>
                  </li>
                  <li className="text-black leading-relaxed flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 mr-4 flex-shrink-0"></span>
                    <span>Empowered by the Holy Spirit</span>
                  </li>
                  <li className="text-black leading-relaxed flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 mr-4 flex-shrink-0"></span>
                    <span>Reliant on Prayer</span>
                  </li>
                </ul>
              </div>

              {/* Second Column */}
              <div>
                <ul className="space-y-4">
                  <li className="text-black leading-relaxed flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 mr-4 flex-shrink-0"></span>
                    <span>Committed to Covenant Community</span>
                  </li>
                  <li className="text-black leading-relaxed flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 mr-4 flex-shrink-0"></span>
                    <span>Gospel-Saturated in Discipleship</span>
                  </li>
                  <li className="text-black leading-relaxed flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 mr-4 flex-shrink-0"></span>
                    <span>Devoted to Equipping the Saints</span>
                  </li>
                  <li className="text-black leading-relaxed flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 mr-4 flex-shrink-0"></span>
                    <span>Relentless in Mission</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent mb-20 md:mb-24"></div>

        {/* Affirmation of Faith Section */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
            {/* Section Title */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-6 h-px bg-blue-400"></div>
                <span className="text-xs font-medium text-blue-400 uppercase tracking-widest">
                  Core Beliefs
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-black mb-8 lg:mb-0">
                Affirmation of Faith
              </h2>
            </div>

            {/* Faith Points - 2 columns on desktop, single column on mobile */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* First Column of Faith Points */}
              <div>
                <ul className="space-y-6">
                  <li className="text-black leading-relaxed flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-400 text-white text-xs font-medium rounded-full mr-4 mt-0.5 flex-shrink-0">
                      1
                    </span>
                    <span>
                      The Bible is the Word of God, fully inspired and without
                      error in the original manuscripts.
                    </span>
                  </li>
                  <li className="text-black leading-relaxed flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-400 text-white text-xs font-medium rounded-full mr-4 mt-0.5 flex-shrink-0">
                      2
                    </span>
                    <span>
                      There is one true, good, and living God who eternally
                      exists in three persons—the Father, Son, and Holy Spirit.
                    </span>
                  </li>
                  <li className="text-black leading-relaxed flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-400 text-white text-xs font-medium rounded-full mr-4 mt-0.5 flex-shrink-0">
                      3
                    </span>
                    <span>
                      God created men and women in His image and created all
                      things for His glory.
                    </span>
                  </li>
                  <li className="text-black leading-relaxed flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-400 text-white text-xs font-medium rounded-full mr-4 mt-0.5 flex-shrink-0">
                      4
                    </span>
                    <span>All have sinned and rebelled against God.</span>
                  </li>
                  <li className="text-black leading-relaxed flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-400 text-white text-xs font-medium rounded-full mr-4 mt-0.5 flex-shrink-0">
                      5
                    </span>
                    <span>
                      Jesus came to earth, lived a perfect life, and died an
                      atoning death—conquering sin, Satan, and death by His
                      resurrection.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Second Column of Faith Points */}
              <div>
                <ul className="space-y-6">
                  <li className="text-black leading-relaxed flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-400 text-white text-xs font-medium rounded-full mr-4 mt-0.5 flex-shrink-0">
                      6
                    </span>
                    <span>God alone is the Author of Salvation.</span>
                  </li>
                  <li className="text-black leading-relaxed flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-400 text-white text-xs font-medium rounded-full mr-4 mt-0.5 flex-shrink-0">
                      7
                    </span>
                    <span>
                      The Holy Spirit gives gifts to those who are in Christ.
                    </span>
                  </li>
                  <li className="text-black leading-relaxed flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-400 text-white text-xs font-medium rounded-full mr-4 mt-0.5 flex-shrink-0">
                      8
                    </span>
                    <span>
                      The church consists of all who have trusted Jesus for
                      their eternal salvation.
                    </span>
                  </li>
                  <li className="text-black leading-relaxed flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-400 text-white text-xs font-medium rounded-full mr-4 mt-0.5 flex-shrink-0">
                      9
                    </span>
                    <span>Heaven and hell are real places.</span>
                  </li>
                  <li className="text-black leading-relaxed flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-400 text-white text-xs font-medium rounded-full mr-4 mt-0.5 flex-shrink-0">
                      10
                    </span>
                    <span>
                      Jesus Christ will one day return to establish His kingdom.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImageTextSection sections={aboutPage.imageTextSections} />
    </main>
  );
}
