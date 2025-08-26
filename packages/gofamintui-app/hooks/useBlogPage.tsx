import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getBlogStats,
  getBlogComments,
  toggleBlogLike,
  toggleCommentLike,
  addComment,
  deleteComment,
} from "../actions/blog/likesAndCommentsInteractions";

// Types
interface User {
  id: string;
  firstName: string;
  lastName: string;
}

interface CommentReply {
  id: string;
  content: string;
  author: User;
  timeAgo: string;
  likesCount: number;
  isLiked: boolean;
  repliesCount: number;
  parentId: string;
  replyingTo: User | null;
  replies: never[];
}

interface Comment {
  id: string;
  content: string;
  author: User;
  timeAgo: string;
  likesCount: number;
  isLiked: boolean;
  repliesCount: number;
  parentId: string | null;
  replyingTo?: User | null;
  replies: CommentReply[];
}

interface BlogStats {
  likesCount: number;
  viewsCount: number;
  commentsCount: number;
  isLiked: boolean;
}

// Hook for blog stats
export const useBlogStats = (blogId: string) => {
  return useQuery<BlogStats>({
    queryKey: ["blog-stats", blogId],
    queryFn: async () => {
      const result = await getBlogStats(blogId);
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to load blog stats");
      }
      return result.data;
    },
  });
};

// Hook for blog comments
export const useBlogComments = (blogId: string) => {
  return useQuery<Comment[]>({
    queryKey: ["blog-comments", blogId],
    queryFn: async () => {
      const result = await getBlogComments(blogId);
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to load comments");
      }
      return result.data;
    },
  });
};

// Hook for blog like mutation
export const useBlogLike = (blogId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("blogId", blogId);
      return toggleBlogLike(formData);
    },
    onMutate: async () => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ["blog-stats", blogId] });

      // Get current stats
      const previousStats = queryClient.getQueryData<BlogStats>([
        "blog-stats",
        blogId,
      ]);

      if (previousStats) {
        // Optimistically update
        const newStats: BlogStats = {
          ...previousStats,
          isLiked: !previousStats.isLiked,
          likesCount: previousStats.isLiked
            ? Math.max(0, previousStats.likesCount - 1)
            : previousStats.likesCount + 1,
        };

        queryClient.setQueryData(["blog-stats", blogId], newStats);
      }

      return { previousStats };
    },
    onError: (error, variables, context) => {
      // Revert on error
      if (context?.previousStats) {
        queryClient.setQueryData(["blog-stats", blogId], context.previousStats);
      }
      toast.error("Failed to update like status");
    },
    onSuccess: (result) => {
      if (result.success && result.data) {
        // Update with server data
        queryClient.setQueryData(
          ["blog-stats", blogId],
          (prev: BlogStats | undefined) => {
            if (!prev) return prev;
            return {
              ...prev,
              isLiked: result.data!.isLiked,
              likesCount: result.data!.likesCount,
            };
          }
        );
        toast.success(result.data.isLiked ? "Post liked!" : "Post unliked!");
      } else {
        toast.error(result.error || "Failed to update like status");
      }
    },
  });
};

// Hook for comment like mutation
export const useCommentLike = (blogId: string, commentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("commentId", commentId);
      return toggleCommentLike(formData);
    },
    onMutate: async () => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ["blog-comments", blogId] });

      // Get current comments
      const previousComments = queryClient.getQueryData<Comment[]>([
        "blog-comments",
        blogId,
      ]);

      if (previousComments) {
        // Optimistically update the comment
        const updatedComments = previousComments.map((c) => {
          if (c.id === commentId) {
            return {
              ...c,
              isLiked: !c.isLiked,
              likesCount: c.isLiked
                ? Math.max(0, c.likesCount - 1)
                : c.likesCount + 1,
            };
          }

          // Update replies
          if (c.replies) {
            const updatedReplies = c.replies.map((reply) =>
              reply.id === commentId
                ? {
                    ...reply,
                    isLiked: !reply.isLiked,
                    likesCount: reply.isLiked
                      ? Math.max(0, reply.likesCount - 1)
                      : reply.likesCount + 1,
                  }
                : reply
            );
            return { ...c, replies: updatedReplies };
          }

          return c;
        });

        queryClient.setQueryData(["blog-comments", blogId], updatedComments);
      }

      return { previousComments };
    },
    onError: (error, variables, context) => {
      // Revert on error
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["blog-comments", blogId],
          context.previousComments
        );
      }
      toast.error("Failed to update like status");
    },
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error || "Failed to update like status");
      }
    },
  });
};

