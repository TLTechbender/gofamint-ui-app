import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true,
  apiVersion: "2024-10-01",
  token: process.env.NEXT_SANITY_TOKEN!,
});

const builder = imageUrlBuilder(sanityClient);
export const urlFor = (source: string) => builder.image(source);
