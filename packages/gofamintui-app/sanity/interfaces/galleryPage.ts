import { SanityImage } from "./sanityImage";


interface SanityImageWithCaption extends SanityImage {
  caption?: string;
}

interface SanitySlug {
  current: string;
  _type: "slug";
}

// Main interface for buildGalleryImagesBySlugQuery
export interface GalleryBySlug {
  _id: string;
  title: string;
  slug: SanitySlug;
  description: string;
  featuredImage: SanityImage;
  category: string;
  eventDate: string; // or Date if you're parsing it
  location: string;
  tags: string[];
  _createdAt: string; // or Date if you're parsing it
  images: SanityImageWithCaption[];
}




// Usage examples:
// const gallery: GalleryBySlugResult = await sanityClient.fetch(buildGalleryImagesBySlugQuery(), { slug: 'my-gallery' });
// const imageCount: GalleryImageCount = await sanityClient.fetch(buildGalleryImagesCountBySlugQuery(), { slug: 'my-gallery' });
