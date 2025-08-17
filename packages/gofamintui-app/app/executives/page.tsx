import { Metadata } from "next";
import { ExcecutivesPageData } from "@/sanity/interfaces/excecutivesPage";
import { excecutivesPageQuery } from "@/sanity/queries/excecutivesPage";
import { urlFor } from "@/sanity/sanityClient";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import Image from "next/image";

// Keep your existing generateMetadata function as is...
export async function generateMetadata(): Promise<Metadata> {
  // Your existing metadata logic here - it's perfect
}

export const dynamic = "force-dynamic";

export default async function Executives() {
  const excosPageData =
    await sanityFetchWrapper<ExcecutivesPageData>(excecutivesPageQuery);

  // Handle empty or null data with minimalist design
  if (!excosPageData || Object.keys(excosPageData).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-4 max-w-md">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-px bg-blue-400"></div>
            <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
              Coming Soon
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-black mb-6 leading-tight">
            Executive Team
          </h2>
          <p className="text-black font-light leading-relaxed">
            We're currently finalizing our executive team information. Please
            check back soon or contact us for details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white">
      {/* Professional Split Hero Section */}
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Mobile: Full overlay design */}
        <div className="pt-20 mb-2 bg-black h-16 w-full"/>
        <div className="md:hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={urlFor(excosPageData.heroSection?.image as any)
                ?.width(1080)
                .height(1920)
                .format("webp")
                .quality(95)
                .url()}
              alt=""
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative z-10 min-h-[90vh] flex items-center justify-center px-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight tracking-tight">
                {excosPageData.heroSection?.title}
              </h1>
              <p className="text-xl text-white/90 font-light max-w-md mx-auto leading-relaxed">
                {excosPageData.heroSection?.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Desktop: Split layout with clipped image */}
        <div className="hidden bg-[#f4f4f4] md:flex min-h-[80vh] pt-8">
          {/* Content Side - Left */}
          <div className="flex-1  flex items-center justify-end pr-8 lg:pr-16 xl:pr-24">
            <div className="max-w-lg text-right">
              <div className="flex items-center justify-end space-x-3 mb-8">
                <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                  Leadership Team
                </span>
                <div className="w-12 h-px bg-blue-400"></div>
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light text-black mb-8 leading-tight tracking-tight">
                {excosPageData.heroSection?.title}
              </h1>

              <p className="text-lg lg:text-xl text-black font-light leading-relaxed mb-10">
                {excosPageData.heroSection?.subtitle}
              </p>

            
            </div>
          </div>

          {/* Image Side - Right with Clipping */}
          <div className="flex-1 relative">
            {/* Main clipped image container */}
            <div
              className="absolute inset-0 bg-gray-100"
              style={{
                clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)",
              }}
            >
              <Image
                src={urlFor(excosPageData.heroSection?.image as any)
                  ?.width(1200)
                  .height(1080)
                  .format("webp")
                  .quality(95)
                  .url()}
                alt=""
                fill
                className="object-cover object-center"
                priority
              />

              {/* Subtle gradient overlay for depth */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"
                style={{
                  clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)",
                }}
              />
            </div>

            {/* Decorative accent line */}
            <div
              className="absolute inset-y-0 bg-blue-400 w-1 z-10"
              style={{
                left: "15%",
                transform: "translateX(-50%)",
              }}
            />
          </div>
        </div>
      </section>

      {/* Clean Info Section */}
      <section className="bg-white py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-start">
            <div className="md:col-span-5">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-px bg-blue-400"></div>
                <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                  Leadership
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-black leading-tight tracking-tight">
                {excosPageData.infoSection?.title}
              </h2>
            </div>
            <div className="md:col-span-7">
              <p className="text-lg md:text-xl text-black font-light leading-relaxed">
                {excosPageData.infoSection?.subTitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Overall Head Section - Minimalist */}
      <section className="bg-gray-50 py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-center">
            {/* Sharp-edged Image */}
            <div className="md:col-span-5 group">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={urlFor(excosPageData.overallHead.posterImage as any)
                    ?.width(600)
                    .height(750)
                    .format("webp")
                    .quality(95)
                    .url()}
                  alt="Overall Head"
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </div>
            </div>

            {/* Clean Content */}
            <div className="md:col-span-7 space-y-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-px bg-blue-400"></div>
                <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                  Leadership Excellence
                </span>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-light text-black leading-tight tracking-tight">
                  Guiding Our Organization Forward
                </h2>

                <p className="text-lg text-black font-light leading-relaxed max-w-2xl">
                  Our leadership team brings decades of combined experience and
                  unwavering commitment to excellence, driving innovation and
                  success across all organizational levels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executives Grid - Clean Minimalist */}
      <section className="bg-white py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          {/* Section Header */}
          <div className="mb-20 md:mb-24">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Our Team
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-8 leading-tight tracking-tight">
              {excosPageData.excosSection?.title || "Executive Team"}
            </h1>
            <p className="text-lg md:text-xl text-black font-light leading-relaxed max-w-3xl">
              {excosPageData.excosSection?.subTitle ||
                "Meet the dedicated professionals leading our organization with vision, expertise, and commitment to excellence."}
            </p>
          </div>

          {/* Clean Executive Cards */}
          {excosPageData.excosSection?.excos &&
          excosPageData.excosSection.excos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
              {excosPageData.excosSection.excos.map((exco, index) => (
                <div
                  key={index}
                  className="group bg-white transition-all duration-300"
                >
                  {/* Sharp Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden mb-6">
                    <Image
                      src={urlFor(exco.picture as any)
                        ?.width(400)
                        .height(500)
                        .format("webp")
                        .quality(95)
                        .url()}
                      alt={`${exco.name} - ${exco.operatingCapacity}`}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                  </div>

                  {/* Minimal Content */}
                  <div className="space-y-2">
                    <h3 className="text-lg md:text-xl font-medium text-black group-hover:text-blue-500 transition-colors duration-300">
                      {exco.name}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 font-light tracking-wide uppercase">
                      {exco.operatingCapacity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="w-8 h-px bg-blue-400"></div>
                <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                  Coming Soon
                </span>
              </div>
              <h3 className="text-2xl font-light text-black mb-4">
                Executive Profiles
              </h3>
              <p className="text-black font-light">
                Executive information will be displayed here when available.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
