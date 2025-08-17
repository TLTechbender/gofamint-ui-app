"use client";
import React, { JSX, useEffect, useMemo, useState, useTransition } from "react";
import {
  Heart,
  MessageCircle,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Reply,
} from "lucide-react";
import useInfiniteCommentsList from "@/hooks/useBlogPage";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  CommentListItem,
  CommentReply,
} from "@/sanity/interfaces/blogComments";
import { formatDate } from "@/lib/dateFormatters";
import {
  createComment,
  replyToComment,
  toggleCommentLike,
} from "../actions/blogComments"; // Update this import path

// User Avatar Component to handle image loading safely
const UserAvatar = ({
  user,
  size = 40,
}: {
  user?: {
    image?: string | null;
    firstName?: string;
    lastName?: string;
  };
  size?: number;
}) => {
  const [imageError, setImageError] = useState(false);

  const initials =
    (user?.firstName?.charAt(0) || "") + (user?.lastName?.charAt(0) || "");

  if (!user?.image || imageError) {
    return (
      <div
        className={`rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-600`}
        style={{ width: size, height: size }}
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={user.image}
      alt={`${user.firstName || ""} ${user.lastName || ""}`}
      width={size}
      height={size}
      className="rounded-full object-cover"
      onError={() => setImageError(true)}
      unoptimized
    />
  );
};


function CommentItem(props: {
  comment: CommentListItem;
  isReply?: false;
  session?: any;
  blogPostId: string;
  onActionComplete?: () => void;
}): JSX.Element;
function CommentItem(props: {
  comment: CommentReply;
  isReply: true;
  session?: any;
  blogPostId: string;
  onActionComplete?: () => void;
}): JSX.Element;
function CommentItem({
  comment,
  isReply = false,
  session,
  blogPostId,
  onActionComplete,
}: {
  comment: CommentListItem | CommentReply;
  isReply?: boolean;
  session?: any;
  blogPostId: string;
  onActionComplete?: () => void;
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0);

  // Check if user has already liked this comment
  useEffect(() => {
    if (session?.user?.id && comment.likes) {
      const userHasLiked = comment.likes.some(
        (like) => like._id === session.user.id
      );
      setIsLiked(userHasLiked);
    }
  }, [session?.user?.id, comment.likes]);

  const handleLikeComment = () => {
    if (!session?.user?.id) {
      console.log("User not authenticated");
      return;
    }

    startTransition(async () => {
      try {
        // Optimistic update
        setIsLiked(!isLiked);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

        const result = await toggleCommentLike({
          commentId: comment._id,
          userId: session.user.id,
        });

        if (result.error) {
          // Revert optimistic update on error
          setIsLiked(isLiked);
          setLikesCount(comment.likesCount || 0);
          console.error("Error liking comment:", result.error);
        } else {
          // Trigger refetch of comments if callback provided
          onActionComplete?.();
        }
      } catch (error) {
        // Revert optimistic update on error
        setIsLiked(isLiked);
        setLikesCount(comment.likesCount || 0);
        console.error("Error liking comment:", error);
      }
    });
  };

  const handleLikeCommentReply = () => {
    // This is the same as handleLikeComment since replies are also comments
    handleLikeComment();
  };

  const handleSubmitCommentReply = () => {
    setShowReplyInput(!showReplyInput);
  };

  const handleSubmitComment = () => {
    // This function seems to be for main comments, not replies
    // You might want to implement this in the parent component
    console.log("Handle submit comment called");
  };

  const handleSubmitReply = () => {
    if (!replyText.trim() || !session?.user?.id) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await replyToComment({
          content: replyText,
          authorId: session.user.id,
          blogPostId: blogPostId,
          parentCommentId: comment._id,
        });

        if (result.success) {
          setReplyText("");
          setShowReplyInput(false);
          // Trigger refetch of comments if callback provided
          onActionComplete?.();
          console.log("Reply submitted successfully");
        } else {
          console.error("Error submitting reply:", result.error);
        }
      } catch (error) {
        console.error("Error submitting reply:", error);
      }
    });
  };

  // Handler functions for button clicks
  const handleLike = () => {
    handleLikeComment();
  };

  const handleReply = () => {
    handleSubmitCommentReply();
  };

  return (
    <div className={`flex gap-3 ${isReply ? "ml-12 mt-3" : "mb-6"}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <UserAvatar user={comment.author} size={40} />
      </div>

      {/* Comment Content */}
      <div className="flex-1 min-w-0">
        {/* Author and Time */}
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm text-gray-900">
            {comment.author?.firstName} {comment.author?.lastName}
          </span>
          <span className="text-xs text-gray-500">
            {`${formatDate(comment._createdAt)} ago`}
          </span>
        </div>

        {/* Comment Text */}
        <div className="text-sm text-gray-800 mb-2 whitespace-pre-wrap">
          {comment.content}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={handleLike}
            disabled={isPending}
            className={`flex items-center gap-1 text-xs hover:bg-gray-100 px-2 py-1 rounded-full transition-colors ${
              isLiked ? "text-red-600" : "text-gray-600"
            } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
            <span>{likesCount}</span>
          </button>

          {!isReply && session && (
            <button
              onClick={handleReply}
              className="flex items-center gap-1 text-xs text-gray-600 hover:bg-gray-100 px-2 py-1 rounded-full transition-colors"
            >
              <Reply size={14} />
              <span>Reply</span>
            </button>
          )}

          <button className="p-1 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical size={14} />
          </button>
        </div>

        {/* Reply Input */}
        {showReplyInput && session && (
          <div className="mt-3 mb-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <UserAvatar user={session.user} size={32} />
              </div>
              <div className="flex-1">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Add a reply..."
                  className="w-full p-2 text-sm border-b border-gray-300 focus:border-blue-500 outline-none resize-none"
                  rows={2}
                  disabled={isPending}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setShowReplyInput(false)}
                    disabled={isPending}
                    className="px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReply}
                    disabled={!replyText.trim() || isPending}
                    className="px-4 py-1 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {isPending ? "Replying..." : "Reply"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show Replies Button - Only for main comments */}
        {!isReply && (comment as CommentListItem).repliesCount > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-full mb-2 transition-colors"
          >
            {showReplies ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span>
              {showReplies ? "Hide" : "Show"}{" "}
              {(comment as CommentListItem).repliesCount}{" "}
              {(comment as CommentListItem).repliesCount === 1
                ? "reply"
                : "replies"}
            </span>
          </button>
        )}

        {/* Replies - Only for main comments */}
        {showReplies &&
          !isReply &&
          (comment as CommentListItem).replies &&
          (comment as CommentListItem).replies.length > 0 && (
            <div className="mt-2">
              {(comment as CommentListItem).replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  isReply={true}
                  session={session}
                  blogPostId={blogPostId}
                  onActionComplete={onActionComplete}
                />
              ))}
            </div>
          )}
      </div>
    </div>
  );
}

