import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";

import type { DefaultSession } from "next-auth";
import { prisma } from "./lib/prisma/prisma";

interface DatabaseUser {
  id: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  isVerified: boolean; // always boolean now
  phoneNumber?: string | null;
  bio?: string | null;
  password?: string | null;
  isAuthor: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to create a new user
async function createNewUser(userData: {
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
}) {
  try {
    const [existingUserByEmail, existingUserByUsername] = await Promise.all([
      getUserByEmail(userData.email),
      getUserByUsername(userData.userName),
    ]);

    // If email exists
    if (existingUserByEmail) {
      if (!existingUserByEmail.isVerified) {
        return {
          success: false,
          user: existingUserByEmail,
          message: "Email already exists but requires verification",
          field: "emailVerification",
        };
      }
      return {
        success: false,
        user: null,
        message: "User with this email already exists",
        field: "email",
      };
    }

    // If username exists
    if (existingUserByUsername) {
      if (!existingUserByUsername.isVerified) {
        return {
          success: false,
          user: existingUserByUsername,
          message: "Username already exists but requires verification",
          field: "userNameVerification",
        };
      }
      return {
        success: false,
        user: null,
        message: "Username is already taken",
        field: "userName",
      };
    }

    // ✅ Create brand new user
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const newUser = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        bio: null,
        isAuthor: false,
      },
    });

    return {
      success: true,
      user: newUser,
      message: "User created successfully",
      field: null,
    };
  } catch (error) {
    console.error("Failed to create new user:", error);
    return {
      success: false,
      user: null,
      message: "User creation failed due to server error",
      field: null,
    };
  }
}

async function updateUserDetails(userId: string, updateData: any) {
  try {
    if (updateData.password) {
      const saltRounds = 12;
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    const result = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });
    return result;
  } catch (error) {
    console.error("Failed to update user details:", error);
    throw new Error("User update failed");
  }
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

function generateUsernameFromEmail(email: string): string {
  const baseUsername = email.split("@")[0].toLowerCase();
  const randomSuffix = generateRandomString(4);
  return `${baseUsername}_${randomSuffix}`;
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
    return generateUsernameFromEmail(email);
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
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        emailOrUsername: {
          label: "Email or Username",
          type: "text",
          placeholder: "Enter email or username",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.emailOrUsername || !credentials?.password) {
          throw new Error("Email/username and password are required.");
        }

        const emailOrUsername = String(credentials.emailOrUsername);
        const password = String(credentials.password);

        try {
          const user =
            (await getUserByEmail(emailOrUsername)) ||
            (await getUserByUsername(emailOrUsername));

          if (!user) {
            throw new Error("Invalid credentials.");
          }

          if (!user.isVerified) {
            throw new Error("Account not verified.");
          }

          if (!user.password) throw new Error("No password from DB ");
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
            throw new Error("Invalid credentials.");
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
          throw new Error("Invalid credentials.");
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await getUserByEmail(user.email!);

          if (existingUser) {
            if (!existingUser.isVerified) return false;
            return true;
          } else {
            const userName = await findAvailableUsername(user.email!);
            const { firstName, lastName } = parseGoogleUserName(user.name);

            await prisma.user.create({
              data: {
                email: user.email!,
                userName,
                firstName,
                lastName,
                password: "",
                phoneNumber: "",
                isVerified: true, // verified immediately
                isAuthor: false,
              },
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
        token.name = session.user.name;
        token.userName = session.user.userName;
        token.firstName = session.user.firstName;
        token.lastName = session.user.lastName;
        token.phoneNumber = session.user.phoneNumber;
        token.isAuthor = session.user.isAuthor;
        token.isVerified = session.user.isVerified;
      }

      if (user && user.id) {
        token.id = user.id;
        token.userName = user.userName || "";
        token.firstName = user.firstName || "";
        token.lastName = user.lastName || "";
        token.phoneNumber = user.phoneNumber || "";
        token.bio = user.bio || "";
        token.isAuthor = user.isAuthor || false;
        token.isVerified = user.isVerified || false;
      }

      if (token.id && !token.userName) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id:token.id },
          });

          if (dbUser) {
            token.name = `${dbUser.firstName} ${dbUser.lastName}`.trim();
            token.userName = dbUser.userName;
            token.firstName = dbUser.firstName;
            token.lastName = dbUser.lastName;
            token.phoneNumber = dbUser.phoneNumber || "";
            token.bio = dbUser.bio || "";
            token.isAuthor = dbUser.isAuthor;
            token.isVerified = dbUser.isVerified;
          }
        } catch (error) {
          console.error("Error fetching user data for JWT:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.userName = token.userName || "";
        session.user.firstName = token.firstName || "";
        session.user.lastName = token.lastName || "";
        session.user.phoneNumber = token.phoneNumber || "";
        session.user.bio = token.bio || "";
        session.user.isAuthor = token.isAuthor || false;
        session.user.isVerified = token.isVerified || false;

        session.user.name =
          `${session.user.firstName} ${session.user.lastName}`.trim();
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

export { createNewUser, updateUserDetails, getUserByEmail, getUserByUsername };
