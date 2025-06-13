export const blogPostQuery = `
  *[_type == "blogPost" && slug.current == $slug && !isDraft][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    featuredImage {
      asset-> {
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
      alt
    },
    author-> {
      _id,
      firstName,
      lastName,
      bio,
      jobTitle,
      profileImage {
        asset-> {
          _id,
          url
        },
        alt
      },
      socialLinks {
        instagram,
        whatsapp,
        linkedin,
        twitter,
        facebook,
        website
      }
    },
    tags,
    publishedAt,
    readingTime,
    views,
    seo {
      metaTitle,
      metaDescription,
      keywords
    },
    createdAt,
    updatedAt
  }`;
