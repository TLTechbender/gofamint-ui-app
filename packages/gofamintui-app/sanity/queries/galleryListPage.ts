// Original query for listing all galleries (with optional search and pagination)
export const buildGalleryListQuery = (hasSearch = false) => {
  const baseFields = `
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
    _createdAt
  `;

  if (hasSearch) {
    return `
      *[_type == "gallery" && published == true && (
        title match $search + "*" || 
        description match $search + "*" ||
        category match $search + "*" ||
        location match $search + "*"
      )] | order(eventDate desc) [$start...$end] {
        ${baseFields}
      }
    `;
  }

  return `
    *[_type == "gallery" && published == true] | order(eventDate desc) [$start...$end] {
      ${baseFields}
    }
  `;
};

export const buildGalleryListCountQuery = (hasSearch = false) => {
  if (hasSearch) {
    return `
      count(*[_type == "gallery" && published == true && (
        title match $search + "*" || 
        description match $search + "*" ||
        category match $search + "*" ||
        location match $search + "*"
      )])
    `;
  }

  return `count(*[_type == "gallery" && published == true])`;
};
