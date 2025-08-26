"use client";
import { useState, useTransition, useOptimistic } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Edit,
  Eye,
  Heart,
  Users,
  BookOpen,

  Save,
  X,
  Camera,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Github,
  Globe,
  Plus,
  Trash2,
} from "lucide-react";
import {
  AuthorDetailsBarImagesSchemaData,
  AuthorProfilePictureSchemaData,
  editAuthorDetailsBarImagesSchema,
  editAuthorProfilePictureSchema,
} from "@/lib/formSchemas/editAuthorDetailsSchema";
import {
  editAuthorDetailsBarProfilePicture,
  editAuthorProfilePicture,
} from "@/actions/author/editProfile";
import { toast } from "react-toastify";
import Link from "next/link";
import { AuthorAnalytics } from "@/actions/author/authorAnalytics";

// Type definitions
export interface ProfileData {
  firstName: string;
  lastName: string;
  bio: string;
  email: string;
  joinedDate: string;
  profileImage: string;
  socials: SocialMedia[];
}

export interface SocialMedia {
  platform:
    | "twitter"
    | "linkedin"
    | "instagram"
    | "facebook"
    | "github"
    | "website";
  url: string;
  handle?: string;
}

//Todo, bro come do the analytics later man
//update: cooked the analytics

interface Post {
  title: string;
  views: number;
  likes: number;
  date: string;
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;

  isMain?: boolean;
}

