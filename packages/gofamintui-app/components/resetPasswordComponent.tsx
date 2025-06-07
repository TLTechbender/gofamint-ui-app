"use client";

import { useState, useTransition } from "react";

import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { resetPasswordAction } from "@/actions/reset-password";
import Link from "next/link";
import { toast } from "react-toastify";

import {
  resetPasswordSchema,
  ResetPasswordSchema,
} from "@/schemas/resetPasswordSchema";

function PasswordRules({ password }: { password: string }) {
  const rules = [
    { text: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { text: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { text: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { text: "One number", test: (p: string) => /[0-9]/.test(p) },
    {
      text: "One special character",
      test: (p: string) => /[^A-Za-z0-9]/.test(p),
    },
  ];

  return (
    <div className="mt-2 space-y-1">
      {rules.map((rule, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              rule.test(password) ? "bg-green-500" : "bg-gray-300"
            }`}
          />
          <span
            className={`text-xs ${
              rule.test(password) ? "text-green-600" : "text-gray-500"
            }`}
          >
            {rule.text}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ResetPasswordCompoent({ token }: { token: string }) {
  const [errors, setErrors] = useState<Partial<ResetPasswordSchema>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      token: token,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    // Clear previous errors
    setErrors({});

    // Validate with Zod schema
    const validation = resetPasswordSchema.safeParse(data);

    if (!validation.success) {
      // Set validation errors
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      try {
        const result = await resetPasswordAction(validation.data);
        console.log(result);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          // Reset form on success

          (e.target as HTMLFormElement).reset();
          setPassword("");
          setErrors({});
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
        console.error("Form submission error:", error);
      }
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1345621A] px-[16px] py-[24px] sm:px-[24px] sm:py-[32px] lg:px-[25px] lg:py-[25px] rounded-[20px] w-full max-w-sm sm:max-w-md lg:max-w-2xl z-10"
    >
      <div className="flex flex-col gap-4 justify-center items-center py-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold lg:mt-[50px] text-black mb-[12px]">
            Create New Password
          </h2>
          <p className="text-sm text-[#A5A8B5] mt-1">
            Your password must be different from the previously used password
          </p>
        </div>

        <div className="w-full">
          <label className="block text-sm text-black">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handlePasswordChange}
              disabled={isPending}
              className={`mt-1 w-full px-4 py-2 border rounded-md bg-transparent outline-none focus:ring-1 ${
                errors.password
                  ? "border-[#EF4444] focus:ring-[#EF4444]"
                  : "border-[#D7D3D0] text-[#292524] focus:ring-[#292524]"
              } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isPending}
              className={`absolute right-3 top-4 text-[#134562] ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[#EF4444] text-xs mt-1">{errors.password}</p>
          )}
          <PasswordRules password={password} />
        </div>

        <div className="w-full">
          <label className="block text-sm text-black ">Confirm Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              disabled={isPending}
              className={`mt-1 w-full px-4 py-2 border rounded-md bg-transparent outline-none focus:ring-1 ${
                errors.confirmPassword
                  ? "border-[#EF4444] focus:ring-[#EF4444]"
                  : "border-[#D7D3D0] text-[#292524] focus:ring-[#292524]"
              } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isPending}
              className={`absolute right-3 top-4 text-[#134562] ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[#EF4444] text-xs mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={`w-full mb-[20px] py-2 rounded-md transition text-white ${
            isPending
              ? "bg-[#0f3a52] cursor-not-allowed animate-pulse"
              : "bg-[#134562] hover:bg-[#083144] cursor-pointer"
          }`}
        >
          {isPending ? "Confirming..." : "Confirm"}
        </button>

        <Link
          href={`/auth/signin`}
          className="text-[#134562] font-medium text-base md:text-lg  text-center  flex flex-wrap gap-2"
        >
          <ArrowLeft size={24} className=" mr-2" />
          <p>Back to Sign In</p>
        </Link>
      </div>
    </form>
  );
}
