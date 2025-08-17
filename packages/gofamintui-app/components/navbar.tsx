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
  const [isClient, setIsClient] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
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
    if (!isClient) return;
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const isActiveLink = (href: string): boolean => {
    if (!isClient) return false;
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const isDropdownActive = (dropdown: DropdownItem[]): boolean => {
    if (!isClient) return false;
    return dropdown.some((item) => isActiveLink(item.href));
  };

  const LogoComponent = () => (
    <div className="flex items-center">
      {logo && isClient ? (
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
          <div className="text-2xl font-bold text-gray-900 lg:text-2xl sm:text-xl">
            {siteName}
          </div>
        </Link>
      )}
    </div>
  );

  if (!isClient) {
    return (
      <div className="bg-white">
        <nav className="hidden lg:block bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <LogoComponent />
              <div className="flex items-center space-x-8">
                {navigationItems.map((item) => (
                  <div key={item.name} className="relative group">
                    <div className="flex items-center space-x-1 px-3 py-4 text-sm font-medium text-gray-600">
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                      {item.dropdown && <ChevronDown className="w-3 h-3" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <nav className="lg:hidden bg-white shadow-sm border-b border-gray-100">
          <div className="px-4 sm:px-6">
            <div className="flex justify-between items-center h-16">
              <LogoComponent />
              <button className="text-gray-600 p-2">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <nav className="hidden lg:block bg-white shadow-sm border-b border-gray-100">
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
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                          onMouseEnter={() => setActiveDropdown(index)}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                          <ChevronDown className="w-3 h-3" />
                          {isActive && (
                            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-blue-600 rounded-t-full" />
                          )}
                        </button>

                        <div
                          className={`absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 transition-all duration-200 ${
                            activeDropdown === index
                              ? "opacity-100 visible"
                              : "opacity-0 invisible"
                          }`}
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          {item.dropdown.map((dropdownItem) => {
                            const isDropdownItemActive = isActiveLink(
                              dropdownItem.href
                            );
                            return (
                              <Link
                                key={dropdownItem.name}
                                href={dropdownItem.href}
                                className={`flex items-center space-x-3 px-4 py-3 text-sm transition-colors duration-150 ${
                                  isDropdownItemActive
                                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                              >
                                <dropdownItem.icon className="w-4 h-4" />
                                <span>{dropdownItem.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href!}
                        className={`flex items-center space-x-1 px-3 py-6 text-sm font-medium transition-colors duration-200 relative ${
                          isActive
                            ? "text-blue-600"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span
                          className={`${isActive ? "font-bold" : "font-medium"}`}
                        >
                          {item.name}
                        </span>
                        {isActive && (
                          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-blue-600 rounded-t-full" />
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

      <nav className="lg:hidden bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <LogoComponent />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`${isMobileMenuOpen ? "block" : "hidden"} border-t border-gray-100 bg-white`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item, index) => {
              const isActive = item.href
                ? isActiveLink(item.href)
                : item.dropdown
                  ? isDropdownActive(item.dropdown)
                  : false;

              return (
                <div key={item.name}>
                  {item.dropdown ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(index)}
                        className={`flex items-center justify-between w-full text-left px-3 py-3 rounded-md transition-colors duration-150 relative ${
                          isActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            activeDropdown === index ? "rotate-180" : ""
                          }`}
                        />
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r" />
                        )}
                      </button>

                      {activeDropdown === index && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.dropdown.map((dropdownItem) => {
                            const isDropdownItemActive = isActiveLink(
                              dropdownItem.href
                            );
                            return (
                              <Link
                                key={dropdownItem.name}
                                href={dropdownItem.href}
                                onClick={closeMobileMenu}
                                className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors duration-150 relative ${
                                  isDropdownItemActive
                                    ? "bg-blue-100 text-blue-800"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                              >
                                <dropdownItem.icon className="w-4 h-4" />
                                <span>{dropdownItem.name}</span>
                                {isDropdownItemActive && (
                                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-600 rounded-r" />
                                )}
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
                      className={`flex items-center space-x-3 px-3 py-3 rounded-md transition-colors duration-150 relative ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r" />
                      )}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
