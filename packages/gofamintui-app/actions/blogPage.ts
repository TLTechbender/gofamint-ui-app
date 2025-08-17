"use server";

import { BlogPost } from "@/sanity/interfaces/blogPost";
import { blogPostQuery } from "@/sanity/queries/blogPage";
import { sanityPatchWrapper, sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { revalidatePath } from "next/cache";

export async function getBlogPost(slug: string): Promise<BlogPost| null> {

    const params = {
       
        slug,
      };
  try {
      const post = await sanityFetchWrapper(blogPostQuery, params);
    return post
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export async function toggleLike(postId: string, userId: string): Promise<{
  success: boolean;
  isLiked: boolean;
  likesCount: number;
  error?: string;
}> {
  try {
    // First, check if user already liked the post
    const currentPost = await sanityFetchWrapper(
      `*[_type == "blogPost" && _id == $postId][0] { likes[]-> { _id } }`,
      { postId }
    )

    const isCurrentlyLiked = currentPost?.likes?.some((like: any) => like._id === userId)

    if (isCurrentlyLiked) {
     
      await sanityPatchWrapper(postId, {
        unset: [`likes[_ref == "${userId}"]`] 
      });
    } else {
  
      await sanityPatchWrapper(postId, {
        setIfMissing: { likes: [] },
        append: {
          selector: 'likes',
          items: [{ _type: 'reference', _ref: userId }] 
        }
      });
    }

    // Get updated likes count
    const updatedPost = await sanityFetchWrapper(
      `*[_type == "blogPost" && _id == $postId][0] { "likesCount": count(likes) }`,
      { postId }
    )

    // Revalidate the post page
    revalidatePath(`/blog/[slug]`, 'page')

    return {
      success: true,
      isLiked: !isCurrentlyLiked,
      likesCount: updatedPost.likesCount || 0
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return {
      success: false,
      isLiked: false,
      likesCount: 0,
      error: 'Failed to update like status'
    }
  }
}
export async function incrementViews(postId: string): Promise<void> {
  try {
    await sanityPatchWrapper(postId, {
      inc: { views: 1 }
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}


