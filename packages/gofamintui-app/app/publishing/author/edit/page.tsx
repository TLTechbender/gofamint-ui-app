import { useState } from "react";

// Mock data structure - replace with your actual data fetching
const mockAuthors = [
  {
    id: "1",
    name: "Sarah Johnson",
    position: "Lead Pastor",
    bio: "Sarah has been serving in ministry for over 15 years, bringing deep theological insight and pastoral care to our community.",
    email: "sarah@gsfui.org",
    phone: "+234 123 456 7890",
    image: "/api/placeholder/400/500",
    socialLinks: {
      twitter: "@sarahjohnson",
      linkedin: "sarah-johnson",
      instagram: "@pastor_sarah",
    },
    specialties: ["Pastoral Care", "Biblical Studies", "Youth Ministry"],
    joinedDate: "2018-03-15",
  },
  {
    id: "2",
    name: "Michael Chen",
    position: "Worship Director",
    bio: "Michael leads our worship team with passion and creativity, helping our congregation connect with God through music.",
    email: "michael@gsfui.org",
    phone: "+234 123 456 7891",
    image: "/api/placeholder/400/500",
    socialLinks: {
      twitter: "@mikeworship",
      instagram: "@michael_chen_music",
    },
    specialties: ["Worship Leading", "Music Production", "Team Leadership"],
    joinedDate: "2019-08-22",
  },
  {
    id: "3",
    name: "Grace Adebayo",
    position: "Community Outreach Coordinator",
    bio: "Grace coordinates our community outreach programs, ensuring we serve our neighbors with love and practical support.",
    email: "grace@gsfui.org",
    phone: "+234 123 456 7892",
    image: "/api/placeholder/400/500",
    socialLinks: {
      twitter: "@grace_outreach",
      linkedin: "grace-adebayo",
    },
    specialties: [
      "Community Service",
      "Event Planning",
      "Volunteer Coordination",
    ],
    joinedDate: "2020-01-10",
  },
];

export default function AuthorsPage() {
  const [authors, setAuthors] = useState(mockAuthors);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const handleEdit = (author) => {
    setEditingAuthor(author);
    setFormData({ ...author });
    setIsEditing(true);
  };

  const handleSave = () => {
    setAuthors(
      authors.map((author) =>
        author.id === formData.id ? { ...formData } : author
      )
    );
    setIsEditing(false);
    setEditingAuthor(null);
    setFormData({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingAuthor(null);
    setFormData({});
  };

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  if (isEditing) {
    return (
      <main className="bg-white min-h-screen">
        {/* Edit Header */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6 md:px-8 max-w-4xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Edit Author
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-black leading-tight">
              Update Author Information
            </h1>
          </div>
        </section>

        {/* Edit Form */}
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-8 max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Image Section */}
              <div className="space-y-6">
                <div className="aspect-[4/5] bg-gray-100 overflow-hidden group">
                  <img
                    src={formData.image}
                    alt={formData.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image || ""}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-blue-400 focus:outline-none transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 focus:border-blue-400 focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      value={formData.position || ""}
                      onChange={(e) =>
                        handleInputChange("position", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 focus:border-blue-400 focus:outline-none transition-colors"
                      placeholder="Lead Pastor"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Biography
                  </label>
                  <textarea
                    value={formData.bio || ""}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-blue-400 focus:outline-none transition-colors resize-none"
                    placeholder="Brief biography..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 focus:border-blue-400 focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone || ""}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 focus:border-blue-400 focus:outline-none transition-colors"
                      placeholder="+234 123 456 7890"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Specialties (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.specialties?.join(", ") || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "specialties",
                        e.target.value.split(", ").filter((s) => s.trim())
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-200 focus:border-blue-400 focus:outline-none transition-colors"
                    placeholder="Pastoral Care, Biblical Studies, Youth Ministry"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-black">
                    Social Links
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Twitter
                      </label>
                      <input
                        type="text"
                        value={formData.socialLinks?.twitter || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "socialLinks.twitter",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-200 focus:border-blue-400 focus:outline-none transition-colors"
                        placeholder="@username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        LinkedIn
                      </label>
                      <input
                        type="text"
                        value={formData.socialLinks?.linkedin || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "socialLinks.linkedin",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-200 focus:border-blue-400 focus:outline-none transition-colors"
                        placeholder="username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Instagram
                      </label>
                      <input
                        type="text"
                        value={formData.socialLinks?.instagram || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "socialLinks.instagram",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-200 focus:border-blue-400 focus:outline-none transition-colors"
                        placeholder="@username"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-6">
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 hover:border-gray-400 text-black font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-px bg-blue-400"></div>
                <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                  Our Team
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-black leading-tight tracking-tight mb-8">
                Meet Our Authors
              </h1>
              <p className="text-lg md:text-xl text-black font-light leading-relaxed max-w-2xl">
                Dedicated individuals who share their insights, experiences, and
                faith through their writing and leadership in our community.
              </p>
            </div>
            <div className="md:col-span-5">
              <div className="text-right">
                <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>{authors.length} Active Authors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authors Grid */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            {authors.map((author, index) => (
              <article key={author.id} className="group">
                {/* Author Image */}
                <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-gray-100">
                  <img
                    src={author.image}
                    alt={author.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Author Info */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-medium text-black group-hover:text-blue-500 transition-colors duration-300">
                      {author.name}
                    </h2>
                    <p className="text-sm text-gray-600 font-medium tracking-wide uppercase mt-1">
                      {author.position}
                    </p>
                  </div>

                  <p className="text-black font-light leading-relaxed text-sm md:text-base">
                    {author.bio}
                  </p>

                  {/* Specialties */}
                  {author.specialties && author.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {author.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium tracking-wide"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Contact & Social */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="space-y-1">
                      <a
                        href={`mailto:${author.email}`}
                        className="block text-sm text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        {author.email}
                      </a>
                      <p className="text-xs text-gray-500">
                        Joined{" "}
                        {new Date(author.joinedDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                          }
                        )}
                      </p>
                    </div>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(author)}
                      className="flex items-center space-x-2 px-3 py-2 border border-gray-200 hover:border-blue-400 hover:text-blue-500 transition-colors duration-200 text-sm font-medium"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 md:px-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-light text-black mb-2">
                {authors.length}
              </div>
              <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Total Authors
              </div>
            </div>
            <div>
              <div className="text-3xl font-light text-black mb-2">
                {authors.reduce(
                  (acc, author) => acc + (author.specialties?.length || 0),
                  0
                )}
              </div>
              <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Combined Specialties
              </div>
            </div>
            <div>
              <div className="text-3xl font-light text-black mb-2">
                {Math.round(
                  authors.reduce(
                    (acc, author) =>
                      acc +
                      (new Date().getFullYear() -
                        new Date(author.joinedDate).getFullYear()),
                    0
                  ) / authors.length
                )}
              </div>
              <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Avg. Years Experience
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
