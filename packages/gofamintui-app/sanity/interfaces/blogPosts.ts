import { SanityImage } from "./sanityImage";

interface Slug {
  current: string;
  _type: string;
}

interface SocialLink {
  platform: string;
  url: string;
  handle?: string;
}

export interface Author {
  _id: string;
  userId: string;
  displayName: string;

  avatar?: SanityImage;
 
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: Slug;
  excerpt: string;
  featuredImage: SanityImage;
  author: Author;
  publishedAt: string;
  _createdAt: string;
  _updatedAt: string;
  readingTime: number;
  featured: boolean;
  views: number; // Generic view count from Sanity
}

interface SEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

// Single Blog Post interface for single post query
export interface SingleBlogPost {
  _id: string;
  title: string;
  slug: Slug;
  excerpt: string;
  content: any; // Portable text content
  featuredImage: SanityImage;
  author: Author;
  publishedAt: string;
  readingTime: number;
  views: number; // Generic view count from Sanity
  seo?: SEO;
}

// Extended interface with SQLite engagement data
export interface BlogPostWithEngagement extends SingleBlogPost {
  userViewCount: number; // From SQLite BlogRead
  likeCount: number; // From SQLite BlogLike
  commentCount: number; // From SQLite Comment
  hasUserLiked: boolean; // If current user liked it
  hasUserRead: boolean; // If current user read it
}
