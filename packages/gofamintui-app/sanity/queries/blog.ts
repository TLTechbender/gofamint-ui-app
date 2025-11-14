export const buildSingleBlogPostQuery = () => `
  *[_type == "blogPost" && slug.current == $slug && isApprovedToBePublished == true][0] {
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
