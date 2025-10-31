"use server";
{
  /**
    This file was gonna get bastardly long anyway and I needed at the time I was developing to put all i wanted to achieve in the same context window in my brain so I may be skipping some of my usual conventions
    */
}

{
  /**
        😢 😢 😢 😢 😢 

        God see as I dey write beans, I gats go relearn databases and how to thnik sha, grinding never stops
        */
}
{
  /**
    At the end of the day writing code comes down to problem solving, my react query knowledge heavily influenced how I was writing this mehn!!!!, 

    1. Instead of onSuccess I can just get the response and run what I need to run
    2. It's all the same with different syntax sugar
  
  Update: chai, I almost died but I found a way to band aid the entire thing ooo, chai!!!!
  subject to future updates later sha, but atm, otilor

  
    */
}

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma/prisma";

/**
 *
 * Shout out to claude ai, I didn't know how I was gonna pagniate with prisma and server actions and all and it just showed me the way
 * Safe to say I would be preaching the server actions gospel anywhere I go now, brilliant one
 *
 * Still keeping my old implementation tho
 */

// Schema definitions
const CommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment is too long")
    .trim(),
  blogId: z.string().uuid("Invalid blog ID"),
  parentId: z.string().uuid().optional(),
  replyingToUserId: z.string().uuid().optional(),
  replyingToUserName: z.string().optional(),
});

const LikeSchema = z.object({
  blogId: z.string().uuid("Invalid blog ID"),
});

const CommentLikeSchema = z.object({
  commentId: z.string().uuid("Invalid comment ID"),
});

// Type definitions
type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

type BlogStats = {
  likesCount: number;
  viewsCount: number;
  commentsCount: number;
  isLiked: boolean;
};

type BlogLikeResult = {
  isLiked: boolean;
  likesCount: number;
};

type CommentLikeResult = {
  isLiked: boolean;
  likesCount: number;
};

type CommentAuthor = {
  id: string;
  firstName: string;
  lastName: string;
  image?: string | null;
};

type CommentReply = {
  id: string;
  content: string;
  author: CommentAuthor;
  timeAgo: string;
  likesCount: number;
  isLiked: boolean;
  repliesCount: number;
  parentId: string;
  replyingTo: CommentAuthor | null;
  replies: never[];
};

type Comment = {
  id: string;
  content: string;
  author: CommentAuthor;
  timeAgo: string;
  likesCount: number;
  isLiked: boolean;
  repliesCount: number;
  parentId: string | null;
  replyingTo?: CommentAuthor | null;
  replies: CommentReply[];
};

type NewComment = {
  id: string;
  content: string;
  author: CommentAuthor;
  timeAgo: string;
  likesCount: number;
  isLiked: boolean;
  repliesCount: number;
  parentId: string | null;
  replyingTo: CommentAuthor | null;
  replies: never[];
};

// Type for Prisma query results
type PrismaComment = {
  id: string;
  content: string;
  createdAt: Date;
  parentId: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  likes: Array<{ userId: string }> | boolean;
  _count: {
    likes: number;
    replies: number;
  };
  replies: Array<{
    id: string;
    content: string;
    createdAt: Date;
    parentId: string | null;
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
    likes: Array<{ userId: string }> | boolean;
    _count: {
      likes: number;
    };
  }>;
};

// Get blog stats
export async function getBlogStats(
  blogId: string
): Promise<ActionResult<BlogStats>> {
  try {
    const session = await auth();

    const [likesCount, viewsCount, commentsCount, userLike] = await Promise.all(
      [
        prisma.blogLike.count({ where: { blogId } }),
        prisma.blog
          .findUnique({
            where: { id: blogId },
            select: { genericViewCount: true },
          })
          .then((blog) => blog?.genericViewCount || 0),
        prisma.comment.count({
          where: {
            blogId,
            parentId: null, // Only count top-level comments
          },
        }),
        session?.user?.id
          ? prisma.blogLike.findUnique({
              where: {
                userId_blogId: {
                  userId: session.user.id,
                  blogId,
                },
              },
            })
          : null,
      ]
    );

    return {
      success: true,
      data: {
        likesCount,
        viewsCount,
        commentsCount,
        isLiked: !!userLike,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch blog statistics",
    };
  }
}

// Like/Unlike blog
export async function toggleBlogLike(
  formData: FormData
): Promise<ActionResult<BlogLikeResult>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to like posts",
      };
    }

    const rawData = {
      blogId: formData.get("blogId") as string,
    };

    const validatedData = LikeSchema.safeParse(rawData);
    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.errors[0]?.message || "Invalid data",
      };
    }

    const { blogId } = validatedData.data;
    const userId = session.user.id;

    // Check if blog exists
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      return {
        success: false,
        error: "Blog not found",
      };
    }

    // Check if already liked
    const existingLike = await prisma.blogLike.findUnique({
      where: {
        userId_blogId: {
          userId,
          blogId,
        },
      },
    });

    let isLiked: boolean;

    if (existingLike) {
      // Unlike
      await prisma.blogLike.delete({
        where: {
          userId_blogId: {
            userId,
            blogId,
          },
        },
      });
      isLiked = false;
    } else {
      // Like
      await prisma.blogLike.create({
        data: {
          userId,
          blogId,
        },
      });
      isLiked = true;
    }

    // Get updated likes count
    const likesCount = await prisma.blogLike.count({
      where: { blogId },
    });

    revalidatePath(`/blog/${blog.sanitySlug}`);

    return {
      success: true,
      data: {
        isLiked,
        likesCount,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to update like status",
    };
  }
}

