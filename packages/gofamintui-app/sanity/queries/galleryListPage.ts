// Fixed GROQ queries with search functionality

// Base query for galleries with search support
export const buildGalleryListQuery = (hasSearch = false) => {
  const baseQuery = `*[_type == "gallery"${hasSearch ? " && (title match $search || description match $search)" : ""}]`;

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

// Count query with search support
export const buildGalleryListCountQuery = (hasSearch = false) => {
  const baseQuery = `*[_type == "gallery"${hasSearch ? " && (title match $search || description match $search)" : ""}]`;

  return `count(${baseQuery})`;
};
