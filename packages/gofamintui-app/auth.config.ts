/**
 * Next auth don't want me importing things betwen the auth.ts and itself that's why I am doing this get user by email things and the
 * other one here again, to implement auth don almost craze me and the docs be super simple
 *
 * Grateful to that one lovely user that left an example for me on github mehn!!
 *
 * Real hero https://github.com/AsharibAli/next-authjs-v5
 * 
 * also I was today years old 28/08/2025 when I learned the diffrernce between bycrypt and bycrypt js see me see wahala, chai!!!!!!
 * always have been just downloading either thing interchangabely
 */
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "./lib/prisma/prisma";

interface DatabaseUser {
  id: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  phoneNumber?: string | null;
  bio?: string | null;
  password?: string | null;
  isAuthor: boolean;
  createdAt: Date;
  updatedAt: Date;
}

async function getUserByEmail(email: string): Promise<DatabaseUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    throw new Error("User lookup failed");
  }
}

async function getUserByUsername(
  userName: string
): Promise<DatabaseUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { userName },
    });
    return user;
  } catch (error) {
    throw new Error("User lookup failed");
  }
}

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        emailOrUsername: {
          label: "Email or Username",
          type: "text",
          placeholder: "Enter email or username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.emailOrUsername || !credentials?.password) {
            return null;
          }

          const emailOrUsername = String(credentials.emailOrUsername);
          const password = String(credentials.password);

          // Try email first, then username
          let user = await getUserByEmail(emailOrUsername);
          if (!user) {
            user = await getUserByUsername(emailOrUsername);
          }

          if (!user) {
            return null;
          }

          // Check if user is verified
          if (!user.isVerified) {
            return null;
          }

          // Check if user has a password (not OAuth user)
          if (!user.password) {
            return null;
          }

          // Validate password
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            return null;
          }

          // Return user object
          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`.trim(),
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            phoneNumber: user.phoneNumber || "",
            bio: user.bio || "",
            isAuthor: user.isAuthor,
            isVerified: user.isVerified,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
