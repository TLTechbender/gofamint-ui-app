import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { AboutPage } from "@/sanity/interfaces/aboutPage";
import { aboutPageQuery } from "@/sanity/queries/aboutPage";
import { aboutPageMetadataQuery } from "@/sanity/queries/aboutPageMetaData";
import { Metadata, ResolvingMetadata } from "next";
import { urlFor } from "@/sanity/sanityClient";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import Image from "next/image";

// ==========================================
// PORTABLE TEXT COMPONENTS
// ==========================================

// Light theme component for white/light backgrounds
const lightTextComponents: PortableTextReactComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      const imageUrl = urlFor(value)
        .width(800)
        .height(600)
        .fit("max")
        .auto("format")
        .url();
      return (
        <div className="relative w-full h-96 my-6">
          <Image
            src={imageUrl}
            alt={value.alt || "Content image"}
            fill
            className="object-contain rounded-lg"
          />
          {value.caption && (
            <p className="text-gray-600 text-sm mt-2 text-center italic">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-gray-900 text-4xl font-bold mb-6 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-gray-800 text-3xl font-bold mt-8 mb-4 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-gray-800 text-2xl font-bold mt-6 mb-3 leading-tight">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-gray-800 text-xl font-semibold mt-4 mb-2">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-gray-800 text-lg font-semibold mt-3 mb-2">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-gray-800 text-base font-semibold mt-2 mb-1">
        {children}
      </h6>
    ),
    normal: ({ children }) => (
      <p className="text-gray-700 mb-4 leading-relaxed text-base">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="text-gray-700 border-l-4 border-blue-500 pl-6 italic my-6 bg-gray-50 py-4 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="text-gray-900 font-bold">{children}</strong>
    ),
    em: ({ children }) => <em className="text-gray-700 italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-gray-100 text-gray-800 rounded px-2 py-1 font-mono text-sm border">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const rel = !value.href.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      return (
        <a
          href={value.href}
          rel={rel}
          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 font-medium"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-6 mb-4 text-gray-700 space-y-1">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal ml-6 mb-4 text-gray-700 space-y-1">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-gray-700 leading-relaxed">{children}</li>
    ),
    number: ({ children }) => (
      <li className="text-gray-700 leading-relaxed">{children}</li>
    ),
  },
  hardBreak: () => <br />,
  unknownMark: ({ children }) => (
    <span className="text-red-500">{children}</span>
  ),
  unknownType: () => <div className="text-red-500">Unknown type</div>,
  unknownBlockStyle: ({ children }) => (
    <div className="text-gray-800 mb-4">{children}</div>
  ),
  unknownList: ({ children }) => (
    <ul className="list-disc ml-6 mb-4 text-gray-700">{children}</ul>
  ),
  unknownListItem: ({ children }) => (
    <li className="text-gray-700 leading-relaxed">{children}</li>
  ),
};

// Dark theme component for dark/colored backgrounds
const darkTextComponents: PortableTextReactComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      const imageUrl = urlFor(value)
        .width(800)
        .height(600)
        .fit("max")
        .auto("format")
        .url();
      return (
        <div className="relative w-full h-96 my-6">
          <Image
            src={imageUrl}
            alt={value.alt || "Content image"}
            fill
            className="object-contain rounded-lg"
          />
          {value.caption && (
            <p className="text-gray-300 text-sm mt-2 text-center italic">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-white text-4xl font-bold mb-6 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-white text-3xl font-bold mt-8 mb-4 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-white text-2xl font-bold mt-6 mb-3 leading-tight">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-white text-xl font-semibold mt-4 mb-2">{children}</h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-white text-lg font-semibold mt-3 mb-2">{children}</h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-white text-base font-semibold mt-2 mb-1">
        {children}
      </h6>
    ),
    normal: ({ children }) => (
      <p className="text-gray-100 mb-4 leading-relaxed text-base">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="text-gray-200 border-l-4 border-blue-400 pl-6 italic my-6 bg-gray-800/50 py-4 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="text-white font-bold">{children}</strong>
    ),
    em: ({ children }) => <em className="text-gray-200 italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-gray-800 text-green-400 rounded px-2 py-1 font-mono text-sm border border-gray-700">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const rel = !value.href.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      return (
        <a
          href={value.href}
          rel={rel}
          className="text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200 font-medium"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-6 mb-4 text-gray-100 space-y-1">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal ml-6 mb-4 text-gray-100 space-y-1">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-gray-100 leading-relaxed">{children}</li>
    ),
    number: ({ children }) => (
      <li className="text-gray-100 leading-relaxed">{children}</li>
    ),
  },
  hardBreak: () => <br />,
  unknownMark: ({ children }) => (
    <span className="text-red-400">{children}</span>
  ),
  unknownType: () => <div className="text-red-400">Unknown type</div>,
  unknownBlockStyle: ({ children }) => (
    <div className="text-gray-100 mb-4">{children}</div>
  ),
  unknownList: ({ children }) => (
    <ul className="list-disc ml-6 mb-4 text-gray-100">{children}</ul>
  ),
  unknownListItem: ({ children }) => (
    <li className="text-gray-100 leading-relaxed">{children}</li>
  ),
};

