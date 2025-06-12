import SermonsPageClient from "@/components/sermonsPageClient";

import { Sermons } from "@/sanity/interfaces/sermonsPage";
import { sermonsPageHeroSection } from "@/sanity/queries/sermonsPage";
import { urlFor } from "@/sanity/sanityClient";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";

export default async function SermonsPage() {
  const sermonsPageHero = await sanityFetchWrapper<Sermons>(
    sermonsPageHeroSection
  );

  return (
    <div>
      <div>
        <section id="hero">
          <div>
            <div
              className="relative min-h-[90vh] bg-fixed bg-center bg-cover flex items-center justify-center md:justify-start"
              style={{
                backgroundImage: `url(${urlFor(
                  sermonsPageHero?.heroSection.backgroundImage as any
                )
                  .width(1920)
                  .height(1080)
                  .format("webp")
                  .quality(95)
                  .url()})`,
              }}
            >
              <div className="absolute inset-0 bg-black/60 z-0"></div>

              <div className="relative z-10 w-full px-4 md:ml-6 lg:ml-16 flex flex-col gap-3 h-full text-center  justify-center  items-center ">
                <h1 className="text-white text-3xl md:text-4xl lg:text-6xl font-bold mb-4">
                  {sermonsPageHero?.heroSection.title}
                </h1>
                <h3 className="text-white text-xl lg:text-2xl ">
                  {sermonsPageHero?.heroSection.subtitle}
                </h3>
              </div>
            </div>
          </div>
        </section>

        <section id="second">
          <SermonsPageClient />
        </section>
      </div>
    </div>
  );
}
