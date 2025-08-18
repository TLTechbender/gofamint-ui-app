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
    
    publishedAt,
    readingTime,
   
   
    seo {
      metaTitle,
      metaDescription,
      keywords
    },
  
  }`;
