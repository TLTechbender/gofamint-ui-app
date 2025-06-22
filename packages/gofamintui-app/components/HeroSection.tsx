// components/HeroSection.tsx
import { motion } from "motion/react";
import Image from "next/image";
import { urlFor } from "@/sanity/sanityClient";

export const HeroSection = ({
  title,
  subtitle,
  backgroundImage,
}: {
  title: string;
  subtitle: string;
  backgroundImage: any;
}) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={urlFor(backgroundImage).width(1920).height(1080).url()}
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div
        className="container mx-auto px-4 text-center z-10"
        // initial={{ opacity: 0, y: 20 }}
        // animate={{ opacity: 1, y: 0 }}
        // transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto">
          {subtitle}
        </p>

        <div
          className="mt-12"
          //   initial={{ opacity: 0 }}
          //   animate={{ opacity: 1 }}
          //   transition={{ delay: 0.5 }}
        >
          <a
            href="#contentSections"
            className="inline-block px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-full border border-white/20 hover:bg-white/20 transition-all"
          >
            Explore More
          </a>
        </div>
      </div>
    </section>
  );
};
