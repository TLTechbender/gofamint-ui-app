"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const WhatsAppContactWidget = ({
  phoneNumber = "YOUR_NUMBER",
  message = "Hi! I'm interested in attending your next service.",
  title = "Want to attend our next service?",
  subtitle = "Reach out on WhatsApp",
  buttonText = "Message Us",
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
  };

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-[calc(100vw-3rem)]">
      <div
        className="bg-white rounded-2xl shadow-2xl relative border border-gray-100 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Subtle close option - only shows on hover */}
        {isHovered && (
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-all duration-200 p-1 hover:bg-gray-100 rounded-full"
            aria-label="Close widget"
          >
            <X size={14} />
          </button>
        )}

        {/* Gradient accent bar */}
        <div className="h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>

        <div className="flex items-center gap-2 md:gap-4 px-3 md:px-6 py-3 md:py-4">
          <div className="bg-gradient-to-br from-green-400 to-green-500 p-2 md:p-3 rounded-full flex-shrink-0 shadow-lg">
            <MessageCircle
              size={16}
              className="md:w-5 md:h-5 text-white animate-pulse"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-xs md:text-sm text-gray-800 truncate">
              {title}
            </p>
            <p className="text-gray-500 text-xs font-medium truncate">
              {subtitle}
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium text-xs md:text-sm flex-shrink-0 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {buttonText}
          </a>
        </div>

        {/* Alternative: "No thanks" text link at bottom */}
        <div className="px-3 md:px-6 pb-2 md:pb-3">
          <button
            onClick={handleClose}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200 underline decoration-dotted"
          >
            No thanks, maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppContactWidget;
