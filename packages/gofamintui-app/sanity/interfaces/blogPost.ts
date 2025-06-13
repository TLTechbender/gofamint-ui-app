// Blog Post Query Return Interface
export interface BlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
    _type: "slug";
  };
  excerpt?: string;
  content: Array<{
    _type: "block" | "image";
    _key: string;
    // Block content properties
    style?: "normal" | "h1" | "h2" | "h3" | "h4" | "blockquote";
    listItem?: "bullet" | "number";
    level?: number;
    children?: Array<{
      _type: "span";
      _key: string;
      text: string;
      marks?: string[];
    }>;
    markDefs?: Array<{
      _type: "link";
      _key: string;
      href: string;
    }>;
    // Image content properties
    asset?: {
      _ref: string;
      _type: "reference";
    };
    alt?: string;
  }>;
  featuredImage?: {
    asset: {
      _id: string;
      url: string;
      metadata?: {
        dimensions?: {
          width: number;
          height: number;
        };
      };
    };
    alt?: string;
  };
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    bio?: string;
    jobTitle?: string;
    profileImage?: {
      asset: {
        _id: string;
        url: string;
      };
      alt?: string;
    };
    socialLinks?: {
      instagram?: string;
      whatsapp?: string;
      linkedin?: string;
      twitter?: string;
      facebook?: string;
      website?: string;
    };
  };
  tags?: string[];
  publishedAt?: string;
  readingTime?: number;
  views?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}
