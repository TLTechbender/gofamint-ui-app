"use server";

import { BlogPost } from "@/sanity/interfaces/blogPost";
import { blogPostQuery } from "@/sanity/queries/blogPage";
import {
  sanityPatchWrapper,
  sanityFetchWrapper,
} from "@/sanity/sanityCRUDHandlers";
import { revalidatePath } from "next/cache";

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const params = {
    slug,
  };
  try {
    const post = await sanityFetchWrapper(blogPostQuery, params);
    return post;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

export async function incrementViews(postId: string): Promise<void> {
  try {
    await sanityPatchWrapper(postId, {
      inc: { views: 1 },
    });
    revalidatePath(`/blog/[slug]`, "page");
  } catch (error) {
    console.error("Error incrementing views:", error);
  }
}