// Get comments with flattened structure and reply context
export async function getBlogComments(
  blogId: string
): Promise<ActionResult<Comment[]>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const comments = (await prisma.comment.findMany({
      where: {
        blogId,
        parentId: null, // Only get top-level comments
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        likes: userId
          ? {
              where: { userId },
            }
          : false,
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            likes: userId
              ? {
                  where: { userId },
                }
              : false,
            _count: {
              select: {
                likes: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })) as PrismaComment[];

    // Function to get reply context (who user is replying to)
    const getReplyingToUser = (
      commentContent: string,
      allReplies: PrismaComment["replies"]
    ): CommentAuthor | null => {
      // Look for @mention pattern in comment content
      const mentionMatch = commentContent.match(/@(\w+\s+\w+)/);
      if (mentionMatch) {
        const [firstName, lastName] = mentionMatch[1].split(" ");
        // Find the user being replied to among the replies
        const replyTarget = allReplies.find(
          (reply) =>
            reply.user.firstName === firstName &&
            reply.user.lastName === lastName
        );
        return replyTarget
          ? {
              id: replyTarget.user.id,
              firstName: replyTarget.user.firstName,
              lastName: replyTarget.user.lastName,
            }
          : null;
      }
      return null;
    };

    // Transform the data to match your UI expectations
    const transformedComments: Comment[] = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      author: {
        id: comment.user.id,
        firstName: comment.user.firstName,
        lastName: comment.user.lastName,
        image: null,
      },
      timeAgo: getTimeAgo(comment.createdAt),
      likesCount: comment._count.likes,
      isLiked: Array.isArray(comment.likes) ? comment.likes.length > 0 : false,
      repliesCount: comment._count.replies,
      parentId: null,
      replyingTo: null,
      replies: comment.replies.map((reply): CommentReply => {
        const replyingTo = getReplyingToUser(reply.content, comment.replies);

        return {
          id: reply.id,
          content: reply.content,
          author: {
            id: reply.user.id,
            firstName: reply.user.firstName,
            lastName: reply.user.lastName,
            image: null,
          },
          timeAgo: getTimeAgo(reply.createdAt),
          likesCount: reply._count.likes,
          isLiked: Array.isArray(reply.likes) ? reply.likes.length > 0 : false,
          repliesCount: 0,
          parentId: comment.id,
          replyingTo,
          replies: [],
        };
      }),
    }));

    return {
      success: true,
      data: transformedComments,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch comments",
    };
  }
}

