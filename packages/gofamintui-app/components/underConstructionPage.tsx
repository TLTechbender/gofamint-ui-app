
const UnderConstructionPage = () => {
  const bibleVerses = [
    {
      verse:
        "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.",
      reference: "Jeremiah 29:11",
    },
    {
      verse:
        "But they who wait for the Lord shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.",
      reference: "Isaiah 40:31",
    },
    {
      verse:
        "Unless the Lord builds the house, those who build it labor in vain.",
      reference: "Psalm 127:1a",
    },
    {
      verse: "Be still before the Lord and wait patiently for him.",
      reference: "Psalm 37:7a",
    },
  ];

  // Get a random verse for this page load
  const randomVerse =
    bibleVerses[Math.floor(Math.random() * bibleVerses.length)];

  return (
    <>
      <div className="bg-black h-16 mb-1 w-full flex-shrink-0" />
      <main className="bg-white h-screen ">
        <section className="relative h-screen  py-6  flex items-center justify-center overflow-hidden">
        
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>

        
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-32 h-32 border border-blue-400"></div>
            <div className="absolute bottom-32 right-32 w-24 h-24 border border-blue-400"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-blue-400"></div>
          </div>

          <div className="relative z-10 container mx-auto px-6 md:px-8 text-center">
            <div className="max-w-4xl mx-auto space-y-12">
            
              <div className="space-y-8">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="w-12 h-px bg-blue-400"></div>
                  <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                    Under Construction
                  </span>
                  <div className="w-12 h-px bg-blue-400"></div>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-black leading-tight tracking-tight">
                  This Page is Currently
                  <br />
                  <span className="text-blue-500">Under Construction</span>
                </h1>

                <p className="text-xl md:text-2xl text-black font-light leading-relaxed max-w-2xl mx-auto">
                  Thanks for your patience as we build something beautiful for
                  you.
                </p>
              </div>

              {/* Bible Verse Section */}
              <div className="bg-gray-50 p-8 md:p-12 max-w-3xl mx-auto mt-16">
                <div className="space-y-6">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-8 h-px bg-blue-400"></div>
                    <span className="text-xs font-medium text-blue-400 tracking-widest uppercase">
                      Word of Encouragement
                    </span>
                    <div className="w-8 h-px bg-blue-400"></div>
                  </div>

                  <blockquote className="text-lg md:text-xl text-black font-light italic leading-relaxed text-center">
                    {`"${randomVerse.verse}"`}
                  </blockquote>

                  <p className="text-blue-500 font-medium text-center tracking-wide">
                    — {randomVerse.reference}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default UnderConstructionPage;
