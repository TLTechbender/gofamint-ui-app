import { Response } from "express";
import { prisma } from "../../database/prisma";
import { AppError } from "../../utils/appError";
import { AppResponse } from "../../utils/appResponse";
import { catchAsync } from "../../utils/catchAsync";
import { formatZodErrors } from "../../utils/formatZodErrors";
import { logger } from "../../utils/logger";
import { editProfileSchema } from "../../schemas/user/editProfileSchema";
import { AuthRequest } from "../../common/constants";

interface UpdatedProfile {
  id: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  phoneNumber: string | null;
  updatedAt: Date;
}

export const editUserProfile = catchAsync(
  async (req: AuthRequest, res: Response) => {
   
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

   
    const validationResult = editProfileSchema.safeParse(req.body);
    if (!validationResult.success) {
      const formattedErrors = formatZodErrors(validationResult.error);
      throw new AppError("Validation failed", 400, formattedErrors);
    }

    const { firstName, lastName, bio, phoneNumber } = validationResult.data;

    // Check if user exists and is not deleted
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        isDeleted: true,
        phoneNumber: true,
      },
    });

    if (!existingUser || existingUser.isDeleted) {
      logger.warn("Profile update attempted for non-existent/deleted user", {
        userId,
      });
      throw new AppError("User account not found", 404);
    }

  
    // Only check if phoneNumber is provided and different from current
    if (phoneNumber !== undefined && phoneNumber !== null) {
      // Only check uniqueness if it's different from user's current phone
      if (phoneNumber !== existingUser.phoneNumber) {
        const phoneExists = await prisma.user.findFirst({
          where: {
            phoneNumber,
            NOT: {
              id: userId,
            },
            isDeleted: false, 
          },
        });

        if (phoneExists) {
          logger.warn("Profile update failed - phone number taken", {
            userId,
            phoneNumber: phoneNumber.substring(0, 3) + "***", 
          });
          throw new AppError(
            "Phone number is already in use",
            409,
            [{ phoneNumber: "Phone number has already been taken" }]
          );
        }
      }
    }

   
    const normalizedBio = bio !== undefined ? (bio === "" ? null : bio) : undefined;
    const normalizedPhoneNumber =
      phoneNumber !== undefined
        ? phoneNumber === ""
          ? null
          : phoneNumber
        : undefined;

    // Build update data object dynamically
    // Only include fields that were actually provided
    const updateData: {
      firstName: string;
      lastName: string;
      bio?: string | null;
      phoneNumber?: string | null;
      updatedAt: Date;
    } = {
      firstName,
      lastName,
      updatedAt: new Date(),
    };

    // Only add bio if it was provided in request
    if (normalizedBio !== undefined) {
      updateData.bio = normalizedBio;
    }

    // Only add phoneNumber if it was provided in request
    if (normalizedPhoneNumber !== undefined) {
      updateData.phoneNumber = normalizedPhoneNumber;
    }

   
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        bio: true,
        phoneNumber: true,
        updatedAt: true,
      },
    });

    const profile: UpdatedProfile = {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      bio: updatedUser.bio,
      phoneNumber: updatedUser.phoneNumber,
      updatedAt: updatedUser.updatedAt,
    };

    logger.info("User profile updated successfully", {
      userId,
      fieldsUpdated: Object.keys(updateData).filter((k) => k !== "updatedAt"),
    });

    return AppResponse(
      res,
      200,
      profile,
      "Profile updated successfully"
    );
  }
);