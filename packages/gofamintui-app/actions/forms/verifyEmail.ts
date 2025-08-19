"use server";

import { getUserByEmail } from "@/auth";
import { VerifyEmailActionState } from "@/lib/formActionStates/verifyEmailActionState";
import { prisma } from "@/lib/prisma/prisma";
import verifyToken from "@/lib/tokenHandler/verifyToken";

export default async function verifyEmail(
  formData: FormData
): Promise<VerifyEmailActionState> {
  try {
    const token = formData.get("token")!.toString();
    const email = formData.get("email")?.toString();

    if (!token || !token.trim()) {
      return {
        success: false,
        status: 400,
        message: "Verification token is required.",
      };
    }

    if (!email) {
      return {
        success: false,
        status: 400,
        message: "Email is required.",
      };
    }

    const isValidUser = await getUserByEmail(email);
    if (!isValidUser) {
      return {
        success: false,
        status: 400,
        message: "User not found ",
      };
    }
    const verifyTokenResult = verifyToken(
      isValidUser.id,
      "verify-email",
      token
    );
    if (!verifyTokenResult) {
      return {
        success: false,
        status: 401, // changed 720 → 401 Unauthorized
        message: "Token is invalid or expired.",
      };
    }

    // ✅ Update user
    await prisma.user.update({
      where: { id: isValidUser.id },
      data: { isVerified: true },
    });

    return {
      success: true,
      status: 200,
      message: "Email verified successfully!",
    };
  } catch (error) {
    console.error("Email verification error:", error);
    return {
      success: false,
      status: 500,
      message: "Email verification failed. Please try again.",
    };
  }
}