const BlogPageClient = ({ blogPostId }: { blogPostId: string }) => {
  const [newComment, setNewComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Move all hooks to the top level - this fixes invalid hook call errors
  const { data: session, status } = useSession();
  const {
    data,
    comments,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    metadata,
    refetch,
  } = useInfiniteCommentsList({ blogPostId });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Memoize comments data
  const allCommentsData = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.commentsListResponse || []);
  }, [data?.pages]);

  // Show loading state during hydration
  if (!hasMounted) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  // Handle session loading
  if (status === "loading") {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !session?.user?.id) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await createComment({
          authorId: session.user.id,
          content: newComment,
          blogPostId: blogPostId,
        });

        if (result.success) {
          setNewComment("");
          setShowCommentInput(false);
          // Trigger refetch of comments
          refetch();
          console.log("Comment submitted successfully");
        } else {
          console.error("Error submitting comment:", result.error);
        }
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    });
  };

  const handleCancelComment = () => {
    setShowCommentInput(false);
    setNewComment("");
  };

  const handleActionComplete = () => {
    // Callback to refetch comments when actions are completed
    refetch();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Comments Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">
          {comments?.length || allCommentsData.length || 0} Comments
        </h3>

        {/* Add Comment Section */}
        {session && (
          <div className="mb-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <UserAvatar user={session.user} size={40} />
              </div>
              <form className="flex-1" onSubmit={handleSubmitComment}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onFocus={() => setShowCommentInput(true)}
                  placeholder="Add a comment..."
                  className="w-full p-3 text-sm border-b border-gray-300 focus:border-blue-500 outline-none resize-none"
                  rows={showCommentInput ? 3 : 1}
                  disabled={isPending}
                />
                {showCommentInput && (
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      type="button"
                      onClick={handleCancelComment}
                      disabled={isPending}
                      className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newComment.trim() || isPending}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {isPending ? "Commenting..." : "Comment"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Sign in prompt for non-authenticated users */}
        {!session && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              Please sign in to leave a comment.
            </p>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comments List */}
      {!isLoading && (
        <div className="space-y-4">
          {allCommentsData.length > 0 ? (
            allCommentsData.map((commentItem) => (
              <CommentItem
                key={commentItem._id}
                comment={commentItem}
                session={session}
                blogPostId={blogPostId}
                onActionComplete={handleActionComplete}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">
                No comments yet. Be the first to comment!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Load More Button */}
      {hasNextPage && (
        <div className="mt-8 text-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isFetchingNextPage ? "Loading..." : "Load More Comments"}
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogPageClient;
