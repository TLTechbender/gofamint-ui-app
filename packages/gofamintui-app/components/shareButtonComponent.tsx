"use client";

import { Share2 } from "lucide-react";
import { toast } from "react-toastify";

async function copyToClipboard(text: string) {
  try {
    if (!navigator.clipboard) {
      throw new Error("Clipboard API not supported");
    }
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy:", error);
    return false;
  }
}

export default function ShareButton({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const handleShare = async () => {
    const shareData = {
      title: title,
      url: url,
    };

    // Try native Web Share API first (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        // Fall back to clipboard if share is cancelled
      }
    }

    // Fallback to clipboard
    const success = await copyToClipboard(url);
    if (success) {
      // You could show a toast notification here
      toast.info("Link copied for sharing");
    } else {
      toast.error("Failed to copy link");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
    >
      <Share2 className="w-5 h-5" />
      <span className="font-medium">Share</span>
    </button>
  );
}
