import { SanityImage, SanityImageWithAlt } from "./sanityImage";

export interface HeroSection {
  backgroundImage: SanityImage;
  title: string;
  subtitle: string;
}

export interface ContentSection {
  sectionId?: string;
  title: string;
  subtitle?: string;
  content: any[]; // Portable Text blocks
}

export interface SectionStyling {
  backgroundColor: "default" | "light-gray" | "white" | "brand";
  paddingSize: "small" | "medium" | "large";
}

export interface ImageTextSection {
  sectionId?: string;
  title: string;
  subtitle?: string;
  image: SanityImageWithAlt;
  imagePosition: "left" | "right";
  content: any[]; // Portable Text blocks
  styling?: SectionStyling;
}

export interface SeoSettings {
  title: string;
  description: string;
  keywords: string[];
  ogImage: SanityImage;
}
export interface AboutPage {
  _id: string;
  _rev: string;
  seo: SeoSettings;
  heroSection: HeroSection;
  contentSections: ContentSection[];
  imageTextSections: ImageTextSection[];
}
