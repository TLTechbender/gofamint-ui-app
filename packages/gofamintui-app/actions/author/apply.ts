"use server";
import { prisma } from "@/lib/prisma/prisma";
import { auth } from "@/auth";
import {
  sanityCreateWrapper,
  sanityFetchWrapper,
} from "@/sanity/sanityCRUDHandlers";

import { Author } from "@/sanity/interfaces/author";
import { applyToBecomeAuthorSchema } from "@/lib/formSchemas/applyToBecomeAuthorSchema";
import { sanityClient } from "@/sanity/sanityClient";
import { revalidatePath } from "next/cache";
import { authorQuery } from "@/sanity/queries/author";
type ValidationErrors = {
  bio?: string[];
  profilePicture?: string[];
};

type ApplicationStatusResponse = {
  status: number;
  success: boolean;
  message: string;
  errors: string | ValidationErrors | null;
};

export async function checkApplicationStatus(): Promise<ApplicationStatusResponse> {
  const session = await auth();

  if (!session?.user) {
    return {
      status: 401,
      success: false,
      message: "Unauthorized",
      errors: "No valid session found",
    };
  }

  const userId = session.user.id;

  try {
    // Check if user is already an author
    const existingAuthor = await prisma.user.findUnique({
      where: {
        id: userId,
        isAuthor: true, // Simplified: no need for AND clause here
      },
    });

    if (existingAuthor) {
      return {
        status: 200,
        success: true,
        message: "User is already an author",
        errors: null,
      };
    }

    const authorApplication = await sanityFetchWrapper<Author>(authorQuery, {
      userId,
    });

    if (!authorApplication) {
      return {
        status: 200,
        success: true,
        message: "no_application",
        errors: null,
      };
    }

    const { application } = authorApplication;

    switch (application.status) {
      case "pending":
        return {
          status: 200,
          success: true,
          message: "pending",
          errors: null,
        };

      case "approved":
        if (application.isApproved) {
          return {
            status: 200,
            success: true,
            message: "approved",
            errors: null,
          };
        }

        //This should never happen sha
        return {
          status: 200,
          success: false,
          message: "inconsistent_approval_status",
          errors: "Application status and approval flag don't match",
        };

      case "rejected":
        return {
          status: 200,
          success: true,
          message: "rejected",
          errors: application.rejectionReason || "No reason provided",
        };

      default:
        return {
          status: 200,
          success: false,
          message: "unknown_status",
          errors: `Unknown application status: ${application.status}`,
        };
    }
  } catch (error) {
    console.error("Error checking application status:", error);
    return {
      status: 500,
      success: false,
      message: "Internal server error",
      errors: "Failed to check application status",
    };
  }
}

export async function applyToBecomeAuthor(
  formData: FormData
): Promise<ApplicationStatusResponse> {
  const session = await auth();

  if (!session?.user) {
    return {
      status: 401,
      success: false,
      message: "Unauthorized",
      errors: "No valid session found",
    };
  }

  const userId = session.user.id;

  try {
    // Check if user is already an author
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (existingUser?.isAuthor) {
      return {
        status: 200,
        success: true,
        message: "User is already an author",
        errors: null,
      };
    }

    // Get form data
    const rawFormData = {
      profilePicture: formData.get("profilePicture") as File,
      bio: formData.get("bio") as string,
    };

    const result = applyToBecomeAuthorSchema.safeParse(rawFormData);

    if (!result.success) {
      const fieldErrors: ValidationErrors = {};

      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof ValidationErrors;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = [];
        }
        fieldErrors[fieldName]!.push(issue.message);
      });

      return {
        success: false,
        status: 400,
        message: "Please correct the validation errors",
        errors: fieldErrors,
      };
    }

    const { profilePicture, bio } = result.data;

    // Upload image to Sanity first, omo just learnig this ooo
    let imageAsset = null;
    if (profilePicture && profilePicture.size > 0) {
      try {
        imageAsset = await sanityClient.assets.upload("image", profilePicture, {
          filename: profilePicture.name,
        });
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return {
          status: 500,
          success: false,
          message: "Failed to upload profile picture",
          errors: "Image upload failed",
        };
      }
    }

    // Create author document
    const authorDoc = {
      _type: "author" as const,
      userId: existingUser?.id,
      email: existingUser?.email,
      userName: existingUser?.userName,
      firstName: existingUser?.firstName,
      lastName: existingUser?.lastName,
      phoneNumber: existingUser?.phoneNumber,
      userBio: existingUser?.bio || undefined, // Add user bio if available
      authorBio: bio,
      requestedAt: new Date().toISOString(),
      application: {
        isApproved: false,
        status: "pending" as const,
      },
      // Only add profilePic if image was uploaded correctly, chai wahala
      ...(imageAsset && {
        profilePic: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset._id,
          },
        },
      }),
    };

  

    await sanityCreateWrapper(authorDoc);
    revalidatePath("/publishing/author/apply");
    return {
      status: 200,
      success: true,
      message: "Application submitted successfully",
      errors: null,
    };
  } catch (error) {
    console.error("Error applying to become author:", error);
    return {
      status: 500,
      success: false,
      message: "Internal server error",
      errors: "Failed to apply to become an author",
    };
  }
}