// Hook for adding comments
export const useAddComment = (blogId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("blogId", blogId);
      return addComment(formData);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Comment added!");
        // Refetch both comments and stats
        queryClient.invalidateQueries({ queryKey: ["blog-comments", blogId] });
        queryClient.invalidateQueries({ queryKey: ["blog-stats", blogId] });
      } else {
        toast.error(result.error || "Failed to add comment");
      }
    },
    onError: () => {
      toast.error("Failed to add comment");
    },
  });
};

// Hook for adding replies
export const useAddReply = (blogId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      parentId,
      replyingToUserId,
      replyingToUserName,
    }: {
      content: string;
      parentId: string;
      replyingToUserId: string;
      replyingToUserName: string;
    }) => {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("blogId", blogId);
      formData.append("parentId", parentId);
      formData.append("replyingToUserId", replyingToUserId);
      formData.append("replyingToUserName", replyingToUserName);

      return addComment(formData);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Reply added!");
        // Refetch comments and stats to get the latest data
        queryClient.invalidateQueries({ queryKey: ["blog-comments", blogId] });
        queryClient.invalidateQueries({ queryKey: ["blog-stats", blogId] });
      } else {
        toast.error(result.error || "Failed to add reply");
      }
    },
    onError: () => {
      toast.error("Failed to add reply");
    },
  });
};

// Export types for use in components
export type { Comment, CommentReply, BlogStats };

// Add this to your existing hooks file or replace the useBlogComments hook

import { useInfiniteQuery } from "@tanstack/react-query";
import { getBlogCommentsPaginated } from "../actions/blog/likesAndCommentsInteractions";

const COMMENTS_PER_PAGE = 2;

// New type for paginated comments response
interface PaginatedCommentsResponse {
  comments: Comment[];
  hasMore: boolean;
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// Fetch function for comments
const fetchComments = async ({
  blogId,
  page,
  limit = COMMENTS_PER_PAGE,
}: {
  blogId: string;
  page: number;
  limit?: number;
}) => {
  try {
    const result = await getBlogCommentsPaginated(blogId, page, limit);

    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to fetch comments");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// Updated hook for infinite comments
export const useBlogCommentsInfinite = (blogId: string) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["blog-comments-infinite", blogId],
    queryFn: ({ pageParam = 1 }) => {
      return fetchComments({
        blogId,
        page: pageParam,
        limit: COMMENTS_PER_PAGE,
      });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Flatten all comments from all pages
  const allComments = data?.pages?.flatMap((page) => page.comments || []) || [];

  // Get metadata from first page
  const metadata = data?.pages?.[0]
    ? {
        totalCount: data.pages[0].totalCount,
        totalPages: data.pages[0].totalPages,
      }
    : null;

  return {
    comments: allComments,
    metadata,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    fetchNextPage: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    hasNextPage,
    isEmpty: allComments.length === 0 && !isLoading,
    totalComments: allComments.length,
  };
};

// Update your comment mutations to work with infinite queries
export const useAddCommentInfinite = (blogId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("blogId", blogId);
      return addComment(formData);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Comment added!");
        // Invalidate infinite comments query to trigger refetch
        queryClient.invalidateQueries({
          queryKey: ["blog-comments-infinite", blogId],
        });
        queryClient.invalidateQueries({
          queryKey: ["blog-stats", blogId],
        });
      } else {
        toast.error(result.error || "Failed to add comment");
      }
    },
    onError: () => {
      toast.error("Failed to add comment");
    },
  });
};

// Update reply mutation for infinite queries
export const useAddReplyInfinite = (blogId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      parentId,
      replyingToUserId,
      replyingToUserName,
    }: {
      content: string;
      parentId: string;
      replyingToUserId: string;
      replyingToUserName: string;
    }) => {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("blogId", blogId);
      formData.append("parentId", parentId);
      formData.append("replyingToUserId", replyingToUserId);
      formData.append("replyingToUserName", replyingToUserName);

      return addComment(formData);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Reply added!");
        // Invalidate infinite comments query to trigger refetch
        queryClient.invalidateQueries({
          queryKey: ["blog-comments-infinite", blogId],
        });
        queryClient.invalidateQueries({
          queryKey: ["blog-stats", blogId],
        });
      } else {
        toast.error(result.error || "Failed to add reply");
      }
    },
    onError: () => {
      toast.error("Failed to add reply");
    },
  });
};

