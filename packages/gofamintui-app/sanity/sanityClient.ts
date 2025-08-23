// import { createClient } from "@sanity/client";
// import imageUrlBuilder from "@sanity/image-url";

// export const sanityClient = createClient({
//   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
//   dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
//   useCdn: false,
//   apiVersion: "2025-04-01",
//   token: process.env.NEXT_SANITY_TOKEN!,
// });

import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { SanityAsset } from "@sanity/image-url/lib/types/types";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  apiVersion: "2025-04-01",
  //No be my fault, i no wan make am public
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN || process.env.NEXT_SANITY_TOKEN,
  // Use the new cache configuration
  fetch: {
    cache: "no-store",
  },
});
  const builder = imageUrlBuilder(sanityClient);
  export const urlFor = (source:SanityAsset) => builder.image(source);