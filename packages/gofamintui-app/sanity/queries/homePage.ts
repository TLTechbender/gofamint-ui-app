export const homepageQuery = `
  *[_type == "homepage"][0] {
    _id,
    _type,
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
        crop
      }
    },
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
      subtitle,
      primaryButton {
        text,
        link
      },
      secondaryButton {
        text,
        link
      }
    },
    welcomeSection {
      title,
      description
    },
    servicesSection {
      title,
      subtitle,
      location,
      services[] {
        title,
        description,
        time,
        posterImage {
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
        }
      }
    },
    messagesSection {
      title,
      subtitle,
      viewMoreLink,
      featuredMessages[] {
        title,
        poster {
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
        duration,
        date,
        preacher,
        description,
        audioUrl,
        videoUrl,
        detailsLink,
        learnMoreLink
      }
    },
    testimonialsSection {
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
      subtitle,
      testimonials[] {
        name,
        text,
        
        position,
        date
      }
    },
    ctaSection {
      title,
      description,
      primaryButton {
        text,
        link
      },
      secondaryButton {
        text,
        link
      }
    },
    journeyPlannerSection {
      isEnabled,
      title,
      description
    }
  }
`;
