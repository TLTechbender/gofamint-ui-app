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

type IconKey = keyof typeof iconMap;

const socialIconMap = {
  facebook: { icon: FaFacebook, color: "hover:text-blue-500" },
  instagram: { icon: FaInstagram, color: "hover:text-pink-500" },
  youtube: { icon: FaYoutube, color: "hover:text-red-500" },
  twitter: { icon: FaXTwitter, color: "hover:text-blue-400" },
  linkedin: { icon: FaLinkedin, color: "hover:text-blue-600" },
  tiktok: { icon: FaTiktok, color: "hover:text-gray-300" },
} as const;

type SocialPlatform = keyof typeof socialIconMap;

export default async function Footer() {
  const footerContent = await getFooterConent();

  if (!footerContent) {
    return (
      <div className="bg-gray-900 text-white p-8 text-center">
        Content not available
      </div>
    );
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative rounded-full bg-white p-1">
                <Image
                  src={urlFor(footerContent.logo.image as any)
                    .width(72)
                    .height(72)
                    .format("jpg")
                    .quality(90)
                    .url()}
                  alt={footerContent.logo.alt || ""}
                  width={72}
                  height={72}
                  className="object-contain rounded-full"
                  priority
                />
              </div>
              <h2 className="text-xl font-bold text-white">
                {footerContent.logo?.fellowshipName}
              </h2>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              {footerContent.about?.description}
            </p>

            {/* Social Links - Moved here for better flow */}
            <div className="space-y-3">
              <h4 className="text-white font-medium text-sm">
                Connect With Us
              </h4>
              <div className="flex space-x-3">
                {footerContent.socialLinks.map((social, index) => {
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
                      className={`w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 ${socialData.color} transition-all duration-200 hover:bg-gray-700`}
                      aria-label={social.platform}
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Quick Links
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {footerContent.quickLinks?.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target={link.openInNewTab ? "_blank" : "_self"}
                  rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                  className="text-gray-300 hover:text-blue-400 text-sm py-1.5 transition-colors duration-200 flex items-center gap-1.5 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {link.name}
                  {link.openInNewTab && (
                    <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              Contact Us
            </h3>
            <div className="space-y-4">
              {footerContent.contact?.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-300 text-sm leading-relaxed">
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
                    </p>
                  </div>
                </div>
              )}
              {footerContent.contact?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <a
                    href={`tel:${footerContent.contact.phone}`}
                    className="text-gray-300 hover:text-blue-400 text-sm transition-colors"
                  >
                    {footerContent.contact.phone}
                  </a>
                </div>
              )}
              {footerContent.contact?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <a
                    href={`mailto:${footerContent.contact.email}`}
                    className="text-gray-300 hover:text-blue-400 text-sm transition-colors"
                  >
                    {footerContent.contact.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Service Times */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Service Times
            </h3>
            <div className="space-y-4">
              {footerContent.serviceTimes?.map((service, index) => {
                const IconComponent =
                  service.icon in iconMap
                    ? iconMap[service.icon as IconKey]
                    : Clock;

                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">
                        {service.name}
                      </h4>
                      <p className="text-blue-400 text-xs font-medium">
                        {service.time}
                      </p>
                      {service.description && (
                        <p className="text-gray-500 text-xs mt-1">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-white font-semibold text-lg mb-2 flex items-center justify-center lg:justify-start gap-2">
                <Mail className="w-5 h-5 text-blue-400" />
                Stay Updated
              </h3>
              <p className="text-gray-300 text-sm max-w-md">
                Subscribe to our newsletter for weekly devotionals, event
                updates, and fellowship news.
              </p>
            </div>
            <form className="w-full lg:w-auto lg:max-w-md">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm transition-all"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm whitespace-nowrap shadow-sm hover:shadow-md"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="bg-gray-950 border-t border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center">
            <p className="text-gray-400 text-xs">
              {footerContent.footerBottom.copyrightText}
            </p>
            <div className="text-gray-500 text-xs flex items-center justify-center gap-1">
              <span>
                {footerContent.footerBottom.developerCredit.techCreditText}
              </span>
              <span>by</span>
              <a
                href={footerContent.footerBottom.developerCredit.link}
                target="_blank"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                {footerContent.footerBottom.developerCredit.developerName}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
