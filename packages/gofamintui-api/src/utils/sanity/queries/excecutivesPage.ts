export const excecutivesPageQuery = `*[_type == "excecutives"][0]{
  heroSection {
    title,
    subtitle,
    image {
      asset->{
        url,
        metadata { lqip }
      },
      alt
    }
  },
  overallHead {
    posterImage {
      asset->{
        url,
        metadata { lqip }
      },
      alt
    },
    title,
    subtitle,
    actionButtons[]{
      buttonText,
      buttonUrl,
      buttonStyle
    }
  },
  infoSection {
    title,
    subTitle
  },
  excosSection {
    title,
    subTitle,
    excos[] {
      name,
      operatingCapacity,
      picture {
        asset->{
          url,
          metadata { lqip }
        },
        alt
      }
    }
  }
}`;
