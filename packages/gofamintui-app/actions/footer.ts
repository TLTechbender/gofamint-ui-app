"use server";

import { Footer } from "@/sanity/interfaces/footerContent";
import { footerQuery } from "@/sanity/queries/footerContent";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";

export async function getFooterConent(): Promise<Footer | null> {
  try {
    const post = await sanityFetchWrapper(footerQuery);
    return post;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}
