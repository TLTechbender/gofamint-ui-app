import Link from "next/link";

interface NavigationLink {
  text: string;
  href: string;
  description: string;
}

const NotFoundPage = () => {
  const navigationLinks: NavigationLink[] = [
    {
      text: "Home",
      href: "/",
      description: "Return to our main page",
    },
    {
      text: "About Us",
      href: "/about",
      description: "Learn about our fellowship",
    },
    {
      text: "Excos",
      href: "/executives",
      description: "Meet our leadership",
    },
    {
      text: "Blog",
      href: "/blog",
      description: "Read our spirit filled blogs and be blessed"
    },
    {
      text: "Events",
      href: "/events",
      description: "Upcoming programs",
    },
    {
      text: "Gallery",
      href: "/gallery",
      description: "Fellowship moments",
    },
    {
      text: "Contact",
      href: "/contact",
      description: "Get in touch with us",
    },
  ];

  return (
    <>
      <div className="bg-black h-16 mb-2 w-full flex-shrink-0" />
      <main className="my-8 bg-white flex items-center justify-center px-6 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Number - Large and Minimal */}
          <div className="mb-12">
            <span className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-light text-gray-100 leading-none select-none">
              404
            </span>
          </div>

          {/* Blue Accent Line */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-12 h-px bg-blue-400"></div>
            <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
              Page Not Found
            </span>
            <div className="w-12 h-px bg-blue-400"></div>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-8 leading-tight tracking-tight">
            Looks like you've wandered off the path
          </h1>

          {/* Bible Reference */}
          <div className="mb-12 space-y-6">
            <blockquote className="text-lg md:text-xl text-black font-light italic leading-relaxed max-w-3xl mx-auto">
              "What do you think? If a man owns a hundred sheep, and one of them
              wanders away, will he not leave the ninety-nine on the hills and
              go to look for the one that wandered off?"
            </blockquote>
            <cite className="text-sm md:text-base text-gray-600 font-medium tracking-wide">
              — Matthew 18:12 (NIV)
            </cite>
          </div>

          {/* Encouraging Message */}
          <p className="text-lg text-black font-light leading-relaxed mb-16 max-w-2xl mx-auto">
            Just like the shepherd searches for his lost sheep, we're here to
            help you find your way. The page you're looking for might have
            moved, but you're always welcome in our fellowship.
          </p>

          {/* Primary Action - Go Home */}
          <div className="mb-16">
            <Link
              href="/"
              className="inline-flex items-center space-x-3 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 transition-all duration-300 hover:shadow-lg group"
            >
              <svg
                className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="font-medium tracking-wide">Return Home</span>
            </Link>
          </div>

          {/* Navigation Grid */}
          <div className="border-t border-gray-200 pt-16">
            <div className="flex items-center justify-center space-x-3 mb-12">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Or Explore These Pages
              </span>
              <div className="w-8 h-px bg-blue-400"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {navigationLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="group p-6 border border-gray-100 hover:border-blue-200 bg-white hover:bg-blue-50/30 transition-all duration-300"
                >
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-black group-hover:text-blue-600 transition-colors duration-300">
                      {link.text}
                    </h3>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      {link.description}
                    </p>
                    <div className="flex items-center space-x-2 text-blue-500 group-hover:text-blue-600 transition-colors duration-300">
                      <span className="text-sm font-medium">Visit page</span>
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Message */}
          <div className="mt-20 pt-12 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-light">
              Still can't find what you're looking for?
              <Link
                href="/contact"
                className="text-blue-500 hover:text-blue-600 font-medium ml-1 hover:underline transition-colors duration-200"
              >
                Contact us
              </Link>{" "}
              and we'll help you find your way.
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFoundPage;