// Update comment like mutation for infinite queries
export const useCommentLikeInfinite = (blogId: string, commentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("commentId", commentId);
      return toggleCommentLike(formData);
    },
    onMutate: async () => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: ["blog-comments-infinite", blogId],
      });

      // Get current data
      const previousData = queryClient.getQueryData<{
        pages: PaginatedCommentsResponse[];
        pageParams: number[];
      }>(["blog-comments-infinite", blogId]);

      if (previousData) {
        // Optimistically update the comment in the infinite data structure
        const updatedPages = previousData.pages.map((page) => ({
          ...page,
          comments: page.comments.map((c) => {
            if (c.id === commentId) {
              return {
                ...c,
                isLiked: !c.isLiked,
                likesCount: c.isLiked
                  ? Math.max(0, c.likesCount - 1)
                  : c.likesCount + 1,
              };
            }

            // Update replies
            if (c.replies) {
              const updatedReplies = c.replies.map((reply) =>
                reply.id === commentId
                  ? {
                      ...reply,
                      isLiked: !reply.isLiked,
                      likesCount: reply.isLiked
                        ? Math.max(0, reply.likesCount - 1)
                        : reply.likesCount + 1,
                    }
                  : reply
              );
              return { ...c, replies: updatedReplies };
            }

            return c;
          }),
        }));

        queryClient.setQueryData(["blog-comments-infinite", blogId], {
          ...previousData,
          pages: updatedPages,
        });
      }

      return { previousData };
    },
    onError: (error, variables, context) => {
      // Revert on error
      if (context?.previousData) {
        queryClient.setQueryData(
          ["blog-comments-infinite", blogId],
          context.previousData
        );
      }
      toast.error("Failed to update like status");
    },
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error || "Failed to update like status");
      }
    },
  });
};

export const useDeleteCommentInfinite = (blogId: string) => {
  /**
   *
   * I already have a query client defined in a provider that wraps the app, but that is at the top level and I was band aiding that with
   * a use state cos of next.js so I had to do this here instead
   *
   * invalidating gives the that revalidatepath expereince of next.js
   *
   *
   *
   *
   * One thing I like about complex projects is that they force yuo to think and read the docs, and the more yuo read the more you see that
   * theres's a lot of real smart engineers in this world, cos how did they know that sometimes I wanna be revalidating cache
   */
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const formData = new FormData();
      formData.append("commentId", commentId);
      return deleteComment(formData);
    },
    onMutate: async (commentId: string) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: ["blog-comments-infinite", blogId],
      });

      // Get current data
      const previousData = queryClient.getQueryData<{
        pages: PaginatedCommentsResponse[];
        pageParams: number[];
      }>(["blog-comments-infinite", blogId]);

      if (previousData) {
        // Optimistically remove the comment from the infinite data structure
        const updatedPages = previousData.pages.map((page) => ({
          ...page,
          comments: page.comments.filter((comment) => {
            // Remove the comment if it matches
            if (comment.id === commentId) {
              return false;
            }

            // Also remove it from replies and filter out replies that match
            if (comment.replies) {
              comment.replies = comment.replies.filter(
                (reply) => reply.id !== commentId
              );
            }

            return true;
          }),
        }));

        queryClient.setQueryData(["blog-comments-infinite", blogId], {
          ...previousData,
          pages: updatedPages,
        });
      }

      return { previousData };
    },
    onError: (error, variables, context) => {
      // Revert on error
      if (context?.previousData) {
        queryClient.setQueryData(
          ["blog-comments-infinite", blogId],
          context.previousData
        );
      }
      toast.error("Failed to delete comment");
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Comment deleted successfully!");

        // Invalidate queries to ensure fresh data
        queryClient.invalidateQueries({
          queryKey: ["blog-comments-infinite", blogId],
        });
        queryClient.invalidateQueries({
          queryKey: ["blog-stats", blogId],
        });
      } else {
        toast.error(result.error || "Failed to delete comment");
      }
    },
  });
};
