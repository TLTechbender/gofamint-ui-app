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

// ==========================================
// PAGE SECTIONS (Tailwind-only animations)
// ==========================================

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
      <div className="absolute inset-0 z-0">
        <Image
          src={urlFor(backgroundImage).width(1920).height(1080).url()}
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="container mx-auto px-4 text-center z-10 transition-all duration-500 animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto">
          {subtitle}
        </p>

        <div className="mt-12 transition-opacity duration-500 delay-300 opacity-100">
          <a
            href="#contentSections"
            
            className="inline-block px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            Explore More
          </a>
        </div>
      </div>
    </section>
  );
};

const ContentSection = ({ sections }: { sections: any[] }) => (
  <section id="contentSections" className="py-16 bg-white">
    <div className="container mx-auto px-4 max-w-4xl">
      {sections.map((section, index) => (
        <div
          key={section.sectionId || index}
          id={section.sectionId}
          className="mb-20 last:mb-0 transition-all duration-500 hover:shadow-lg hover:bg-gray-50 p-6 rounded-lg"
        >
          {section.title && (
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
              {section.title}
            </h2>
          )}
          {section.subtitle && (
            <p className="text-xl text-center mb-8 text-gray-600">
              {section.subtitle}
            </p>
          )}
          <LightPortableText value={section.content} />
        </div>
      ))}
    </div>
  </section>
);

const ImageTextSection = ({ sections }: { sections: any[] }) => (
  <section className="bg-gradient-to-b from-gray-900 to-gray-800">
    {sections.map((section, index) => {
      const isImageLeft = section.imagePosition === "left";

      return (
        <div
          key={section.sectionId || index}
          id={section.sectionId}
          className={`py-20 ${index % 2 === 0 ? "bg-gray-900/50" : "bg-gray-800/50"} transition-colors duration-300`}
        >
          <div className="container mx-auto px-4 max-w-6xl">
            <div
              className={`grid md:grid-cols-2 gap-12 items-center ${isImageLeft ? "" : "md:grid-flow-col-dense"}`}
            >
              {/* Image Column */}
              <div
                className={`relative ${isImageLeft ? "" : "md:col-start-2"} transition-all duration-500 hover:scale-[1.02]`}
              >
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
                  <Image
                    src={urlFor(section.image).width(800).height(600).url()}
                    alt={section.image.alt}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {section.image.caption && (
                  <p className="text-sm text-gray-400 mt-3 text-center italic">
                    {section.image.caption}
                  </p>
                )}
              </div>

              {/* Content Column */}
              <div
                className={`${isImageLeft ? "" : "md:col-start-1"} transition-all duration-500`}
              >
                {section.title && (
                  <h2 className="text-3xl font-bold mb-6 text-white">
                    {section.title}
                  </h2>
                )}
                {section.subtitle && (
                  <p className="text-xl text-gray-300 mb-8">
                    {section.subtitle}
                  </p>
                )}
                <DarkPortableText value={section.content} />
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </section>
);

// ==========================================
// METADATA GENERATION (unchanged)
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
    <main className="overflow-hidden">
      <HeroSection
        title={aboutPage.heroSection.title}
        subtitle={aboutPage.heroSection.subtitle}
        backgroundImage={aboutPage.heroSection.backgroundImage}
      />

      <ContentSection sections={aboutPage.contentSections} />

      <ImageTextSection sections={aboutPage.imageTextSections} />
    </main>
  );
}
