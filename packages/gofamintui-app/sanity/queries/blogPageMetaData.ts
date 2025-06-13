export const blogPostBySlugQuery = `
  *[_type == "blogPost" && slug.current == $slug && !isDraft][0] {
    _id,
    title,
    slug,
    author->{
      _id,
      firstName,
      lastName,
      email,
      bio,
      "image": image.asset->url
    },
    "featuredImage": featuredImage{
      "url": asset->url,
      alt,
      hotspot
    },
    excerpt,
    content,
    tags,
    publishedAt,
    isDraft,
    featured,
    readingTime,
    views,
    seo{
      title,
      description,
      keywords,
      "ogImage": ogImage{
        "url": asset->url,
        alt
      },
      canonical,
      noIndex
    },
    createdAt,
    updatedAt
  }
`;
