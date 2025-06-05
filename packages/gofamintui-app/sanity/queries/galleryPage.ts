// ========================================
// GALLERY TYPESCRIPT INTERFACES
// ========================================

// Base Sanity types
export interface SanityAsset {
  _id: string;
  url: string;
  metadata?: {
    lqip?: string;
    dimensions?: {
      width: number;
      height: number;
    };
  };
}

export interface SanityImage {
  asset: SanityAsset;
  alt?: string;
}

export interface SanitySlug {
  current: string;
  _type: "slug";
}

// Gallery specific interfaces
export interface GalleryImage {
  image: {
    asset: SanityAsset;
  };
  alt: string;
  caption?: string;
  photographer?: string;
}

export interface GallerySEO {
  title?: string;
  description: string;
  keywords: string[];
  ogImage?: SanityImage;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
  noIndex: boolean;
}

export interface GalleryCategory {
  events: "events";
  fellowship: "fellowship";
  worship: "worship";
  outreach: "outreach";
  conference: "conference";
  retreat: "retreat";
  other: "other";
}

export type GalleryCategoryValue = keyof GalleryCategory;

// Base gallery interface (for listings)
export interface GalleryBase {
  _id: string;
  title: string;
  slug: SanitySlug;
  description?: string;
  featuredImage: SanityImage;
  category: GalleryCategoryValue;
  eventDate?: string;
  location?: string;
  tags?: string[];
  _createdAt: string;
  imageCount?: number;
}

// Full gallery interface (for detail pages)
export interface Gallery extends GalleryBase {
  images: GalleryImage[];
  _updatedAt: string;
  seo: GallerySEO;
}

// Query result types
export interface GetAllGalleriesResult extends GalleryBase {}

export interface GetGalleryBySlugResult extends Gallery {}

export interface GetGalleriesByCategoryResult extends GalleryBase {}

export interface GetRecentGalleriesResult extends GalleryBase {}

export interface GetGalleriesByTagResult extends GalleryBase {}

export interface SearchGalleriesResult extends GalleryBase {}

export interface GetFeaturedGalleriesResult extends GalleryBase {}

export interface GetRelatedGalleriesResult extends GalleryBase {}

export interface GetGalleriesWithPaginationResult extends GalleryBase {}

// Category and tag result types
export interface CategoryResult {
  category: GalleryCategoryValue;
}

export type TagsResult = string[];

export type GalleryCountResult = number;

// Query parameter types
export interface GetGalleryBySlugParams {
  slug: string;
}

export interface GetGalleriesByCategoryParams {
  category: GalleryCategoryValue;
}

export interface GetGalleriesByTagParams {
  tag: string;
}

export interface SearchGalleriesParams {
  searchTerm: string;
}

export interface GetRelatedGalleriesParams {
  category: GalleryCategoryValue;
  currentSlug: string;
}

export interface GetGalleriesWithPaginationParams {
  start: number;
  end: number;
}

// ========================================
// TYPED QUERY FUNCTIONS
// ========================================

import { SanityClient } from "@sanity/client";

export class GalleryQueries {
  constructor(private client: SanityClient) {}

  async getAllGalleries(): Promise<GetAllGalleriesResult[]> {
    const query = `
        *[_type == "gallery" && published == true] | order(eventDate desc) {
          _id,
          title,
          slug,
          description,
          featuredImage {
            asset->{
              _id,
              url,
              metadata {
                lqip,
                dimensions {
                  width,
                  height
                }
              }
            },
            alt
          },
          category,
          eventDate,
          location,
          tags,
          _createdAt,
          "imageCount": count(images)
        }
      `;
    return this.client.fetch<GetAllGalleriesResult[]>(query);
  }

  async getGalleryBySlug(
    params: GetGalleryBySlugParams
  ): Promise<GetGalleryBySlugResult | null> {
    const query = `
        *[_type == "gallery" && slug.current == $slug && published == true][0] {
          _id,
          title,
          slug,
          description,
          featuredImage {
            asset->{
              _id,
              url,
              metadata {
                lqip,
                dimensions {
                  width,
                  height
                }
              }
            },
            alt
          },
          images[] {
            image {
              asset->{
                _id,
                url,
                metadata {
                  lqip,
                  dimensions {
                    width,
                    height
                  }
                }
              }
            },
            alt,
            caption,
            photographer
          },
          category,
          eventDate,
          location,
          tags,
          _createdAt,
          _updatedAt,
          seo {
            title,
            description,
            keywords,
            ogImage {
              asset->{
                _id,
                url
              },
              alt
            },
            ogTitle,
            ogDescription,
            canonicalUrl,
            noIndex
          }
        }
      `;
    return this.client.fetch<GetGalleryBySlugResult>(query, params);
  }

  async getGalleriesByCategory(
    params: GetGalleriesByCategoryParams
  ): Promise<GetGalleriesByCategoryResult[]> {
    const query = `
        *[_type == "gallery" && category == $category && published == true] | order(eventDate desc) {
          _id,
          title,
          slug,
          description,
          featuredImage {
            asset->{
              _id,
              url,
              metadata {
                lqip,
                dimensions {
                  width,
                  height
                }
              }
            },
            alt
          },
          category,
          eventDate,
          location,
          tags,
          _createdAt,
          "imageCount": count(images)
        }
      `;
    return this.client.fetch<GetGalleriesByCategoryResult[]>(query, params);
  }

