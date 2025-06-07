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
        author-> {
          firstName,
          lastName
        },
        publishedAt,
        _createdAt,
        _updatedAt,
        readingTime,
        featured,
        likes,
        viewsCount
      `;

  if (hasSearch) {
    return `
          *[_type == "blogPost" && !isDraft && (
            title match $search + "*" ||
            description match $search + "*" ||
            excerpt match $search + "*"
          )] | order(publishedAt desc) [$start...$end] {
            ${baseFields}
          }
        `;
  }

  return `
        *[_type == "blogPost" ] | order(publishedAt desc) [$start...$end] {
          ${baseFields}
        }
      `;
};

export const buildBlogPostsCountQuery = (hasSearch = false) => {
  if (hasSearch) {
    return `
          count(*[_type == "blogPost" &&  !isDraft && (
            title match $search + "*" ||
            description match $search + "*" ||
            excerpt match $search + "*"
          )])
        `;
  }
  return `count(*[_type == "blogPost" && !isDraft])`;
};
