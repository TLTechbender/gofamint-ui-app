import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  sanityFetchWrapper,
  sanityPatchWrapper,
} from "@/sanity/sanityCRUDHandlers";
import { sendPasswordResetEmail } from "@/lib/email/emailHandler";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user by email
    const userQuery = `*[_type == "user" && email == $email][0]`;
    const user = await sanityFetchWrapper(userQuery, { email });

    console.log(user);

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        {
          message:
            "If an account with that email exists, a password reset link has been sent.",
        },
        { status: 200 }
      );
    }

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

    return NextResponse.json(
      {
        message:
          "If an account with that email exists, a password reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Password reset failed. Please try again." },
      { status: 500 }
    );
  }
}
