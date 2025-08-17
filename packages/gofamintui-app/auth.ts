import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";

import {
  sanityFetchWrapper,
  sanityCreateWrapper,
  sanityPatchWrapper,
} from "./sanity/sanityCRUDHandlers";

import type { DefaultSession } from "next-auth";

interface SanityUser {
  _id: string;
  _type: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  password?: string;
  profileImage?: any;
  department?: string;
  isActive?: boolean;
  emailVerified?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Helper function to create user in Sanity
async function createSanityUser(userData: {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  emailVerified?: boolean;
  phoneNumber?: string;
  department?: string;
}) {
  const newUser = {
    _type: "user",
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    password: userData.password,
    phoneNumber: userData.phoneNumber || "",
    department: userData.department || "",
    isActive: true,
    emailVerified: userData.emailVerified ? new Date().toISOString() : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notificationPreferences: {
      eventReminders: true,
      blogUpdates: true,
      generalAnnouncements: true,
    },
  };

  try {
    const result = await sanityCreateWrapper<SanityUser>(newUser);
    return result;
  } catch (error) {
    console.error("Failed to create user in Sanity:", error);
    throw new Error("User creation failed");
  }
}

// Helper function to update user in Sanity
async function updateSanityUser(userId: string, updateData: any) {
  try {
    const result = await sanityPatchWrapper(userId, {
      set: { ...updateData, updatedAt: new Date().toISOString() },
    });
    return result;
  } catch (error) {
    console.error("Failed to update user in Sanity:", error);
    throw new Error("User update failed");
  }
}

// Helper function to fetch user by email regardless of active or not
async function getUserByEmail(email: string): Promise<SanityUser | null> {
  try {
    const query = `*[_type == "user" && email == $email ] | order(_createdAt desc)[0]`;
    const user = await sanityFetchWrapper<SanityUser>(query, { email });
    return user || null;
  } catch (error) {
    console.error("Failed to fetch user by email:", error);
    throw new Error("User lookup failed");
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        const email = String(credentials.email);
        const password = String(credentials.password);

        try {
          console.log("Authenticating user:", email);

          // Fetch user using wrapper function
          const user = await getUserByEmail(email);

          if (!user || !user.email) {
            throw new Error("Invalid credentials.");
          }

          // Check if user has a password (for Google OAuth users)
          if (!user.password) {
            throw new Error(
              "Please sign in with Google or reset your password."
            );
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
            throw new Error("Invalid credentials.");
          }

          return {
            id: user._id,
            email: user.email,
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            phoneNumber: user.phoneNumber ?? "",
            image: user.profileImage?.asset?.url ?? null,
            department: user.department ?? "",
            isActive: user.isActive ?? true,
            emailVerified: user.emailVerified,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error("Invalid credentials.");
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user already exists using wrapper
          const existingUser = await getUserByEmail(user.email!);

          if (existingUser) {
            // Update existing user with Google info if needed
            if (!existingUser.emailVerified) {
              await updateSanityUser(existingUser._id, {
                emailVerified: new Date().toISOString(),
              });
            }
            return true;
          } else {
            // Create new user from Google OAuth
            const nameParts = user.name?.split(" ") ?? ["", ""];
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            await createSanityUser({
              email: user.email!,
              firstName,
              lastName,
              emailVerified: true,
            });
            return true;
          }
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, trigger, session, user }) {
      if (trigger === "update" && session?.user) {
        token.firstName = session.user.firstName;
        token.lastName = session.user.lastName;
        token.phoneNumber = session.user.phoneNumber;
        token.department = session.user.department;
      }

      if (user) {
        token.id = user.id!;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.phoneNumber = user.phoneNumber;
        token.department = user.department;
        token.isActive = user.isActive;
        // Handle emailVerified conversion properly
        token.emailVerified = user.emailVerified
          ? typeof user.emailVerified === "string"
            ? user.emailVerified
            : user.emailVerified.toISOString()
          : null;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.phoneNumber = token.phoneNumber as string;
        session.user.department = token.department as string;
        session.user.isActive = token.isActive as boolean;
        // Convert emailVerified to string for session
        (session.user as any).emailVerified = token.emailVerified
          ? typeof token.emailVerified === "string"
            ? token.emailVerified
            : token.emailVerified.toISOString()
          : undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
    newUser: "/register",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

// TypeScript type extensions
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      department?: string;
      isActive?: boolean;
      emailVerified?: string;
    } & DefaultSession["user"];
  }

  interface User {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    department?: string;
    isActive?: boolean;
    emailVerified?: string | Date | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    department?: string;
    isActive?: boolean;
    emailVerified?: string | Date | null;
  }
}

// Export helper functions for use in API routes
export { createSanityUser, updateSanityUser, getUserByEmail };
