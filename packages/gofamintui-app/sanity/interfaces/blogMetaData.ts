import { SanityImage } from "./sanityImage";

// TypeScript Interface for the SEO response
export interface BlogMetadata {
  seo: {
    title: string;
    description: string;
    ogImage: SanityImage
  };
}
