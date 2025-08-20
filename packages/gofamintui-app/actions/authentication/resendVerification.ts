
"use server";

import { getUserByEmail } from "@/auth";
import { sendVerifiyUserEmail } from "@/lib/email/emailHandler";
import { ResendEmailValidationActionState } from "@/lib/formActionStates/resendEmailValidationActionState";
import generateToken from "@/lib/tokenHandler/generateToken";

export async function resendVerificationEmail(
  formData: FormData
): Promise<ResendEmailValidationActionState> {
  try {
    const email = formData.get("email") as string;
    if (!email) {
      return {
        success: false,
        message: "Email is required",
        status: 404,
      };
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return {
        success: false,
        message: "User not found. Please sign in again.",
        status: 404,
      };
    }

    // Send verification email
    const verificationToken = generateToken(user!.id, "verify-email");
    await sendVerifiyUserEmail(user!.email, verificationToken, user!.firstName);

    return {
      success: true,
      message: "Verification email sent! Check your inbox.",
      status: 200,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send email. Please try again.",
      status: 500,
    };
  }
}
