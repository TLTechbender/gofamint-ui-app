"use client";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterFormDataClient,
  registerSchemaClient,
} from "@/lib/formSchemas/registerSchemaClient";
import registerNewUser from "@/actions/authentication/register";
import { Eye, EyeOff, Mail } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { RegisterActionState } from "@/lib/formActionStates/registerActionState";
import { resendVerificationEmail } from "@/actions/authentication/resendVerification";

/*
 * RESEND VERIFICATION TIMER UTILITY FUNCTIONS
 * These functions manage the timer state that persists across page refreshes
 * to prevent users from abusing the resend verification feature
 */

// Key for storing timer data in localStorage
const RESEND_TIMER_KEY = "resend_verification_timer";
const RESEND_COOLDOWN_MINUTES = 2; // 2 minutes cooldown period

// Get remaining time from localStorage
const getRemainingTime = (email: string): number => {
  if (typeof window === "undefined") return 0;

  try {
    const stored = localStorage.getItem(`${RESEND_TIMER_KEY}_${email}`);
    if (!stored) return 0;

    const { timestamp, cooldownMinutes } = JSON.parse(stored);
    const now = Date.now();
    const elapsed = now - timestamp;
    const cooldownMs = cooldownMinutes * 60 * 1000;

    return Math.max(0, cooldownMs - elapsed);
  } catch {
    return 0;
  }
};

// Set timer in localStorage
const setResendTimer = (email: string): void => {
  if (typeof window === "undefined") return;

  try {
    const timerData = {
      timestamp: Date.now(),
      cooldownMinutes: RESEND_COOLDOWN_MINUTES,
    };
    localStorage.setItem(
      `${RESEND_TIMER_KEY}_${email}`,
      JSON.stringify(timerData)
    );
  } catch (error) {
    console.warn("Could not set resend timer:", error);
  }
};

// Clear timer from localStorage
const clearResendTimer = (email: string): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(`${RESEND_TIMER_KEY}_${email}`);
  } catch (error) {
    console.warn("Could not clear resend timer:", error);
  }
};

/*
 * PASSWORD STRENGTH VALIDATION HOOK
 * This custom hook evaluates password strength based on multiple criteria
 * and provides visual feedback to users about their password quality
 */
