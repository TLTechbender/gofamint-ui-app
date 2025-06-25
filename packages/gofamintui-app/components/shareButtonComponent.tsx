"use client";
import { Share2, Check, Copy } from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";
import { motion } from "framer-motion";

async function copyToClipboard(text: string) {
  try {
    if (!navigator.clipboard) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
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
  variant = "default",
}: {
  url: string;
  title: string;
  variant?: "default" | "icon-only" | "text-only";
}) {
  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);

    const shareData = {
      title: title,
      text: `Check out "${title}"`,
      url: url,
    };

    // Try native Web Share API first
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setIsSharing(false);
        return;
      } catch (error) {
        // if (error.name !== "AbortError") {
        console.error("Error sharing:", error);
        // }
        // Continue to fallback if share was cancelled
      }
    }

    // Fallback to clipboard
    const success = await copyToClipboard(url);
    if (success) {
      setIsCopied(true);
      toast.success("Link copied to clipboard!", {
        position: "bottom-center",
        autoClose: 2000,
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      toast.error("Failed to copy link", {
        position: "bottom-center",
        autoClose: 2000,
      });
    }

    setIsSharing(false);
  };

  // Button variants
  const getButtonClass = () => {
    const baseClass =
      "flex items-center gap-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

    switch (variant) {
      case "icon-only":
        return `${baseClass} p-2 bg-gray-100 hover:bg-gray-200 text-gray-700`;
      case "text-only":
        return `${baseClass} px-3 py-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50`;
      default:
        return `${baseClass} px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700`;
    }
  };

  const renderContent = () => {
    if (isCopied) {
      return (
        <>
          <Check className="w-5 h-5 text-green-600" />
          {variant !== "icon-only" && (
            <span className="font-medium text-green-600">Copied!</span>
          )}
        </>
      );
    }

    return (
      <>
        <Share2
          className={`w-5 h-5 ${variant === "text-only" ? "text-blue-600" : ""}`}
        />
        {variant !== "icon-only" && <span className="font-medium">Share</span>}
      </>
    );
  };

  return (
    <motion.button
      onClick={handleShare}
      className={getButtonClass()}
      disabled={isSharing}
      whileTap={{ scale: 0.95 }}
      aria-label={isCopied ? "Link copied" : "Share this content"}
      title="Share this content"
    >
      {renderContent()}
    </motion.button>
  );
}
