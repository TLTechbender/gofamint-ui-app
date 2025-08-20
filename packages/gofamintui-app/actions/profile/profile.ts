"use server";

import { auth } from "@/auth";
import { UpdateProfileActionState } from "@/lib/formActionStates/updateProfileActionState";
import { editProfileSchema } from "@/lib/formSchemas/editProfileSchema";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

//Again updating all the stuff at once is kinda expensive but it's a price I am willing to pay

//Update: even without checking each, the logic is stil getting kinda long
export async function updateProfile(
  formData: FormData
): Promise<UpdateProfileActionState> {
  // Get the current session
  const session = await auth();

  console.log(session);

  if (!session || !session.user) {
    return {
      status: 401,
      success: false,
      message: "Unauthorized",
      errors: null,
    };
  }

  const data = {
    bio: formData.get("bio"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phoneNumber: formData.get("phoneNumber"),
  };

  const result = editProfileSchema.safeParse(data);
  if (!result.success) {
    type RegisterErrors = NonNullable<UpdateProfileActionState["errors"]>;
    const fieldErrors: Partial<RegisterErrors> = {};
    result.error.issues.forEach((issue) => {
      const key = issue.path[0] as keyof RegisterErrors;
      (fieldErrors[key] ??= []).push(issue.message);
    });
    return {
      status: 400,
      success: false,
      message: "Please correct the errors below",
      errors: fieldErrors,
    };
  }

  const { firstName, lastName, bio, phoneNumber } = result.data;

  const shouldUpdateBio = bio !== undefined;
  const shouldUpdatePhoneNumber = phoneNumber !== undefined;

  const normalizedPhoneNumber = shouldUpdatePhoneNumber
    ? phoneNumber !== ""
      ? phoneNumber
      : null
    : undefined;
  const normalizedBio = shouldUpdateBio ? (bio !== "" ? bio : null) : undefined;
  if (normalizedPhoneNumber) {
    const existingUserPhoneNumber = await prisma.user.findFirst({
      where: {
        phoneNumber,
        NOT: {
          id: session.user.id,
        },
      },
    });

    if (existingUserPhoneNumber) {
      return {
        status: 409,
        success: false,
        message: "Phone number has already been taken",
        errors: {
          phoneNumber: ["Phone number has already been taken"],
        },
      };
    }
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        firstName,
        lastName,
        ...(normalizedBio && { bio: normalizedBio }),
        ...(normalizedPhoneNumber && { phoneNumber: normalizedPhoneNumber }),
      },
    });

    revalidatePath("/profile");
    return {
      status: 200,
      success: true,
      message: "Profile updated successfully!",
      errors: null,
      data: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        bio: updatedUser.lastName,
        ...(updatedUser.phoneNumber && {
          phoneNumber: updatedUser.phoneNumber,
        }),
      },
    };
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      status: 500,
      success: false,
      message: "An unexpected error occurred. Please try again.",
      errors: null,
    };
  }
}

export async function fetchProfile() {
  const session = await auth();

  console.log(session);

  if (!session || !session.user) {
    return {
      status: 401,
      success: false,
      message: "Unauthorized",
      errors: null,
    };
  }

  const userId = session.user.id;

  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      _count: {
        select: {
          comments: true,
          commentLikes: true,
          blogLikes: true,
          blogReads: true,
        },
      },
    },
  });

  const transformedData = {
    id: userData!.id,
    firstName: userData!.firstName,
    lastName: userData!.lastName,
    userName: userData!.userName,
    email: userData!.email,
    phoneNumber: userData!.phoneNumber || "",
    bio: userData!.bio || "",

    joinedDate: userData!.createdAt.toISOString(),

    commentsCount: userData!._count.comments,
    likesCount: userData!._count.blogLikes,
    viewsCount: userData!._count.blogReads,
  };

  return {
    status: 200,
    success: true,
    message: "user data retrieved successfully",
    data: transformedData,
  };
}
