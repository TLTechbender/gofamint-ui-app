"use server";
import { createNewUser } from "@/auth";
import { sendVerifiyUserEmail } from "@/lib/email/emailHandler";
import { RegisterActionState } from "@/lib/formActionStates/registerActionState";
import { registerSchemaServer } from "@/lib/formSchemas/registerSchemaServer";
import generateToken from "@/lib/tokenHandler/generateToken";

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

    const createNewUserResponse = await createNewUser({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      password: userData.password,
      userName: userData.userName,
    });

    console.log("omo, deep in the server action");
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
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      errors: null,
    };
  }
}
