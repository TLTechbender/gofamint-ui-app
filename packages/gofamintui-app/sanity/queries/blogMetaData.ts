// GROQ Query for SEO data only
export const buildBlogPostSeoQuery = () => `
  *[_type == "blogPost" && slug.current == $slug && isApprovedToBePublished == true][0] {
    seo {
      title,
      description,
      ogImage {
        asset->{
          _id,
          url,
          metadata {
            dimensions,
            lqip
          }
        },
        hotspot
      }
    }
  }
`;

