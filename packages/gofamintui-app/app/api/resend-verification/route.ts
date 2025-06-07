import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  sanityFetchWrapper,
  sanityPatchWrapper,
} from "@/sanity/sanityCRUDHandlers";
import { sendVerificationEmail } from "@/lib/email/emailHandler";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user by email
    const userQuery = `*[_type == "user" && email == $email][0]`;
    const user = await sanityFetchWrapper(userQuery, { email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isActive) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    

    await sanityPatchWrapper(user._id, {
      set: {
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationExpiry.toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });



    console.log("kai omo");
      const response = await sendVerificationEmail(email, verificationToken, user.firstName);
      
      console.log(response);
    console.log("resending mail");
    return NextResponse.json(
      { message: "Verification email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification email. Please try again." },
      { status: 500 }
    );
  }
}
