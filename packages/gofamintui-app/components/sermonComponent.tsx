"use client";
import { Sermon } from "@/sanity/interfaces/sermonsPage";
import Image from "next/image";
import { Download } from "lucide-react";
import { SiTelegram } from "react-icons/si";
import { urlFor } from "@/sanity/sanityClient";
import { memo } from "react";

const SermonComponent = memo(({ sermon }: { sermon: Sermon }) => {
  return (
    <div>
      <div className="relative w-full basis-1/2 aspect-[345/442] overflow-hidden rounded-lg group">
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
          className="w-full h-full object-cover"
        />

        {/* Overlay with links - shows on hover for desktop, always visible on mobile */}
        <div className="absolute inset-0 bg-black/60 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex flex-col gap-3 md:gap-4">
            <a
              href={sermon.googleDriveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black p-3 md:p-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
              aria-label="Download from Google Drive"
            >
              <Download className="w-5 h-5 md:w-6 md:h-6" />
            </a>
            <a
              href={sermon.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white p-3 md:p-4 rounded-lg hover:bg-white hover:text-black transition-colors flex items-center justify-center"
              aria-label="Open Telegram link"
            >
              <SiTelegram className="w-5 h-5 md:w-6 md:h-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3.5 basis-1/2 text-white">
        <p>{sermon.title}</p>
        <span>
          <p>{sermon.date}</p>
          <p>{sermon.duration}</p>
        </span>
      </div>
    </div>
  );
});

export default SermonComponent;
