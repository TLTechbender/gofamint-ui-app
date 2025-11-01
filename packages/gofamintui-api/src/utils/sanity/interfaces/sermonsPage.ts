import { SanityImage } from "./sanityImage";

export interface Sermon {
  title: string;
  date: string;
  duration: number;
  telegramLink: string;
  googleDriveLink: string;

  posterImage: SanityImage;
}

export interface SermonsCountResponse {
  count: number;
}

export interface SermonsMetadataAndHero {
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
}
