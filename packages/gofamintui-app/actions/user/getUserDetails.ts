"use server";
import { prisma } from "@/lib/prisma/prisma";
import { Author } from "@/sanity/interfaces/author";
import { SanityImage } from "@/sanity/interfaces/sanityImage";
import { authorQuery } from "@/sanity/queries/author";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";

interface UserDetailsResponse {
  status: number;
  success: boolean;
  errors?: string | string[];
  data?: {
    dateJoined: string;
    firstName: string;
    lastName: string;
    bio?: string | null;
    userName: string;
    isAuthor: boolean;
    profilePicture?: SanityImage;
  };
}

export async function getUserDetails(
  userId: string
): Promise<UserDetailsResponse> {
  try {
    // Validate userId parameter
    if (!userId || typeof userId !== "string") {
      return {
        status: 400,
        success: false,
        errors: "Invalid user ID provided.",
      };
    }

    // Fetch user details from database
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        createdAt: true,
        firstName: true,
        lastName: true,
        bio: true,
        userName: true,
        isAuthor: true,
      },
    });

    if (!user) {
      return {
        status: 404,
        success: false,
        errors: "User not found. Please contact support if this persists.",
      };
    }

    // Base user data
    const userData = {
      dateJoined: user.createdAt.toISOString(),
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      userName: user.userName,
      isAuthor: user.isAuthor,
    };

    // If user is an author, fetch additional details from Sanity
    if (user.isAuthor) {
      try {
        const authorDetails = await sanityFetchWrapper<Author>(authorQuery, {
          userId: userId,
        });

        if (authorDetails?.profilePic?.asset?.url) {
          return {
            status: 200,
            success: true,
            data: {
              ...userData,
              profilePicture: authorDetails.profilePic,
            },
          };
        }
      } catch (sanityError) {
        console.error(
          "Failed to fetch author details from Sanity:",
          sanityError
        );

        // Return user data without profile picture if Sanity fails
        return {
          status: 200,
          success: true,
          data: userData,
          errors:
            "Unable to load profile picture. Other details loaded successfully.",
        };
      }
    }

    return {
      status: 200,
      success: true,
      data: userData,
    };
  } catch (error) {
    console.error("Error fetching user details:", error);

    return {
      status: 500,
      success: false,
      errors:
        "An unexpected error occurred while fetching user details. Please try again later.",
    };
  }
}
