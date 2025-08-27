"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useCallback, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

import {
  applyToBecomeAuthorSchema,
  ApplyToBecomeAuthorSchemaData,
} from "@/lib/formSchemas/applyToBecomeAuthorSchema";

import Link from "next/link";
import { applyToBecomeAuthor } from "@/actions/author/apply";
import Image from "next/image";

type ValidationErrors = {
  bio?: string[];
  profilePicture?: string[];
};

type ApplicationState = {
  status: number;
  success: boolean;
  message: string;
  errors: string | ValidationErrors | null;
} | null;

const ApplyPageClient = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [applicationState, setApplicationState] =
    useState<ApplicationState>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    setError,
    reset,
    clearErrors,
  } = useForm<ApplyToBecomeAuthorSchemaData>({
    mode: "onChange",
    resolver: zodResolver(applyToBecomeAuthorSchema),
  });

  const profilePicture = watch("profilePicture");

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      toast.error("You need to have a GSF UI account to access this page");
      router.push(`/auth/register`);
    },
  });

  // Handle application state changes
  useEffect(() => {
    if (applicationState) {
      if (applicationState.success) {
        switch (applicationState.message) {
          case "User is already an author":
            toast.info("You're already an author!");

            //App should not even get here cos I am alredy handiling sumn like this
            router.push("/publishing/dashboard"); // Redirect to author dashboard
            break;
          case "Application submitted successfully":
            toast.success("Application submitted successfully!");
            setShowSuccess(true);
            reset();
            if (imagePreview) {
              URL.revokeObjectURL(imagePreview);
              setImagePreview(null);
            }
            break;
          case "approved":
            toast.success("Your application has been approved!");
            router.push("/publishing/dashboard");
            break;
          case "pending":
            toast.info("Your application is still pending review");
            setShowSuccess(true);
            break;
          case "rejected":
            toast.error(
              `Your application was rejected: ${applicationState.errors || "No reason provided"}`
            );
            break;
        }
      } else {
        // Handle errors
        if (applicationState.status === 401) {
          toast.error("Please log in to continue");
          router.push("/auth/login");
        } else if (
          applicationState.status === 400 &&
          typeof applicationState.errors === "object" &&
          applicationState.errors
        ) {
          // Map server validation errors to form field errors
          Object.entries(applicationState.errors as ValidationErrors).forEach(
            ([field, messages]) => {
              if (messages && messages.length > 0) {
                setError(field as keyof ApplyToBecomeAuthorSchemaData, {
                  type: "server",
                  message: messages[0],
                });
              }
            }
          );
          toast.error("Please correct the validation errors");
        } else {
          // General error handling
          const errorMessage =
            typeof applicationState.errors === "string"
              ? applicationState.errors
              : applicationState.message || "Something went wrong";
          toast.error(errorMessage);
        }
      }
    }
  }, [applicationState, setError, reset, router, imagePreview]);

  // Dropzone configuration
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Clear any previous profile picture errors
        clearErrors("profilePicture");

        // Set the file in react-hook-form
        setValue("profilePicture", file, { shouldValidate: true });

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      }
    },
    [setValue, clearErrors]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png"],
      },
      multiple: false,
      maxSize: 2 * 1024 * 1024, // 2MB
      onDropRejected: (fileRejections) => {
        const rejection = fileRejections[0];
        if (rejection) {
          //double validation LFG!
          const error = rejection.errors[0];
          if (error?.code === "file-too-large") {
            setError("profilePicture", {
              type: "manual",
              message: "File size must be less than 2MB",
            });
          } else if (error?.code === "file-invalid-type") {
            setError("profilePicture", {
              type: "manual",
              message: "Only image files are allowed",
            });
          }
        }
      },
    });

  // Clean up preview URL when component unmounts or image changes
  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setValue("profilePicture", undefined as unknown as File, {
      shouldValidate: true,
    });
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const onSubmit = async (data: ApplyToBecomeAuthorSchemaData) => {
    // Clear any previous application state
    setApplicationState(null);

    startTransition(async () => {
      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append("bio", data.bio);
        formData.append("profilePicture", data.profilePicture);

        // Call the server action
        const result = await applyToBecomeAuthor(formData);
        setApplicationState(result);
      } catch (error) {
        console.error("Error submitting form:", error);
        setApplicationState({
          status: 500,
          success: false,
          message: "Network error occurred",
          errors: "Please check your connection and try again",
        });
      }
    });
  };

  if (showSuccess) {
    return (
      <>
        <main className="min-h-screen bg-white flex items-center justify-center py-4">
          <div className="container mx-auto px-6 md:px-8 max-w-2xl">
            <div className="text-center space-y-12">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-blue-500 flex items-center justify-center rounded-full">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Success Message */}
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="w-8 h-px bg-blue-400"></div>
                  <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                    Request Submitted
                  </span>
                  <div className="w-8 h-px bg-blue-400"></div>
                </div>

                <h1 className="text-4xl md:text-5xl font-light text-black leading-tight">
                  Thank You!
                </h1>

                <p className="text-lg md:text-xl text-black font-light leading-relaxed">
                  Your author request has been successfully submitted.
                  <br />
                  {`You'll receive an email notification when you're approved to
                  start publishing.`}
                </p>
              </div>

              {/* Next Steps */}
              <div className="bg-gray-50 py-8 px-8 md:px-12 space-y-6 rounded-lg">
                <h3 className="text-xl font-medium text-black">
                  What happens next?
                </h3>
                <ul className="space-y-4 text-left">
                  <li className="flex items-start space-x-4">
                    <span className=" w-6 h-6 bg-blue-400 text-white text-xs font-medium inline-flex items-center justify-center flex-shrink-0 mt-0.5 rounded-full">
                      1
                    </span>
                    <span className="text-black font-light">
                      Our Leadership will review your application
                    </span>
                  </li>
                  <li className="flex items-start space-x-4">
                    <span className=" w-6 h-6 bg-blue-400 text-white text-xs font-medium inline-flex items-center justify-center flex-shrink-0 mt-0.5 rounded-full">
                      2
                    </span>
                    <span className="text-black font-light">
                      {`You'll receive an approval email if you get approved`}
                    </span>
                  </li>
                  <li className="flex items-start space-x-4">
                    <span className=" w-6 h-6 bg-blue-400 text-white text-xs font-medium inline-flex items-center justify-center flex-shrink-0 mt-0.5 rounded-full">
                      3
                    </span>
                    <span className="text-black font-light">
                      Start creating and publishing inspiring content as guided
                      by the Holy spirit
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/publishing"
                  className="px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors text-center"
                >
                  Back to Publishing
                </Link>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-white">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 md:px-8 max-w-3xl">
            {/* Back Button */}
            <Link
              href="/publishing"
              className="inline-flex items-center space-x-2 text-blue-500 hover:text-blue-600 font-medium mb-8 transition-colors duration-200"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back to publishing home page</span>
            </Link>

            {/* Form Header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-8 h-px bg-blue-400"></div>
                <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                  Author Application
                </span>
                <div className="w-8 h-px bg-blue-400"></div>
              </div>
              <h1 className="text-3xl md:text-4xl font-light text-black mb-6 leading-tight">
                Tell Us About Yourself
              </h1>
              <p className="text-lg text-black font-light">
                Help us get to know you better so we can welcome you to our
                community of writers.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
              {/* Profile Picture Upload */}
              <div className="space-y-4">
                <label className="block text-lg font-medium text-black">
                  Profile Picture <span className="text-blue-500">*</span>
                </label>

                <div
                  {...getRootProps()}
                  className={`relative border-2 border-dashed transition-colors duration-200 p-12 text-center cursor-pointer rounded-lg ${
                    isDragActive
                      ? "border-blue-400 bg-blue-50"
                      : isDragReject
                        ? "border-red-400 bg-red-50"
                        : errors.profilePicture
                          ? "border-red-400"
                          : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  <input {...getInputProps()} />

                  {imagePreview ? (
                    <div className="space-y-4">
                      <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden bg-gray-100">
                        {/**
                         * Wahala for next.js Image
                         */}
                        <Image
                          src={imagePreview}
                          sizes="128px"
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-black font-light">
                        {profilePicture?.name}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                        className="text-red-500 hover:text-red-600 text-sm font-medium"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <svg
                        className="w-12 h-12 text-gray-400 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <div>
                        <p className="text-black font-medium">
                          {isDragActive
                            ? "Drop your profile picture here"
                            : "Upload your profile picture"}
                        </p>
                        <p className="text-sm text-gray-600 font-light">
                          Drag and drop or click to select (Max 2MB)
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Supported formats: JPEG, PNG, GIF, WebP
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {errors.profilePicture && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.profilePicture.message}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-3">
                <label className="block text-lg font-medium text-black">
                  About You (this should be like you writing a short bio about
                  yourself) <span className="text-blue-500">*</span>
                </label>
                <textarea
                  {...register("bio")}
                  rows={6}
                  className={`w-full px-4 py-3 border transition-colors duration-200 text-black resize-none rounded-lg focus:outline-none ${
                    errors.bio
                      ? "border-red-400 focus:border-red-400"
                      : "border-gray-300 focus:border-blue-400"
                  }`}
                  placeholder="Imagine you you are writing a short bio about yourself for people to read, what would you say?"
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.bio.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="text-center pt-8">
                <button
                  type="submit"
                  disabled={!isValid || isPending}
                  className={`inline-flex items-center space-x-3 px-12 py-4 font-medium transition-all duration-300 rounded-lg ${
                    isValid && !isPending
                      ? "bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg transform hover:-translate-y-1"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isPending ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Application</span>
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
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default ApplyPageClient;
