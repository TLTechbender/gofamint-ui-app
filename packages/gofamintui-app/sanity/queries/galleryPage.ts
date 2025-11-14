// export const buildGalleryImagesBySlugQuery = `
//   *[_type == "gallery" && slug.current == $slug && published == true][0] {
//     _id,
//     title,
//     slug,
//     description,
//     featuredImage {
//       asset->{
//         _id,
//         url,
//         metadata {
//           lqip,
//           dimensions {
//             width,
//             height
//           }
//         }
//       },
//       alt
//     },
//     category,
//     eventDate,
//     location,
//     tags,
//     _createdAt,
//     _type == "galleryImage" => {
//         _type,
//         image { asset->{url}, alt },
//         alt,
//         caption,
//         photographer
//       },
//       _type == "galleryVideo" => {
//         _type,
//         video { asset->{url} },
//         caption,
//         videographer,
//         thumbnail { asset->{url} }
//       },
//       alt,
//       caption,
//       photographer
//     }
//   }
// `;

// export const buildGalleryImagesCountBySlugQuery = `
//   *[_type == "gallery" && slug.current == $slug && published == true][0] {
//     "mediaCount": count(media)
//   }.imageCount
// `;


