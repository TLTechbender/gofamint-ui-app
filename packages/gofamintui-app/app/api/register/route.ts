import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { existingUserQuery } from "@/sanity/queries/user/user";
import {
  sanityCreateWrapper,
  sanityFetchWrapper,
} from "@/sanity/sanityCRUDHandlers";
import { sendVerificationEmail } from "@/lib/email/emailHandler";

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phoneNumber, department } =
      await request.json();

    // Validation
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !department
    ) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Check if user already exists

    const existingUser = await sanityFetchWrapper(existingUserQuery, { email });

    console.log(existingUser);

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user in Sanity
    const newUser = {
      _type: "user",
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      department,
      isActive: false, // User needs to verify email first
      emailVerificationToken: verificationToken,
      emailVerificationExpiry: verificationExpiry.toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notificationPreferences: {
        eventReminders: true,
        blogUpdates: true,
        generalAnnouncements: true,
      },
    };

    const result = await sanityCreateWrapper(newUser);

    console.log(result);

    // Send verification email
    await sendVerificationEmail(email, verificationToken, firstName);

    return NextResponse.json(
      {
        message:
          "Registration successful. Please check your email to verify your account.",
        userId: result._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
