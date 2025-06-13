// TypeScript Interfaces for Fellowship Contact Information

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  whatsapp?: string;
  tiktok?: string;
}

export interface ServiceHour {
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  time: string;
  serviceType:
    | "Sunday Service"
    | "Prayer Meeting"
    | "Bible Study"
    | "Youth Service"
    | "Workers Meeting";
  posterImage?: {
    asset: {
      _ref: string;
      _type: "reference";
    };
    alt?: string;
  };
  description?: string;
}

export interface ContactInfo {
  _id: string;
  fellowshipName: string;
  address: Address;
  directions: string;
  landmarks?: string;
  googleMapsLink?: string;
  contactPhone: string;
  contactEmail: string;
  socialMedia?: SocialMedia;
  serviceHours: ServiceHour[];
}
