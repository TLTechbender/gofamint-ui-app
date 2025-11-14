export const buildGalleryListQuery = (hasSearch = false) => {
  const baseQuery = hasSearch
    ? `*[_type == "gallery" && (
        title match $search + "*" || 
        description match $search + "*" ||
        lower(title) match lower($search) + "*" ||
        lower(description) match lower($search) + "*"
      )]`
    : `*[_type == "gallery"]`;

  return `${baseQuery} | order(_createdAt desc) [$start...$end] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    description,
    featuredImage {
      asset-> {
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
      hotspot,
      crop
    },
    googleDriveFolder,
    
  }`;
};

// Count query with enhanced search support
export const buildGalleryListCountQuery = (hasSearch = false) => {
  const baseQuery = hasSearch
    ? `*[_type == "gallery" && (
        title match $search + "*" || 
        description match $search + "*" ||
        lower(title) match lower($search) + "*" ||
        lower(description) match lower($search) + "*"
      )]`
    : `*[_type == "gallery"]`;

  return `count(${baseQuery})`;
};