// Add comment with flattened reply structure
export async function addComment(
  formData: FormData
): Promise<ActionResult<NewComment>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to comment",
      };
    }

    const rawData = {
      content: formData.get("content") as string,
      blogId: formData.get("blogId") as string,
      parentId: (formData.get("parentId") as string) || undefined,
      replyingToUserId:
        (formData.get("replyingToUserId") as string) || undefined,
      replyingToUserName:
        (formData.get("replyingToUserName") as string) || undefined,
    };

    const validatedData = CommentSchema.safeParse(rawData);
    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.errors[0]?.message || "Invalid comment data",
      };
    }

    const { content, blogId, parentId, replyingToUserId, replyingToUserName } =
      validatedData.data;
    const userId = session.user.id;

    // Check if blog exists
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      return {
        success: false,
        error: "Blog not found",
      };
    }

    // Logic for flattened structure
    let finalParentId = parentId;
    let finalContent = content;

    if (parentId) {
      // Check if parent comment exists
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        return {
          success: false,
          error: "Parent comment not found",
        };
      }

      // If the parent has a parent (it's a reply), use the grandparent instead
      if (parentComment.parentId) {
        finalParentId = parentComment.parentId;
      }

      // Add @mention to content if replying to someone
      if (replyingToUserName) {
        finalContent = `@${replyingToUserName} ${content}`;
      }
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content: finalContent,
        blogId,
        userId,
        parentId: finalParentId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    revalidatePath(`/blog/${blog.sanitySlug}`);

    // Get replyingTo user info for response
    let replyingToUser: CommentAuthor | null = null;
    if (replyingToUserId) {
      const replyUser = await prisma.user.findUnique({
        where: { id: replyingToUserId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      });
      if (replyUser) {
        replyingToUser = {
          id: replyUser.id,
          firstName: replyUser.firstName,
          lastName: replyUser.lastName,
        };
      }
    }

    // Transform comment for response
    const transformedComment: NewComment = {
      id: comment.id,
      content: comment.content,
      author: {
        id: comment.user.id,
        firstName: comment.user.firstName,
        lastName: comment.user.lastName,
        image: null,
      },
      timeAgo: getTimeAgo(comment.createdAt),
      likesCount: comment._count.likes,
      isLiked: false,
      repliesCount: 0,
      parentId: finalParentId || null,
      replyingTo: replyingToUser,
      replies: [],
    };

    return {
      success: true,
      data: transformedComment,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to add comment",
    };
  }
}

// Like/Unlike comment
export async function toggleCommentLike(
  formData: FormData
): Promise<ActionResult<CommentLikeResult>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to like comments",
      };
    }

    const rawData = {
      commentId: formData.get("commentId") as string,
    };

    const validatedData = CommentLikeSchema.safeParse(rawData);
    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.errors[0]?.message || "Invalid data",
      };
    }

    const { commentId } = validatedData.data;
    const userId = session.user.id;

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { blog: true },
    });

    if (!comment) {
      return {
        success: false,
        error: "Comment not found",
      };
    }

    // Check if already liked
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    let isLiked: boolean;

    if (existingLike) {
      // Unlike
      await prisma.commentLike.delete({
        where: {
          userId_commentId: {
            userId,
            commentId,
          },
        },
      });

      isLiked = false;
    } else {
      // Like
   await prisma.commentLike.create({
        data: {
          userId,
          commentId,
        },
      });
      isLiked = true;
     
    }

    // Get updated likes count
    const likesCount = await prisma.commentLike.count({
      where: { commentId },
    });



    revalidatePath(`/blog/${comment.blog.sanitySlug}`);

    return {
      success: true,
      data: {
        isLiked,
        likesCount,
      },
    };
  } catch (error) {

    return {
      success: false,
      error: "Failed to update like status",
    };
  }
}

// Utility function to format time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  } else {
    return date.toLocaleDateString();
  }
}

// Add this to your existing server actions file

// Add this new schema for pagination
const CommentPaginationSchema = z.object({
  blogId: z.string().uuid("Invalid blog ID"),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(5),
});

// New type for paginated response
type PaginatedCommentsResult = {
  comments: Comment[];
  hasMore: boolean;
  totalCount: number;
  totalPages: number;
  currentPage: number;
};

