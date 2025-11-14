export const blogsPageMetadataAndHeroQuery = `
  *[_type == "blogsPage"][0] {
    _id,
    _type,
    seo {
      title,
      description,
      keywords,
      ogImage {
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
        hotspot,
        crop,
        alt
      }
    },
    heroSection {
      backgroundImage {
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
        hotspot,
        crop,
        alt
      },
      title,
      subtitle
    }
  }
`;
