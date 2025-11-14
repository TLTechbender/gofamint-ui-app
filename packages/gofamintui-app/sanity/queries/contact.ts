export const getFellowshipContactInfo = `*[_type == "contactInfo"][0]{
  _id,
  fellowshipName,
  address,
  directions,
  landmarks,
  googleMapsLink,
  contactPhone,
  contactEmail,
  socialMedia,
  serviceHours[] {
    day,
    time,
    serviceType,
    posterImage {
      asset->{
        _id,
        url
      },
      alt
    },
    description
  }
}`;

// 2. Get service schedule only, need this for home page
export const getServiceSchedule = `*[_type == "contactInfo"][0]{
  _id,
  fellowshipName,
  serviceHours[] {
    day,
    time,
    serviceType,
    posterImage {
      asset->{
        _id,
        url
      },
      alt
    },
    description
  }
}`;