  async getRecentGalleries(): Promise<GetRecentGalleriesResult[]> {
    const query = `
        *[_type == "gallery" && published == true] | order(_createdAt desc)[0...6] {
          _id,
          title,
          slug,
          description,
          featuredImage {
            asset->{
              _id,
              url,
              metadata {
                lqip,
                dimensions {
                  width,
                  height
                }
              }
            },
            alt
          },
          category,
          eventDate,
          location,
          _createdAt,
          "imageCount": count(images)
        }
      `;
    return this.client.fetch<GetRecentGalleriesResult[]>(query);
  }

  async getGalleriesByTag(
    params: GetGalleriesByTagParams
  ): Promise<GetGalleriesByTagResult[]> {
    const query = `
        *[_type == "gallery" && $tag in tags && published == true] | order(eventDate desc) {
          _id,
          title,
          slug,
          description,
          featuredImage {
            asset->{
              _id,
              url,
              metadata {
                lqip,
                dimensions {
                  width,
                  height
                }
              }
            },
            alt
          },
          category,
          eventDate,
          location,
          tags,
          _createdAt,
          "imageCount": count(images)
        }
      `;
    return this.client.fetch<GetGalleriesByTagResult[]>(query, params);
  }

  async searchGalleries(
    params: SearchGalleriesParams
  ): Promise<SearchGalleriesResult[]> {
    const query = `
        *[_type == "gallery" && (title match $searchTerm || description match $searchTerm) && published == true] | order(_score desc) {
          _id,
          title,
          slug,
          description,
          featuredImage {
            asset->{
              _id,
              url,
              metadata {
                lqip,
                dimensions {
                  width,
                  height
                }
              }
            },
            alt
          },
          category,
          eventDate,
          location,
          tags,
          _createdAt,
          "imageCount": count(images)
        }
      `;
    return this.client.fetch<SearchGalleriesResult[]>(query, params);
  }

  async getCategories(): Promise<CategoryResult[]> {
    const query = `
        *[_type == "gallery" && published == true && defined(category)] {
          category
        } | order(category asc)
      `;
    return this.client.fetch<CategoryResult[]>(query);
  }

  async getTags(): Promise<TagsResult> {
    const query = `array::unique(*[_type == "gallery" && published == true].tags[])`;
    return this.client.fetch<TagsResult>(query);
  }

  async getFeaturedGalleries(): Promise<GetFeaturedGalleriesResult[]> {
    const query = `
        *[_type == "gallery" && published == true] | order(count(images) desc)[0...3] {
          _id,
          title,
          slug,
          description,
          featuredImage {
            asset->{
              _id,
              url,
              metadata {
                lqip,
                dimensions {
                  width,
                  height
                }
              }
            },
            alt
          },
          category,
          eventDate,
          location,
          tags,
          _createdAt,
          "imageCount": count(images)
        }
      `;
    return this.client.fetch<GetFeaturedGalleriesResult[]>(query);
  }

  async getRelatedGalleries(
    params: GetRelatedGalleriesParams
  ): Promise<GetRelatedGalleriesResult[]> {
    const query = `
        *[_type == "gallery" && category == $category && slug.current != $currentSlug && published == true] | order(eventDate desc)[0...4] {
          _id,
          title,
          slug,
          description,
          featuredImage {
            asset->{
              _id,
              url,
              metadata {
                lqip,
                dimensions {
                  width,
                  height
                }
              }
            },
            alt
          },
          category,
          eventDate,
          location,
          _createdAt,
          "imageCount": count(images)
        }
      `;
    return this.client.fetch<GetRelatedGalleriesResult[]>(query, params);
  }

  async getGalleriesWithPagination(
    params: GetGalleriesWithPaginationParams
  ): Promise<GetGalleriesWithPaginationResult[]> {
    const query = `
        *[_type == "gallery" && published == true] | order(eventDate desc)[$start...$end] {
          _id,
          title,
          slug,
          description,
          featuredImage {
            asset->{
              _id,
              url,
              metadata {
                lqip,
                dimensions {
                  width,
                  height
                }
              }
            },
            alt
          },
          category,
          eventDate,
          location,
          tags,
          _createdAt,
          "imageCount": count(images)
        }
      `;
    return this.client.fetch<GetGalleriesWithPaginationResult[]>(query, params);
  }

  async getGalleryCount(): Promise<GalleryCountResult> {
    const query = `count(*[_type == "gallery" && published == true])`;
    return this.client.fetch<GalleryCountResult>(query);
  }
}

// ========================================
// USAGE EXAMPLE
// ========================================

/*
  // Initialize the queries class
  import { createClient } from '@sanity/client';
  
  const client = createClient({
    projectId: 'your-project-id',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
  });
  
  const galleryQueries = new GalleryQueries(client);
  
  // Usage examples:
  const galleries = await galleryQueries.getAllGalleries();
  const gallery = await galleryQueries.getGalleryBySlug({ slug: 'my-gallery' });
  const eventGalleries = await galleryQueries.getGalleriesByCategory({ category: 'events' });
  const searchResults = await galleryQueries.searchGalleries({ searchTerm: 'fellowship*' });
  */
