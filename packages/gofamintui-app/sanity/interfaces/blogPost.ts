// Single Blog Post Query Interfaces

import { Author } from "./blogPosts";
import { SanityImage } from "./sanityImage";

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
export interface BlogPost {
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