// Replace your existing getBlogComments with this paginated version
export async function getBlogCommentsPaginated(
  blogId: string,
  page: number = 1,
  limit: number = 5
): Promise<ActionResult<PaginatedCommentsResult>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    // Validate input
    const validatedData = CommentPaginationSchema.safeParse({
      blogId,
      page,
      limit,
    });

    if (!validatedData.success) {
      return {
        success: false,
        error:
          validatedData.error.errors[0]?.message || "Invalid pagination data",
      };
    }

    const { page: validPage, limit: validLimit } = validatedData.data;
    const skip = (validPage - 1) * validLimit;

    // Get total count of top-level comments
    const totalCount = await prisma.comment.count({
      where: {
        blogId,
        parentId: null,
      },
    });

    // Get paginated comments
    const comments = (await prisma.comment.findMany({
      where: {
        blogId,
        parentId: null, // Only get top-level comments
      },
      skip,
      take: validLimit,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        likes: userId
          ? {
              where: { userId },
            }
          : false,
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            likes: userId
              ? {
                  where: { userId },
                }
              : false,
            _count: {
              select: {
                likes: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })) as PrismaComment[];

    // Function to get reply context (who user is replying to)
    const getReplyingToUser = (
      commentContent: string,
      allReplies: PrismaComment["replies"]
    ): CommentAuthor | null => {
      // Look for @mention pattern in comment content
      const mentionMatch = commentContent.match(/@(\w+\s+\w+)/);
      if (mentionMatch) {
        const [firstName, lastName] = mentionMatch[1].split(" ");
        // Find the user being replied to among the replies
        const replyTarget = allReplies.find(
          (reply) =>
            reply.user.firstName === firstName &&
            reply.user.lastName === lastName
        );
        return replyTarget
          ? {
              id: replyTarget.user.id,
              firstName: replyTarget.user.firstName,
              lastName: replyTarget.user.lastName,
            }
          : null;
      }
      return null;
    };

    // Transform the data to match your UI expectations
    const transformedComments: Comment[] = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      author: {
        id: comment.user.id,
        firstName: comment.user.firstName,
        lastName: comment.user.lastName,
        image: null,
      },
      timeAgo: getTimeAgo(comment.createdAt),
      likesCount: comment._count.likes,
      isLiked: Array.isArray(comment.likes) ? comment.likes.length > 0 : false,
      repliesCount: comment._count.replies,
      parentId: null,
      replyingTo: null,
      replies: comment.replies.map((reply): CommentReply => {
        const replyingTo = getReplyingToUser(reply.content, comment.replies);

        return {
          id: reply.id,
          content: reply.content,
          author: {
            id: reply.user.id,
            firstName: reply.user.firstName,
            lastName: reply.user.lastName,
            image: null,
          },
          timeAgo: getTimeAgo(reply.createdAt),
          likesCount: reply._count.likes,
          isLiked: Array.isArray(reply.likes) ? reply.likes.length > 0 : false,
          repliesCount: 0,
          parentId: comment.id,
          replyingTo,
          replies: [],
        };
      }),
    }));

    const totalPages = Math.ceil(totalCount / validLimit);
    const hasMore = validPage < totalPages;

    return {
      success: true,
      data: {
        comments: transformedComments,
        hasMore,
        totalCount,
        totalPages,
        currentPage: validPage,
      },
    };
  } catch (error) {
   
    return {
      success: false,
      error: "Failed to fetch comments",
    };
  }
}

// Keep your original getBlogComments for backward compatibility if needed
// or replace it entirely with getBlogCommentsPaginated (claude ai)

//adding this in now cos make I no lie bro, atimes we do thigs we don't want to and we want to undo them so we gotta erase

//Edit could have been implemented too but that is something for the future

const DeleteCommentSchema = z.object({
  commentId: z.string().uuid("Invalid comment ID"),
});

//By the grace of God we give second chances

type DeleteCommentResult = {
  deletedCommentId: string;
  parentId: string | null;
  deletedRepliesCount: number;
};

// Delete comment (with cascade for replies)
export async function deleteComment(
  formData: FormData
): Promise<ActionResult<DeleteCommentResult>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to delete comments",
      };
    }

    const rawData = {
      commentId: formData.get("commentId") as string,
    };

    const validatedData = DeleteCommentSchema.safeParse(rawData);
    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.errors[0]?.message || "Invalid data",
      };
    }

    const { commentId } = validatedData.data;
    const userId = session.user.id;

    // First, fetch the comment to check ownership and get info
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        user: {
          select: { id: true },
        },
        blog: {
          select: { sanitySlug: true },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    if (!comment) {
      return {
        success: false,
        error: "Comment not found",
      };
    }

    // Check if user owns the comment
    if (comment.user.id !== userId) {
      return {
        success: false,
        error: "You can only delete your own comments",
      };
    }

    // Store info for response before deletion
    const parentId = comment.parentId;
    const repliesCount = comment._count.replies;
    const blogSlug = comment.blog.sanitySlug;

    /**
     *
     * This is one of the benefits of not fucking around with crazy nesting cos I know when I hit delete, ati replies ati everything, e go delete am
     */
    await prisma.comment.delete({
      where: { id: commentId },
    });

    revalidatePath(`/blog/${blogSlug}`);

    return {
      success: true,
      data: {
        deletedCommentId: commentId,
        parentId,
        deletedRepliesCount: repliesCount,
      },
    };
  } catch (error) {

    return {
      success: false,
      error: "Failed to delete comment",
    };
  }
}
