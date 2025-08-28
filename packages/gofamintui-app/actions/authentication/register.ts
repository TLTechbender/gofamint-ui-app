"use server";

import { getUserByEmail, getUserByPhoneNumber, getUserByUsername } from "@/auth";
import { sendVerifiyUserEmail } from "@/lib/email/emailHandler";
import { RegisterActionState } from "@/lib/formActionStates/registerActionState";
import { registerSchemaServer } from "@/lib/formSchemas/registerSchemaServer";
import generateToken from "@/lib/tokenHandler/generateToken";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma/prisma";

export default async function registerNewUser(
  formData: FormData
): Promise<RegisterActionState> {
  try {
    const rawFormData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      password: formData.get("password") as string,
      userName: formData.get("userName") as string,
    };

    //logging cos i dont know what to do with it and I just be learning how to use the hook this be coming from

    const result = registerSchemaServer.safeParse(rawFormData);
    if (!result.success) {
      type RegisterErrors = NonNullable<RegisterActionState["errors"]>;
      const fieldErrors: Partial<RegisterErrors> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof RegisterErrors;
        (fieldErrors[key] ??= []).push(issue.message);
      });
      return {
        success: false,
        message: "Please correct the errors below",
        errors: fieldErrors,
      };
    }

    const { firstName, lastName, email, phoneNumber, password, userName } =
      result.data;

    const userData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      userName,
    };

    async function createNewUser(userData: {
      email: string;
      userName: string;
      firstName: string;
      lastName: string;
      password: string;
      phoneNumber: string;
    }) {
      try {
        const [
          existingUserByEmail,
          existingUserByUsername,
          existingUserByPhone,
        ] = await Promise.all([
          getUserByEmail(userData.email),
          getUserByUsername(userData.userName),
          getUserByPhoneNumber(userData.phoneNumber),
        ]);

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

        if (existingUserByPhone) {
          return {
            success: false,
            user: null,
            message: "Phone number is already registered",
            field: "phoneNumber",
          };
        }

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

    const createNewUserResponse = await createNewUser({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      password: userData.password,
      userName: userData.userName,
    });

  
    if (createNewUserResponse.success) {
      //Patterns here is key dawg
      const verificationToken = generateToken(
        createNewUserResponse.user!.id,
        "verify-email"
      );
      await sendVerifiyUserEmail(
        createNewUserResponse.user!.email,
        verificationToken,
        createNewUserResponse.user!.firstName
      );
      return {
        success: true,
        message: "User created successfully! Verify email and sign in.",
        errors: null,
        isUserVerified: true,
        email: createNewUserResponse.user?.email,
      };
    } else {
      switch (createNewUserResponse.field) {
        case "email":
          return {
            success: false,
            message: createNewUserResponse.message,
            errors: { email: [createNewUserResponse.message] },
          };
        case "userName":
          return {
            success: false,
            message: createNewUserResponse.message,
            errors: { userName: [createNewUserResponse.message] },
          };
        case "emailVerification":
          return {
            success: false,
            message:
              "Your email is registered but not verified. Please verify.",
            errors: null,
            isUserVerified: false,
            email: createNewUserResponse.user?.email,
          };
        case "userNameVerification":
          return {
            success: false,
            message: "Your username is reserved but account not verified.",
            errors: { userName: ["Please complete verification"] },
            isUserVerified: false,
            email: createNewUserResponse.user?.email,
          };
        case "phoneNumber":
          return {
            success: false,
            message: createNewUserResponse.message,
            errors: { phoneNumber: [createNewUserResponse.message] },
          };
        default:
          return {
            success: false,
            message: createNewUserResponse.message,
            errors: null,
          };
      }
    }
  } catch (error) {
   
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      errors: null,
    };
  }
}
