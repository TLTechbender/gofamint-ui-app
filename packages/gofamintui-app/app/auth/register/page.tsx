"use client";
import { useActionState, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterFormDataClient,
  registerSchemaClient,
} from "@/lib/formSchemas/registerSchemaClient";
import registerNewUser from "@/actions/forms/register";
import { Eye, EyeOff, Mail, AlertCircle } from "lucide-react";
import Link from "next/link";

//Is user verified state can throw me into bush later walahi

const initialState = {
  success: false,
  message: "",
  errors: null,
  
  email: "",
};

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

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [serverErrorsProcessed, setServerErrorsProcessed] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterFormDataClient>({
    resolver: zodResolver(registerSchemaClient),
    mode: "onChange",
  });

  const password = watch("password") || "";
  const { criteria, strength, score, strengthLabel, strengthColor } =
    usePasswordStrength(password);

  const [state, formAction, isPending] = useActionState(
    registerNewUser,
    initialState
  );

  // Handle server-side validation errors - Fixed to prevent infinite re-renders
  useEffect(() => {
    if (state.errors && !state.success && !serverErrorsProcessed) {
      Object.entries(state.errors).forEach(([field, messages]) => {
        if (messages && messages.length > 0) {
          setError(field as keyof RegisterFormDataClient, {
            type: "server",
            message: messages[0],
          });
        }
      });
      setServerErrorsProcessed(true);
    }

    if (state.success && !state.errors) {
      reset();
      setServerErrorsProcessed(false);
    }
  }, [state, setError, reset, serverErrorsProcessed]);

  const onSubmit = async (data: RegisterFormDataClient) => {
   
    clearErrors();
    setServerErrorsProcessed(false);

    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("userName", data.userName);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("password", data.password);

    formAction(formData);
  };

  const handleResendVerification = async () => {
    setIsResendingEmail(true);
    try {
      // Call your resend verification email action here
      const response = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.email }),
      });

      if (response.ok) {
        // Show success message
        alert("Verification email sent! Please check your inbox.");
      } else {
        alert("Failed to resend email. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsResendingEmail(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Show verification needed state
  if (state.isUserVerified == false ) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-blue-500" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-black">
                Check Your Email
              </h1>
              <p className="text-gray-600">
                {` We've sent a verification link to{" "} `}
                <span className="font-medium">{state.email}</span>
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                {`   Didn't receive the email? Check your spam folder or click below
                to resend. `}
              </p>

              <button
                onClick={handleResendVerification}
                disabled={isResendingEmail}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                {isResendingEmail ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline"
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
                    Sending...
                  </>
                ) : (
                  "Resend Verification Email"
                )}
              </button>

              <Link
                href="/auth/signin"
                className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 transition-colors duration-200"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="pt-20 mb-2 bg-black h-16 w-full" />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-start">
            {/* Left Column - Welcome Content */}
            <div className="space-y-10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-px bg-blue-400"></div>
                <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                  Join Us
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-black leading-tight tracking-tight">
                  Create Your Account
                </h1>
                <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-xl">
                  {`  Join the Gofamint Students' Fellowship community and be part
                  of our spiritual journey at the University of Ibadan.`}
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-5 pt-4">
                {[
                  "Personal access to content",
                  "Connect with fellow believers in chat",
                  "Stay updated with upcoming features",
                  "Access spiritual resources",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2.5 flex-shrink-0"></span>
                    <span className="text-gray-700 font-light text-lg">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Registration Form */}
            <div className="w-full">
              <div className="max-w-lg">
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Personal Information Section */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 pb-2">
                      <div className="w-6 h-px bg-blue-400"></div>
                      <span className="text-xs font-medium text-blue-400 tracking-widest uppercase">
                        Personal Information
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          {...register("firstName")}
                          disabled={isPending}
                          className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 text-gray-900 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                            errors.firstName
                              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                          }`}
                          placeholder="Enter your first name"
                        />
                        {errors.firstName && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          {...register("lastName")}
                          disabled={isPending}
                          className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 text-gray-900 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                            errors.lastName
                              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                          }`}
                          placeholder="Enter your last name"
                        />
                        {errors.lastName && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...register("email")}
                        disabled={isPending}
                        className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 text-gray-900 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                          errors.email
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                        }`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="userName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="userName"
                        {...register("userName")}
                        disabled={isPending}
                        className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 text-gray-900 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                          errors.userName
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                        }`}
                        placeholder="e.g omoJesu4Ever"
                      />
                      {errors.userName && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.userName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        {...register("phoneNumber")}
                        disabled={isPending}
                        className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 text-gray-900 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                          errors.phoneNumber
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                        }`}
                        placeholder="+234 xxx xxx xxxx"
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.phoneNumber.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Account Security Section */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 pb-2">
                      <div className="w-6 h-px bg-blue-400"></div>
                      <span className="text-xs font-medium text-blue-400 tracking-widest uppercase">
                        Account Security
                      </span>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          {...register("password")}
                          disabled={isPending}
                          className={`w-full px-4 py-3 pr-12 border rounded-lg transition-colors duration-200 text-gray-900 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                            errors.password
                              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                          }`}
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          disabled={isPending}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.password.message}
                        </p>
                      )}

                      {/* Password Strength Indicator */}
                      {password && (
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
                                    criterion.met
                                      ? "bg-green-500"
                                      : "bg-gray-300"
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

                    <div className="space-y-2">
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          {...register("confirmPassword")}
                          disabled={isPending}
                          className={`w-full px-4 py-3 pr-12 border rounded-lg transition-colors duration-200 text-gray-900 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                            errors.confirmPassword
                              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                          }`}
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          disabled={isPending}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Agreement Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("acceptTerms")}
                        disabled={isPending}
                        className="mt-1 w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="text-sm text-gray-700 leading-relaxed">
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-blue-500 hover:text-blue-600 underline underline-offset-2 font-medium"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-blue-500 hover:text-blue-600 underline underline-offset-2 font-medium"
                        >
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    {errors.acceptTerms && (
                      <p className="text-red-600 text-sm mt-2">
                        {errors.acceptTerms.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isPending}
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
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </div>

                  {/* Sign In Link */}
                  <div className="text-center pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link
                        href="/auth/signin"
                        className="text-blue-500 hover:text-blue-600 underline underline-offset-2 font-medium"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
