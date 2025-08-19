"use client";

import { useState } from "react";
import Image from "next/image";

const AuthorRequestPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    level: "",
    bio: "",
    expertise: "",
    previousWriting: "",
    motivation: "",
    portfolio: "",
    socialMedia: {
      twitter: "",
      linkedin: "",
      instagram: "",
    },
    agreedToTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name.startsWith("socialMedia.")) {
      const socialField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialField]: value,
        },
      }));
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
    }, 2000);
  };

  if (submitStatus === "success") {
    return (
      <main className="bg-white min-h-screen">
        <div className="container mx-auto px-6 md:px-8 py-24 md:py-32 max-w-2xl">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-12 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Success
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-light text-black mb-8 leading-tight">
              Application Submitted
            </h1>

            <p className="text-lg text-black font-light leading-relaxed mb-12">
              Thank you for your interest in becoming an author with GSF UI.
              We'll review your application and get back to you within 5-7
              business days.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => setSubmitStatus("idle")}
                className="inline-block px-8 py-3 bg-blue-400 text-white font-medium tracking-wide uppercase text-sm hover:bg-blue-500 transition-colors duration-300"
              >
                Submit Another Application
              </button>

              <div>
                <a
                  href="/"
                  className="text-blue-400 hover:text-blue-500 font-medium underline underline-offset-2 transition-colors duration-200"
                >
                  Return to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-8 max-w-4xl">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Join Our Team
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-8 leading-tight tracking-tight">
              Become an Author
            </h1>
            <p className="text-lg md:text-xl text-black font-light leading-relaxed max-w-2xl mx-auto">
              Share your voice and contribute to our community. Fill out the
              form below to apply as a content author for GSF UI.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-white py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Personal Information */}
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-6 h-px bg-blue-400"></div>
                <h2 className="text-xl md:text-2xl font-light text-black">
                  Personal Information
                </h2>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-3 uppercase tracking-wide">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-0 py-3 text-black bg-transparent border-0 border-b border-gray-300 focus:border-blue-400 focus:outline-none transition-colors duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-3 uppercase tracking-wide">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-0 py-3 text-black bg-transparent border-0 border-b border-gray-300 focus:border-blue-400 focus:outline-none transition-colors duration-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-3 uppercase tracking-wide">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-0 py-3 text-black bg-transparent border-0 border-b border-gray-300 focus:border-blue-400 focus:outline-none transition-colors duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-3 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-0 py-3 text-black bg-transparent border-0 border-b border-gray-300 focus:border-blue-400 focus:outline-none transition-colors duration-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-3 uppercase tracking-wide">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-0 py-3 text-black bg-transparent border-0 border-b border-gray-300 focus:border-blue-400 focus:outline-none transition-colors duration-300"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Medicine">Medicine</option>
                      <option value="Law">Law</option>
                      <option value="Arts">Arts</option>
                      <option value="Sciences">Sciences</option>
                      <option value="Social Sciences">Social Sciences</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-3 uppercase tracking-wide">
                      Level *
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="w-full px-0 py-3 text-black bg-transparent border-0 border-b border-gray-300 focus:border-blue-400 focus:outline-none transition-colors duration-300"
                      required
                    >
                      <option value="">Select Level</option>
                      <option value="100">100 Level</option>
                      <option value="200">200 Level</option>
                      <option value="300">300 Level</option>
                      <option value="400">400 Level</option>
                      <option value="500">500 Level</option>
                      <option value="Graduate">Graduate</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Writing Information */}
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-6 h-px bg-blue-400"></div>
                <h2 className="text-xl md:text-2xl font-light text-black">
                  Writing Background
                </h2>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-black mb-3 uppercase tracking-wide">
                    Brief Bio *
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-0 py-3 text-black bg-transparent border-0 border-b border-gray-300 focus:border-blue-400 focus:outline-none resize-none transition-colors duration-300"
                    placeholder="Tell us about yourself in a few sentences..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-3 uppercase tracking-wide">
                    Areas of Expertise
                  </label>
                  <input
                    type="text"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleInputChange}
                    className="w-full px-0 py-3 text-black bg-transparent border-0 border-b border-gray-300 focus:border-blue-400 focus:outline-none transition-colors duration-300"
                    placeholder="e.g., Theology, Student Life, Technology, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-3 uppercase tracking-wide">
                    Previous Writing Experience
                  </label>
                  <textarea
                    name="previousWriting"
                    value={formData.previousWriting}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-0 py-3 text-black bg-transparent border-0 border-b border-gray-300 focus:border-blue-400 focus:outline-none resize-none transition-colors duration-300"
                    placeholder="Describe any previous writing experience, publications, or relevant work..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-3 uppercase tracking-wide">
                    Why do you want to become an author? *
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-0 py-3 text-black bg-transparent border-0 border-b border-gray-300 focus:border-blue-400 focus:outline-none resize-none transition-colors duration-300"
                    placeholder="Share your motivation and what you hope to contribute..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-3 uppercase tracking-wide">
                    Portfolio/Writing Samples
                  </label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    className="w-full px-0 py-3 text-black bg-transparent border-0 border-b border-gray-300 focus:border-blue-400 focus:outline-none transition-colors duration-300"
                    placeholder="Link to your portfolio, blog, or writing samples"
                  />
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-6 h-px bg-blue-400"></div>
                <h2 className="text-xl md:text-2xl font-light text-black">
                  Social Media (Optional)
                </h2>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-black mb-3 uppercase tracking-wide">
                    Twitter/X
                  </label>
                  <input
                    type="url"
                    name="socialMedia.twitter"
                    value={formData.socialMedia.twitter}
                    onChange={handleInputChange}
                    className="w-full px-0 py-3 text-black bg-transparent border-0 border-b border-gray-300 focus:border-blue-400 focus:outline-none transition-colors duration-300"
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-3 uppercase tracking-wide">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    name="socialMedia.linkedin"
                    value={formData.socialMedia.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-0 py-3 text-black bg-transparent border-0 border-b border-gray-300 focus:border-blue-400 focus:outline-none transition-colors duration-300"
                    placeholder="https://linkedin.com/in/yourusername"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-3 uppercase tracking-wide">
                    Instagram
                  </label>
                  <input
                    type="url"
                    name="socialMedia.instagram"
                    value={formData.socialMedia.instagram}
                    onChange={handleInputChange}
                    className="w-full px-0 py-3 text-black bg-transparent border-0 border-b border-gray-300 focus:border-blue-400 focus:outline-none transition-colors duration-300"
                    placeholder="https://instagram.com/yourusername"
                  />
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div>
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  id="agreedToTerms"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 text-blue-400 border-gray-300 focus:ring-blue-400"
                  required
                />
                <label
                  htmlFor="agreedToTerms"
                  className="text-black font-light leading-relaxed"
                >
                  I agree to the terms and conditions, and I understand that
                  submitted content may be edited and published under GSF UI's
                  guidelines. I commit to writing content that aligns with our
                  values and mission.
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-12 py-4 bg-blue-400 text-white font-medium tracking-wide uppercase text-sm hover:bg-blue-500 disabled:bg-gray-300 transition-colors duration-300"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default AuthorRequestPage;