const usePasswordStrength = (password: string) => {
  // Define password strength criteria
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

  // Calculate strength metrics
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

  // Determine strength label and color
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

/*
 * MAIN REGISTER COMPONENT
 * This component handles the complete registration flow with multiple states:
 * 1. Initial registration form
 * 2. Email verification required state
 * 3. Email verification sent state
 *
 * Architecture Philosophy: BFF (Backend for Frontend)
 * - Server actions handle all backend communication
 * - Client manages UI state and user interactions
 * - Props flow between server and client for consistent auth experience
 */
export default function Register() {
  // UI STATE MANAGEMENT
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // REGISTRATION STATE from server actions
  const [registrationState, setRegistrationState] =
    useState<RegisterActionState>({
      success: false,
      message: "",
      errors: null as Record<string, string[]> | null,
      email: "",
      isUserVerified: null as boolean | null,
    });

  // RESEND VERIFICATION TIMER STATE
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  // LOADING STATES for async operations
  const [isPending, startTransition] = useTransition();
  const [isResendingEmail, startIsResendingTransition] = useTransition();

  // FORM MANAGEMENT with React Hook Form and Zod validation
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
    mode: "onChange", // Real-time validation
  });

  // Watch password for strength calculation
  const password = watch("password") || "";
  const { criteria, strength, score, strengthLabel, strengthColor } =
    usePasswordStrength(password);

  /*
   * TIMER EFFECT MANAGEMENT
   * Initialize and manage the resend verification timer
   * This effect runs when the component mounts or when email changes
   */
  useEffect(() => {
    if (registrationState.email) {
      const remaining = getRemainingTime(registrationState.email);
      setRemainingTime(remaining);
      setIsTimerActive(remaining > 0);
    }
  }, [registrationState.email]);

  /*
   * COUNTDOWN TIMER EFFECT
   * Updates the timer every second when active
   * Automatically clears when timer reaches zero
   */
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerActive && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          const newTime = Math.max(0, prev - 1000);
          if (newTime === 0) {
            setIsTimerActive(false);
            // Clean up localStorage when timer expires
            if (registrationState.email) {
              clearResendTimer(registrationState.email);
            }
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerActive, remainingTime, registrationState.email]);

  /*
   * SERVER ERROR HANDLING
   * Process validation errors returned from server actions
   * and display them in the appropriate form fields
   */
  useEffect(() => {
    if (registrationState.errors && !registrationState.success) {
      // Map server errors to form field errors
      Object.entries(registrationState.errors).forEach(([field, messages]) => {
        if (messages && messages.length > 0) {
          setError(field as keyof RegisterFormDataClient, {
            type: "server",
            message: messages[0],
          });
        }
      });
    }

    // Reset form on successful registration
    if (registrationState.success && !registrationState.errors) {
      reset();
    }
  }, [registrationState, setError, reset]);

  /*
   * TOAST NOTIFICATION MANAGEMENT
   * Display success/error messages to users
   * Handles both registration and verification resend feedback
   */
  useEffect(() => {
    if (registrationState.message && !registrationState.success) {
      toast.error(registrationState.message);
    } else if (registrationState.message && registrationState.success) {
      toast.success(registrationState.message);
    }
  }, [registrationState.message, registrationState.success]);

  /*
   * FORM SUBMISSION HANDLER
   * Processes user registration with comprehensive error handling
   * This is where client data flows to server via server actions
   */
  const onSubmit = async (data: RegisterFormDataClient) => {
    // Clear any existing form errors
    clearErrors();

    startTransition(async () => {
      try {
        // Prepare FormData for server action
        // Server actions expect FormData format for type safety
        const formData = new FormData();
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("email", data.email);
        formData.append("userName", data.userName);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("password", data.password);

        console.log("FormData being sent to server action:", formData);

        // Call server action for user registration
        const result = await registerNewUser(formData);
        console.log("Registration result from server:", result);

        // Update component state with server response
        setRegistrationState(result);
      } catch (error) {
        // Handle unexpected client-side errors
        console.error("Registration error:", error);
        setRegistrationState({
          success: false,
          message: "An unexpected error occurred. Please try again.",
          errors: null,
          email: "",
          isUserVerified: null,
        });
      }
    });
  };

  /*
   * RESEND VERIFICATION EMAIL HANDLER
   * Manages email resending with timer-based rate limiting
   * Prevents abuse while maintaining good UX for network issues
   */
  const handleResendVerification = async () => {
    // Validate email availability
    if (!registrationState.email) {
      toast.error("Email is required for resending verification");
      return;
    }

    // Check if timer is still active (rate limiting)
    if (isTimerActive && remainingTime > 0) {
      const minutes = Math.ceil(remainingTime / (60 * 1000));
      toast.warning(
        `Please wait ${minutes} minute(s) before requesting another email`
      );
      return;
    }

    startIsResendingTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("email", registrationState.email!);

        console.log(
          "Resending verification email for:",
          registrationState.email
        );

        // Call server action to resend verification
        const result = await resendVerificationEmail(formData);

        if (result && !isResendingEmail) {
          toast.success("Verification email sent! Check your inbox.");

          setResendTimer(registrationState.email!);
          setRemainingTime(RESEND_COOLDOWN_MINUTES * 60 * 1000);
          setIsTimerActive(true);
        }
      } catch (error) {
        console.error("Could not resend verification email:", error);
        toast.error("Failed to resend email. Please try again.");
      }
    });
  };

  // UI UTILITY FUNCTIONS
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Helper function to format remaining time
  const formatRemainingTime = (ms: number): string => {
    const minutes = Math.floor(ms / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  /*
   * CONDITIONAL RENDERING: EMAIL VERIFICATION REQUIRED STATE
   *
   * This state handles users who registered but haven't verified their email
   * Provides options to resend verification with rate limiting
   * Gracefully handles network errors common in Nigeria ("nha naija we dey network errors dey happen")
   */
  if (
    !registrationState.isUserVerified &&
    registrationState.message ==
      "Your email is registered but not verified. Please verify."
  ) {
    return (
      <>
        <div className="pt-20 mb-2 bg-black h-16 w-full" />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-lg w-full">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              {/* Header Section */}
              <div className="text-center space-y-4 mb-8">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-amber-600" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Email Verification Required
                  </h1>
                  <p className="text-gray-600 leading-relaxed">
                    Your account{" "}
                    <span className="font-semibold text-gray-800">
                      {registrationState.email}
                    </span>{" "}
                    needs to be verified before you can continue.
                  </p>
                </div>
              </div>

              {/* Network-Aware Info Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      We understand network issues can happen. If you previously
                      signed up but never verified your email, we can send you a
                      new verification link.
                    </p>
                  </div>
                </div>
              </div>

              {/* Timer Display */}
              {isTimerActive && remainingTime > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-orange-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-orange-700">
                        You can request another verification email in{" "}
                        <span className="font-semibold">
                          {formatRemainingTime(remainingTime)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleResendVerification}
                  disabled={
                    isResendingEmail || (isTimerActive && remainingTime > 0)
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
                >
                  {isResendingEmail ? (
                    <div className="flex items-center justify-center">
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending verification email...
                    </div>
                  ) : isTimerActive && remainingTime > 0 ? (
                    `Wait ${formatRemainingTime(remainingTime)}`
                  ) : (
                    "Send Verification Email"
                  )}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-3">
                    {`Don't have access to this email anymore?`}
                  </p>
                  <Link
                    href="/auth/signup"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm underline"
                  >
                    Create a new account
                  </Link>
                </div>

                <div className="border-t pt-4">
                  <Link
                    href="/auth/signin"
                    className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>

              {/* Help Text */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  {`Check your spam folder if you don't see the email within a few
                  minutes. Network delays are common, so please be patient.`}
                </p>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  /*
   * CONDITIONAL RENDERING: EMAIL VERIFICATION SENT STATE
   *
   * This state shows after successful registration
   * Provides resend functionality with timer protection
   */
  if (registrationState.isUserVerified === false) {
    return (
      <>
        <div className="pt-20 mb-2 bg-black h-16 w-full" />
        <main className="h-screen bg-white flex items-center justify-center p-6">
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
                  {`We've sent a verification link to `}
                  <span className="font-medium">{registrationState.email}</span>
                </p>
              </div>

              {/* Timer Display for this state too */}
              {isTimerActive && remainingTime > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm text-orange-700">
                    Resend available in{" "}
                    <span className="font-semibold">
                      {formatRemainingTime(remainingTime)}
                    </span>
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  {` Didn't receive the email? Check your spam folder or click
                  below to resend.`}
                </p>

                <button
                  onClick={handleResendVerification}
                  disabled={
                    isResendingEmail || (isTimerActive && remainingTime > 0)
                  }
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
                  ) : isTimerActive && remainingTime > 0 ? (
                    `Wait ${formatRemainingTime(remainingTime)}`
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
      </>
    );
  }

  /*
   * MAIN REGISTRATION FORM
   *
   * This is the primary registration interface where users input their details
   * Features comprehensive validation, password strength checking, and smooth UX
   */
  return (
    <main className="min-h-screen bg-white">
      <div className="pt-20 mb-2 bg-black h-16 w-full" />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-start">
            {/* Left Column - Welcome Content & Benefits */}
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
                  {`Join the Gofamint Students' Fellowship community and be part
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Personal Information Section */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 pb-2">
                      <div className="w-6 h-px bg-blue-400"></div>
                      <span className="text-xs font-medium text-blue-400 tracking-widest uppercase">
                        Personal Information
                      </span>
                    </div>

                    {/* Name Fields Grid */}
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

                    {/* Email Field */}
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

                    {/* Username Field */}
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

                    {/* Phone Number Field */}
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

                    {/* Password Field with Strength Indicator */}
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

                          {/* Password Criteria Checklist */}
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

                  {/* Terms and Conditions Agreement */}
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
