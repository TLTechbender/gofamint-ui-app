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

  if (hasSearch) {
    return `
          *[_type == "sermon" && (
            title match $search + "*" || pt::text(description) match $search + "*"
          )] | order(date desc) [$start...$end] {
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
  if (hasSearch) {
    return `
          count(*[_type == "sermon" && (
            title match $search + "*" || pt::text(description) match $search + "*"
          )])
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

export const sermonsPageHeroSection = `
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
    }
  }
`;
