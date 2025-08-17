"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { forgotPasswordAction } from "@/actions/forgot-password";
import {
  forgotPasswordSchema,
  ForgotPasswordSchema,
} from "@/schemas/forgotPasswordSchema";

export default function ForgotPassword() {
  const [errors, setErrors] = useState<Partial<ForgotPasswordSchema>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setErrors({});
    setIsLoading(true);

    const data = {
      email: formData.get("email") as string,
    };

    // Client-side validation
    const result = forgotPasswordSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: Partial<ForgotPasswordSchema> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof ForgotPasswordSchema] =
            error.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      await forgotPasswordAction(formData);
    } catch (error) {
      console.error("Password reset error:", error);
      setIsLoading(false);
    }
  };

  return (
    <form
      action={handleSubmit}
      className="bg-[#1345621A] px-[16px] py-[24px] sm:px-[24px] sm:py-[32px] lg:px-[25px] lg:py-[25px] rounded-[20px] w-full max-w-sm sm:max-w-md lg:max-w-2xl z-10"
    >
      <div className="flex flex-col gap-5 justify-center items-center py-24">
        <h2 className="text-2xl font-bold text-black">Reset Password</h2>
        <p className="text-sm text-[#A5A8B5] mt-1">
          We'll send you reset instructions. Enter your Conova registered email
          address
        </p>

        <div className="mb-[16px] sm:mb-[12px] w-full">
          <label className="block text-sm text-black">
            Work Email Address <span className="text-[#EF4444]">*</span>
          </label>
          <input
            type="email"
            name="email"
            className={`mt-1 w-full px-3 py-2.5 sm:py-2 border rounded-md bg-transparent outline-none focus:ring-1 ${
              errors.email
                ? "border-[#EF4444] focus:ring-[#EF4444]"
                : "border-[#D7D3D0] text-[#292524] focus:ring-[#292524]"
            }`}
            placeholder="e.g., tofunmi.ishola@company.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-xs text-[#EF4444] mt-1">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full mb-[20px] py-2 rounded-md transition text-white ${
            isLoading
              ? "bg-[#0f3a52] cursor-not-allowed animate-pulse"
              : "bg-[#134562] hover:bg-[#083144] cursor-pointer"
          }`}
        >
          {isLoading ? "Sending Instructions..." : "Send Instructions"}
        </button>

        <Link
          href={`/auth/signin`}
          className="text-[#134562] font-medium text-base md:text-lg text-center flex flex-wrap gap-2"
        >
          <ArrowLeft size={24} className="mr-2" />
          <p>Back to Sign In</p>
        </Link>
      </div>
    </form>
  );
}
