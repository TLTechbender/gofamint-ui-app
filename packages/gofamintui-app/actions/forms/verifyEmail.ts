"use server";

import { prisma } from "@/lib/prisma/prisma";
import verifyToken from "@/lib/tokenHandler/verifyToken";

export type VerifyEmailActionState = {
  success: boolean;
  status: number;
  message: string;
};

export default async function verifyEmail(
  prevState: VerifyEmailActionState,
  formData: FormData
): Promise<VerifyEmailActionState> {
  try {
    const token = formData.get("token")!.toString();
    const id = formData.get("id")?.toString();

    if (!token || !token.trim()) {
      return {
        success: false,
        status: 400,
        message: "Verification token is required.",
      };
    }

    if (!id) {
      return {
        success: false,
        status: 400,
        message: "User ID is required.",
      };
    }

    // ✅ Verify token
    const verifyTokenResult = verifyToken(id, "verify-email", token);
    if (!verifyTokenResult) {
      return {
        success: false,
        status: 401, // changed 720 → 401 Unauthorized
        message: "Token is invalid or expired.",
      };
    }

    // ✅ Check user
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return {
        success: false,
        status: 404,
        message: "User not found.",
      };
    }

    // ✅ Update user
    await prisma.user.update({
      where: { id },
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
