"use client";

import React, { useState, useTransition } from "react";
import { useOptimistic } from "react";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Edit3,
  Save,
  X,
  MessageSquare,
  Heart,
  Eye,
  Phone,
  Loader2,
} from "lucide-react";

import { useForm } from "react-hook-form";
import {
  editProfileSchema,
  EditProfileSchemaData,
} from "@/lib/formSchemas/editProfileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { updateProfile } from "@/actions/profile/profile";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string | null;
  bio: string | null;
  joinedDate: string;
  commentsCount: number;
  likesCount: number;
  viewsCount: number;
}

interface ProfileProps {
  user: UserProfile;
}

function formatDateDisplay(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Helper function to generate user initials
function getUserInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
}

// Helper function to generate a consistent background color from name (for the cultuure as suggested by ai)
function getInitialsBackgroundColor(
  firstName: string,
  lastName: string
): string {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-teal-500",
  ];

  //Bro I would have done something longer walahi
  const nameHash = (firstName + lastName).split("").reduce((hash, char) => {
    return hash + char.charCodeAt(0);
  }, 0);

  return colors[nameHash % colors.length];
}

const ProfileComponent = ({ user }: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const [isPending, startTransition] = useTransition();

  const [optimisticUser, addOptimisticUpdate] = useOptimistic(
    user,
    (currentUser, newData: Partial<UserProfile>) => ({
      ...currentUser,
      ...newData,
    })
  );

  const {
    register,
    handleSubmit,
    setError,
    reset,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm<EditProfileSchemaData>({
    resolver: zodResolver(editProfileSchema),
    mode: "onChange",
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber || "",
      bio: user.bio || "",
    },
  });

  const handleEdit = () => {
    // Reset form with current user data when entering edit mode
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber || "",
      bio: user.bio || "",
    });
    clearErrors();
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset form to original values
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber || "",
      bio: user.bio || "",
    });
    clearErrors();
    setIsEditing(false);
  };

  // Enhanced form submission with useTransition
  const onSubmitWithOptimistic = (data: EditProfileSchemaData) => {
    clearErrors();

   

    // Exit edit mode optimistically
    setIsEditing(false);

    // Use startTransition to handle the async operation
      startTransition(async () => {
        addOptimisticUpdate({
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber || null,
          bio: data.bio || null,
        });
      try {
      
        const formData = new FormData();
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("phoneNumber", data.phoneNumber || "");
        if (data.bio) {
          formData.append("bio", data.bio);
        }

      
        const result = await updateProfile(formData);

        if (result?.errors && !result.success) {
       
          toast.error("Oops! Please check the form for errors.");

          // Revert optimistic update by resetting to original user data
          addOptimisticUpdate({
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            bio: user.bio,
          });

          // Re-enter edit mode on server errors
          setIsEditing(true);

          // Set server errors to React Hook Form
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && messages.length > 0) {
              setError(field as keyof EditProfileSchemaData, {
                type: "server",
                message: messages[0],
              });
            }
          });
        } else if (result?.success && result?.data) {
         

            //Still learning this hook
          addOptimisticUpdate({
            firstName: result.data.firstName,
            lastName: result.data.lastName,
            phoneNumber: result.data.phoneNumber,
            bio: result.data.bio,
          });

        
          reset({
            firstName: result.data.firstName,
            lastName: result.data.lastName,
            phoneNumber: result.data.phoneNumber || "",
            bio: result.data.bio || "",
          });

          toast.success("Your profile has been successfully updated!");
        }
      } catch (error) {
        
        console.error("Profile update failed:", error);
        toast.error("An unexpected error occurred. Please try again.");

        // Revert optimistic update
        addOptimisticUpdate({
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          bio: user.bio,
        });

        // Re-enter edit mode
        setIsEditing(true);
      }
    });
  };

  // Get user initials and background color
  const userInitials = getUserInitials(
    optimisticUser.firstName,
    optimisticUser.lastName
  );
  const initialsBackgroundColor = getInitialsBackgroundColor(
    optimisticUser.firstName,
    optimisticUser.lastName
  );

  return (
    <>
      <div className="bg-black h-16 mb-2 w-full flex-shrink-0" />
      <main className="bg-white">
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
              {/* Profile Avatar with Initials */}
              <div className="relative group">
                <div
                  className={`relative w-32 h-32 md:w-40 md:h-40 ${initialsBackgroundColor} rounded-full flex items-center justify-center transition-all duration-300 group-hover:opacity-90`}
                >
                  <span className="text-white text-3xl md:text-4xl font-semibold">
                    {userInitials}
                  </span>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2
                      className={`text-2xl md:text-3xl font-light text-black mb-2 transition-opacity duration-200 ${isPending ? "opacity-60" : ""}`}
                    >
                      {optimisticUser.firstName} {optimisticUser.lastName}
                      {isPending && (
                        <Loader2 className="w-5 h-5 animate-spin inline ml-2 text-blue-500" />
                      )}
                    </h2>
                    <p className="text-gray-600 font-light">
                      @{optimisticUser.userName}
                    </p>
                  </div>

                  {!isEditing && (
                    <button
                      onClick={handleEdit}
                      disabled={isPending}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:border-blue-400 text-black hover:text-blue-600 transition-colors duration-200 font-light disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <span>{optimisticUser.commentsCount} comments</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Heart className="w-4 h-4" />
                      <span>{optimisticUser.likesCount} likes</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Eye className="w-4 h-4" />
                      <span>{optimisticUser.viewsCount} views</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form
              onSubmit={handleSubmit(onSubmitWithOptimistic)}
              className="space-y-8"
            >
              {isEditing && (
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <h3 className="text-xl font-light text-black">
                    Edit Profile
                  </h3>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isPending}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      type="submit"
                      disabled={!isDirty || isPending}
                      className="flex items-center space-x-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white transition-colors duration-200 font-medium disabled:cursor-not-allowed min-w-[140px] justify-center"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-8">
          
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-medium text-black uppercase tracking-wide">
                    <User className="w-4 h-4 text-blue-400" />
                    <span>First Name</span>
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        {...register("firstName")}
                        disabled={isPending}
                        className={`w-full px-4 py-3 border ${
                          errors.firstName
                            ? "border-red-400"
                            : "border-gray-300"
                        } focus:border-blue-400 focus:outline-none transition-colors duration-200 font-light text-black disabled:bg-gray-50 disabled:cursor-not-allowed`}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p
                      className={`text-black font-light px-4 py-3 transition-opacity duration-200 ${isPending ? "opacity-60" : ""}`}
                    >
                      {optimisticUser.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-medium text-black uppercase tracking-wide">
                    <User className="w-4 h-4 text-blue-400" />
                    <span>Last Name</span>
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        {...register("lastName")}
                        disabled={isPending}
                        className={`w-full px-4 py-3 border ${
                          errors.lastName ? "border-red-400" : "border-gray-300"
                        } focus:border-blue-400 focus:outline-none transition-colors duration-200 font-light text-black disabled:bg-gray-50 disabled:cursor-not-allowed`}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p
                      className={`text-black font-light px-4 py-3 transition-opacity duration-200 ${isPending ? "opacity-60" : ""}`}
                    >
                      {optimisticUser.lastName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-medium text-black uppercase tracking-wide">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span>Email</span>
                  </label>
                  <p className="text-black font-light px-4 py-3">
                    {optimisticUser.email}
                  </p>
                </div>

                {/* Phone Number */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-medium text-black uppercase tracking-wide">
                    <Phone className="w-4 h-4 text-blue-400" />
                    <span>Phone Number</span>
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="tel"
                        {...register("phoneNumber")}
                        disabled={isPending}
                        placeholder="08012345678 or +2348012345678"
                        className={`w-full px-4 py-3 border ${
                          errors.phoneNumber
                            ? "border-red-400"
                            : "border-gray-300"
                        } focus:border-blue-400 focus:outline-none transition-colors duration-200 font-light text-black disabled:bg-gray-50 disabled:cursor-not-allowed`}
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phoneNumber.message}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p
                      className={`text-black font-light px-4 py-3 transition-opacity duration-200 ${isPending ? "opacity-60" : ""}`}
                    >
                      {optimisticUser.phoneNumber || "Not provided"}
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
                  <div>
                    <textarea
                      {...register("bio")}
                      disabled={isPending}
                      rows={4}
                      className={`w-full px-4 py-3 border ${
                        errors.bio ? "border-red-400" : "border-gray-300"
                      } focus:border-blue-400 focus:outline-none transition-colors duration-200 font-light text-black resize-none disabled:bg-gray-50 disabled:cursor-not-allowed`}
                      placeholder="Tell us about yourself..."
                    />
                    {errors.bio && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.bio.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <p
                    className={`text-black font-light px-4 py-3 leading-relaxed transition-opacity duration-200 ${isPending ? "opacity-60" : ""}`}
                  >
                    {optimisticUser.bio || "No bio provided"}
                  </p>
                )}
              </div>

              {/* Joined Date */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>
                    Member since {formatDateDisplay(optimisticUser.joinedDate)}
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProfileComponent;
