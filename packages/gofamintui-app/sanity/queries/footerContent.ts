export const footerQuery = `*[_type == "footer"][0]{
    _id,
    _type,
    logo {
      image {
        asset->{
          _id,
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        },
        alt,
        hotspot
      },
      alt,
      fellowshipName
    },
    about {
      description
    },
    contact {
      address {
        street,
        city,
        state,
        zipCode,
        country
      },
      phone,
      email,
      website
    },
    serviceTimes[] {
      name,
      time,
      icon,
      description
    },
    quickLinks[] {
      name,
      url,
      openInNewTab
    },
    socialLinks[] {
      platform,
      url,
      isActive
    },
    newsletter {
      title,
      description,
      buttonText,
      placeholder,
      isEnabled
    },
    
  }`;

export const logoQuery = `*[_type == "footer"][0]{
    logo {
      image {
        asset->{
          _id,
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        },
        alt,
        hotspot
      },
      alt,
      fellowshipName
    }
  }`;
