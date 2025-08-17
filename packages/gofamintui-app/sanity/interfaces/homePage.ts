import { SanityImage } from "./sanityImage";

interface SanityVideoMetadata {
  duration?: number;
  dimensions?: {
    width: number;
    height: number;
    aspectRatio: number;
  };
  size?: number;
  mimeType?: string;
  [key: string]: unknown;
}

//Keeping this export here cos this be the only place I be using it
export interface SanityVideoAsset {
  asset: {
    _id: string;
    metadata: Required<SanityVideoMetadata>;
    url: string;
  };
}

interface SliderImage {
  image: SanityImage;
}
export interface Homepage {
  _id: string;
  _type: "homepage";

  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: SanityImage;
  };
  heroSection: {
    backgroundImage: SanityImage;
    backgroundVideo: SanityVideoAsset;

    title: string;
    subtitle: string;
    primaryButton: {
      text: string;
      link: string;
    };
    secondaryButton: {
      text: string;
      link: string;
    };
  };
  welcomeSection: {
    title: string;
    description: string;
    imageSlider: SliderImage[];
  };
  servicesSection: {
    title: string;
    subtitle: string;
    location: string;
    services: {
      title: string;
      description: string;
      time: string;
      posterImage: SanityImage;
    }[];
  };
  journeyPlannerSection: {
    title: string;
    description: string;
  };
  messagesSection: {
    title: string;
    subtitle: string;
    viewMoreLink: string;
    featuredMessages: {
      title: string;
      poster: SanityImage;
      duration: string;
      date: string;
      preacher: string;
      description: string;
      audioUrl?: string;
      videoUrl?: string;
      detailsLink: string;
      learnMoreLink: string;
    }[];
  };
  testimonialsSection: {
    backgroundImage: SanityImage;
    title: string;
    subtitle: string;
    testimonials: {
      name: string;
      text: string;
      image?: SanityImage;
      position?: string;
      date: string;
    }[];
  };
  ctaSection: {
    title: string;
    description: string;
    ctaBigImage: SanityImage;
  };
}
