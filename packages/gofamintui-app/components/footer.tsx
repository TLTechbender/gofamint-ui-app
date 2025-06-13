import React from "react";
import Image from "next/image";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Users,
  Coffee,
  Clock,
  ExternalLink,
  Music,
} from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { getFooterConent } from "@/actions/footer";
import { urlFor } from "@/sanity/sanityClient";

const iconMap = {
  Users,
  Heart,
  Coffee,
  BookOpen,
  Music,
  Clock,
  Calendar,
} as const;

// Type for valid icon keys
type IconKey = keyof typeof iconMap;

// Social platform mapping with proper typing
const socialIconMap = {
  facebook: { icon: FaFacebook, color: "hover:text-blue-600" },
  instagram: { icon: FaInstagram, color: "hover:text-pink-600" },
  youtube: { icon: FaYoutube, color: "hover:text-red-600" },
  twitter: { icon: FaXTwitter, color: "hover:text-blue-400" },
  linkedin: { icon: FaLinkedin, color: "hover:text-blue-700" },
  tiktok: { icon: FaTiktok, color: "hover:text-black-400" },
} as const;

type SocialPlatform = keyof typeof socialIconMap;

export default async function Footer() {
  const footerContent = await getFooterConent();

  if (!footerContent) {
    return <div>Content not available</div>;
  }

  return (
    <footer className="bg-gray-800 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* About Section - Enhanced */}
          <div className="lg:col-span-1">
            <span className="flex items-center mb-6 flex-flow gap-1.5">
              <Image
                src={urlFor(footerContent.logo.image as any)
                  .width(40)
                  .height(40)
                  .format("jpg")
                  .quality(85)
                  .url()}
                alt={footerContent.logo.alt || ""}
                width={40}
                height={40}
                className="object-contain rounded-full"
                priority
              />

              <p className="text-2xl font-bold text-white">
                {footerContent.logo?.fellowshipName}
              </p>
            </span>
            <p className="text-gray-300 mb-8 leading-relaxed text-base">
              {footerContent.about?.description}
            </p>

            {/* Contact Info - Better spacing */}
            <div className="space-y-4">
              {footerContent.contact?.address && (
                <div className="flex items-start space-x-4">
                  <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-medium text-sm">
                      Address
                    </div>
                    <span className="text-gray-300 text-sm">
                      {footerContent.contact.address.street}
                      <br />
                      {footerContent.contact.address.city},{" "}
                      {footerContent.contact.address.state}{" "}
                      {footerContent.contact.address.zipCode}
                      {footerContent.contact.address.country &&
                        footerContent.contact.address.country !==
                          "United States" && (
                          <>
                            <br />
                            {footerContent.contact.address.country}
                          </>
                        )}
                    </span>
                  </div>
                </div>
              )}
              {footerContent.contact?.phone && (
                <div className="flex items-center space-x-4">
                  <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium text-sm">Phone</div>
                    <span className="text-gray-300 text-sm">
                      {footerContent.contact.phone}
                    </span>
                  </div>
                </div>
              )}
              {footerContent.contact?.email && (
                <div className="flex items-center space-x-4">
                  <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium text-sm">Email</div>
                    <span className="text-gray-300 text-sm">
                      {footerContent.contact.email}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links - Better organization */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <BookOpen className="w-5 h-5 mr-3 text-blue-400" />
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {footerContent.quickLinks?.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target={link.openInNewTab ? "_blank" : "_self"}
                  rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm py-1 hover:translate-x-1 transform transition-transform flex items-center"
                >
                  {link.name}
                  {link.openInNewTab && (
                    <ExternalLink className="w-3 h-3 ml-1" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Service Times & Social - Combined */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-3 text-blue-400" />
              Service Times
            </h3>
            <div className="space-y-5 mb-8">
              {footerContent.serviceTimes?.map((service, index) => {
                // Type-safe icon selection with fallback
                const IconComponent =
                  service.icon in iconMap
                    ? iconMap[service.icon as IconKey]
                    : Clock;

                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">
                        {service.name}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {service.time}
                      </div>
                      {service.description && (
                        <div className="text-gray-500 text-xs mt-1">
                          {service.description}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 capitalize">
                Connect With Us on our social media platforms{" "}
              </h4>
              <div className="flex space-x-4">
                {footerContent.socialLinks.map((social, index) => {
                  // Type-safe social icon selection
                  const socialData =
                    social.platform in socialIconMap
                      ? socialIconMap[social.platform as SocialPlatform]
                      : null;

                  if (!socialData) return null;

                  const IconComponent = socialData.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 ${socialData.color} transition-all duration-200 hover:transform hover:scale-110`}
                      aria-label={social.platform}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section - Enhanced */}
      <div className="border-t border-gray-700 bg-gray-750">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h3 className="text-white font-bold text-xl mb-2 flex items-center justify-center md:justify-start">
                <Mail className="w-5 h-5 mr-2 text-blue-400" />
                Stay Connected
              </h3>
              <p className="text-gray-300 text-base">
                Get updates on events, sermons, and community news delivered to
                your inbox.
              </p>
            </div>
            <div className="flex md:w-auto max-w-md">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-200"
              />
              <button className="px-8 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-lg hover:shadow-xl">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer - Cleaner */}
      <div className="border-t border-gray-700 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm text-center md:text-left">
              {`${footerContent.footerBottom.copyrightText}`}
            </div>

            {/* Built with love section */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-gray-400 text-sm text-center md:text-right">
                <p>
                  {footerContent.footerBottom.developerCredit.techCreditText}
                </p>

                <p>by</p>

                <a
                  href={footerContent.footerBottom.developerCredit.link}
                  target="_blank"
                  className="text-underline"
                >
                  {footerContent.footerBottom.developerCredit.developerName}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
