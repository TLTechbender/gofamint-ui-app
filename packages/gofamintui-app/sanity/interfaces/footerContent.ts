import { SanityImage } from "./sanityImage";


export interface FooterLogo {
  image: SanityImage;
  alt: string;
  fellowshipName: string;
}

export interface FooterAbout {
  description: string;
}

export interface FooterAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface FooterContact {
  address: FooterAddress;
  phone: string;
  email: string;
  website?: string;
}

export interface ServiceTime {
  name: string;
  time: string;
  icon: string;
  description?: string;
}

export interface QuickLink {
  name: string;
  url: string;
  openInNewTab: boolean;
}

export interface SocialLink {
  platform:
    | "facebook"
    | "instagram"
    | "youtube"
    | "twitter"
    | "linkedin"
    | "tiktok";
  url: string;
  isActive: boolean;
}





export interface Footer {
  _id: string;
  _type: "footer";
  logo: FooterLogo;
  about: FooterAbout;
  contact: FooterContact;
  serviceTimes: ServiceTime[];
  quickLinks: QuickLink[];
  socialLinks: SocialLink[];
 
  
}


export interface LogoOnly {
  logo: FooterLogo;
}
