import { SanityImage } from "./sanityImage";

export interface GalleryListItem {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description: string;
  featuredImage: SanityImage;
  category: string;
  eventDate: string;
  location: string;
  tags: string[];
  _createdAt: string;
  imageCount: number;
}