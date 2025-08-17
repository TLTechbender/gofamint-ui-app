"use server";

import crypto from "crypto";
import { redirect } from "next/navigation";
import {
  sanityFetchWrapper,
  sanityPatchWrapper,
} from "@/sanity/sanityCRUDHandlers";
import { sendPasswordResetEmail } from "@/lib/email/emailHandler";
import { forgotPasswordSchema } from "@/schemas/forgotPasswordSchema";

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;

  const result = forgotPasswordSchema.safeParse({ email });

  if (!result.success) {
    throw new Error("Invalid email format");
  }

  try {
    // Find user by email
    const userQuery = `*[_type == "user" && email == $email][0]`;
    const user = await sanityFetchWrapper(userQuery, { email });

    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Update user with reset token
      await sanityPatchWrapper(user._id, {
        set: {
          resetToken,
          resetTokenExpiry: resetTokenExpiry.toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });

      // Send password reset email
      await sendPasswordResetEmail(email, resetToken, user.firstName);
    }
  } catch (error) {
    // Check if it's a redirect error (which is expected behavior)
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error; // Re-throw redirect errors
    }

    console.error("Password reset error:", error);
    throw new Error("Password reset failed. Please try again.");
  }

  // Always redirect for security (moved outside try-catch)
  redirect(`/auth/forgot-password/reset?email=${encodeURIComponent(email)}`);
}
