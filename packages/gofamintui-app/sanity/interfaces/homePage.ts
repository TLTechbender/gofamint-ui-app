import { SanityImage } from "./sanityImage";

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
    primaryButton: {
      text: string;
      link: string;
    };
    secondaryButton: {
      text: string;
      link: string;
    };
  };
  journeyPlannerSection: {
    isEnabled: boolean;
    title?: string;
    description?: string;
  };
}
