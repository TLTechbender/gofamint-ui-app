import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { DefaultSession } from "next-auth";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "./lib/prisma/prisma";
import authConfig from "@/auth.config";

// Your helper functions stay the same
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
    console.error("Failed to fetch user by email:", error);
    throw new Error("User lookup failed");
  }
}

export async function getUserByPhoneNumber(
  phoneNumber: string
): Promise<DatabaseUser | null> {
  return await prisma.user.findUnique({
    where: {
      phoneNumber: phoneNumber,
    },
  });
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
    console.error("Failed to fetch user by username:", error);
    throw new Error("User lookup failed");
  }
}

function generateRandomString(length: number = 4): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join("");
}

function generateUniqueUsernameOptions(
  email: string,
  count: number = 5
): string[] {
  const baseUsername = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .substring(0, 12);

  const options: string[] = [];

  for (let i = 0; i < count; i++) {
    let username: string;

    switch (i) {
      case 0:
        username = `${baseUsername}_${generateRandomString(4)}`;
        break;
      case 1:
        username = `${baseUsername}_${generateRandomString(6)}`;
        break;
      case 2:
        const timeComponent = Date.now().toString().slice(-4);
        username = `${baseUsername}_${timeComponent}${generateRandomString(2)}`;
        break;
      case 3:
        username = `${baseUsername}_${generateRandomString(8)}`;
        break;
      default:
        const microTime = (Date.now() * 1000 + Math.floor(Math.random() * 1000))
          .toString()
          .slice(-6);
        username = `${baseUsername}_${microTime}`;
        break;
    }

    options.push(username);
  }

  return options;
}

async function findAvailableUsername(email: string): Promise<string> {
  const usernameOptions = generateUniqueUsernameOptions(email, 5);

  try {
    const availabilityChecks = usernameOptions.map(async (username) => ({
      username,
      isAvailable: !(await getUserByUsername(username)),
    }));

    const results = await Promise.all(availabilityChecks);
    const available = results.find((result) => result.isAvailable);

    if (available) {
      return available.username;
    }

    const baseUsername = email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 10);
    const timestamp = Date.now().toString();
    const randomSuffix = generateRandomString(4);
    return `${baseUsername}_${timestamp.slice(-8)}_${randomSuffix}`;
  } catch (error) {
    console.error("Error checking username availability:", error);
    const baseUsername = email.split("@")[0].toLowerCase();
    const randomSuffix = generateRandomString(4);
    return `${baseUsername}_${randomSuffix}`;
  }
}

function parseGoogleUserName(fullName: string | null | undefined): {
  firstName: string;
  lastName: string;
} {
  if (!fullName) {
    return { firstName: "", lastName: "" };
  }

  const nameParts = fullName.trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return { firstName, lastName };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 5 * 24 * 60 * 60, // 5 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification initially
      if (account?.provider === "google") {
        try {
          const existingUser = await getUserByEmail(user.email!);

          if (existingUser) {
            // Block unverified users
            if (!existingUser.isVerified) return false;

            // Block Google login if user has password (credentials user)
            if (existingUser.password) return false;

            return true;
          }

          // Create new Google user
          const userName = await findAvailableUsername(user.email!);
          const { firstName, lastName } = parseGoogleUserName(user.name);

          await prisma.user.create({
            data: {
              email: user.email!,
              userName,
              firstName,
              lastName,
              password: null,
              phoneNumber: null,
              bio: null,
              isVerified: true,
              isAuthor: false,
            },
          });

          return true;
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }

      // For credentials login - additional verification logic can go here
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // Handle session updates
      if (trigger === "update" && session?.user) {
        Object.assign(token, {
          name: session.user.name,
          userName: session.user.userName,
          firstName: session.user.firstName,
          lastName: session.user.lastName,
          phoneNumber: session.user.phoneNumber,
          isAuthor: session.user.isAuthor,
          isVerified: session.user.isVerified,
        });
        return token;
      }

      // Handle initial sign-in
      if (user?.id) {
        Object.assign(token, {
          id: user.id,
          userName: user.userName || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phoneNumber: user.phoneNumber || "",
          bio: user.bio || "",
          isAuthor: user.isAuthor || false,
          isVerified: user.isVerified || false,
        });
        return token;
      }

      // Fetch user data if missing (shouldn't happen often)
      if (token.id && !token.userName) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
          });

          if (dbUser) {
            Object.assign(token, {
              name: `${dbUser.firstName} ${dbUser.lastName}`.trim(),
              userName: dbUser.userName,
              firstName: dbUser.firstName,
              lastName: dbUser.lastName,
              phoneNumber: dbUser.phoneNumber || "",
              bio: dbUser.bio || "",
              isAuthor: dbUser.isAuthor,
              isVerified: dbUser.isVerified,
            });
          }
        } catch (error) {
          console.error("Error fetching user data for JWT:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        const userSession = session.user as any;
        Object.assign(userSession, {
          id: token.id,
          userName: token.userName || "",
          firstName: token.firstName || "",
          lastName: token.lastName || "",
          phoneNumber: token.phoneNumber || "",
          bio: token.bio || "",
          isAuthor: token.isAuthor || false,
          isVerified: token.isVerified || false,
          name: `${token.firstName || ""} ${token.lastName || ""}`.trim(),
        });
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  // Spread the authConfig to inherit providers
  ...authConfig,
});

// Override the credentials authorize function with your logic
authConfig.providers?.forEach((provider) => {
  if (provider.id === "credentials") {
    (provider as any).authorize = async (credentials: any) => {
      try {
        if (!credentials?.emailOrUsername || !credentials?.password) {
          return null;
        }

        const emailOrUsername = String(credentials.emailOrUsername);
        const password = String(credentials.password);

        const user =
          (await getUserByEmail(emailOrUsername)) ||
          (await getUserByUsername(emailOrUsername));

        if (!user || !user.isVerified || !user.password) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return null;
        }

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
        console.error("Authentication error:", error);
        return null;
      }
    };
  }
});

// Type declarations
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userName: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      bio: string;
      isAuthor: boolean;
      isVerified: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    userName?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    bio?: string;
    isAuthor?: boolean;
    isVerified: boolean;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    bio?: string;
    isAuthor?: boolean;
    isVerified: boolean;
  }
}

export { getUserByEmail, getUserByUsername };
