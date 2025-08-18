"use client";

import { useState, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

import { resetPasswordClientSchema, ResetPasswordSchemaClientData } from "@/lib/formSchemas/resetPasswordSchemaClient";
import resetPassword from "@/actions/forms/resetPassword";
import { ResetPasswordActionState } from "@/lib/formActionStates/resetPasswordActionState";
// import { resetPasswordSchemaClient } from "@/lib/formSchemas/resetPasswordSchemaClient"; // Add when ready

// Types
interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const initialState: ResetPasswordActionState = {
  success: false,
  message: "",
  status: 0
};

// Custom hook for password strength (consistent with your registration component)
const usePasswordStrength = (password: string) => {
  const criteria = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains number", met: /\d/.test(password) },
    {
      label: "Contains special character",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  const metCount = criteria.filter((c) => c.met).length;

  const strength =
    metCount === 0
      ? 0
      : metCount <= 2
        ? 1
        : metCount <= 3
          ? 2
          : metCount <= 4
            ? 3
            : 4;
  const score = (metCount / 5) * 100;

  const strengthLabel =
    strength === 0
      ? ""
      : strength === 1
        ? "Weak"
        : strength === 2
          ? "Fair"
          : strength === 3
            ? "Good"
            : "Strong";
  const strengthColor =
    strength === 1
      ? "bg-red-500"
      : strength === 2
        ? "bg-orange-500"
        : strength === 3
          ? "bg-yellow-500"
          : strength === 4
            ? "bg-green-500"
            : "bg-gray-300";

  return { criteria, strength, score, strengthLabel, strengthColor };
};

export default function ResetPasswordComponent({ token }: { token: string }) {
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false,
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverErrorsProcessed, setServerErrorsProcessed] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();


  const [state, formAction, isPending] = useActionState(
    resetPassword,
    initialState
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setError,
    clearErrors,
    reset,
  } = useForm<ResetPasswordSchemaClientData>({
    
    mode: "onChange",
    resolver: zodResolver(resetPasswordClientSchema)
  });

  // Watch password for real-time validation and strength checking
  const watchedPassword = watch("password") || "";


  // Password strength hook
  const { criteria, strength, score, strengthLabel, strengthColor } =
    usePasswordStrength(watchedPassword);


  // Form submission handler
  const onSubmit = (data: ResetPasswordForm) => {
    // Clear any previous server errors
    clearErrors();
    setServerErrorsProcessed(false);

    // Create FormData for server action
    const formData = new FormData();
    formData.append("token", token);
    formData.append("password", data.password);

    // Extract userId from token or get it from searchParams
    const userId = searchParams.get("userId"); // Adjust based on your URL structure
    if (userId) {
      formData.append("userId", userId);
    }


    formAction(formData);
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Success state


  //also call reset when form submits right would test and check soon,, just want to get all the code up bro
  if (isSuccess) {
    return (
      <main className="bg-white min-h-screen">
        <div className="pt-20 mb-2 bg-black h-16 w-full" />
        <div className="container mx-auto px-6 md:px-8 py-24 md:py-32">
          <div className="max-w-md mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Success
              </span>
            </div>

            <div className="mb-8">
              <div className="w-16 h-16 bg-green-50 mx-auto mb-6 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h1 className="text-3xl md:text-4xl font-light text-black mb-6 leading-tight">
                Password Updated
              </h1>

              <p className="text-lg text-black font-light leading-relaxed mb-8">
                Your password has been successfully updated. You can now sign in
                with your new password.
              </p>
            </div>

            <Link
              href="/auth/login"
              className="inline-block w-full bg-black hover:bg-gray-900 text-white font-medium py-4 transition-all duration-200 text-center"
            >
              Continue to Login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Invalid token state
  if (!token) {
    return (
      <main className="bg-white min-h-screen">
        <div className="pt-20 mb-2 bg-black h-16 w-full" />
        <div className="container mx-auto px-6 md:px-8 py-24 md:py-32">
          <div className="max-w-md mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-8 h-px bg-red-400"></div>
              <span className="text-sm font-medium text-red-400 tracking-widest uppercase">
                Invalid Link
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-light text-black mb-6 leading-tight">
              Invalid Reset Link
            </h1>

            <p className="text-lg text-black font-light leading-relaxed mb-8">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>

            <Link
              href="/auth/forgot-password"
              className="inline-block w-full bg-black hover:bg-gray-900 text-white font-medium py-4 transition-all duration-200 text-center"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Main form
  return (
    <main className="bg-white min-h-screen">
      <div className="pt-20 mb-2 bg-black h-16 w-full" />

      <div className="container mx-auto px-6 md:px-8 py-24 md:py-32">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Reset Password
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-light text-black mb-6 leading-tight">
              Create New Password
            </h1>

            <p className="text-lg text-black font-light leading-relaxed">
              Choose a strong password to secure your account.
            </p>
          </div>

          {/* Show server messages */}
          {state.message && !state.success && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{state.message}</p>
            </div>
          )}

          {state.message && state.success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400">
              <p className="text-green-700 text-sm">{state.message}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Account Security Section Header */}
            <div className="flex items-center space-x-3 pb-2">
              <div className="w-6 h-px bg-blue-400"></div>
              <span className="text-xs font-medium text-blue-400 tracking-widest uppercase">
                Account Security
              </span>
            </div>

            {/* New Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.password ? "text" : "password"}
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    validate: (value) => {
                      const passwordCriteria = [
                        /[A-Z]/.test(value) || "Must contain uppercase letter",
                        /[a-z]/.test(value) || "Must contain lowercase letter",
                        /\d/.test(value) || "Must contain number",
                        /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                          "Must contain special character",
                      ];
                      const failedCriteria = passwordCriteria.filter(
                        (criteria) => typeof criteria === "string"
                      );
                      return failedCriteria.length === 0 || failedCriteria[0];
                    },
                  })}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg transition-colors duration-200 text-gray-900 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                  }`}
                  placeholder="Create a strong password"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("password")}
                  disabled={isPending}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPasswords.password ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1" role="alert">
                  {errors.password.message}
                </p>
              )}

              {/* Password Strength Indicator */}
              {watchedPassword && (
                <div className="space-y-3 mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600 font-medium">
                        Password Strength
                      </span>
                      <span
                        className={`font-semibold ${
                          strength === 1
                            ? "text-red-600"
                            : strength === 2
                              ? "text-orange-600"
                              : strength === 3
                                ? "text-yellow-600"
                                : strength === 4
                                  ? "text-green-600"
                                  : "text-gray-600"
                        }`}
                      >
                        {strengthLabel}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${strengthColor}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {criteria.map((criterion, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 text-xs"
                      >
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-300 ${
                            criterion.met ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          {criterion.met && (
                            <svg
                              className="w-2.5 h-2.5 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`transition-colors duration-300 ${
                            criterion.met
                              ? "text-green-700 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {criterion.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => {
                      return (
                        value === watchedPassword || "Passwords don't match"
                      );
                    },
                  })}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg transition-colors duration-200 text-gray-900 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                  }`}
                  placeholder="Confirm your new password"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  disabled={isPending}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPasswords.confirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1" role="alert">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isPending || !isValid}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 flex items-center justify-center"
              >
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating Password...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-black font-light">
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200 underline underline-offset-2"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
