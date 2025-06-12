
export const projectQueries
  // Get all projects
=`*[_type == "gallery"] | order(_createdAt desc) {
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
    googleDriveFolder
  }`,