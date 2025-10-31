"use server";

import { auth } from "@/auth";
import {
  AuthorDetailsBarImagesSchemaData,
  editAuthorDetailsBarImagesSchema,
  editAuthorProfilePictureSchema,
} from "@/lib/formSchemas/editAuthorDetailsSchema";
import { Author } from "@/sanity/interfaces/author";
import { authorQuery } from "@/sanity/queries/author";
import { sanityClient } from "@/sanity/sanityClient";
import {
  sanityFetchWrapper,
  sanityPatchWrapper,
} from "@/sanity/sanityCRUDHandlers";
import { revalidatePath } from "next/cache";

// Response types
interface ServerActionResponse<T = any> {
  status: number;
  success: boolean;
  message: string;
  errors?: string | any;
  data?: T;
}

interface ProfilePictureUploadResponse {
  _id: string;
  url?: string;
}


//again making a lot of concession here

export async function editAuthorProfilePicture(
  formData: FormData
): Promise<ServerActionResponse<ProfilePictureUploadResponse | null>> {
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
    const rawData = {
      profilePicture: formData.get("profilePicture") as File,
    };

    const validationResult = editAuthorProfilePictureSchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        status: 400,
        success: false,
        message: "Validation failed",
        errors: validationResult.error.flatten(),
      };
    }

    const isUserExisting = await sanityFetchWrapper<Author>(authorQuery, {
      userId: userId,
    });

    if (!isUserExisting) {
      return {
        status: 404,
        success: false,
        message: "User not found",
        errors: "Author document not found",
      };
    }

    const { profilePicture } = validationResult.data;

    let imageAsset = null;
    if (
      profilePicture &&
      profilePicture instanceof File &&
      profilePicture.size > 0
    ) {
      try {
        imageAsset = await sanityClient.assets.upload("image", profilePicture, {
          filename: profilePicture.name,
        });
      } catch (uploadError) {
     
        return {
          status: 500,
          success: false,
          message: "Failed to upload profile picture",
          errors: "Image upload failed",
        };
      }
    }

    const authorDocumentId = isUserExisting._id;

    const result = await sanityPatchWrapper<Author>(authorDocumentId, {
      set: {
        ...(imageAsset && {
          profilePic: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: imageAsset._id,
            },
          },
        }),
      },
    });

    if (!result) {
      return {
        status: 500,
        success: false,
        message: "Failed to update profile picture in sanity",
        errors: "Failed to upload profile picture in sanity",
      };
    }

    revalidatePath("/publishing/author");

    return {
      status: 200,
      success: true,
      message: "Profile picture updated successfully",
      data: {
        _id: result._id,
        url: imageAsset?.url || undefined,
      },
    };
  } catch (error) {
  
    return {
      status: 500,
      success: false,
      message: "Internal server error",
      errors: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function editAuthorDetailsBarProfilePicture(
  formData: FormData
): Promise<ServerActionResponse<Author>> {
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
    // Extract data from FormData
    const bio = formData.get("bio") as string;
    const socialMediaJson = formData.get("socialMedia") as string;



    // Parse social media data if it exists
    let socialMedia;
    if (socialMediaJson) {
      try {
        socialMedia = JSON.parse(socialMediaJson);
      } catch (error) {
      
        return {
          status: 400,
          success: false,
          message: "Invalid social media data format",
          errors: "Failed to parse social media JSON",
        };
      }
    }

    // Prepare data for validation
    const rawData: AuthorDetailsBarImagesSchemaData = {
      bio,
      socialMedia: socialMedia || [],
    };

    // Validate the data with Zod
    const validationResult =
      editAuthorDetailsBarImagesSchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        status: 400,
        success: false,
        message: "Validation failed",
        errors: validationResult.error.flatten(),
      };
    }

    const validatedData = validationResult.data;

    // Check if user exists
    const isUserExisting = await sanityFetchWrapper<Author>(authorQuery, {
      userId: userId,
    });

    if (!isUserExisting) {
      return {
        status: 404,
        success: false,
        message: "User not found",
        errors: "Author document not found",
      };
    }

    // Transform socialMedia data to match Sanity schema structure
    const transformedSocials =
      validatedData.socialMedia?.map((social: any) => {
        return {
          _type: "object",
          platform: social.platform,
          url: social.url,
          handle: social.handle || null,
        };
      }) || [];

    // Prepare updates object
    const updates = {
      userBio: validatedData.bio,
      authorBio: validatedData.bio,
      socials: transformedSocials,
      _updatedAt: new Date().toISOString(),
    };

   

    // Update the user document
    const authorDocumentId = isUserExisting._id;
    const result = await sanityPatchWrapper<Author>(authorDocumentId, {
      set: updates,
    });

    if (!result) {
      return {
        status: 500,
        success: false,
        message: "Failed to update profile",
        errors: "Database update failed",
      };
    }

    revalidatePath("/publishing/author");

    return {
      status: 200,
      success: true,
      message: "Profile updated successfully",
      data: result,
    };
  } catch (error) {
  
    return {
      status: 500,
      success: false,
      message: "Internal server error",
      errors: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
