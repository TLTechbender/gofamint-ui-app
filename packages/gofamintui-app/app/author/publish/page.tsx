import { useState } from "react";

const ArticleEditor = () => {
  const [article, setArticle] = useState({
    title: "",
    subtitle: "",
    content: "",
    category: "",
    tags: "",
    featuredImage: null,
    status: "draft", // draft, published
  });

  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    "Spiritual Growth",
    "Community Life",
    "Biblical Studies",
    "Prayer & Worship",
    "Leadership",
    "Campus Ministry",
    "Testimonies",
    "Devotionals",
  ];

  const handleSave = async (status = "draft") => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setArticle((prev) => ({ ...prev, status }));
    setIsSaving(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setArticle((prev) => ({ ...prev, featuredImage: imageUrl }));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-px bg-blue-400"></div>
                <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                  Write Article
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="text-black hover:text-blue-500 transition-colors duration-200 font-light tracking-wide"
              >
                {isPreview ? "Edit" : "Preview"}
              </button>
              <button
                onClick={() => handleSave("draft")}
                disabled={isSaving}
                className="px-6 py-2 border border-gray-300 text-black hover:border-blue-400 hover:text-blue-500 transition-all duration-200 font-light tracking-wide disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Draft"}
              </button>
              <button
                onClick={() => handleSave("published")}
                disabled={isSaving || !article.title || !article.content}
                className="px-6 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 font-light tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 md:px-8 max-w-4xl py-12">
        {!isPreview ? (
          /* Editor Mode */
          <div className="space-y-12">
            {/* Article Meta */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 tracking-wide uppercase">
                    Article Title
                  </label>
                  <input
                    type="text"
                    value={article.title}
                    onChange={(e) =>
                      setArticle((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Enter your article title..."
                    className="w-full text-3xl md:text-4xl font-light text-black placeholder-gray-400 border-none outline-none bg-transparent leading-tight tracking-tight"
                  />
                  <div className="h-px bg-gradient-to-r from-blue-400 via-blue-200 to-transparent"></div>
                </div>

                {/* Subtitle */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 tracking-wide uppercase">
                    Subtitle (Optional)
                  </label>
                  <input
                    type="text"
                    value={article.subtitle}
                    onChange={(e) =>
                      setArticle((prev) => ({
                        ...prev,
                        subtitle: e.target.value,
                      }))
                    }
                    placeholder="A compelling subtitle to engage readers..."
                    className="w-full text-xl font-light text-black placeholder-gray-400 border-none outline-none bg-transparent leading-relaxed"
                  />
                  <div className="h-px bg-gradient-to-r from-blue-200 via-gray-100 to-transparent"></div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Category */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-600 tracking-wide uppercase">
                    Category
                  </label>
                  <select
                    value={article.category}
                    onChange={(e) =>
                      setArticle((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-200 focus:border-blue-400 focus:outline-none transition-colors duration-200 font-light bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-600 tracking-wide uppercase">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={article.tags}
                    onChange={(e) =>
                      setArticle((prev) => ({ ...prev, tags: e.target.value }))
                    }
                    placeholder="faith, prayer, community..."
                    className="w-full p-3 border border-gray-200 focus:border-blue-400 focus:outline-none transition-colors duration-200 font-light"
                  />
                  <p className="text-xs text-gray-500 font-light">
                    Separate tags with commas
                  </p>
                </div>
              </div>
            </div>

            {/* Featured Image Upload */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-600 tracking-wide uppercase">
                Featured Image
              </label>

              {article.featuredImage ? (
                <div className="relative group">
                  <img
                    src={article.featuredImage}
                    alt="Featured"
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                    <button
                      onClick={() =>
                        setArticle((prev) => ({ ...prev, featuredImage: null }))
                      }
                      className="opacity-0 group-hover:opacity-100 bg-white/90 text-black px-4 py-2 font-light tracking-wide transition-all duration-200"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 hover:border-blue-400 transition-colors duration-200">
                  <label className="cursor-pointer block p-12 text-center">
                    <div className="space-y-4">
                      <div className="w-12 h-12 mx-auto bg-gray-100 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-black font-light">
                          Upload featured image
                        </p>
                        <p className="text-sm text-gray-500 font-light">
                          PNG, JPG, or WEBP up to 5MB
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Content Editor */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-600 tracking-wide uppercase">
                Article Content
              </label>
              <div className="border border-gray-200 focus-within:border-blue-400 transition-colors duration-200">
                <textarea
                  value={article.content}
                  onChange={(e) =>
                    setArticle((prev) => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="Start writing your article here...

You can write in plain text and it will be formatted beautifully. Use:

- Double line breaks for paragraphs
- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- Quote important passages with quotation marks

Share your insights, experiences, and wisdom with the community..."
                  className="w-full min-h-96 p-6 border-none outline-none resize-none font-light text-base leading-relaxed text-black placeholder-gray-400"
                />
              </div>
              <p className="text-xs text-gray-500 font-light">
                Write in plain text. Basic formatting will be applied
                automatically.
              </p>
            </div>

            {/* Status Indicator */}
            {article.status && (
              <div className="flex items-center justify-between py-4 border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      article.status === "published"
                        ? "bg-green-400"
                        : "bg-orange-400"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-600 font-light capitalize tracking-wide">
                    {article.status}
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-light">
                  Last saved: Just now
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Preview Mode */
          <article className="prose prose-lg max-w-none">
            {/* Preview Header */}
            <div className="not-prose mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-px bg-blue-400"></div>
                <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                  Preview Mode
                </span>
              </div>
            </div>

            {/* Featured Image */}
            {article.featuredImage && (
              <div className="not-prose mb-12">
                <img
                  src={article.featuredImage}
                  alt="Featured"
                  className="w-full aspect-video object-cover"
                />
              </div>
            )}

            {/* Article Meta */}
            <div className="not-prose mb-8">
              {article.category && (
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xs font-medium text-blue-400 uppercase tracking-widest">
                    {article.category}
                  </span>
                </div>
              )}
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-4xl md:text-5xl font-light text-black mb-6 leading-tight tracking-tight">
              {article.title || "Article Title"}
            </h1>

            {article.subtitle && (
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-12 not-prose">
                {article.subtitle}
              </p>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none prose-headings:font-light prose-headings:text-black prose-p:text-black prose-p:font-light prose-p:leading-relaxed">
              {article.content ? (
                article.content.split("\n\n").map((paragraph, index) => {
                  if (paragraph.trim()) {
                    return (
                      <p key={index} className="mb-6">
                        {paragraph.split("\n").map((line, lineIndex) => (
                          <span key={lineIndex}>
                            {line}
                            {lineIndex < paragraph.split("\n").length - 1 && (
                              <br />
                            )}
                          </span>
                        ))}
                      </p>
                    );
                  }
                  return null;
                })
              ) : (
                <p className="text-gray-400 italic">
                  Start writing to see your content here...
                </p>
              )}
            </div>

            {/* Tags */}
            {article.tags && (
              <div className="not-prose mt-12 pt-8 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {article.tags.split(",").map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-light tracking-wide"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        )}
      </div>
    </div>
  );
};

export default ArticleEditor;
