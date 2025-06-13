export const aboutPageQuery = `*[_type == "aboutpage"][0]{
    _id,
    _rev,
 
    heroSection {
      backgroundImage {
        asset->{
          _id,
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        },
        hotspot,
        crop
      },
      title,
      subtitle
    },
    contentSections[] {
      sectionId,
      title,
      subtitle,
      content
    },
    imageTextSections[] {
      sectionId,
      title,
      subtitle,
      image {
        asset->{
          _id,
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        },
        alt,
        caption,
        hotspot,
        crop
      },
      imagePosition,
      content,
      styling {
        backgroundColor,
        paddingSize
      }
    }
  }`;