const AuthorDashboardClient = ({
  profileData,
  analyticsData,
}: {
  profileData: ProfileData;
  analyticsData: AuthorAnalytics;
}) => {
  const [isBioEditing, setIsBioEditing] = useState<boolean>(false);
  const [isImageEditing, setIsImageEditing] = useState<boolean>(false);
  // Add state for preview image URL
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Transition hooks for server actions
  const [isPendingBio, startBioTransition] = useTransition();
  const [isPendingImage, startImageTransition] = useTransition();

  // Optimistic updates
  const [optimisticProfile, updateOptimisticProfile] = useOptimistic(
    profileData,
    (state, newProfile: Partial<ProfileData>) => ({
      ...state,
      ...newProfile,
    })
  );

  // React Hook Form setup for bio and social media
  const bioForm = useForm<AuthorDetailsBarImagesSchemaData>({
    resolver: zodResolver(editAuthorDetailsBarImagesSchema),
    defaultValues: {
      bio: profileData.bio,
      socialMedia: profileData.socials,
    },
  });

  const {
    control: bioControl,
    handleSubmit: handleBioSubmit,
    reset: resetBioForm,
    formState: { errors: bioErrors },
  } = bioForm;

  // React Hook Form setup for profile picture
  const imageForm = useForm<AuthorProfilePictureSchemaData>({
    resolver: zodResolver(editAuthorProfilePictureSchema),
    defaultValues: {
      profilePicture: undefined,
    },
  });

  const {
    control: imageControl,
    handleSubmit: handleImageSubmit,
    reset: resetImageForm,
    formState: { errors: imageErrors },
  } = imageForm;

  // Field array for dynamic social media fields
  const { fields, append, remove } = useFieldArray({
    control: bioControl,
    name: "socialMedia",
  });

  const recentPosts: Post[] = [
    {
      title: "Finding Community in Faith",
      views: 834,
      likes: 67,
      date: "2 days ago",
    },
    {
      title: "Campus Life Reflections",
      views: 1247,
      likes: 89,
      date: "1 week ago",
    },
    {
      title: "Prayer and Study Balance",
      views: 692,
      likes: 45,
      date: "2 weeks ago",
    },
    {
      title: "GSF UI Conference Highlights",
      views: 1856,
      likes: 134,
      date: "3 weeks ago",
    },
  ];

  // Handle file selection for image preview
  const handleImageFileChange = (file: File) => {
    if (file) {
      // Clean up previous URL if exists
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
      // Create new preview URL
      const url = URL.createObjectURL(file);
      setPreviewImageUrl(url);
    }
  };

  // Bio and social media form submission handler
  const onBioSubmit = async (data: AuthorDetailsBarImagesSchemaData) => {
    startBioTransition(async () => {
      try {
        // Optimistic update
        updateOptimisticProfile({
          bio: data.bio,
          socials: data.socialMedia || [],
        });

        console.log("data for checking", data);
        // Create FormData for server action
        const formData = new FormData();
        formData.append("bio", data.bio);

        if (data.socialMedia && data.socialMedia.length > 0) {
          formData.append("socialMedia", JSON.stringify(data.socialMedia));
        }

        // Call server action
        const result = await editAuthorDetailsBarProfilePicture(formData);

        if (result?.success) {
          // Update actual state on success
          setIsBioEditing(false);
          toast.success("Bio details updated successfully!");
        } else {
          // Revert optimistic update on error
          updateOptimisticProfile(profileData);
          toast.error(
            result?.message || "Failed to update profile. Please try again."
          );
        }
      } catch (error) {
        // Revert optimistic update on error
        updateOptimisticProfile(profileData);
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile. Please try again.");
      }
    });
  };

  // Profile picture form submission handler
  const onImageSubmit = async (data: AuthorProfilePictureSchemaData) => {
    if (!data.profilePicture) return;

    startImageTransition(async () => {
      try {
        // Create FormData for server action
        const formData = new FormData();
        formData.append("profilePicture", data.profilePicture!);

        // Call server action
        const result = await editAuthorProfilePicture(formData);

        if (result?.success) {
          // Update the actual profile image URL from server response
          //For real, typescript has been saving my ass in many ways that I can count
          if (result.data?.url) {
            updateOptimisticProfile({
              profileImage: result.data.url,
            });
          }

          // Clean up preview URL
          if (previewImageUrl) {
            URL.revokeObjectURL(previewImageUrl);
            setPreviewImageUrl(null);
          }

          setIsImageEditing(false);
          resetImageForm();
          toast.success("Profile picture updated successfully!");
        } else {
          toast.error(
            result?.message ||
              "Failed to update profile picture. Please try again."
          );
        }
      } catch (error) {
        console.error("Error updating profile picture:", error);
        toast.error("Failed to update profile picture. Please try again.");
      }
    });
  };

  const handleBioCancel = (): void => {
    resetBioForm({
      bio: profileData.bio,
      socialMedia: profileData.socials,
    });
    setIsBioEditing(false);
  };

  const handleImageCancel = (): void => {
    resetImageForm();
    setIsImageEditing(false);

    // Clean up preview URL and revert to original
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
      setPreviewImageUrl(null);
    }
  };

  const getSocialIcon = (platform: string) => {
    const iconClass = "w-5 h-5";
    switch (platform) {
      case "twitter":
        return <Twitter className={iconClass} />;
      case "linkedin":
        return <Linkedin className={iconClass} />;
      case "instagram":
        return <Instagram className={iconClass} />;
      case "facebook":
        return <Facebook className={iconClass} />;
      case "github":
        return <Github className={iconClass} />;
      case "website":
        return <Globe className={iconClass} />;
      default:
        return <Globe className={iconClass} />;
    }
  };

  const addSocial = (): void => {
    append({ platform: "twitter", url: "", handle: "" });
  };

  const StatCard: React.FC<StatCardProps> = ({
    icon: Icon,
    label,
    value,
   
    isMain = false,
  }) => (
    <div
      className={`bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg p-4 sm:p-6 ${isMain ? "sm:col-span-2" : ""}`}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 flex items-center justify-center rounded-sm">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-600 tracking-wide uppercase">
            {label}
          </span>
        </div>
        
      </div>
      <div className="space-y-1">
        <p
          className={`font-light text-black ${isMain ? "text-3xl sm:text-4xl md:text-5xl" : "text-xl sm:text-2xl md:text-3xl"}`}
        >
          {value.toLocaleString()}
        </p>
      
      </div>
    </div>
  );

  // Determine which image to show: preview > optimistic > original
  const currentImageUrl = previewImageUrl || optimisticProfile.profileImage;

  return (
    <>
      <div className="bg-black h-16 mb-2 w-full flex-shrink-0" />
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 max-w-7xl">
          {/* Header */}
          <div className="mb-12 sm:mb-16 md:mb-20">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-6 sm:w-8 h-px bg-blue-400"></div>
              <span className="text-xs sm:text-sm font-medium text-blue-400 tracking-widest uppercase">
                Author Dashboard
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-black leading-tight tracking-tight">
              Welcome back, {optimisticProfile.firstName}
            </h1>
          </div>

          {/* Profile Section */}
          <div className="mb-16 sm:mb-20 md:mb-24">
            <div className="bg-gray-50 p-6 sm:p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 md:gap-12 items-start">
                {/* Profile Image & Basic Info */}
                <div className="md:col-span-4 text-center md:text-left">
                  <div className="relative inline-block mb-4 sm:mb-6">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 relative overflow-hidden mx-auto md:mx-0 rounded-sm">
                      <img
                        src={currentImageUrl}
                        alt={`${optimisticProfile.firstName}'s profile picture`}
                        className="w-full h-full object-cover"
                      />
                      {isImageEditing && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center md:hidden">
                          <label className="bg-blue-400 text-white p-3 hover:bg-blue-500 transition-colors rounded-full cursor-pointer">
                            <Camera className="w-6 h-6" />
                            <Controller
                              name="profilePicture"
                              control={imageControl}
                              render={({
                                field: { onChange, value, ...field },
                              }) => (
                                <input
                                  {...field}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      onChange(file);
                                      handleImageFileChange(file);
                                    }
                                  }}
                                />
                              )}
                            />
                          </label>
                        </div>
                      )}
                    </div>

                    {isImageEditing && (
                      <label className="absolute -bottom-2 -right-2 bg-blue-400 text-white p-2 hover:bg-blue-500 transition-colors rounded-full hidden md:flex items-center justify-center shadow-lg cursor-pointer">
                        <Camera className="w-4 h-4" />
                        <Controller
                          name="profilePicture"
                          control={imageControl}
                          render={({
                            field: { onChange, value, ...field },
                          }) => (
                            <input
                              {...field}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  onChange(file);
                                  handleImageFileChange(file);
                                }
                              }}
                            />
                          )}
                        />
                      </label>
                    )}
                  </div>

                  {/* Profile Image Edit Controls */}
                  <div className="mb-4 sm:mb-6">
                    {!isImageEditing ? (
                      <button
                        onClick={() => setIsImageEditing(true)}
                        className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 transition-colors text-sm font-medium rounded-sm flex items-center justify-center space-x-2"
                        disabled={isPendingImage}
                      >
                        <Camera className="w-4 h-4" />
                        <span>Change Photo</span>
                      </button>
                    ) : (
                      <form onSubmit={handleImageSubmit(onImageSubmit)}>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                          <button
                            type="submit"
                            disabled={isPendingImage}
                            className="bg-blue-400 text-white px-4 py-2 hover:bg-blue-500 transition-colors text-sm font-medium rounded-sm flex items-center justify-center space-x-2 disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            <span>
                              {isPendingImage ? "Saving..." : "Save Photo"}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={handleImageCancel}
                            disabled={isPendingImage}
                            className="text-gray-600 hover:text-black transition-colors px-4 py-2 border border-gray-200 hover:border-gray-300 text-sm font-medium rounded-sm flex items-center justify-center space-x-2 disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        </div>
                        {imageErrors.profilePicture && (
                          <p className="text-red-500 text-sm mt-1">
                            {imageErrors.profilePicture.message}
                          </p>
                        )}
                      </form>
                    )}
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-gray-600 font-light tracking-wide uppercase">
                      contributing author
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 font-light">
                      Became an author on: {optimisticProfile.joinedDate}
                    </p>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="md:col-span-8 space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-black mb-2">
                        {optimisticProfile.firstName}{" "}
                        {optimisticProfile.lastName}
                      </h2>

                      {/* Bio and Social Media Form */}
                      <form onSubmit={handleBioSubmit(onBioSubmit)}>
                        {/* Bio Section */}
                        {!isBioEditing ? (
                          <p className="text-sm  text-black font-light leading-relaxed mb-3 sm:mb-4">
                            {optimisticProfile.bio}
                          </p>
                        ) : (
                          <div className="mb-3 sm:mb-4">
                            <Controller
                              name="bio"
                              control={bioControl}
                              render={({ field }) => (
                                <textarea
                                  {...field}
                                  rows={10}
                                  className="w-full text-base sm:text-lg font-light text-black bg-white border border-gray-200 p-2 sm:p-3 focus:border-blue-400 focus:outline-none transition-colors resize-none rounded-sm"
                                  placeholder="Bio"
                                />
                              )}
                            />
                            {bioErrors.bio && (
                              <p className="text-red-500 text-sm mt-1">
                                {bioErrors.bio.message}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Email - Always read-only */}
                        <p className="text-sm sm:text-base text-gray-600 font-light break-all sm:break-normal mb-4">
                          {optimisticProfile.email}
                        </p>

                        {/* Social Media */}
                        {!isBioEditing ? (
                          <div className="flex flex-wrap gap-3">
                            {optimisticProfile.socials.map((social, index) => (
                              <a
                                key={index}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-sm"
                                title={social.handle || social.url}
                              >
                                {getSocialIcon(social.platform)}
                                {social.handle && (
                                  <span className="text-sm font-medium">
                                    {social.handle}
                                  </span>
                                )}
                              </a>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-700">
                                Social Media
                              </h4>
                              <button
                                type="button"
                                onClick={addSocial}
                                className="flex items-center space-x-1 text-blue-400 hover:text-blue-500 text-sm"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Add Social</span>
                              </button>
                            </div>

                            {fields.map((field, index) => (
                              <div
                                key={field.id}
                                className="bg-gray-50 p-4 rounded-sm space-y-3"
                              >
                                <div className="flex items-center justify-between">
                                  <Controller
                                    name={`socialMedia.${index}.platform`}
                                    control={bioControl}
                                    render={({ field: platformField }) => (
                                      <select
                                        {...platformField}
                                        className="text-sm border border-gray-200 rounded px-2 py-1 focus:border-blue-400 focus:outline-none"
                                      >
                                        <option value="twitter">Twitter</option>
                                        <option value="linkedin">
                                          LinkedIn
                                        </option>
                                        <option value="instagram">
                                          Instagram
                                        </option>
                                        <option value="facebook">
                                          Facebook
                                        </option>
                                        <option value="github">GitHub</option>
                                        <option value="website">Website</option>
                                      </select>
                                    )}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="text-red-500 hover:text-red-600 p-1"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>

                                <Controller
                                  name={`socialMedia.${index}.url`}
                                  control={bioControl}
                                  render={({ field: urlField }) => (
                                    <div>
                                      <input
                                        {...urlField}
                                        type="url"
                                        placeholder="URL (e.g., https://twitter.com/username)"
                                        className="w-full text-sm border border-gray-200 rounded px-3 py-2 focus:border-blue-400 focus:outline-none"
                                      />
                                      {bioErrors.socialMedia?.[index]?.url && (
                                        <p className="text-red-500 text-xs mt-1">
                                          {
                                            bioErrors.socialMedia[index]?.url
                                              ?.message
                                          }
                                        </p>
                                      )}
                                    </div>
                                  )}
                                />

                                <Controller
                                  name={`socialMedia.${index}.handle`}
                                  control={bioControl}
                                  render={({ field: handleField }) => (
                                    <input
                                      {...handleField}
                                      type="text"
                                      placeholder="Handle (e.g., @username) - optional for LinkedIn/Website"
                                      className="w-full text-sm border border-gray-200 rounded px-3 py-2 focus:border-blue-400 focus:outline-none"
                                    />
                                  )}
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Form Submission Buttons */}
                        {isBioEditing && (
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                            <button
                              type="submit"
                              disabled={isPendingBio}
                              className="flex items-center justify-center space-x-2 bg-blue-400 text-white px-3 sm:px-4 py-2 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-sm text-sm"
                            >
                              <Save className="w-4 h-4" />
                              <span className="font-medium">
                                {isPendingBio ? "Saving..." : "Save Changes"}
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={handleBioCancel}
                              disabled={isPendingBio}
                              className="flex items-center justify-center space-x-2 text-gray-600 hover:text-black transition-colors px-3 sm:px-4 py-2 border border-gray-200 hover:border-gray-300 rounded-sm text-sm disabled:opacity-50"
                            >
                              <X className="w-4 h-4" />
                              <span className="font-medium">Cancel</span>
                            </button>
                          </div>
                        )}
                      </form>
                    </div>

                    {/* Edit Button */}
                    <div className="flex-shrink-0">
                      {!isBioEditing && (
                        <button
                          onClick={() => setIsBioEditing(true)}
                          disabled={isPendingBio || isPendingImage}
                          className="flex items-center space-x-2 text-blue-400 hover:text-blue-500 transition-colors disabled:opacity-50"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Edit Bio & Socials
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="mb-16 sm:mb-20 md:mb-24">
            <div className="flex items-center space-x-3 mb-6 sm:mb-8">
              <div className="w-6 sm:w-8 h-px bg-blue-400"></div>
              <span className="text-xs sm:text-sm font-medium text-blue-400 tracking-widest uppercase">
                Analytics Overview
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <StatCard
                icon={Eye}
                label="Total Views"
                value={analyticsData.totalGenericViews}
              
                isMain={true}
              />
              <StatCard
                icon={Users}
                label="Verified Views"
                value={analyticsData.totalVerifiedViews}
               
              />
              <StatCard
                icon={Heart}
                label="Total Likes"
                value={analyticsData.totalLikes}
               
              />
              <StatCard
                icon={BookOpen}
                label="Published Posts"
                value={analyticsData.totalPosts}
              />
            </div>
          </div>

          {/* Recent Posts Section */}
          <div className="mb-16 sm:mb-20 md:mb-24">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 sm:w-8 h-px bg-blue-400"></div>
                <span className="text-xs sm:text-sm font-medium text-blue-400 tracking-widest uppercase">
                  Recent Posts
                </span>
              </div>
              <Link
                href={`/publishing/author/new`}
                className="flex items-center space-x-2 bg-blue-400 text-white px-4 sm:px-6 py-2 sm:py-3 hover:bg-blue-500 transition-colors text-sm font-medium tracking-wide uppercase rounded-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Post</span>
              </Link>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {recentPosts.map((post, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg p-4 sm:p-6 rounded-sm"
                >
                  <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-medium text-black mb-1 sm:mb-2 hover:text-blue-500 transition-colors cursor-pointer leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 font-light">
                        Published {post.date}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 sm:space-x-8 text-sm">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-black font-light">
                          {post.views.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-gray-400" />
                        <span className="text-black font-light">
                          {post.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 text-center">
              <button className="text-blue-400 hover:text-blue-500 transition-colors font-medium text-sm tracking-wide uppercase">
                View All Posts →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthorDashboardClient;
