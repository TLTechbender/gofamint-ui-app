import React from "react";

interface SlideshowProps {
  images?: string[];
  speed?: number;
}

const ImagesScrollingContainer: React.FC<SlideshowProps> = ({
  images,
  speed = 30,
}) => {
  if (!images) return;
  const duplicatedImages = [...images, ...images];

  return (
    <div className="w-full overflow-hidden ">
      <div className="h-48 md:h-64 lg:h-80 xl:h-96 overflow-hidden">
        <div
          className="flex items-center h-full gap-4 md:gap-6"
          style={{
            width: "fit-content",
            animation: `slideLeftWelcomeSection ${speed}s linear infinite`,
          }}
        >
          {duplicatedImages.map((image, index) => {
            const isOdd = index % 2 === 0; // 0-indexed, so 0,2,4... are "odd" in our pattern

            //Next nha big scam walahi, I dey use normal img tag here, the werey no complain
            return (
              <picture
                key={index}
                className={`flex-shrink-0 rounded-xl overflow-hidden bg-transparent  duration-300 ${
                  isOdd
                    ? "w-32 h-40 md:w-40 md:h-52 lg:w-48 lg:h-64 xl:w-56 xl:h-72" // tall
                    : "w-48 h-28 md:w-60 md:h-36 lg:w-72 lg:h-44 xl:w-80 xl:h-48" // wide
                }`}
              >
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </picture>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ImagesScrollingContainer;
