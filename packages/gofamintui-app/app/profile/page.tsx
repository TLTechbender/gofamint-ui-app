"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Edit3,
  Camera,
  Save,
  X,
  MessageSquare,
  Heart,
  Eye,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  bio: string;
  location: string;
  joinedDate: string;
  profileImage: string;
  stats: {
    comments: number;
    likes: number;
    views: number;
  };
}

const Dashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    id: "user_123",
    name: "John Doe",
    email: "john.doe@me.co",
    username: "johndoe",
    bio: "Active member of GSF UI. Love sharing thoughts on sermons and community events.",
    location: "Ibadan, Nigeria",
    joinedDate: "2024-01-15",
    profileImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    stats: {
      comments: 42,
      likes: 128,
      views: 1250,
    },
  });

  const [editForm, setEditForm] = useState(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setEditForm(user);
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser(editForm);
    setIsEditing(false);
    // Here you would typically make an API call to save the changes
    console.log("Saving user data:", editForm);
  };

  const handleCancel = () => {
    setEditForm(user);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        if (isEditing) {
          setEditForm({ ...editForm, profileImage: imageUrl });
        } else {
          setUser({ ...user, profileImage: imageUrl });
          // Here you would typically upload to your server
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-6 md:px-8 max-w-4xl">
          <div className="py-12 md:py-16">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Dashboard
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-black leading-tight">
              Profile Settings
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-8 max-w-4xl py-12">
        <div className="space-y-12">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            {/* Profile Image */}
            <div className="relative group">
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <Image
                  src={isEditing ? editForm.profileImage : user.profileImage}
                  alt="Profile"
                  fill
                  className="object-cover transition-all duration-300 group-hover:opacity-90"
                  sizes="(max-width: 768px) 128px, 160px"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <Camera className="w-5 h-5 text-black" />
                  </button>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-light text-black mb-2">
                    {user.name}
                  </h2>
                  <p className="text-gray-600 font-light">@{user.username}</p>
                </div>

                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:border-blue-400 text-black hover:text-blue-600 transition-colors duration-200 font-light"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="flex space-x-8 pt-4">
                <div className="text-center">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MessageSquare className="w-4 h-4" />
                    <span>{user.stats.comments} comments</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Heart className="w-4 h-4" />
                    <span>{user.stats.likes} likes</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span>{user.stats.views} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-8">
            {isEditing && (
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <h3 className="text-xl font-light text-black">Edit Profile</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-black transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 font-medium"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Name */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-medium text-black uppercase tracking-wide">
                  <User className="w-4 h-4 text-blue-400" />
                  <span>Full Name</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 focus:border-blue-400 focus:outline-none transition-colors duration-200 font-light text-black"
                  />
                ) : (
                  <p className="text-black font-light px-4 py-3">{user.name}</p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-medium text-black uppercase tracking-wide">
                  <span>@</span>
                  <span>Username</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) =>
                      setEditForm({ ...editForm, username: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 focus:border-blue-400 focus:outline-none transition-colors duration-200 font-light text-black"
                  />
                ) : (
                  <p className="text-black font-light px-4 py-3">
                    @{user.username}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-medium text-black uppercase tracking-wide">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>Email</span>
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 focus:border-blue-400 focus:outline-none transition-colors duration-200 font-light text-black"
                  />
                ) : (
                  <p className="text-black font-light px-4 py-3">
                    {user.email}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-medium text-black uppercase tracking-wide">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>Location</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 focus:border-blue-400 focus:outline-none transition-colors duration-200 font-light text-black"
                  />
                ) : (
                  <p className="text-black font-light px-4 py-3">
                    {user.location}
                  </p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-medium text-black uppercase tracking-wide">
                <Edit3 className="w-4 h-4 text-blue-400" />
                <span>Bio</span>
              </label>
              {isEditing ? (
                <textarea
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-blue-400 focus:outline-none transition-colors duration-200 font-light text-black resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-black font-light px-4 py-3 leading-relaxed">
                  {user.bio}
                </p>
              )}
            </div>

            {/* Joined Date */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Member since {formatDate(user.joinedDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
