export const aboutPageQuery = `
*[_type == "aboutpage"][0]{
  heroSection {
    backgroundImage {
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
      crop
    },
    title,
    subtitle
  },
  establishedSection {
    yearLabel,
    title
  },
  whoWeAreSection {
    label,
    content
  },
  beliefsSection {
    sectionLabel,
    title,
    convictionsTitle,
    convictions,
    faithLabel,
    faithTitle,
    faithPoints
  },
  imageTextSections[] {
  
    title,
    subtitle,
    image {
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
      alt,
      caption
    },
    imagePosition,
    content
  }
}

`;
