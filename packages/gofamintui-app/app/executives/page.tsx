import { ExcecutivesPageData } from "@/sanity/interfaces/excecutivesPage";
import { excecutivesPageQuery } from "@/sanity/queries/excecutivesPage";

import { urlFor } from "@/sanity/sanityClient";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import Image from "next/image";

export default async function Excecutives() {
  const excosPageData =
    await sanityFetchWrapper<ExcecutivesPageData>(excecutivesPageQuery);

  console.log(excosPageData);

  // Handle empty or null data
  if (!excosPageData || Object.keys(excosPageData).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No Executive Data Available
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            We're currently updating our executives information. Please check
            back later or contact us for more details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Secti
      on - Keep as is */}
   
      <section id="hero">
        <div
          className="relative min-h-[90vh] bg-fixed bg-center bg-cover flex items-center justify-center md:justify-start"
          style={{
            backgroundImage: `url(${urlFor(
              excosPageData.heroSection?.image as any
            )
              ?.width(1920)
              .height(1080)
              .format("webp")
              .quality(95)
              .url()})`,
          }}
        >
          <div className="absolute inset-0 bg-black/60 z-0"></div>
          <div className="relative z-10 w-full px-4 md:ml-6 lg:ml-16 flex flex-col gap-3 h-full text-center justify-center items-center">
            <h1 className="text-white text-3xl md:text-4xl lg:text-6xl font-bold mb-4">
              {excosPageData.heroSection?.title}
            </h1>
            <h3 className="text-white text-xl lg:text-2xl">
              {excosPageData.heroSection?.subtitle}
            </h3>
          </div>
        </div>
      </section>

      {/* Info Section - Light Gray Background */}
      <section id="info" className="bg-gray-50">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="flex flex-col gap-8 lg:gap-12 lg:flex-row lg:items-center max-w-6xl mx-auto">
            <div className="lg:basis-1/2">
              <h2 className="text-gray-900 font-bold text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight text-center lg:text-left mb-6">
                {excosPageData.infoSection?.title}
              </h2>
            </div>
            <div className="lg:basis-1/2">
              <p className="text-lg text-gray-700 leading-relaxed text-center lg:text-left">
                {excosPageData.infoSection?.subTitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Overall Head Section - White Background with Subtle Shadow */}
      <section id="boss" className="bg-white">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              {/* Image Container */}
              <div className="lg:basis-2/5">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image
                    width={500}
                    height={600}
                    className="w-full h-auto object-cover"
                    alt="Overall Head"
                    src={urlFor(excosPageData.overallHead.posterImage as any)
                      ?.width(500)
                      .height(600)
                      .format("webp")
                      .quality(95)
                      .url()}
                  />
                </div>
              </div>

              {/* Content Container */}
              <div className="lg:basis-3/5 text-center lg:text-left">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                      Leadership Excellence
                    </h2>
                    <h3 className="text-xl md:text-2xl text-gray-600 font-medium">
                      Guiding Our Organization Forward
                    </h3>
                  </div>

                  <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
                    Our leadership team brings decades of combined experience
                    and unwavering commitment to excellence, driving innovation
                    and success across all organizational levels.
                  </p>

                  <div className="pt-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executives Grid Section - Light Blue Background */}
      <section
        id="executives"
        className="bg-gradient-to-br from-blue-50 to-indigo-50"
      >
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {excosPageData.excosSection?.title || "Our Executive Team"}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {excosPageData.excosSection?.subTitle ||
                  "Meet the dedicated professionals leading our organization with vision, expertise, and commitment to excellence."}
              </p>
            </div>

            {/* Executives Grid */}
            {excosPageData.excosSection?.excos &&
            excosPageData.excosSection.excos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                {excosPageData.excosSection.excos.map((exco, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden max-w-sm w-full transform hover:-translate-y-2"
                  >
                    {/* Image Container - Passport Style */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <Image
                        width={300}
                        height={400}
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                        alt={`${exco.name} - ${exco.operatingCapacity}`}
                        src={urlFor(exco.picture as any)
                          ?.width(300)
                          .height(400)
                          .format("webp")
                          .quality(95)
                          .url()}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {exco.name}
                      </h3>
                      <p className="text-blue-600 font-medium text-sm uppercase tracking-wide">
                        {exco.operatingCapacity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Executives Available
                </h3>
                <p className="text-gray-500">
                  Executive information will be displayed here when available.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
