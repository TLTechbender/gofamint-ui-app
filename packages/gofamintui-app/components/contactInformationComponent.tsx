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

type TabType = "contact" | "location" | "services";

const ContactInformationComponent = ({
  contactInfo,
}: {
  contactInfo: ContactInfo;
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("contact");

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
    switch (platform) {
      case "facebook":
        return <FaFacebook size={20} />;
      case "instagram":
        return <FaInstagram size={20} />;
      case "twitter":
        return <FaXTwitter size={20} />;
      case "youtube":
        return <FaYoutube size={20} />;
      case "tiktok":
        return <FaTiktok size={20} />;
      case "whatsapp":
        return <FaWhatsapp size={20} />;
      default:
        return <ExternalLink size={20} />;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}

      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <Heart className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            {contactInfo.fellowshipName}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            Welcome to our spiritual family
          </p>
          <button
            onClick={handleWhatsAppContact}
            className="inline-flex items-center px-8 py-4 bg-green-500 hover:bg-green-600 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            type="button"
          >
            <MessageCircle className="mr-3" size={24} />
            Connect on WhatsApp
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex space-x-8">
            {tabConfig.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center px-4 py-6 border-b-2 transition-all ${
                  activeTab === key
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-600 hover:text-purple-500"
                }`}
                type="button"
              >
                <Icon size={20} className="mr-2" />
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
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Get In Touch
              </h2>
              <p className="text-lg text-gray-600">
                We'd love to hear from you and welcome you to our fellowship
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Phone className="mr-3 text-blue-500" size={28} />
                  Contact Details
                </h3>
                <div className="space-y-6">
                  {contactInfo.contactPhone && (
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <Phone className="text-blue-500 mr-4" size={20} />
                      <div>
                        <p className="font-semibold text-gray-800">Phone</p>
                        <a
                          href={`tel:${contactInfo.contactPhone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {contactInfo.contactPhone}
                        </a>
                      </div>
                    </div>
                  )}
                  {contactInfo.contactEmail && (
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <Mail className="text-purple-500 mr-4" size={20} />
                      <div>
                        <p className="font-semibold text-gray-800">Email</p>
                        <a
                          href={`mailto:${contactInfo.contactEmail}`}
                          className="text-purple-600 hover:underline"
                        >
                          {contactInfo.contactEmail}
                        </a>
                      </div>
                    </div>
                  )}
                  {contactInfo.socialMedia?.whatsapp && (
                    <div className="flex items-center p-4 bg-green-50 rounded-xl">
                      <MessageCircle
                        className="text-green-500 mr-4"
                        size={20}
                      />
                      <div>
                        <p className="font-semibold text-gray-800">WhatsApp</p>
                        <button
                          onClick={handleWhatsAppContact}
                          className="text-green-600 hover:underline font-medium"
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
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Users className="mr-3 text-purple-500" size={28} />
                  Follow Us
                </h3>
                <div className="grid grid-cols-2 gap-4">
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
                          className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-purple-50 hover:to-blue-50 transition-all transform hover:scale-105"
                        >
                          {getSocialIcon(platform)}
                          <span className="ml-3 font-medium capitalize text-gray-700">
                            {platform === "tiktok" ? "TikTok" : platform}
                          </span>
                        </a>
                      ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location Tab */}
        {activeTab === "location" && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Find Us</h2>
              <p className="text-lg text-gray-600">
                Come worship with us at our beautiful location
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="text-red-500 mr-4 mt-1" size={24} />
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Address
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {contactInfo.address.street}
                        <br />
                        {contactInfo.address.city}, {contactInfo.address.state}
                        <br />
                        {contactInfo.address.country}
                      </p>
                    </div>
                  </div>

                  {contactInfo.directions && (
                    <div className="flex items-start">
                      <Navigation
                        className="text-blue-500 mr-4 mt-1"
                        size={24}
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          Directions
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {contactInfo.directions}
                        </p>
                        {contactInfo.googleMapsLink && (
                          <button
                            onClick={handleDirections}
                            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            type="button"
                          >
                            <ExternalLink className="mr-2" size={18} />
                            Open in Maps
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {contactInfo.landmarks && (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      Nearby Landmarks
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {contactInfo.landmarks}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Service Times
              </h2>
              <p className="text-lg text-gray-600">
                Join us for worship, prayer, and fellowship
              </p>
            </div>

            <div className="space-y-6">
              {dayOrder.map((day) => {
                const dayServices = groupServicesByDay()[day];
                if (!dayServices) return null;

                return (
                  <div
                    key={day}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <Calendar className="mr-3 text-purple-500" size={24} />
                      {day}
                    </h3>
                    <div className="grid gap-6">
                      {dayServices.map(
                        (service: ServiceHour, index: number) => (
                          <div
                            key={index}
                            className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                          >
                            <div className="md:flex">
                              {/* Service Poster Image */}
                              {service.posterImage && (
                                <div className="md:w-1/3 relative">
                                  <Image
                                    src={urlFor(
                                      service.posterImage as any
                                    ).url()}
                                    alt={
                                      service.posterImage.alt ||
                                      service.serviceType ||
                                      "Service poster"
                                    }
                                    width={400}
                                    height={300}
                                    className="w-full h-48 md:h-full object-cover"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejN5oVH0clHU3ttanBoHePdPidOvUuRuuLa0AZqLRNPEwOl2lPZ5Vo4mCgv6LWlXh7bBSFVJqBQA2RnGF8pNPEqPG0fpWPxdJoHd/MhHd/MhQD//Z"
                                  />
                                </div>
                              )}

                              {/* Service Content */}
                              <div
                                className={`p-6 ${service.posterImage ? "md:w-2/3" : "w-full"}`}
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center">
                                    <Clock
                                      className="text-blue-500 mr-3"
                                      size={20}
                                    />
                                    <span className="font-semibold text-gray-800 text-lg">
                                      {service.time}
                                    </span>
                                  </div>
                                  <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                    {service.serviceType}
                                  </span>
                                </div>

                                {service.description && (
                                  <p className="text-gray-600 leading-relaxed">
                                    {service.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Join Us?</h3>
              <p className="text-lg mb-6 text-purple-100">
                Experience the love of Christ in our welcoming community
              </p>
              <button
                onClick={handleWhatsAppContact}
                className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105"
                type="button"
              >
                <Send className="mr-2" size={20} />
                Let us know you're coming
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInformationComponent;
