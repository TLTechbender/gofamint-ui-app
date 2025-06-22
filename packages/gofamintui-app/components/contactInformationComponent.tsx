"use client";
import { JSX, useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  MessageCircle,
  Navigation,
  Users,
  Heart,
  Calendar,
  Send,
} from "lucide-react";
import {
  ContactInfo,
  ServiceHour,
  SocialMedia,
} from "@/sanity/interfaces/contact";
import { urlFor } from "@/sanity/sanityClient";
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import GoogleMap from "./googleMap";

type TabType = "contact" | "location" | "services";

const ContactInformationComponent = ({
  contactInfo,
}: {
  contactInfo: ContactInfo;
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("contact");
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleWhatsAppContact = (): void => {
    if (contactInfo?.socialMedia?.whatsapp) {
      const message = encodeURIComponent(
        "Hello! I found your fellowship online and would like to know more about your services."
      );
      const phoneNumber = contactInfo.socialMedia.whatsapp.replace("+", "");
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    }
  };

  const handleDirections = (): void => {
    if (contactInfo?.googleMapsLink) {
      window.open(contactInfo.googleMapsLink, "_blank");
    }
  };

  const getSocialIcon = (platform: keyof SocialMedia): JSX.Element => {
    const iconClass = "w-5 h-5";
    switch (platform) {
      case "facebook":
        return <FaFacebook className={`${iconClass} text-blue-600`} />;
      case "instagram":
        return <FaInstagram className={`${iconClass} text-pink-600`} />;
      case "twitter":
        return <FaXTwitter className={`${iconClass} text-blue-400`} />;
      case "youtube":
        return <FaYoutube className={`${iconClass} text-red-600`} />;
      case "tiktok":
        return <FaTiktok className={`${iconClass} text-gray-800`} />;
      case "whatsapp":
        return <FaWhatsapp className={`${iconClass} text-green-600`} />;
      default:
        return <ExternalLink className={`${iconClass} text-blue-500`} />;
    }
  };

  const dayOrder: ServiceHour["day"][] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const groupServicesByDay = (): Record<string, ServiceHour[]> => {
    if (!contactInfo?.serviceHours) return {};
    return contactInfo.serviceHours.reduce(
      (acc: Record<string, ServiceHour[]>, service: ServiceHour) => {
        if (!acc[service.day]) acc[service.day] = [];
        acc[service.day].push(service);
        return acc;
      },
      {}
    );
  };

  const tabConfig = [
    { key: "contact" as const, label: "Contact", icon: Phone },
    { key: "location" as const, label: "Location", icon: MapPin },
    { key: "services" as const, label: "Service Hours", icon: Calendar },
  ];

  // Construct the full address for Google Maps
  const fullAddress = `${contactInfo.address.street}, ${contactInfo.address.city}, ${contactInfo.address.state}, ${contactInfo.address.country}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-700 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {contactInfo.fellowshipName}
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Welcome to our spiritual family
          </p>
          <button
            onClick={handleWhatsAppContact}
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-lg font-medium transition-colors shadow-md hover:shadow-lg"
            type="button"
          >
            <MessageCircle className="mr-3" size={20} />
            Connect on WhatsApp
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-center md:justify-start md:space-x-8 overflow-x-auto hide-scrollbar">
            {tabConfig.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center px-4 py-6 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === key
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-gray-600 hover:text-blue-600"
                }`}
                type="button"
              >
                <Icon
                  size={18}
                  className={`mr-2 ${
                    activeTab === key ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div className="space-y-12 animate-fade-in">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Get In Touch
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We'd love to hear from you and welcome you to our fellowship
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Phone className="mr-3 text-blue-500" size={22} />
                  Contact Details
                </h3>
                <div className="space-y-4">
                  {contactInfo.contactPhone && (
                    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Phone className="text-blue-600" size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Phone</p>
                        <a
                          href={`tel:${contactInfo.contactPhone}`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {contactInfo.contactPhone}
                        </a>
                      </div>
                    </div>
                  )}
                  {contactInfo.contactEmail && (
                    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Mail className="text-blue-600" size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Email</p>
                        <a
                          href={`mailto:${contactInfo.contactEmail}`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {contactInfo.contactEmail}
                        </a>
                      </div>
                    </div>
                  )}
                  {contactInfo.socialMedia?.whatsapp && (
                    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="bg-green-50 p-2 rounded-lg">
                        <MessageCircle className="text-green-600" size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">WhatsApp</p>
                        <button
                          onClick={handleWhatsAppContact}
                          className="text-green-600 hover:underline text-sm font-medium"
                          type="button"
                        >
                          Start a conversation
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Users className="mr-3 text-blue-500" size={22} />
                  Follow Us
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {contactInfo.socialMedia &&
                    (
                      Object.entries(contactInfo.socialMedia) as [
                        keyof SocialMedia,
                        string,
                      ][]
                    )
                      .filter(([_, url]) => url)
                      .map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          {getSocialIcon(platform)}
                          <span className="font-medium text-gray-700 text-sm capitalize">
                            {platform === "tiktok" ? "TikTok" : platform}
                          </span>
                        </a>
                      ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location Tab with Google Maps */}
        {activeTab === "location" && (
          <div className="space-y-12 animate-fade-in">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Find Us</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Come worship with us at our beautiful location
              </p>
            </div>

            {/* Google Maps Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-64 sm:h-80 md:h-96 w-full">
                <GoogleMap
                  address={fullAddress}
                  className="w-full h-full"
                  mapId={process.env.NEXT_PUBLIC_MAP_ID}
                  onLoad={() => setMapLoaded(true)}
                />
              </div>
              <div className="p-6">
                <button
                  onClick={handleDirections}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  type="button"
                >
                  <ExternalLink size={16} />
                  Open in Google Maps
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-50 p-2 rounded-lg">
                      <MapPin className="text-red-600" size={18} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Address
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {contactInfo.address.street}
                        <br />
                        {contactInfo.address.city}, {contactInfo.address.state}
                        <br />
                        {contactInfo.address.country}
                      </p>
                    </div>
                  </div>

                  {contactInfo.directions && (
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Navigation className="text-blue-600" size={18} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Directions
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {contactInfo.directions}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {contactInfo.landmarks && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Nearby Landmarks
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {contactInfo.landmarks}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Service Times & Locations
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join us for worship, prayer, and fellowship across our locations
              </p>
            </div>

            {/* Service Day Navigation */}
            <div className="flex overflow-x-auto pb-2 hide-scrollbar gap-2">
              {dayOrder.map((day) => {
                const hasServices = groupServicesByDay()[day];
                return hasServices ? (
                  <button
                    key={day}
                    onClick={() => {
                      const element = document.getElementById(`day-${day}`);
                      element?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-blue-50 hover:border-blue-200 transition-colors whitespace-nowrap"
                  >
                    {day}
                  </button>
                ) : null;
              })}
            </div>

            <div className="space-y-6">
              {dayOrder.map((day) => {
                const dayServices = groupServicesByDay()[day];
                if (!dayServices) return null;

                return (
                  <div
                    key={day}
                    id={`day-${day}`}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                        <Calendar className="text-blue-500" size={20} />
                        {day}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {dayServices.length} service
                        {dayServices.length > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {dayServices.map(
                        (service: ServiceHour, index: number) => (
                          <div
                            key={index}
                            className="p-6 hover:bg-gray-50 transition-colors group"
                          >
                            <div className="md:flex gap-6">
                              {/* Service Poster Image */}
                              {service.posterImage && (
                                <div className="md:w-1/3 mb-4 md:mb-0">
                                  <div className="relative aspect-video rounded-lg overflow-hidden shadow-sm">
                                    <Image
                                      src={urlFor(
                                        service.posterImage as any
                                      ).url()}
                                      alt={
                                        service.posterImage.alt ||
                                        service.serviceType ||
                                        "Service poster"
                                      }
                                      fill
                                      className="object-cover group-hover:scale-105 transition-transform"
                                      sizes="(max-width: 768px) 100vw, 33vw"
                                      placeholder="blur"
                                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejN5oVH0clHU3ttanBoHePdPidOvUuRuuLa0AZqLRNPEwOl2lPZ5Vo4mCgv6LWlXh7bBSFVJqBQA2RnGF8pNPEqPG0fpWPxdJoHd/MhHd/MhQD//Z"
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Service Content */}
                              <div
                                className={`flex-1 ${service.posterImage ? "md:pt-0" : ""}`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                                  <div className="flex items-center gap-2">
                                    <Clock
                                      className="text-blue-500"
                                      size={18}
                                    />
                                    <span className="font-medium text-gray-800">
                                      {service.time}
                                    </span>
                                  </div>
                                  {service.serviceType && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium self-start">
                                      {service.serviceType}
                                    </span>
                                  )}
                                </div>

                                {service.description && (
                                  <p className="text-gray-600 text-sm mb-4">
                                    {service.description}
                                  </p>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-gray-100">
                                  <button
                                    onClick={handleWhatsAppContact}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                                  >
                                    <MessageCircle size={16} />
                                    Ask questions
                                  </button>
                                  <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                                    <Calendar size={16} />
                                    Add to calendar
                                  </button>
                                </div>

                              </div>
                            </div>
                                {/* Location Section */}
                                <div className="mt-4 space-y-3">
                                  <div className="flex items-start gap-3">
                                    <MapPin
                                      className="text-red-500 mt-0.5 flex-shrink-0"
                                      size={18}
                                    />
                                    <div>
                                      <h4 className="font-medium text-gray-800 text-sm">
                                        Location
                                      </h4>
                                      <p className="text-gray-600 text-sm">
                                        {fullAddress}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Mini Map Preview */}
                                  <div className="h-40 rounded-lg overflow-hidden border border-gray-200 mt-2">
                                    <GoogleMap
                                      address={fullAddress}
                                      className="h-full"
                                      mapId={process.env.NEXT_PUBLIC_MAP_ID}
                                    />
                                  </div>

                                  <button
                                    onClick={() => {
                                      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress || "")}`;
                                      window.open(mapsUrl, "_blank");
                                    }}
                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                                  >
                                    <ExternalLink size={14} />
                                    Get directions
                                  </button>
                                </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-3">Need Help Finding Us?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Our team is ready to assist you with directions or any questions
                about our services
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleWhatsAppContact}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  <MessageCircle size={18} />
                  Chat with us
                </button>
                <a
                  href={`tel:${contactInfo.contactPhone}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  <Phone size={18} />
                  Call us
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInformationComponent;
