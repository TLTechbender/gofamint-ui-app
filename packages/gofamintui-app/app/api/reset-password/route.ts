import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

import {
  sanityFetchWrapper,
  sanityPatchWrapper,
} from "@/sanity/sanityCRUDHandlers";
import { resetPasswordSchema } from "@/schemas/resetPasswordSchema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

      const { token, password } = validation.data;
      
      console.log(token);

    // Find user with reset token
    const userQuery = `*[_type == "user" && resetToken == $token][0]{
      _id,
      password,
      passwordHistory[],
      resetTokenExpiry
    }`;
    const user = await sanityFetchWrapper(userQuery, { token });

      console.log(user);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Check if token expired
    if (new Date() > new Date(user.resetTokenExpiry)) {
      return NextResponse.json(
        { error: "Reset token has expired" },
        { status: 400 }
      );
    }

    // Check if password was used before (current + last 5)
    const passwordsToCheck = [
      user.password,
      ...(user.passwordHistory || []),
    ].filter(Boolean);

    for (const oldPassword of passwordsToCheck) {
      if (await bcrypt.compare(password, oldPassword)) {
        return NextResponse.json(
          { error: "You cannot reuse a previous password" },
          { status: 400 }
        );
      }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password history (keep last 5)
    const updatedHistory = [user.password, ...(user.passwordHistory || [])]
      .filter(Boolean)
      .slice(0, 5);

    // Update user
    await sanityPatchWrapper(user._id, {
      set: {
        password: hashedPassword,
        passwordHistory: updatedHistory,
        resetToken: null,
        resetTokenExpiry: null,
        updatedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json(
      { message: "Password reset successful!" },
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
