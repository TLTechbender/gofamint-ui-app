// Single Blog Post Query Interfaces

interface Asset {
  _id: string;
  url: string;
  metadata?: {
    lqip: string;
    dimensions: {
      width: number;
      height: number;
    };
  };
}

interface FeaturedImage {
  asset: Asset;
  alt: string;
}

interface AuthorImage {
  asset: Asset;
  alt?: string;
}

interface Author {
  _id: string;
  firstName: string;
  lastName: string;
  image?: AuthorImage;
  bio?: string;
}

interface AuthorInfo {
  bio?: string;
  jobTitle?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    instagram?: string;
    facebook?: string;
  };
}

interface LikedUser {
  _id: string;
  firstName: string;
  lastName: string;
}

interface SEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

interface Slug {
  current: string;
  _type: "slug";
}

// Main Blog Post interface for single post query
export interface BlogPost{
  _id: string;
  title: string;
  slug: Slug;
  excerpt: string;
  content: any; // This could be more specific based on your content structure (e.g., PortableText)
  featuredImage: FeaturedImage;
  author: Author;
  authorInfo?: AuthorInfo;
  tags?: string[]; // Adjust based on your tag structure
  publishedAt: string;
  readingTime: number;
  allowComments: boolean;
  likes: LikedUser[];
  views: number;
  seo?: SEO;
  commentCount: number;
}
