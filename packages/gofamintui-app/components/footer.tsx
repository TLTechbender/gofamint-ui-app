"use client";

import React from "react";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Calendar,
  BookOpen,
  Users,
  Coffee,
  Clock,
  ExternalLink,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Sermons", href: "/sermons" },
    { name: "Contact", href: "/contact" },
    { name: "Give", href: "/giving" },
    { name: "Blog", href: "/blog" },
  ];

  const ministries = [
    { name: "Youth Ministry", href: "/youth" },
    { name: "Children's Church", href: "/children" },
    { name: "Small Groups", href: "/small-groups" },
    { name: "Worship Team", href: "/worship" },
    { name: "Prayer Ministry", href: "/prayer" },
    { name: "Community Outreach", href: "/outreach" },
  ];

  const servicesTimes = [
    { day: "Sunday Worship", time: "9:00 AM & 11:00 AM", icon: Users },
    { day: "Wednesday Prayer", time: "7:00 PM", icon: Heart },
    { day: "Friday Youth", time: "6:30 PM", icon: Coffee },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "#",
      color: "hover:text-blue-600",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "#",
      color: "hover:text-pink-600",
    },
    { name: "YouTube", icon: Youtube, href: "#", color: "hover:text-red-600" },
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-400" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="text-2xl font-bold text-white">Fellowship</div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              A welcoming community where faith, hope, and love come together.
              Join us as we grow in Christ and serve our community with open
              hearts.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span className="text-sm">
                  123 Faith Street, Grace City, GC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span className="text-sm">(555) 123-PRAY</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span className="text-sm">hello@fellowship.org</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-indigo-400" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ministries */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Users className="w-4 h-4 mr-2 text-indigo-400" />
              Ministries
            </h3>
            <ul className="space-y-3">
              {ministries.map((ministry) => (
                <li key={ministry.name}>
                  <a
                    href={ministry.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {ministry.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-indigo-400" />
              Service Times
            </h3>
            <div className="space-y-4">
              {servicesTimes.map((service) => (
                <div key={service.day} className="flex items-center space-x-3">
                  <service.icon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <div>
                    <div className="text-white text-sm font-medium">
                      {service.day}
                    </div>
                    <div className="text-gray-400 text-xs">{service.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="text-white text-sm font-semibold mb-3">
                Connect With Us
              </h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`text-gray-400 ${social.color} transition-colors duration-200`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-white font-semibold mb-1">Stay Connected</h3>
              <p className="text-gray-400 text-sm">
                Get updates on events, sermons, and community news.
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors duration-200 font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Fellowship. All rights reserved.
            </div>

            {/* Built with love section */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-gray-400">
                <span>Built with</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span>Next.js and Sanity Studio</span>
              </div>

              {/* Subtle developer credit */}
              <div className="text-gray-500 text-xs">
                <span>by </span>
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-400 transition-colors duration-200 inline-flex items-center space-x-1"
                >
                  <span>developer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a
                href="/privacy"
                className="hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
