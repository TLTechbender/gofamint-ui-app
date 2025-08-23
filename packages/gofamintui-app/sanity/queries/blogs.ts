export const buildBlogPostsQuery = (hasSearch: boolean = false) => `
  *[
    _type == "blogPost" 
    && isApprovedToBePublished == true
    ${hasSearch ? "&& (title match $search || excerpt match $search || content[].children[].text match $search)" : ""}
  ] | order(publishedAt desc) [$start...$end] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    authorDatabaseReferenceId,
    featuredImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      alt,
      hotspot
    },
    excerpt,
    content,
    publishedAt,
    isApprovedToBePublished,
    readingTime,
    createdAt,
    updatedAt,
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
    },
    author->{
      _id,
      userId,
      email,
      userName,
      firstName,
      lastName,
      phoneNumber,
      userBio,
      requestedAt,
      application {
        isApproved,
        status,
        approvedAt,
        rejectionReason
      },
      authorBio,
      profilePic {
        asset->{
          _id,
          url,
          metadata {
            dimensions,
            lqip
          }
        },
        hotspot
      },
      socials[] {
        platform,
        url,
        handle
      }
    }
  }
`;

export const buildBlogPostsCountQuery = (hasSearch: boolean = false) => `
  count(*[
    _type == "blogPost" 
    && isApprovedToBePublished == true
    ${hasSearch ? "&& (title match $search || excerpt match $search || content[].children[].text match $search)" : ""}
  ])
`;
