export const authorQuery = `*[_type == "author" && userId == $userId][0] {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  _rev,
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
    asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height
        },
        lqip
      }
    },
    hotspot,
    crop
  },
  socials[] {
    platform,
    url,
    handle
  }
}`;
