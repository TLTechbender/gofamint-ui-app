import { SanityImage } from "./sanityImage";

export interface BlogsPageMetadataAndHero {
  heroSection: {
    backgroundImage: SanityImage;
    title: string;
    subtitle: string;
  };
  seo: {
    title: string;
    description: string;
    ogImage: SanityImage;
    keywords: string[]
  };
}
