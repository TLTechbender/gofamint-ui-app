"use client";

{
  /**
  if no be say I no sabi design and I dey ask for AI opinion a lot, why TF have I got two Icon libraries Nigga
  Chai!!!
  */
}

{
  /**
    Huge shoutout to Devqing for the google maps thought, code so good, bro deserves his flowers for real!!!
    */
}
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
import GoogleMap from "../googleMap";

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

  const fullAddress = `${contactInfo.address.street}, ${contactInfo.address.city}, ${contactInfo.address.state}, ${contactInfo.address.country}`;

  return (
    <div>
      {/* Hero Section with dark background and proper spacing for nav */}
      <div className="relative  pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/phoneCall.jpg"
            alt="Peaceful spiritual gathering"
            className="w-full h-full object-cover"
            width={2000}
            height={1920}
          />
          {/* Enhanced overlay for better text readability */}

          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>

        {/* Navigation spacer */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-black/30 backdrop-blur-sm z-10" />

        <div className="container mx-auto px-6 md:px-8 max-w-6xl relative z-20">
          <div className="text-center">
            {/* Section accent */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 uppercase tracking-wider">
                Connect With Us
              </span>
              <div className="w-8 h-px bg-blue-400"></div>
            </div>

            {/* Enhanced icon container with better backdrop */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/15 rounded-full mb-6 backdrop-blur-md border border-white/10">
              <Heart className="w-10 h-10 text-white drop-shadow-sm" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 leading-tight drop-shadow-lg">
              {contactInfo.fellowshipName}
            </h1>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl">
          <div className="flex justify-center md:justify-start md:space-x-8 overflow-x-auto">
            {tabConfig.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center px-4 py-6 border-b-2 transition-colors whitespace-nowrap font-light ${
                  activeTab === key
                    ? "border-blue-400 text-blue-400"
                    : "border-transparent text-black hover:text-blue-400"
                }`}
                type="button"
              >
                <Icon
                  size={18}
                  className={`mr-2 ${
                    activeTab === key ? "text-blue-400" : "text-gray-500"
                  }`}
                />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-6 md:px-8 max-w-6xl py-16 md:py-20">
        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div className="space-y-12">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-6 h-px bg-blue-400"></div>
                <span className="text-xs font-medium text-blue-400 uppercase tracking-widest">
                  Get In Touch
                </span>
                <div className="w-6 h-px bg-blue-400"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-light text-black mb-6">
                {`We'd Love to Hear From You`}
              </h2>
              <p className="text-black font-light max-w-2xl mx-auto">
                Connect with our fellowship community and discover how you can
                grow spiritually with us
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl md:text-2xl font-light text-black mb-8 flex items-center">
                  <Phone className="mr-3 text-blue-400" size={22} />
                  Contact Details
                </h3>
                <div className="space-y-6">
                  {contactInfo.contactPhone && (
                    <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Phone className="text-blue-400" size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-black mb-1">Phone</p>
                        <a
                          href={`tel:${contactInfo.contactPhone}`}
                          className="text-blue-400 hover:text-blue-500 transition-colors font-light"
                        >
                          {contactInfo.contactPhone}
                        </a>
                      </div>
                    </div>
                  )}
                  {contactInfo.contactEmail && (
                    <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Mail className="text-blue-400" size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-black mb-1">Email</p>
                        <a
                          href={`mailto:${contactInfo.contactEmail}`}
                          className="text-blue-400 hover:text-blue-500 transition-colors font-light"
                        >
                          {contactInfo.contactEmail}
                        </a>
                      </div>
                    </div>
                  )}
                  {contactInfo.socialMedia?.whatsapp && (
                    <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="bg-green-50 p-2 rounded-lg">
                        <MessageCircle className="text-green-600" size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-black mb-1">WhatsApp</p>
                        <button
                          onClick={handleWhatsAppContact}
                          className="text-green-600 hover:text-green-700 transition-colors font-medium"
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
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl md:text-2xl font-light text-black mb-8 flex items-center">
                  <Users className="mr-3 text-blue-400" size={22} />
                  Follow Our Journey
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contactInfo.socialMedia &&
                    (
                      Object.entries(contactInfo.socialMedia) as [
                        keyof SocialMedia,
                        string,
                      ][]
                    )
                      .filter(([url]) => url)
                      .map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          {getSocialIcon(platform)}
                          <span className="font-medium text-black capitalize">
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
          <div className="space-y-12">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-6 h-px bg-blue-400"></div>
                <span className="text-xs font-medium text-blue-400 uppercase tracking-widest">
                  Visit Us
                </span>
                <div className="w-6 h-px bg-blue-400"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-light text-black mb-6">
                Find Our Location
              </h2>
              <p className="text-black font-light max-w-2xl mx-auto">
                Come worship with us at our beautiful campus location
              </p>
            </div>

            {/* Google Maps Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-64 sm:h-80 md:h-96 w-full">
                <GoogleMap
                  address={fullAddress}
                  className="w-full h-full"
                  mapId={process.env.NEXT_PUBLIC_MAP_ID}
                />
              </div>
              <div className="p-6">
                <button
                  onClick={handleDirections}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium"
                  type="button"
                >
                  <ExternalLink size={16} />
                  Open in Google Maps
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-50 p-2 rounded-lg">
                      <MapPin className="text-red-600" size={18} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-black mb-3">
                        Our Address
                      </h3>
                      <p className="text-black font-light leading-relaxed">
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
                        <Navigation className="text-blue-400" size={18} />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-black mb-3">
                          Getting Here
                        </h3>
                        <p className="text-black font-light leading-relaxed">
                          {contactInfo.directions}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {contactInfo.landmarks && (
                <div className="bg-blue-50 rounded-xl p-6 md:p-8">
                  <h3 className="text-lg font-medium text-black mb-4">
                    Nearby Landmarks
                  </h3>
                  <p className="text-black font-light leading-relaxed">
                    {contactInfo.landmarks}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="space-y-12">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-6 h-px bg-blue-400"></div>
                <span className="text-xs font-medium text-blue-400 uppercase tracking-widest">
                  Worship Schedule
                </span>
                <div className="w-6 h-px bg-blue-400"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-light text-black mb-6">
                Service Times & Events
              </h2>
              <p className="text-black font-light max-w-2xl mx-auto">
                Join us for worship, prayer, and fellowship throughout the week
              </p>
            </div>

            {/* Service Day Navigation */}
            <div className="flex overflow-x-auto pb-2 gap-3">
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
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium hover:bg-blue-50 hover:border-blue-200 transition-colors whitespace-nowrap"
                  >
                    {day}
                  </button>
                ) : null;
              })}
            </div>

            <div className="space-y-8">
              {dayOrder.map((day) => {
                const dayServices = groupServicesByDay()[day];
                if (!dayServices) return null;

                return (
                  <div
                    key={day}
                    id={`day-${day}`}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-xl md:text-2xl font-light text-black flex items-center gap-3">
                        <Calendar className="text-blue-400" size={20} />
                        {day}
                      </h3>
                      <span className="text-sm text-gray-500 font-light">
                        {dayServices.length} service
                        {dayServices.length > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {dayServices.map(
                        (service: ServiceHour, index: number) => (
                          <div
                            key={index}
                            className="p-6 md:p-8 hover:bg-gray-50 transition-colors group"
                          >
                            <div className="md:flex gap-8">
                              {/* Service Poster Image */}
                              {service.posterImage && (
                                <div className="md:w-1/3 mb-6 md:mb-0">
                                  <div className="relative aspect-video rounded-lg overflow-hidden shadow-sm">
                                    <Image
                                      src={urlFor(service.posterImage).url()}
                                      alt={
                                        service.posterImage.alt ||
                                        service.serviceType ||
                                        "Service poster"
                                      }
                                      fill
                                      className="object-cover group-hover:scale-105 transition-transform"
                                      sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Service Content */}
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                  <div className="flex items-center gap-3">
                                    <Clock
                                      className="text-blue-400"
                                      size={18}
                                    />
                                    <span className="font-medium text-black">
                                      {service.time}
                                    </span>
                                  </div>
                                  {service.serviceType && (
                                    <span className="px-3 py-1 bg-blue-50 text-blue-400 rounded-full text-xs font-medium self-start">
                                      {service.serviceType}
                                    </span>
                                  )}
                                </div>

                                {service.description && (
                                  <p className="text-black font-light mb-6 leading-relaxed">
                                    {service.description}
                                  </p>
                                )}

                                {/* Location Section */}
                                <div className="mb-6 space-y-4">
                                  <div className="flex items-start gap-3">
                                    <MapPin
                                      className="text-red-500 mt-0.5 flex-shrink-0"
                                      size={18}
                                    />
                                    <div>
                                      <h4 className="font-medium text-black mb-1">
                                        Location
                                      </h4>
                                      <p className="text-black font-light">
                                        {fullAddress}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Mini Map Preview */}
                                  <div className="h-32 rounded-lg overflow-hidden border border-gray-200">
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
                                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-500 font-medium transition-colors"
                                  >
                                    <ExternalLink size={14} />
                                    Get directions
                                  </button>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                                  <button
                                    onClick={handleWhatsAppContact}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100 transition-colors"
                                  >
                                    <MessageCircle size={16} />
                                    Ask questions
                                  </button>
                                </div>
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

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-8 md:p-12 text-center">
              <h3 className="text-2xl md:text-3xl font-light mb-4">
                Need Help Finding Us?
              </h3>
              <p className="text-gray-300 font-light mb-8 max-w-2xl mx-auto">
                Our team is ready to assist you with directions or any questions
                about our services
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleWhatsAppContact}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-400 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors"
                >
                  <MessageCircle size={18} />
                  Chat with us
                </button>
                <a
                  href={`tel:${contactInfo.contactPhone}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
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
