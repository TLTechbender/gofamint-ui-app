"use server";

import { auth } from "@/auth";
import { Author } from "@/sanity/interfaces/author";
import { authorQuery } from "@/sanity/queries/author";
import { urlFor } from "@/sanity/sanityClient";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";


interface AuthorProfilePictureURLResponse {
  success: boolean;
  profilePicUrl?: string | null;
  error: string | null;
  status: number;
}

export async function getAuthorProfilePictureURL(): Promise<AuthorProfilePictureURLResponse> {
  try {
    const session = await auth();

    if (!session?.user.isAuthor) {
      return {
        success: false,
        profilePicUrl: null,
        error: "User not an author",
        status: 403,
      };
    }

    const authorDetails = await sanityFetchWrapper<Author>(authorQuery, {
      userId: session.user.id,
    });

    if (!authorDetails || !authorDetails.profilePic?.asset) {
      return {
        success: false,
        profilePicUrl: null,
        error: "Author profile picture not found",
        status: 404,
      };
    }

    return {
      success: true,
      profilePicUrl: urlFor(authorDetails.profilePic.asset)
        .width(100)
        .height(100)
        .quality(90)
        .format("webp")
        .url(),
      error: null,
      status: 200,
    };
  } catch (error) {
    console.error("Error retrieving author profile picture:", error);

    return {
      success: false,
      profilePicUrl: null,
      error: "An unexpected error occurred",
      status: 500,
    };
  }
}
