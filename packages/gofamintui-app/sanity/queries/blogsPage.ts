export const buildBlogPostsQuery = (hasSearch = false) => {
  const baseFields = `
    _id,
    title,
    slug,
    excerpt,
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
    author->{
      userId,
      displayName,
      bio,
      avatar {
        asset->{
          _id,
          url
        }
      },
      socialLinks
    },
    publishedAt,
    _createdAt,
    _updatedAt,
    readingTime,
    featured,
    views
  `;

  if (hasSearch) {
    return `
      *[_type == "blogPost" && !isDraft && (
        title match $search + "*" ||
        excerpt match $search + "*"
      )] | order(publishedAt desc) [$start...$end] {
        ${baseFields}
      }
    `;
  }

  return `
    *[_type == "blogPost" && !isDraft] | order(publishedAt desc) [$start...$end] {
      ${baseFields}
    }
  `;
};

export const buildBlogPostsCountQuery = (hasSearch = false) => {
  if (hasSearch) {
    return `
      count(*[_type == "blogPost" && !isDraft && (
        title match $search + "*" ||
        excerpt match $search + "*"
      )])
    `;
  }
  return `count(*[_type == "blogPost" && !isDraft])`;
};

export const blogPostQuery = `
  *[_type == "blogPost" && slug.current == $slug && !isDraft][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
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
    author->{
      userId,
      displayName,
      bio,
      avatar {
        asset->{
          _id,
          url
        }
      },
      socialLinks
    },
    publishedAt,
    readingTime,
    views,
    seo {
      metaTitle,
      metaDescription,
      keywords
    }
  }
`;

export const authorQuery = `
  *[_type == "author" && userId == $userId && isActive == true][0] {
    _id,
    userId,
    displayName,
    bio,
    avatar {
      asset->{
        _id,
        url
      }
    },
    socialLinks
  }
`;
