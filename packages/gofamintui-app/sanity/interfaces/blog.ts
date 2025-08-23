import { PortableTextBlock } from "@portabletext/react";
import { Author } from "./author";
import { SanityImage } from "./sanityImage";

export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface SocialMedia {
  platform:
    | "twitter"
    | "linkedin"
    | "instagram"
    | "facebook"
    | "github"
    | "website";
  url: string;
  handle?: string;
}

export interface BlogPostSlug {
  current: string;
  _type: "slug";
}

// Portable Text types for rich content

export interface BlogPost {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: BlogPostSlug;
  authorDatabaseReferenceId: string;
  author: Author;
  featuredImage?: SanityImage;
  excerpt?: string;
  content: PortableTextBlock[];
  publishedAt: string;
  isApprovedToBePublished: boolean;
  readingTime?: number;

  createdAt: string;
  updatedAt?: string;
}
