// export const buildGalleryImagesBySlugQuery = `
//       *[_type == "gallery" && slug.current == $slug && published == true][0] {
//         _id,
//         title,
//         slug,
//         description,
//         featuredImage {
//           asset->{
//             _id,
//             url,
//             metadata {
//               lqip,
//               dimensions {
//                 width,
//                 height
//               }
//             }
//           },
//           alt
//         },
//         category,
//         eventDate,
//         location,
//         tags,
//         _createdAt,
//         "images": images[$start...$end] {
//           asset->{
//             _id,
//             url,
//             metadata {
//               lqip,
//               dimensions {
//                 width,
//                 height
//               }
//             }
//           },
//           alt,
//           caption
//         }
//       }
//     `;

// export const buildGalleryImagesCountBySlugQuery = `
//       *[_type == "gallery" && slug.current == $slug && published == true][0] {
//         "imageCount": count(images)
//       }.imageCount
//     `;
export const buildGalleryImagesBySlugQuery = `
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
    category,
    eventDate,
    location,
    tags,
    _createdAt,
    "images": images[$start...$end] {
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
    }
  }
`;

export const buildGalleryImagesCountBySlugQuery = `
  *[_type == "gallery" && slug.current == $slug && published == true][0] {
    "imageCount": count(images)
  }.imageCount
`;