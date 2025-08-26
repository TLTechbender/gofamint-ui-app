import { SanityImage } from "./sanityImage";
export interface AboutPage {
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: SanityImage;
  };

  heroSection: {
    backgroundImage: SanityImage;
    title: string;
    subtitle: string;
  };

  establishedSection: {
    yearLabel: string;
    title: string;
  };

  whoWeAreSection: {
    label: string;
    content: string;
  };

  beliefsSection: {
    sectionLabel: string;
    title: string;
    convictionsTitle: string;
    convictions: string[];
    faithLabel: string;
    faithTitle: string;
    faithPoints: string[];
  };

  imageTextSections: {

    title: string;
    subtitle?: string;
    image: SanityImage;
    imagePosition: "left" | "right";
    content: string;
  }[];
}
