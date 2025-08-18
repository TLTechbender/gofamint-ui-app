"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Home,
  Users,
  Calendar,
  BookOpen,
  Heart,
  Phone,
  Camera,
  Radio,
  MessageCircle,
  Flame,
} from "lucide-react";
import { SanityAsset } from "@sanity/image-url/lib/types/types";
import { urlFor } from "@/sanity/sanityClient";
import Link from "next/link";

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  dropdown?: DropdownItem[];
}

interface DropdownItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavbarProps {
  logo?: SanityAsset;
  siteName?: string;
}

const Navbar: React.FC<NavbarProps> = ({ logo, siteName = "Fellowship" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const pathname = usePathname();

  // Handle mobile menu effects
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    // Set initial state
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems: NavigationItem[] = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: Users },
    {
      name: "Connect",
      icon: Heart,
      dropdown: [
        { name: "Events Calendar", href: "/events", icon: Calendar },
        { name: "Contact Us", href: "/contact", icon: Phone },
        { name: "Live Streaming", href: "/live", icon: Radio },
        { name: "Blog & News", href: "/blog", icon: MessageCircle },
      ],
    },
    {
      name: "Resources",
      icon: BookOpen,
      dropdown: [
        { name: "Sermons & Teachings", href: "/sermons", icon: BookOpen },
        { name: "Media Gallery", href: "/gallery", icon: Camera },
      ],
    },
    { name: "Give", href: "/giving", icon: Heart },
    { name: "Excos", href: "/executives", icon: Flame },
  ];

  const toggleDropdown = (index: number): void => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const isActiveLink = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const isDropdownActive = (dropdown: DropdownItem[]): boolean => {
    return dropdown.some((item) => isActiveLink(item.href));
  };

  const LogoComponent = () => (
    <div className="flex items-center">
      {logo ? (
        <Link href={`/`} className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src={urlFor((logo as any).image)
                .width(40)
                .height(40)
                .format("jpg")
                .quality(85)
                .url()}
              alt={logo.alt || "Logo"}
              width={40}
              height={40}
              className="object-contain rounded-full"
              priority
            />
          </div>
        </Link>
      ) : (
        <Link href="/" className="flex items-center">
          <div className="bg-gray-200 w-5 h-5 rounded-full " />
        </Link>
      )}
    </div>
  );

  return (
    <div className="bg-transparent ">
      {/* Desktop Navigation */}
      <nav
        className={`hidden lg:block shadow-sm transition-all duration-300 ${
          isScrolled
            ? "bg-[rgba(255,255,255,0.72)] py-3"
            : "bg-transparent shadow-2xl"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <LogoComponent />

            <div className="flex items-center space-x-8">
              {navigationItems.map((item, index) => {
                const isActive = item.href
                  ? isActiveLink(item.href)
                  : item.dropdown
                    ? isDropdownActive(item.dropdown)
                    : false;

                return (
                  <div key={item.name} className="relative group">
                    {item.dropdown ? (
                      <div>
                        <button
                          className={`flex items-center space-x-1 px-3 py-6 text-sm font-medium transition-colors duration-200 relative ${
                            isActive
                              ? "text-blue-600"
                              : isScrolled
                                ? "text-black hover:text-gray-700"
                                : "text-white hover:text-gray-300"
                          }`}
                          onMouseEnter={() => setActiveDropdown(index)}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                          <ChevronDown className="w-3 h-3" />
                          {isActive && (
                            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-orange-600 rounded-t-full" />
                          )}
                        </button>

                        <div
                          style={{
                            left: "50%",
                            transform: "translateX(-50%)",
                          }}
                          className={`fixed top-20 mt-1 w-full min-w-[60vw] max-w-[70vw] bg-white rounded-lg shadow-xl border border-gray-100 z-50 transition-all duration-500 ease-out ${
                            activeDropdown === index
                              ? "opacity-100 visible translate-y-0"
                              : "opacity-0 invisible -translate-y-4"
                          }`}
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          {/* Flex container for horizontal layout */}
                          <div className="flex divide-x divide-gray-200">
                            {item.dropdown.map(
                              (dropdownItem, dropdownIndex) => {
                                const isDropdownItemActive = isActiveLink(
                                  dropdownItem.href
                                );
                                return (
                                  <Link
                                    key={dropdownItem.name}
                                    href={dropdownItem.href}
                                    className={`flex-1 flex flex-col items-center justify-center gap-3 px-6 py-4 text-sm transition-all duration-200 ease-in-out group hover:bg-gray-50 ${
                                      dropdownIndex === 0 ? "rounded-l-lg" : ""
                                    } ${
                                      dropdownIndex ===
                                      item.dropdown!.length - 1
                                        ? "rounded-r-lg"
                                        : ""
                                    } ${
                                      isDropdownItemActive
                                        ? "bg-blue-50 text-blue-700 shadow-inner"
                                        : "hover:text-gray-700 text-black"
                                    }`}
                                  >
                                    {/* Icon with animation */}
                                    <div
                                      className={`p-2 rounded-full transition-all duration-200 ${
                                        isDropdownItemActive
                                          ? "bg-blue-100 text-blue-700 scale-110"
                                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:scale-105"
                                      }`}
                                    >
                                      <dropdownItem.icon className="w-5 h-5" />
                                    </div>

                                    {/* Text */}
                                    <span
                                      className={`font-medium transition-all duration-200 ${
                                        isDropdownItemActive
                                          ? "text-blue-700"
                                          : "text-gray-700 group-hover:text-gray-900"
                                      }`}
                                    >
                                      {dropdownItem.name}
                                    </span>

                                    {/* Active indicator pill */}
                                    {isDropdownItemActive && (
                                      <div className="w-8 h-1 bg-blue-600 rounded-full animate-pulse" />
                                    )}
                                  </Link>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href!}
                        className={`flex items-center space-x-1 px-3 py-6 text-sm font-medium transition-colors duration-200 relative ${
                          isActive
                            ? "text-blue-600"
                            : isScrolled
                              ? "text-black hover:text-gray-700"
                              : "text-white hover:text-gray-300"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span
                          className={`${isActive ? "font-bold" : "font-medium"}`}
                        >
                          {item.name}
                        </span>
                        {isActive && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full transition-all duration-300" />
                        )}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav
        className={`lg:hidden  shadow-sm relative  z-60 transition-all duration-300 ${
          isScrolled
            ? "bg-[rgba(255,255,255,0.72)]  shadow-2xl"
            : "bg-transparent shadow-2xl"
        }`}
      >
        <div className="px-4 sm:px-6 relative z-60">
          <div className="flex justify-between items-center h-16">
            <LogoComponent />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative w-8 h-8 flex flex-col justify-center items-center space-y-1 focus:outline-none p-1 "
              aria-label="Toggle menu"
            >
              <span
                className={`block w-6 h-0.5 bg-gray-600 transform transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? "rotate-45 translate-y-1.5" : "rotate-0"
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-gray-600 transform transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-gray-600 transform transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : "rotate-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu Full Screen Overlay */}
        <div
          className={`lg:hidden fixed inset-0 z-40 transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
          }`}
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Scrollable Container */}
          <div className="h-full overflow-y-auto">
            {/* Top padding to clear the header - using pt-20 for 80px (16*5) to clear h-16 header + extra space */}
            <div className="min-h-full pt-20 pb-8 px-8">
              {/* Centered Menu Content */}
              <div className="flex flex-col justify-center min-h-[calc(100%-5rem)]">
                <nav className="text-center">
                  <ul className="space-y-8">
                    {navigationItems.map((item, index) => {
                      const isActive = item.href
                        ? isActiveLink(item.href)
                        : item.dropdown
                          ? isDropdownActive(item.dropdown)
                          : false;

                      return (
                        <li key={item.name}>
                          {item.dropdown ? (
                            <div>
                              <button
                                onClick={() => toggleDropdown(index)}
                                className={`block w-full text-gray-900 text-2xl leading-[36px] transition-all duration-200 relative ${
                                  isActive
                                    ? "font-semibold"
                                    : "font-normal hover:text-blue-600 hover:scale-105"
                                } ${
                                  isActive
                                    ? "after:content-[''] after:absolute after:left-1/2 after:bottom-[-8px] after:transform after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-blue-600 after:rounded-full"
                                    : ""
                                }`}
                              >
                                <div className="flex items-center justify-center space-x-2">
                                  <item.icon className="w-6 h-6" />
                                  <span>{item.name}</span>
                                  <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${
                                      activeDropdown === index
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  />
                                </div>
                              </button>

                              {activeDropdown === index && (
                                <div className="mt-4 space-y-4">
                                  {item.dropdown.map((dropdownItem) => {
                                    const isDropdownItemActive = isActiveLink(
                                      dropdownItem.href
                                    );
                                    return (
                                      <Link
                                        key={dropdownItem.name}
                                        href={dropdownItem.href}
                                        onClick={closeMobileMenu}
                                        className={`flex items-center justify-center space-x-2 text-lg transition-all duration-200 ${
                                          isDropdownItemActive
                                            ? "text-blue-600 font-medium"
                                            : "text-gray-600 hover:text-blue-600 hover:scale-105"
                                        }`}
                                      >
                                        <dropdownItem.icon className="w-5 h-5" />
                                        <span>{dropdownItem.name}</span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ) : (
                            <Link
                              href={item.href!}
                              onClick={closeMobileMenu}
                              className={`block text-gray-900 text-2xl leading-[36px] transition-all duration-200 relative ${
                                isActive
                                  ? "font-semibold"
                                  : "font-normal hover:text-blue-600 hover:scale-105"
                              } ${
                                isActive
                                  ? "after:content-[''] after:absolute after:left-1/2 after:bottom-[-8px] after:transform after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-blue-600 after:rounded-full"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center justify-center space-x-2">
                                <item.icon className="w-6 h-6" />
                                <span>{item.name}</span>
                              </div>
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;


// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import {
//   Menu,
//   X,
//   ChevronDown,
//   Home,
//   Users,
//   Calendar,
//   BookOpen,
//   Heart,
//   Phone,
//   Camera,
//   Radio,
//   MessageCircle,
//   Flame,
//   User,
//   Settings,
//   LogOut,
//   LogIn
// } from "lucide-react";
// import { SanityAsset } from "@sanity/image-url/lib/types/types";
// import { urlFor } from "@/sanity/sanityClient";
// import Link from "next/link";

// interface NavigationItem {
//   name: string;
//   href?: string;
//   icon: React.ComponentType<{ className?: string }>;
//   dropdown?: DropdownItem[];
// }

// interface DropdownItem {
//   name: string;
//   href: string;
//   icon: React.ComponentType<{ className?: string }>;
// }

// interface UserProfile {
//   id: string;
//   name: string;
//   email: string;
//   username: string;
//   profileImage: string;
// }

// interface NavbarProps {
//   logo?: SanityAsset;
//   siteName?: string;
// }

// const Navbar: React.FC<NavbarProps> = ({ logo, siteName = "Fellowship" }) => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
//   const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
//   const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
//   const pathname = usePathname();
//   const userDropdownRef = useRef<HTMLDivElement>(null);

//   // Mock user state - replace with your actual auth state
//   const [user, setUser] = useState<UserProfile | null>({
//     id: "user_123",
//     name: "John Doe",
//     email: "john.doe@example.com",
//     username: "johndoe",
//     profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
//   });

//   // Handle clicking outside user dropdown
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
//         setUserDropdownOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Handle mobile menu effects
//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === "Escape") {
//         setIsMobileMenuOpen(false);
//         setUserDropdownOpen(false);
//       }
//     };

//     if (isMobileMenuOpen) {
//       document.addEventListener("keydown", handleEscape);
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }

//     return () => {
//       document.removeEventListener("keydown", handleEscape);
//       document.body.style.overflow = "unset";
//     };
//   }, [isMobileMenuOpen]);

//   const [isScrolled, setIsScrolled] = useState<boolean>(false);

//   useEffect(() => {
//     if (typeof document === "undefined") return;

//     const handleScroll = () => {
//       const scrollY = window.scrollY;
//       setIsScrolled(scrollY > 50);
//     };

//     handleScroll();
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const navigationItems: NavigationItem[] = [
//     { name: "Home", href: "/", icon: Home },
//     { name: "About", href: "/about", icon: Users },
//     {
//       name: "Connect",
//       icon: Heart,
//       dropdown: [
//         { name: "Events Calendar", href: "/events", icon: Calendar },
//         { name: "Contact Us", href: "/contact", icon: Phone },
//         { name: "Live Streaming", href: "/live", icon: Radio },
//         { name: "Blog & News", href: "/blog", icon: MessageCircle },
//       ],
//     },
//     {
//       name: "Resources",
//       icon: BookOpen,
//       dropdown: [
//         { name: "Sermons & Teachings", href: "/sermons", icon: BookOpen },
//         { name: "Media Gallery", href: "/gallery", icon: Camera },
//       ],
//     },
//     { name: "Give", href: "/giving", icon: Heart },
//     { name: "Excos", href: "/executives", icon: Flame },
//   ];

//   const toggleDropdown = (index: number): void => {
//     setActiveDropdown(activeDropdown === index ? null : index);
//   };

//   const closeMobileMenu = (): void => {
//     setIsMobileMenuOpen(false);
//     setActiveDropdown(null);
//   };

//   const isActiveLink = (href: string): boolean => {
//     if (href === "/") {
//       return pathname === "/";
//     }
//     return pathname.startsWith(href);
//   };

//   const isDropdownActive = (dropdown: DropdownItem[]): boolean => {
//     return dropdown.some((item) => isActiveLink(item.href));
//   };

//   const handleSignOut = () => {
//     setUser(null);
//     setUserDropdownOpen(false);
//     // Add your actual sign out logic here
//     console.log('Signing out...');
//   };

//   const handleSignIn = () => {
//     // Add your actual sign in logic here
//     console.log('Redirecting to sign in...');
//   };

//   const LogoComponent = () => (
//     <div className="flex items-center">
//       {logo ? (
//         <Link href={`/`} className="flex items-center space-x-3">
//           <div className="relative">
//             <Image
//               src={urlFor((logo as any).image)
//                 .width(40)
//                 .height(40)
//                 .format("jpg")
//                 .quality(85)
//                 .url()}
//               alt={logo.alt || "Logo"}
//               width={40}
//               height={40}
//               className="object-contain rounded-full"
//               priority
//             />
//           </div>
//         </Link>
//       ) : (
//         <Link href="/" className="flex items-center">
//           <div className="bg-gray-200 w-8 h-8 rounded-full" />
//         </Link>
//       )}
//     </div>
//   );

//   const UserAvatar = () => (
//     <div className="relative" ref={userDropdownRef}>
//       {user ? (
//         <button
//           onClick={() => setUserDropdownOpen(!userDropdownOpen)}
//           className="flex items-center space-x-2 focus:outline-none"
//         >
//           <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-transparent hover:border-blue-400 transition-colors duration-200">
//             <Image
//               src={user.profileImage}
//               alt={user.name}
//               fill
//               className="object-cover"
//               sizes="32px"
//             />
//           </div>
//         </button>
//       ) : (
//         <button
//           onClick={handleSignIn}
//           className={`flex items-center space-x-2 px-4 py-2 transition-colors duration-200 font-medium ${
//             isScrolled
//               ? "text-black hover:text-blue-600"
//               : "text-white hover:text-blue-300"
//           }`}
//         >
//           <LogIn className="w-4 h-4" />
//           <span className="hidden sm:inline">Sign In</span>
//         </button>
//       )}

//       {/* User Dropdown Menu */}
//       {user && userDropdownOpen && (
//         <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
//           {/* User Info Header */}
//           <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
//             <div className="flex items-center space-x-3">
//               <div className="relative w-10 h-10 rounded-full overflow-hidden">
//                 <Image
//                   src={user.profileImage}
//                   alt={user.name}
//                   fill
//                   className="object-cover"
//                   sizes="40px"
//                 />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-black truncate">{user.name}</p>
//                 <p className="text-xs text-gray-600 truncate">@{user.username}</p>
//               </div>
//             </div>
//           </div>

//           {/* Menu Items */}
//           <div className="py-2">
//             <Link
//               href="/dashboard"
//               onClick={() => setUserDropdownOpen(false)}
//               className="flex items-center space-x-3 px-4 py-3 text-sm text-black hover:bg-gray-50 transition-colors duration-200"
//             >
//               <User className="w-4 h-4 text-blue-400" />
//               <span>Dashboard</span>
//             </Link>
//             <Link
//               href="/dashboard#settings"
//               onClick={() => setUserDropdownOpen(false)}
//               className="flex items-center space-x-3 px-4 py-3 text-sm text-black hover:bg-gray-50 transition-colors duration-200"
//             >
//               <Settings className="w-4 h-4 text-blue-400" />
//               <span>Settings</span>
//             </Link>
//           </div>

//           {/* Sign Out */}
//           <div className="border-t border-gray-100">
//             <button
//               onClick={handleSignOut}
//               className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
//             >
//               <LogOut className="w-4 h-4" />
//               <span>Sign Out</span>
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="bg-transparent">
//       {/* Desktop Navigation */}
//       <nav
//         className={`hidden lg:block shadow-sm transition-all duration-300 ${
//           isScrolled
//             ? "bg-[rgba(255,255,255,0.72)] py-3"
//             : "bg-transparent shadow-2xl"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <LogoComponent />

//             <div className="flex items-center space-x-8">
//               {navigationItems.map((item, index) => {
//                 const isActive = item.href
//                   ? isActiveLink(item.href)
//                   : item.dropdown
//                     ? isDropdownActive(item.dropdown)
//                     : false;

//                 return (
//                   <div key={item.name} className="relative group">
//                     {item.dropdown ? (
//                       <div>
//                         <button
//                           className={`flex items-center space-x-1 px-3 py-6 text-sm font-medium transition-colors duration-200 relative ${
//                             isActive
//                               ? "text-blue-600"
//                               : isScrolled
//                                 ? "text-black hover:text-gray-700"
//                                 : "text-white hover:text-gray-300"
//                           }`}
//                           onMouseEnter={() => setActiveDropdown(index)}
//                         >
//                           <item.icon className="w-4 h-4" />
//                           <span>{item.name}</span>
//                           <ChevronDown className="w-3 h-3" />
//                           {isActive && (
//                             <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-orange-600 rounded-t-full" />
//                           )}
//                         </button>

//                         <div
//                           style={{
//                             left: "50%",
//                             transform: "translateX(-50%)",
//                           }}
//                           className={`fixed top-20 mt-1 w-full min-w-[60vw] max-w-[70vw] bg-white rounded-lg shadow-xl border border-gray-100 z-50 transition-all duration-500 ease-out ${
//                             activeDropdown === index
//                               ? "opacity-100 visible translate-y-0"
//                               : "opacity-0 invisible -translate-y-4"
//                           }`}
//                           onMouseLeave={() => setActiveDropdown(null)}
//                         >
//                           <div className="flex divide-x divide-gray-200">
//                             {item.dropdown.map(
//                               (dropdownItem, dropdownIndex) => {
//                                 const isDropdownItemActive = isActiveLink(
//                                   dropdownItem.href
//                                 );
//                                 return (
//                                   <Link
//                                     key={dropdownItem.name}
//                                     href={dropdownItem.href}
//                                     className={`flex-1 flex flex-col items-center justify-center gap-3 px-6 py-4 text-sm transition-all duration-200 ease-in-out group hover:bg-gray-50 ${
//                                       dropdownIndex === 0 ? "rounded-l-lg" : ""
//                                     } ${
//                                       dropdownIndex ===
//                                       item.dropdown!.length - 1
//                                         ? "rounded-r-lg"
//                                         : ""
//                                     } ${
//                                       isDropdownItemActive
//                                         ? "bg-blue-50 text-blue-700 shadow-inner"
//                                         : "hover:text-gray-700 text-black"
//                                     }`}
//                                   >
//                                     <div
//                                       className={`p-2 rounded-full transition-all duration-200 ${
//                                         isDropdownItemActive
//                                           ? "bg-blue-100 text-blue-700 scale-110"
//                                           : "bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:scale-105"
//                                       }`}
//                                     >
//                                       <dropdownItem.icon className="w-5 h-5" />
//                                     </div>

//                                     <span
//                                       className={`font-medium transition-all duration-200 ${
//                                         isDropdownItemActive
//                                           ? "text-blue-700"
//                                           : "text-gray-700 group-hover:text-gray-900"
//                                       }`}
//                                     >
//                                       {dropdownItem.name}
//                                     </span>

//                                     {isDropdownItemActive && (
//                                       <div className="w-8 h-1 bg-blue-600 rounded-full animate-pulse" />
//                                     )}
//                                   </Link>
//                                 );
//                               }
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ) : (
//                       <Link
//                         href={item.href!}
//                         className={`flex items-center space-x-1 px-3 py-6 text-sm font-medium transition-colors duration-200 relative ${
//                           isActive
//                             ? "text-blue-600"
//                             : isScrolled
//                               ? "text-black hover:text-gray-700"
//                               : "text-white hover:text-gray-300"
//                         }`}
//                       >
//                         <item.icon className="w-4 h-4" />
//                         <span
//                           className={`${isActive ? "font-bold" : "font-medium"}`}
//                         >
//                           {item.name}
//                         </span>
//                         {isActive && (
//                           <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full transition-all duration-300" />
//                         )}
//                       </Link>
//                     )}
//                   </div>
//                 );
//               })}
              
//               {/* User Avatar/Sign In */}
//               <UserAvatar />
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Navigation */}
//       <nav
//         className={`lg:hidden shadow-sm relative z-60 transition-all duration-300 ${
//           isScrolled
//             ? "bg-[rgba(255,255,255,0.72)] shadow-2xl"
//             : "bg-transparent shadow-2xl"
//         }`}
//       >
//         <div className="px-4 sm:px-6 relative z-60">
//           <div className="flex justify-between items-center h-16">
//             <LogoComponent />

//             <div className="flex items-center space-x-4">
//               {/* Mobile User Avatar */}
//               <UserAvatar />
              
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="relative w-8 h-8 flex flex-col justify-center items-center space-y-1 focus:outline-none p-1"
//                 aria-label="Toggle menu"
//               >
//                 <span
//                   className={`block w-6 h-0.5 bg-gray-600 transform transition-all duration-300 ease-in-out ${
//                     isMobileMenuOpen ? "rotate-45 translate-y-1.5" : "rotate-0"
//                   }`}
//                 />
//                 <span
//                   className={`block w-6 h-0.5 bg-gray-600 transform transition-all duration-300 ease-in-out ${
//                     isMobileMenuOpen ? "opacity-0" : "opacity-100"
//                   }`}
//                 />
//                 <span
//                   className={`block w-6 h-0.5 bg-gray-600 transform transition-all duration-300 ease-in-out ${
//                     isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : "rotate-0"
//                   }`}
//                 />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Menu Full Screen Overlay */}
//         <div
//           className={`lg:hidden fixed inset-0 z-40 transform transition-transform duration-300 ease-out ${
//             isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
//           }`}
//           style={{
//             background: "rgba(255, 255, 255, 0.95)",
//             backdropFilter: "blur(12px)",
//           }}
//         >
//           <div className="h-full overflow-y-auto">
//             <div className="min-h-full pt-20 pb-8 px-8">
//               <div className="flex flex-col justify-center min-h-[calc(100%-5rem)]">
//                 <nav className="text-center">
//                   <ul className="space-y-8">
//                     {navigationItems.map((item, index) => {
//                       const isActive = item.href
//                         ? isActiveLink(item.href)
//                         : item.dropdown
//                           ? isDropdownActive(item.dropdown)
//                           : false;

//                       return (
//                         <li key={item.name}>
//                           {item.dropdown ? (
//                             <div>
//                               <button
//                                 onClick={() => toggleDropdown(index)}
//                                 className={`block w-full text-gray-900 text-2xl leading-[36px] transition-all duration-200 relative ${
//                                   isActive
//                                     ? "font-semibold"
//                                     : "font-normal hover:text-blue-600 hover:scale-105"
//                                 } ${
//                                   isActive
//                                     ? "after:content-[''] after:absolute after:left-1/2 after:bottom-[-8px] after:transform after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-blue-600 after:rounded-full"
//                                     : ""
//                                 }`}
//                               >
//                                 <div className="flex items-center justify-center space-x-2">
//                                   <item.icon className="w-6 h-6" />
//                                   <span>{item.name}</span>
//                                   <ChevronDown
//                                     className={`w-4 h-4 transition-transform duration-200 ${
//                                       activeDropdown === index
//                                         ? "rotate-180"
//                                         : ""
//                                     }`}
//                                   />
//                                 </div>
//                               </button>

//                               {activeDropdown === index && (
//                                 <div className="mt-4 space-y-4">
//                                   {item.dropdown.map((dropdownItem) => {
//                                     const isDropdownItemActive = isActiveLink(
//                                       dropdownItem.href
//                                     );
//                                     return (
//                                       <Link
//                                         key={dropdownItem.name}
//                                         href={dropdownItem.href}
//                                         onClick={closeMobileMenu}
//                                         className={`flex items-center justify-center space-x-2 text-lg transition-all duration-200 ${
//                                           isDropdownItemActive
//                                             ? "text-blue-600 font-medium"
//                                             : "text-gray-600 hover:text-blue-600 hover:scale-105"
//                                         }`}
//                                       >
//                                         <dropdownItem.icon className="w-5 h-5" />
//                                         <span>{dropdownItem.name}</span>
//                                       </Link>
//                                     );
//                                   })}
//                                 </div>
//                               )}
//                             </div>
//                           ) : (
//                             <Link
//                               href={item.href!}
//                               onClick={closeMobileMenu}
//                               className={`block text-gray-900 text-2xl leading-[36px] transition-all duration-200 relative ${
//                                 isActive
//                                   ? "font-semibold"
//                                   : "font-normal hover:text-blue-600 hover:scale-105"
//                               } ${
//                                 isActive
//                                   ? "after:content-[''] after:absolute after:left-1/2 after:bottom-[-8px] after:transform after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-blue-600 after:rounded-full"
//                                   : ""
//                               }`}
//                             >
//                               <div className="flex items-center justify-center space-x-2">
//                                 <item.icon className="w-6 h-6" />
//                                 <span>{item.name}</span>
//                               </div>
//                             </Link>
//                           )}
//                         </li>
//                       );
//                     })}

//                     {/* Mobile Auth Actions */}
//                     {user && (
//                       <>
//                         <li className="pt-8 border-t border-gray-200">
//                           <Link
//                             href="/dashboard"
//                             onClick={closeMobileMenu}
//                             className="flex items-center justify-center space-x-2 text-lg text-gray-600 hover:text-blue-600 hover:scale-105 transition-all duration-200"
//                           >
//                             <User className="w-5 h-5" />
//                             <span>Dashboard</span>
//                           </Link>
//                         </li>
//                         <li>
//                           <button
//                             onClick={() => {
//                               handleSignOut();
//                               closeMobileMenu();
//                             }}
//                             className="flex items-center justify-center space-x-2 text-lg text-red-600 hover:scale-105 transition-all duration-200"
//                           >
//                             <LogOut className="w-5 h-5" />
//                             <span>Sign Out</span>
//                           </button>
//                         </li>
//                       </>
//                     )}
//                   </ul>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default Navbar;