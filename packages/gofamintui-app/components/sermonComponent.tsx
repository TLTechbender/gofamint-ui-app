"use client";
import { Sermon } from "@/sanity/interfaces/sermonsPage";
import Image from "next/image";
import { Calendar, Clock, Download } from "lucide-react";
import { SiTelegram } from "react-icons/si";
import { urlFor } from "@/sanity/sanityClient";
import { memo } from "react";
import { usePathname } from "next/navigation";

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

  return (
    <div className="group cursor-pointer">
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-black/30 group-hover:scale-[1.02]">
        <Image
          src={urlFor(sermon.posterImage as any)
            .width(345)
            .height(443)
            .format("webp")
            .quality(85)
            .url()}
          width={345}
          height={443}
          alt="poster image"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
          <div className="flex flex-col gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <a
              href={sermon.googleDriveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black p-4 rounded-full hover:bg-gray-100 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
              aria-label="Download from Google Drive"
            >
              <Download className="w-6 h-6" />
            </a>
            <a
              href={sermon.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white p-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
              aria-label="Open Telegram link"
            >
              <SiTelegram className="w-6 h-6" />
            </a>
          </div>
        </div>

        <div className="md:hidden absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
          <div className="flex gap-3 justify-center">
            <a
              href={sermon.googleDriveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black p-3 rounded-full transition-all duration-300 active:scale-95"
              aria-label="Download from Google Drive"
            >
              <Download className="w-5 h-5" />
            </a>
            <a
              href={sermon.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white p-3 rounded-full transition-all duration-300 active:scale-95"
              aria-label="Open Telegram link"
            >
              <SiTelegram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <h3
          className={`${isSermonPage ? "text-black group-hover:text-gray-800" : "text-white group-hover:text-gray-200"} text-lg font-semibold leading-tight line-clamp-2 transition-colors duration-300`}
        >
          {sermon.title}
        </h3>

        <div
          className={`flex items-center gap-4 ${isSermonPage ? "text-gray-700" : "text-gray-400"} text-sm`}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{sermon.date.substring(0, 10)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(sermon.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SermonComponent;