// Reusable components
interface PortableTextProps {
  value: any;
  className?: string;
}

const LightPortableText = ({ value, className = "" }: PortableTextProps) => (
  <div className={`prose max-w-none ${className}`}>
    <PortableText components={lightTextComponents} value={value} />
  </div>
);

const DarkPortableText = ({ value, className = "" }: PortableTextProps) => (
  <div className={`prose max-w-none ${className}`}>
    <PortableText components={darkTextComponents} value={value} />
  </div>
);

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Helper function to get background color classes
const getBackgroundColorClass = (bgColor: string) => {
  switch (bgColor) {
    case "light-gray":
      return "bg-gray-50";
    case "white":
      return "bg-white";
    case "brand":
      return "bg-blue-50"; // Adjust to your brand color
    default:
      return "bg-transparent";
  }
};

// Helper function to get padding classes
const getPaddingClass = (paddingSize: string) => {
  switch (paddingSize) {
    case "small":
      return "py-8 px-4";
    case "large":
      return "py-20 px-6";
    default:
      return "py-12 px-4";
  }
};

// ==========================================
// METADATA GENERATION
// ==========================================

export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
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
// MAIN COMPONENT
// ==========================================

export default async function About() {
  const aboutPage = await sanityFetchWrapper<AboutPage>(aboutPageQuery);

  return (
    <div>
      <div>
        {/* Hero Section */}
        <section id="hero">
          <div
            className="relative min-h-[50vh] bg-fixed bg-center bg-cover flex items-center justify-center md:justify-start"
            style={{
              backgroundImage: `url(${urlFor(
                aboutPage.heroSection.backgroundImage as any
              )
                .width(1920)
                .height(1080)
                .format("webp")
                .quality(85)
                .url()})`,
            }}
          >
            <div className="absolute inset-0 bg-black/60 z-0"></div>
            <span className="flex flex-col gap-4 items-center justify-center z-20 relative w-full">
              <h1 className="text-3xl md:text-5xl text-center text-white capitalize">
                {aboutPage.heroSection.title}
              </h1>
              <h3 className="text-lg md:text-xl text-center text-white capitalize">
                {aboutPage.heroSection.subtitle}
              </h3>
            </span>
          </div>
        </section>

        {/* Content Sections - Light Background */}
        <section id="contentSections">
          <div className="max-w-4xl mx-auto">
            {aboutPage.contentSections?.map((section, index) => (
              <div
                key={section.sectionId || index}
                id={section.sectionId}
                className="py-12 px-4"
              >
                {/* Section Title */}
                {section.title && (
                  <h2 className="text-3xl font-bold text-center mb-4 text-[#1a202c]">
                    {section.title}
                  </h2>
                )}

                {/* Section Subtitle */}
                {section.subtitle && (
                  <p className="text-xl font-medium text-center mb-8 text-[#1a202c]">
                    {section.subtitle}
                  </p>
                )}

                {/* Light Portable Text Content for Light Background */}
                <LightPortableText value={section.content} />
              </div>
            ))}
          </div>
        </section>

        {/* Image-Text Sections - Dark Background */}
        <section id="imageTextSections">
          <div
            style={{
              background: "linear-gradient(0deg, rgb(0, 0, 0), rgb(0, 0, 0))",
            }}
            className="mx-auto"
          >
            {aboutPage.imageTextSections?.map((section, index) => {
              const bgColorClass = getBackgroundColorClass(
                section.styling?.backgroundColor || "default"
              );
              const paddingClass = getPaddingClass(
                section.styling?.paddingSize || "medium"
              );
              const isImageLeft = section.imagePosition === "left";

              return (
                <div
                  key={section.sectionId || index}
                  id={section.sectionId}
                  className={`${bgColorClass} ${paddingClass}`}
                >
                  <div className="max-w-6xl mx-auto">
                    {section.title && (
                      <h2 className="text-3xl text-white font-bold text-center mb-4">
                        {section.title}
                      </h2>
                    )}

                    {section.subtitle && (
                      <p className="text-xl text-white text-center mb-12">
                        {section.subtitle}
                      </p>
                    )}

                    <div
                      className={`grid md:grid-cols-2 gap-12 items-center ${
                        isImageLeft ? "" : "md:grid-flow-col-dense"
                      }`}
                    >
                      <div
                        className={`relative ${isImageLeft ? "" : "md:col-start-2"}`}
                      >
                        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
                          <Image
                            src={urlFor(section.image as any)
                              .width(600)
                              .height(400)
                              .fit("crop")
                              .auto("format")
                              .url()}
                            alt={section.image.alt}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {section.image.caption && (
                          <p className="text-sm text-gray-300 mt-2 text-center italic">
                            {section.image.caption}
                          </p>
                        )}
                      </div>

                      {/* Dark Portable Text Content for Dark Background */}
                      <div className={`${isImageLeft ? "" : "md:col-start-1"}`}>
                        <DarkPortableText value={section.content} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
