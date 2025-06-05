import { SanityImage } from "./sanityImage";

export interface Sermon {
  title: string;
  date: string;
  duration: number;
  telegramLink: string;
  googleDriveLink: string;

  posterImage: SanityImage;
}

export interface Sermons {
  _id: string;
  _rev: string;
  _createdAt: string;
  _updatedAt: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: SanityImage;
  };
  sermons: Sermon[];
}

export interface SermonsCountResponse {
  count: number;
}