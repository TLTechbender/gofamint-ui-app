"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";

import { login, signInWithGoogle } from "@/actions/login";
import { loginSchema, type LoginSchema } from "@/schemas/loginSchema";

type FormErrors = {
  [K in keyof LoginSchema]?: string;
};

export default function LoginForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<string>("");
  const [generalError, setGeneralError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset states
    setErrors({});
    setSuccess("");
    setGeneralError("");

    // Get form data
    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // Client-side validation
    const result = loginSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof LoginSchema] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      try {
        const response = await login(result.data, callbackUrl);

        if (response?.error) {
          setGeneralError(response.error);
        } else if (response?.success) {
          setSuccess(response.success);
        }
      } catch (error) {
        console.error("Login error:", error);
        setGeneralError("An unexpected error occurred. Please try again.");
      }
    });
  };

  const handleGoogleSignIn = () => {
    setErrors({});
    setSuccess("");
    setGeneralError("");

    startTransition(async () => {
      try {
        const response = await signInWithGoogle(callbackUrl);

        if (response?.error) {
          setGeneralError(response.error);
        }
      } catch (error) {
        console.error("Google sign-in error:", error);
        setGeneralError("An unexpected error occurred with Google sign-in.");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1345621A] px-[16px] py-[24px] sm:px-[24px] sm:py-[32px] lg:px-[25px] lg:py-[25px] rounded-[20px] w-full max-w-sm sm:max-w-md lg:max-w-2xl z-10"
    >
      <div>
        <div className="text-center">
          <h2 className="text-2xl font-bold lg:mt-[50px] text-black mb-[12px]">
            Welcome back to Conova!
          </h2>
          <p className="text-sm text-[#A5A8B5] mt-1 mb-[40px]">
            Book shared workspaces with ease. Collaborate, grow, and innovate.
          </p>
        </div>

        {/* Display URL error (OAuth account linking issues) */}
        {urlError && (
          <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#EF4444] px-3 py-2 rounded-md text-sm mb-4">
            {urlError}
          </div>
        )}

        {/* Display general error */}
        {generalError && (
          <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#EF4444] px-3 py-2 rounded-md text-sm mb-4">
            {generalError}
          </div>
        )}

        {/* Display success message */}
        {success && (
          <div className="bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] px-3 py-2 rounded-md text-sm mb-4">
            {success}
          </div>
        )}

        <div className="sm:flex gap-3 block space-y-3 sm:space-y-0 mb-[20px]">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isPending}
            className="w-full flex items-center text-black justify-center gap-2 border border-[#A5A8B5] px-4 py-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <FcGoogle className="text-xl" />
            Sign in with Google
          </button>
          <button
            type="button"
            disabled={isPending}
            className="w-full flex items-center text-black justify-center gap-2 border border-[#A5A8B5] px-4 py-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <FaApple className="text-xl" />
            Sign in with Apple
          </button>
        </div>

        <div className="text-center text-gray-400 text-sm flex justify-center items-center mb-[20px]">
          <span className="inline-block w-2/3 border-b border-[#DCDFE3]"></span>
          <span className="mx-2">OR</span>
          <span className="inline-block w-2/3 border-b border-[#DCDFE3]"></span>
        </div>

        <div className="">
          <label className="block text-sm text-black">Email Address</label>
          <input
            type="email"
            name="email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            disabled={isPending}
            className={`mt-[8px] w-full px-4 py-2 border rounded-md bg-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed
              ${
                errors.email
                  ? "border-[#EF4444] focus:ring-[#EF4444]"
                  : emailValue
                    ? "border-2 border-[#292524]"
                    : "border-[#D7D3D0] focus:border-[#292524]"
              }`}
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="text-[#EF4444] text-xs mt-[8px]">{errors.email}</p>
          )}
        </div>

        <div className="my-[16px]">
          <label className="block text-sm text-black">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              disabled={isPending}
              className={`mt-[8px] w-full px-4 py-2 border rounded-md bg-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  errors.password
                    ? "border-[#EF4444] focus:ring-[#EF4444]"
                    : passwordValue
                      ? "border-2 border-[#292524]"
                      : "border-[#D7D3D0] focus:border-[#292524]"
                }`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isPending}
              className="absolute right-3 top-5 text-[#134562] disabled:opacity-50"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[#EF4444] text-xs mt-[8px]">{errors.password}</p>
          )}
        </div>

        <div className="text-right text-sm mt-[12px] mb-[20px]">
          <Link href="/reset" className="text-[#134562] hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={`w-full bg-[#134562] text-white py-2 rounded-md ${
            isPending ? "opacity-70 cursor-not-allowed" : "hover:bg-[#083144]"
          } transition`}
        >
          {isPending ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-sm text-center text-[#A5A8B5] mt-[20px]">
          Don't have an account yet?{" "}
          <Link
            href="/auth/register"
            className="text-[#134562] hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </form>
  );
}
