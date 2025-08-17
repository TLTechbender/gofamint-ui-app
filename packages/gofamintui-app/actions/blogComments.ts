"use server";
import {
  sanityCreateWrapper,
  sanityFetchWrapper,
  sanityPatchWrapper,
} from "@/sanity/sanityCRUDHandlers";
import { revalidatePath } from "next/cache";

// Create a new comment
export async function createComment({
  authorId,
  content,
  blogPostId,
}: {
  authorId: string;
  content: string;
  blogPostId: string;
}) {
  try {
    if (!content || !authorId || !blogPostId) {
      return { error: "Missing required fields" };
    }

    const comment = await sanityCreateWrapper({
      _type: "comment",
      content: content.trim(),
      author: {
        _type: "reference",
        _ref: authorId,
      },
      blogPost: {
        _type: "reference",
        _ref: blogPostId,
      },
      approved: true,
      likes: [],
    });

    revalidatePath("/blog/[slug]", "page");
    return { success: true, comment };
  } catch (error) {
    console.error("Error creating comment:", error);
    return { error: "Failed to create comment" };
  }
}

// Reply to a comment
export async function replyToComment({
  content,
  authorId,
  blogPostId,
  parentCommentId,
}: {
  content: string;
  authorId: string;
  blogPostId: string;
  parentCommentId: string;
}) {
  try {
    if (!content || !authorId || !blogPostId || !parentCommentId) {
      return { error: "Missing required fields" };
    }

    const reply = await sanityCreateWrapper({
      _type: "comment",
      content: content.trim(),
      author: {
        _type: "reference",
        _ref: authorId,
      },
      blogPost: {
        _type: "reference",
        _ref: blogPostId,
      },
      parentComment: {
        _type: "reference",
        _ref: parentCommentId,
      },
      approved: true,
      likes: [],
    });

    revalidatePath("/blog/[slug]", "page");
    return { success: true, reply };
  } catch (error) {
    console.error("Error creating reply:", error);
    return { error: "Failed to create reply" };
  }
}

// Like/Unlike a comment
export async function toggleCommentLike({
  commentId,
  userId,
}: {
  commentId: string;
  userId: string;
}) {
  try {
    if (!commentId || !userId) {
      return { error: "Missing comment ID or user ID" };
    }

    // First, get the current comment to check if user already liked it
    const comment = await sanityFetchWrapper(
      `*[_type == "comment" && _id == $commentId][0]{
        _id,
        likes[]->_id
      }`,
      { commentId }
    );

    if (!comment) {
      return { error: "Comment not found" };
    }

    const userHasLiked = comment.likes?.includes(userId);

    if (userHasLiked) {
      // Remove like

      await sanityPatchWrapper(commentId, {
        unset: [`likes[_ref == "${userId}"]`],
      });
    } else {
      await sanityPatchWrapper(commentId, {
        setIfMissing: { likes: [] },
        append: {
          selector: "likes",
          items: [{ _type: "reference", _ref: userId }],
        },
      });
    }

    revalidatePath("/blog/[slug]", "page");
    return { success: true, liked: !userHasLiked };
  } catch (error) {
    console.error("Error toggling comment like:", error);
    return { error: "Failed to toggle like" };
  }
}
