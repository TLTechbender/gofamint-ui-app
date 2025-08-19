import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// Types for our authors system
interface Author {
  id: string;
  name: string;
  email: string;
  bio: string;
  profileImage: string;
  joinDate: string;
  totalArticles: number;
  totalViews: number;
  totalLikes: number;
  isActive: boolean;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishDate: string;
  status: "published" | "draft" | "archived";
  views: number;
  likes: number;
  comments: number;
  readTime: number;
  featuredImage?: string;
  tags: string[];
}

// Mock data - replace with your actual data fetching
const mockAuthors: Author[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@gsfui.org",
    bio: "Passionate writer focused on faith, leadership, and community building. Been part of GSF UI for over 3 years.",
    profileImage: "/api/placeholder/300/300",
    joinDate: "2022-03-15",
    totalArticles: 24,
    totalViews: 15420,
    totalLikes: 892,
    isActive: true,
  },
  {
    id: "2",
    name: "David Adebayo",
    email: "david@gsfui.org",
    bio: "Tech enthusiast and spiritual growth advocate. Loves writing about the intersection of faith and modern life.",
    profileImage: "/api/placeholder/300/300",
    joinDate: "2021-08-22",
    totalArticles: 18,
    totalViews: 12300,
    totalLikes: 654,
    isActive: true,
  },
];

const mockArticles: Article[] = [
  {
    id: "1",
    title: "Building Strong Faith Communities in University",
    slug: "building-strong-faith-communities",
    excerpt:
      "Exploring how student fellowships can create lasting impact on campus and beyond...",
    publishDate: "2024-08-10",
    status: "published",
    views: 1250,
    likes: 89,
    comments: 12,
    readTime: 8,
    featuredImage: "/api/placeholder/800/400",
    tags: ["Community", "Faith", "Leadership"],
  },
  {
    id: "2",
    title: "The Power of Prayer in Student Life",
    slug: "power-of-prayer-student-life",
    excerpt:
      "How maintaining a consistent prayer life transformed my university experience...",
    publishDate: "2024-08-05",
    status: "published",
    views: 890,
    likes: 67,
    comments: 8,
    readTime: 6,
    featuredImage: "/api/placeholder/800/400",
    tags: ["Prayer", "Spirituality", "Student Life"],
  },
  {
    id: "3",
    title: "Balancing Academics and Ministry",
    slug: "balancing-academics-ministry",
    excerpt:
      "Practical tips for excelling in studies while staying committed to your calling...",
    publishDate: "2024-07-28",
    status: "draft",
    views: 0,
    likes: 0,
    comments: 0,
    readTime: 10,
    tags: ["Academic", "Ministry", "Balance"],
  },
];

// Authors Overview Page Component
export function AuthorsPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Meet Our Writers
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-8 leading-tight tracking-tight">
              Our Authors
            </h1>
            <p className="text-lg md:text-xl text-black font-light leading-relaxed max-w-3xl mx-auto">
              Dedicated writers sharing insights on faith, community, and
              spiritual growth. Each author brings unique perspectives and
              experiences to our community.
            </p>
          </div>

          {/* Authors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
            {mockAuthors.map((author, index) => (
              <div
                key={author.id}
                className="group bg-white transition-all duration-300 hover:shadow-lg"
              >
                {/* Author Image */}
                <div className="relative aspect-square overflow-hidden mb-6">
                  <Image
                    src={author.profileImage}
                    alt={author.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Author Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-light text-black mb-2 group-hover:text-blue-500 transition-colors duration-300">
                      {author.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <span>{author.totalArticles} articles</span>
                      <span>•</span>
                      <span>{author.totalViews.toLocaleString()} views</span>
                    </div>
                  </div>

                  <p className="text-black font-light leading-relaxed text-sm md:text-base">
                    {author.bio}
                  </p>

                  <Link
                    href={`/authors/${author.id}`}
                    className="inline-flex items-center text-blue-500 hover:text-blue-600 font-medium text-sm transition-colors duration-200"
                  >
                    View Profile
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

// Author Dashboard Component
export function AuthorDashboard({ authorId }: { authorId: string }) {
  const author = mockAuthors.find((a) => a.id === authorId) || mockAuthors[0];
  const authorArticles = mockArticles; // In real app, filter by authorId

  const stats = [
    { label: "Total Articles", value: author.totalArticles, icon: "📝" },
    {
      label: "Total Views",
      value: author.totalViews.toLocaleString(),
      icon: "👁️",
    },
    {
      label: "Total Likes",
      value: author.totalLikes.toLocaleString(),
      icon: "❤️",
    },
    {
      label: "Active Since",
      value: new Date(author.joinDate).getFullYear().toString(),
      icon: "📅",
    },
  ];

  const handleDeleteArticle = (articleId: string) => {
    // Implement delete logic here
    console.log("Delete article:", articleId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Dashboard Header */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center space-x-6">
              <div className="relative w-20 h-20 md:w-24 md:h-24 overflow-hidden">
                <Image
                  src={author.profileImage}
                  alt={author.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-6 h-px bg-blue-400"></div>
                  <span className="text-xs font-medium text-blue-400 tracking-widest uppercase">
                    Author Dashboard
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-light text-black mb-2">
                  Welcome back, {author.name}
                </h1>
                <p className="text-black font-light">{author.email}</p>
              </div>
            </div>

            <Link
              href="/articles/new"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Article
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 p-6 hover:border-blue-200 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="text-2xl md:text-3xl font-light text-black">
                    {stat.value}
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-light">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Management */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Your Content
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h2 className="text-2xl md:text-3xl font-light text-black">
                Manage Articles
              </h2>
              <div className="flex items-center space-x-4">
                <select className="px-4 py-2 border border-gray-200 bg-white text-black font-light focus:outline-none focus:border-blue-400">
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Articles List */}
          <div className="space-y-6">
            {authorArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white border border-gray-100 hover:border-gray-200 transition-colors duration-200"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Article Image */}
                    {article.featuredImage && (
                      <div className="lg:w-48 lg:flex-shrink-0">
                        <div className="relative aspect-video lg:aspect-[4/3] overflow-hidden">
                          <Image
                            src={article.featuredImage}
                            alt={article.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 192px"
                          />
                        </div>
                      </div>
                    )}

                    {/* Article Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span
                              className={`px-2 py-1 text-xs font-medium uppercase tracking-wide ${getStatusColor(article.status)}`}
                            >
                              {article.status}
                            </span>
                            <span className="text-sm text-gray-600 font-light">
                              {new Date(
                                article.publishDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-lg md:text-xl font-medium text-black mb-2 hover:text-blue-500 transition-colors duration-200">
                            <Link href={`/articles/${article.slug}`}>
                              {article.title}
                            </Link>
                          </h3>
                          <p className="text-black font-light leading-relaxed mb-4">
                            {article.excerpt}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {article.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs text-blue-600 font-light"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/articles/${article.id}/edit`}
                            className="p-2 text-gray-600 hover:text-blue-500 transition-colors duration-200"
                            title="Edit"
                          >
                            <svg
                              className="w-5 h-5"
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
                          </Link>
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            className="p-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
                            title="Delete"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          <span>{article.views.toLocaleString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
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
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          <span>{article.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
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
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          <span>{article.comments}</span>
                        </span>
                        <span>{article.readTime} min read</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
