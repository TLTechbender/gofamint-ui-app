export const buildSermonsQuery = (hasSearch = false) => {
  const baseFields = `
    title,
    date,
    duration,
    telegramLink,
    googleDriveLink,
    slug,
    description,
    posterImage {
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
    }
  `;

  const smartSearchCondition = `
    (
      title match $search + "*" || 
      pt::text(description) match $search + "*" ||
      lower(title) match lower($search) + "*" ||
      lower(pt::text(description)) match lower($search) + "*" ||
      title match "*" + $search + "*" ||
      pt::text(description) match "*" + $search + "*"
    )
  `;

  if (hasSearch) {
    return `
      *[_type == "sermon" && ${smartSearchCondition}] | order(date desc) [$start...$end] {
        ${baseFields}
      }
    `;
  }

  return `
    *[_type == "sermon"] | order(date desc) [$start...$end] {
      ${baseFields}
    }
  `;
};

export const buildSermonsCountQuery = (hasSearch = false) => {
  const smartSearchCondition = `
    (
      title match $search + "*" || 
      pt::text(description) match $search + "*" ||
      lower(title) match lower($search) + "*" ||
      lower(pt::text(description)) match lower($search) + "*" ||
      title match "*" + $search + "*" ||
      pt::text(description) match "*" + $search + "*"
    )
  `;

  if (hasSearch) {
    return `
      count(*[_type == "sermon" && ${smartSearchCondition}])
    `;
  }

  return `count(*[_type == "sermon"])`;
};

export const recentSermonsQuery = `
*[_type == "sermon"] | order(date desc) [0...3] {
  title,
  date,
  duration,
  telegramLink,
  googleDriveLink,
  posterImage {
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
  }
}`;

export const sermonsPageHeroMetaDataAndHeroSection = `
  *[_type == "sermonsPageMetadataAndHero"][0] {
    heroSection {
      backgroundImage {
        asset-> {
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
        hotspot,
        crop
      },
      title,
      subtitle
    },
          seo {
      title,
      description,
      keywords,
      ogImage {
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
        hotspot,
        crop,
        alt
      }
    }
  }
`;
