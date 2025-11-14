import React from "react";
import Image from "next/image";
import {
 
  ExternalLink,

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





const socialIconMap = {
  facebook: { icon: FaFacebook, color: "hover:text-blue-400" },
  instagram: { icon: FaInstagram, color: "hover:text-blue-400" },
  youtube: { icon: FaYoutube, color: "hover:text-blue-400" },
  twitter: { icon: FaXTwitter, color: "hover:text-blue-400" },
  linkedin: { icon: FaLinkedin, color: "hover:text-blue-400" },
  tiktok: { icon: FaTiktok, color: "hover:text-blue-400" },
} as const;

type SocialPlatform = keyof typeof socialIconMap;

export default async function Footer() {
  const footerContent = await getFooterConent();

  if (!footerContent) {
    return (
      <div className="bg-gray-900 text-white p-8 text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-8 h-px bg-blue-400"></div>
          <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
            Content Unavailable
          </span>
        </div>
        <p className="text-gray-300 font-light">
          Footer content is currently being updated.
        </p>
      </div>
    );
  }

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
          {/* Brand Section - Minimalist */}
          <div className="lg:col-span-1 space-y-8">
            {/* Clean Logo Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 bg-white overflow-hidden">
                  <Image
                    src={urlFor(footerContent.logo.image)
                      .width(48)
                      .height(48)
                      .format("jpg")
                      .quality(90)
                      .url()}
                    alt={footerContent.logo.alt || ""}
                    width={48}
                    height={48}
                    className="object-contain"
                    priority
                  />
                </div>
                <h2 className="text-lg font-light text-white tracking-wide">
                  {footerContent.logo?.fellowshipName}
                </h2>
              </div>

              <p className="text-gray-300 font-light leading-relaxed text-sm max-w-xs">
                {footerContent.about?.description}
              </p>
            </div>

            {/* Social Links - Minimalist Style */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-px bg-blue-400"></div>
                <span className="text-xs font-medium text-blue-400 uppercase tracking-widest">
                  Connect
                </span>
              </div>
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
                      className="w-10 h-10 border border-gray-700 hover:border-blue-400 flex items-center justify-center text-gray-300 hover:text-blue-400 transition-all duration-300"
                      aria-label={social.platform}
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Links - Clean */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-px bg-blue-400"></div>
                <span className="text-xs font-medium text-blue-400 uppercase tracking-widest">
                  Quick Links
                </span>
              </div>
              <h3 className="text-lg font-light text-white">Navigation</h3>
            </div>

            <div className="space-y-3">
              {footerContent.quickLinks?.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target={link.openInNewTab ? "_blank" : "_self"}
                  rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                  className="block text-gray-300 hover:text-blue-400 text-sm font-light transition-colors duration-300 hover:translate-x-1 transform"
                >
                  {link.name}
                  {link.openInNewTab && (
                    <ExternalLink className="w-3 h-3 ml-2 inline opacity-60" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info - Clean */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-px bg-blue-400"></div>
                <span className="text-xs font-medium text-blue-400 uppercase tracking-widest">
                  Contact
                </span>
              </div>
              <h3 className="text-lg font-light text-white">Reach Out</h3>
            </div>

            <div className="space-y-6">
              {footerContent.contact?.address && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border border-blue-400 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-blue-400"></div>
                    </div>
                    <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">
                      Address
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm font-light leading-relaxed ml-7">
                    {footerContent.contact.address.street}
                    <br />
                    {footerContent.contact.address.city},{" "}
                    {footerContent.contact.address.state}
                    {footerContent.contact.address.country && (
                      <>
                        <br />
                        {footerContent.contact.address.country}
                      </>
                    )}
                  </p>
                </div>
              )}

              {footerContent.contact?.phone && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border border-blue-400 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-blue-400"></div>
                    </div>
                    <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">
                      Phone
                    </span>
                  </div>
                  <a
                    href={`tel:${footerContent.contact.phone}`}
                    className="block text-gray-300 hover:text-blue-400 text-sm font-light transition-colors ml-7"
                  >
                    {footerContent.contact.phone}
                  </a>
                </div>
              )}

              {footerContent.contact?.email && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border border-blue-400 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-blue-400"></div>
                    </div>
                    <span className="text-xs font-medium text-blue-400 uppercase tracking-wider ">
                      Email
                    </span>
                  </div>
                  <a
                    href={`mailto:${footerContent.contact.email}`}
                    className="block text-gray-300 hover:text-blue-400 text-sm font-light transition-colors ml-7 truncate text-wrap"
                  >
                    {footerContent.contact.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Service Times - Clean */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-px bg-blue-400"></div>
                <span className="text-xs font-medium text-blue-400 uppercase tracking-widest">
                  Schedule
                </span>
              </div>
              <h3 className="text-lg font-light text-white">Service Times</h3>
            </div>

            <div className="space-y-6">
              {footerContent.serviceTimes?.map((service, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border border-blue-400 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-blue-400"></div>
                    </div>
                    <span className="text-white text-sm font-medium">
                      {service.name}
                    </span>
                  </div>
                  <div className="ml-7 space-y-1">
                    <p className="text-blue-400 text-xs font-medium tracking-wide">
                      {service.time}
                    </p>
                    {service.description && (
                      <p className="text-gray-400 text-xs font-light">
                        {service.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter/CTA Section */}
      <div className="bg-gray-800/50 border-y border-gray-700">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Stay Connected
              </span>
              <div className="w-12 h-px bg-blue-400"></div>
            </div>
            <h3 className="text-2xl md:text-3xl font-light text-white leading-tight tracking-tight">
              Stay in the Loop
            </h3>
            <p className="text-gray-300 font-light leading-relaxed max-w-lg mx-auto">
              Explore our latest blogs for inspiration and check the calendar to
              stay updated with upcoming events and gatherings.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center">
            {/* Copyright */}
            <p className="text-gray-400 text-sm font-light">
              © GSF UI {new Date().getFullYear()}. All rights reserved.
            </p>

            {/* Developer Credits */}
            <div className="text-gray-500 text-sm font-light">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span>Wrought by the hands of</span>
                <a
                  href="https://github.com/TLTechbender"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
                >
                  OluwaBrimz
                </a>
                <span>&</span>
                <a
                  href="https://github.com/devqing00"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
                >
                  Devqing
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
