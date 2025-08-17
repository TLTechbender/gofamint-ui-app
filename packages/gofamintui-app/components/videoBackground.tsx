"use client";

import { useState, useRef, useEffect } from "react";

interface VideoBackgroundProps {
  videoSrc: string;
  imageSrc: string;
  className?: string;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoSrc,
  imageSrc,
  className = "",
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  console.log(videoSrc);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();
  }, [videoSrc]);

  const handleVideoCanPlayThrough = () => {
    setIsVideoLoaded(true);
  };

  const handleVideoError = () => {
    setIsVideoError(true);
  };

  const getVideoType = (src: string): string => {
    const extension = src.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "webm":
        return "video/webm";
      case "mp4":
        return "video/mp4";
      case "ogg":
        return "video/ogg";
      case "avi":
        return "video/avi";
      case "mov":
        return "video/mp4";
      default:
        return "video/mp4"; // Default fallback
    }
  };

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${className}`}>
      {/* Image Placeholder background */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${
          isVideoLoaded ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: `url(${imageSrc})`,
          transform: "translate3d(0,0,0)",
        }}
      />

      {/* Video background */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isVideoLoaded && !isVideoError ? "opacity-100" : "opacity-0"
        }`}
        onCanPlayThrough={handleVideoCanPlayThrough}
        onError={handleVideoError}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={videoSrc} type={getVideoType(videoSrc)} />
      </video>
    </div>
  );
};

export default VideoBackground;
