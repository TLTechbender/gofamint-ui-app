// ========================================
// GALLERY GROQ QUERIES
// ========================================

// 1. Get all published galleries (overview/listing page)
export const getAllGalleriesQuery = `
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

// 2. Get single gallery by slug (detail page)
export const getGalleryBySlugQuery = `
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

// 3. Get galleries by category
export const getGalleriesByCategoryQuery = `
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

// 4. Get recent galleries (limit 6)
export const getRecentGalleriesQuery = `
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

// 5. Get galleries by tag
export const getGalleriesByTagQuery = `
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

// 6. Search galleries by title or description
export const searchGalleriesQuery = `
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

// 7. Get all unique categories
export const getCategoriesQuery = `
  *[_type == "gallery" && published == true && defined(category)] {
    category
  } | order(category asc)
`;

// 8. Get all unique tags
export const getTagsQuery = `
  array::unique(*[_type == "gallery" && published == true].tags[])
`;

// 9. Get featured galleries (with most images or specific criteria)
export const getFeaturedGalleriesQuery = `
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

// 10. Get related galleries (same category, excluding current)
export const getRelatedGalleriesQuery = `
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

// 11. Get galleries with pagination
export const getGalleriesWithPaginationQuery = `
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

// 12. Get total count of published galleries
export const getGalleryCountQuery = `
  count(*[_type == "gallery" && published == true])
`;

// ========================================
// USAGE EXAMPLES
// ========================================

// Example usage in your frontend:

// Get single gallery
// const gallery = await sanityClient.fetch(getGalleryBySlugQuery, { slug: 'my-gallery-slug' })

// Get galleries by category
// const galleries = await sanityClient.fetch(getGalleriesByCategoryQuery, { category: 'events' })

// Search galleries
// const searchResults = await sanityClient.fetch(searchGalleriesQuery, { searchTerm: 'fellowship*' })

// Get with pagination
// const galleries = await sanityClient.fetch(getGalleriesWithPaginationQuery, { start: 0, end: 9 })

// Get related galleries
// const related = await sanityClient.fetch(getRelatedGalleriesQuery, {
//   category: 'events',
//   currentSlug: 'current-gallery-slug'
// })
