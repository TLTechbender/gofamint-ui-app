"use client";

import { useState, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import forgotPassword from "@/actions/forms/forgotPassword";
import { forgotPasswordSchemaClient, ForgotPasswordSchemaClientData } from "@/lib/formSchemas/forgotPasswordSchemaClient";
import { ForgotPasswordActionState } from "@/lib/formActionStates/forgotPasswordActionState";
import { zodResolver } from "@hookform/resolvers/zod";


// Types
interface ForgotPasswordForm {
  email: string;
}



const initialState: ForgotPasswordActionState = {
  success: false,
  message: "",
  status: 0
};

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  // useActionState hook for server action
  const [state, formAction, isPending] = useActionState(
    forgotPassword,
    initialState
  );

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setError,
    reset
  } = useForm<ForgotPasswordSchemaClientData>({
    mode: "onChange",
   resolver: zodResolver(forgotPasswordSchemaClient)
  });

  // Handle server action response
  useEffect(() => {
    if (state.success) {
      setSubmittedEmail(getValues("email"));
      setIsSubmitted(true);
      reset();
    } else if (state.message && !state.success) {
      // Set server errors on the form
      setError("email", {
        type: "server",
        message: state.message,
      });
    }
  }, [state, getValues, setError]);

  // Form submission handler
  const onSubmit = (data: ForgotPasswordForm) => {
    // Create FormData for server action
    const formData = new FormData();
    formData.append("email", data.email);

    // Call server action
    formAction(formData);
  };

  // Reset to form view
  const handleTryDifferentEmail = () => {
    setIsSubmitted(false);
    setSubmittedEmail("");
  };

  if (isSubmitted) {
    return (
      <main className="bg-white min-h-screen">
        {/* Nav Divider */}
        <div className="pt-20 mb-2 bg-black h-16 w-full" />

        <div className="container mx-auto px-6 md:px-8 py-24 md:py-32">
          <div className="max-w-md mx-auto text-center">
            {/* Success State */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Email Sent
              </span>
            </div>

            <div className="mb-8">
              <div className="w-16 h-16 bg-blue-50 mx-auto mb-6 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-light text-black mb-6 leading-tight">
                Check Your Email
              </h1>
              <p className="text-lg text-black font-light leading-relaxed mb-2">
                We've sent a password reset link to
              </p>
              <p className="text-lg font-medium text-blue-500 mb-8">
                {submittedEmail}
              </p>
              <p className="text-base text-gray-600 font-light leading-relaxed">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleTryDifferentEmail}
                className="w-full text-blue-500 hover:text-blue-600 font-medium py-3 transition-colors duration-200 border-b border-transparent hover:border-blue-500"
              >
                Try Different Email
              </button>

              <Link
                href="/auth/login"
                className="block w-full text-black hover:text-blue-500 font-light py-3 transition-colors duration-200"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      {/* Nav Divider */}
      <div className="pt-20 mb-2 bg-black h-16 w-full" />

      <div className="container mx-auto px-6 md:px-8 py-24 md:py-32">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Account Recovery
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-light text-black mb-6 leading-tight">
              Forgot Password?
            </h1>

            <p className="text-lg text-black font-light leading-relaxed">
              No worries! Enter your email address and we'll send you a link to
              reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black mb-3 tracking-wide"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
                className={`w-full px-0 py-3 text-black font-light bg-transparent border-0 border-b transition-colors duration-200 placeholder:text-gray-400 focus:ring-0 focus:outline-none ${
                  errors.email
                    ? "border-red-400 focus:border-red-400"
                    : "border-gray-200 focus:border-blue-400"
                }`}
                placeholder="Enter your email address"
                disabled={isPending}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending || !isValid}
              className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-300 text-white font-medium py-4 transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isPending ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
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
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
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
