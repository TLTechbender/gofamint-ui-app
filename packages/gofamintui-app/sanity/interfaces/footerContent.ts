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

export interface Newsletter {
  title: string;
  description: string;
  buttonText: string;
  placeholder: string;
  isEnabled: boolean;
}

export interface LegalLink {
  name: string;
  url: string;
}

export interface DeveloperCredit {
  show: boolean;
  techCreditText: string;
  developerName: string;
  link?: string;
}

export interface FooterBottom {
  copyrightText?: string;
  legalLinks: LegalLink[];
  developerCredit: DeveloperCredit;
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
  newsletter: Newsletter;
  footerBottom: FooterBottom;
}


export interface LogoOnly {
  logo: FooterLogo;
}
