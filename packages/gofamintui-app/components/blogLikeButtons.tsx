"use client";

import { toast } from "react-toastify";

import { useState, useTransition } from "react";

import { Heart } from "lucide-react";
import { toggleLike } from "@/actions/blogPage";

interface LikePostButtonProps {
  postId: string;
  userId: string | null;
  initialIsLiked: boolean;
  initialLikesCount: number;
}

export function LikePostButton({
  postId,
  userId,
  initialIsLiked,
  initialLikesCount,
}: LikePostButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isPending, startTransition] = useTransition();

  const handleLike = async () => {
    if (!userId) {
      toast.error("You have to be signed in to perform this action");
      return;
    }

    const newIsLiked = !isLiked;
    const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;

    setIsLiked(newIsLiked);
    setLikesCount(newLikesCount);

    startTransition(async () => {
      const result = await toggleLike(postId, userId);

      if (!result.success) {
        // Revert optimistic update on error
        setIsLiked(!newIsLiked);
        setLikesCount(likesCount);
        console.error("Failed to update like:", result.error);
      } else {
        // Update with server response (in case of any discrepancy)
        setIsLiked(result.isLiked);
        setLikesCount(result.likesCount);
      }
    });
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending }
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full transition-all
        ${
          isLiked
            ? "bg-red-100 text-red-600 hover:bg-red-200"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }
        ${isPending ? "opacity-50 cursor-not-allowed" : ""}
       
      `}
    >
      <Heart size={20} className={isLiked ? "fill-current" : ""} />
      <span>{likesCount}</span>
      {isPending && <span className="text-xs">...</span>}
    </button>
  );
}




