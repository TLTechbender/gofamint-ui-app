"use client";
import { Sermon } from "@/sanity/interfaces/sermonsPage";
import Image from "next/image";
import { Calendar, Clock, Download, Play } from "lucide-react";
import { SiTelegram } from "react-icons/si";
import { urlFor } from "@/sanity/sanityClient";
import { memo } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const formatDuration = (duration: string | number): string => {
  if (typeof duration === "string") {
    if (
      duration.includes("min") ||
      duration.includes("sec") ||
      duration.includes("h") ||
      duration.includes("m")
    ) {
      return duration;
    }

    const numDuration = parseInt(duration);
    if (!isNaN(numDuration)) {
      return formatMinutesAndSeconds(numDuration);
    }

    if (duration.includes(":")) {
      const [minutes, seconds] = duration.split(":").map(Number);
      if (!isNaN(minutes) && !isNaN(seconds)) {
        return formatMinutesAndSeconds(minutes, seconds);
      }
    }

    return duration;
  }

  if (typeof duration === "number") {
    if (duration > 120) {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return formatMinutesAndSeconds(minutes, seconds);
    } else {
      return formatMinutesAndSeconds(duration);
    }
  }

  return "N/A";
};

const formatMinutesAndSeconds = (
  minutes: number,
  seconds: number = 0
): string => {
  if (minutes === 0 && seconds === 0) return "N/A";

  if (seconds === 0) {
    return `${minutes} min`;
  }

  if (minutes === 0) {
    return `${seconds} sec`;
  }

  return `${minutes}m ${seconds}s`;
};

const SermonComponent = memo(({ sermon }: { sermon: Sermon }) => {
  const pathname = usePathname();
  const isSermonPage = pathname.includes("/sermons");
  const isDarkMode = !isSermonPage;

  return (
    <motion.div
      className="group cursor-pointer"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-xl">
        {/* Poster Image */}
        <Image
          src={urlFor(sermon.posterImage as any)
            .width(400)
            .height(500)
            .format("webp")
            .quality(90)
            .url()}
          width={400}
          height={500}
          alt={sermon.title || "Sermon poster"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Hover Actions */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-sm">
          <div className="flex gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {/* Play Button (if video available) */}
            {/* {sermon?.videoLink && (
              <a
                href={sermon?.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                aria-label="Watch sermon video"
              >
                <Play className="w-6 h-6 fill-current" />
              </a>
            )} */}

            {/* Download Button */}
            <a
              href={sermon.googleDriveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-900 p-4 rounded-full hover:bg-gray-100 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              aria-label="Download sermon"
            >
              <Download className="w-6 h-6" />
            </a>

            {/* Telegram Button */}
            <a
              href={sermon.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0088cc] text-white p-4 rounded-full hover:bg-[#0077b5] transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              aria-label="Share on Telegram"
            >
              <SiTelegram className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
          <div className="flex gap-3 justify-center">
            {/* {sermon.videoLink && (
              <a
                href={sermon.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white p-3 rounded-full transition-all duration-200 active:scale-95"
                aria-label="Watch sermon video"
              >
                <Play className="w-5 h-5 fill-current" />
              </a>
            )} */}
            <a
              href={sermon.googleDriveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-900 p-3 rounded-full transition-all duration-200 active:scale-95"
              aria-label="Download sermon"
            >
              <Download className="w-5 h-5" />
            </a>
            <a
              href={sermon.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0088cc] text-white p-3 rounded-full transition-all duration-200 active:scale-95"
              aria-label="Share on Telegram"
            >
              <SiTelegram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Sermon Info */}
      <div className="mt-4 space-y-2">
        <h3
          className={`${
            isDarkMode ? "text-white" : "text-gray-900"
          } text-lg font-semibold leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-200`}
        >
          {sermon.title}
        </h3>

        <div
          className={`flex items-center gap-4 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          } text-sm`}
        >
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(sermon.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(sermon.duration)}</span>
          </div>
        </div>

        {/* {sermon.preacher && (
          <p
            className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} mt-1`}
          >
            By {sermon.preacher}
          </p>
        )} */}
      </div>
    </motion.div>
  );
});

SermonComponent.displayName = "SermonComponent";
export default SermonComponent;
