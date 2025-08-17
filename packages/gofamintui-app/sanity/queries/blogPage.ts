export const blogPostQuery = `
  *[_type == "blogPost" && slug.current == $slug && !isDraft][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    featuredImage {
      asset,
      alt
    },
    author-> {
      _id,
      firstName,
      lastName,
      image,
      bio
    },
    authorInfo {
      bio,
      jobTitle,
      socialLinks
    },
    tags,
    publishedAt,
    readingTime,
    allowComments,
    likes[]-> {
      _id,
      firstName,
      lastName
    },
    views,
    seo {
      metaTitle,
      metaDescription,
      keywords
    },
    "commentCount": count(*[_type == "comment" && references(^._id) && approved == true])
  }`;
