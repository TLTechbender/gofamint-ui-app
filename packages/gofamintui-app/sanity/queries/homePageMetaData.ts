export const homepageMetadataQuery = `
  *[_type == "homepage"][0] {
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
    }
  }
`;
