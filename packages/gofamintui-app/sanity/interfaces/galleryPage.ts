// import { SanityImage } from "./sanityImage";

// interface SanitySlug {
//   current: string;
//   _type: "slug";
// }

// // Base media item interface
// interface BaseMediaItem {
//   _type: string;
//   alt?: string;
//   caption?: string;
// }

// // Gallery image interface
// interface GalleryImage extends BaseMediaItem {
//   _type: "galleryImage";
//   image: SanityImage;
//   photographer?: string;
// }

// // Gallery video interface
// interface GalleryVideo extends BaseMediaItem {
//   _type: "galleryVideo";
//   video: {
//     asset: {
//       _id: string;
//       url: string;
//     };
//   };
//   videographer?: string;
//   thumbnail?: SanityImage;
// }

// // Union type for media items
// type MediaItem = GalleryImage | GalleryVideo;

// // Main interface for buildGalleryImagesBySlugQuery
// export interface GalleryBySlug {
//   _id: string;
//   title: string;
//   slug: SanitySlug;
//   description: string;
//   featuredImage: SanityImage;
//   category: string;
//   eventDate: string; // or Date if you're parsing it
//   location: string;
//   tags: string[];
//   _createdAt: string; // or Date if you're parsing it
//   media: MediaItem[];
// }

// // Type guards for media items
// export const isGalleryImage = (item: MediaItem): item is GalleryImage => {
//   return item._type === "galleryImage";
// };

// export const isGalleryVideo = (item: MediaItem): item is GalleryVideo => {
//   return item._type === "galleryVideo";
// };

// // Interface for the count query result
// export interface GalleryMediaCount {
//   mediaCount: number;
// }

// // Usage examples:
// // const gallery: GalleryBySlugResult = await sanityClient.fetch(buildGalleryImagesBySlugQuery(), { slug: 'my-gallery' });
// // const imageCount: GalleryImageCount = await sanityClient.fetch(buildGalleryImagesCountBySlugQuery(), { slug: 'my-gallery' });
