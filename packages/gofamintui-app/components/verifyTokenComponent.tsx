"use client";

import verifyEmail from "@/actions/authentication/verifyEmail";
import { VerifyEmailActionState } from "@/lib/formActionStates/verifyEmailActionState";
import {
  ArrowRight,
  CheckCircle,
  Mail,
  User,
  Home,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";

const initialState: VerifyEmailActionState = {
  success: false,
  status: 0,
  message: "",
};

const VerifyTokenComponent = ({ token }: { token: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // UI state management
  const [isVisible, setIsVisible] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Server action state management
  const [state, setState] = useState<VerifyEmailActionState>(initialState);

  // useTransition for server action - CORRECTED USAGE
  const [isPending, startTransition] = useTransition();

  // Track if verification has been attempted
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  // Extract user ID from search params or other source

  const userEmail = searchParams.get("email");

  /*
   * SERVER ACTION WRAPPER FUNCTION
   * This function wraps the server action call and manages the state updates
   * useTransition expects a synchronous function that calls async operations
   */
  const performVerification = async (formData: FormData) => {
    try {
      console.log("Starting email verification with:", {
        token: formData.get("token"),
        userId: formData.get("id"),
      });

      // Call the server action
      const result = await verifyEmail(formData);

      console.log("Verification result:", result);

      // Update state with the result
      setState(result);

      return result;
    } catch (error) {
      console.error("Verification error:", error);

      // Handle unexpected errors
      const errorState: VerifyEmailActionState = {
        success: false,
        status: 500,
        message:
          "An unexpected error occurred during verification. Please try again.",
      };

      setState(errorState);
      return errorState;
    }
  };

  /*
   * INITIAL VERIFICATION TRIGGER
   * Automatically attempt verification when component mounts with valid token and userId
   */
  useEffect(() => {
    if (token && userEmail && !verificationAttempted) {
      console.log("Triggering initial verification attempt");

      setVerificationAttempted(true);

      // Use startTransition to wrap the async server action call
      startTransition(() => {
        const formData = new FormData();
        formData.append("token", token.trim());
        formData.append("email", userEmail!);

        // Call our wrapper function inside the transition
        performVerification(formData);
      });
    } else if (!token || !userEmail) {
      console.log("Missing required parameters:", {
        token: !!token,
        userEmail: !!userEmail,
      });

      // Handle missing token or userId
      setVerificationAttempted(true);
      setState({
        success: false,
        status: 400,
        message: "Invalid verification link. Missing required parameters.",
      });
    }
  }, [token, userEmail, verificationAttempted]);

  /*
   * SUCCESS REDIRECT HANDLER
   * Automatically redirect to dashboard after successful verification
   */
  useEffect(() => {
    if (state.success) {
      console.log("Verification successful, setting up redirect");

      // Redirect to dashboard after 3 seconds
      const timer = setTimeout(() => {
        console.log("Redirecting to profiel");
        router.push("/profile");
      }, 3000);

      return () => {
        console.log("Clearing redirect timer");
        clearTimeout(timer);
      };
    }
  }, [state.success, router]);

  /*
   * UI ANIMATION EFFECTS
   * Handle entrance animations for better UX
   */
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setShowActions(true), 800);
    return () => clearTimeout(timer);
  }, []);

  /*
   * ACTION HANDLERS
   * Handle user interactions for retry, navigation, etc.
   */

  // Retry verification with the same parameters
  const handleRetry = () => {
    if (token && userEmail) {
      console.log("Retrying verification");

      // Reset states for retry
      setVerificationAttempted(false);
      setState(initialState);

      // Use startTransition for the retry attempt
      startTransition(() => {
        const formData = new FormData();
        formData.append("token", token.trim());
        formData.append("email", userEmail);

        performVerification(formData).then(() => {
          setVerificationAttempted(true);
        });
      });
    } else {
      console.error("Cannot retry: missing token or userId");
    }
  };

  // Navigate to home page
  const handleGoHome = () => {
    console.log("Navigating to home");
    router.push("/");
  };

  // Navigate to dashboard/profile
  const handleGoToDashboard = () => {
    console.log("Navigating to dashboard");
    router.push("/dashboard"); // or "/profile" based on your routing
  };

  // TODO: Implement resend email functionality
  const handleResendEmail = () => {
    console.log("Resend email functionality - to be implemented");
    // router.push("/auth/resend-verification");
    // For now, you could redirect to your register component's resend functionality
    router.push("/auth/signup");
  };

  /*
   * LOADING STATE RENDERING
   * Show loading spinner while verification is in progress
   */
  if (isPending || (!verificationAttempted && token && userEmail)) {
    return (
      <div>
        <div className="pt-20 mb-2 bg-black h-16 w-full" />
        <main className="bg-white flex items-center justify-center px-6 py-12 min-h-screen">
          <div className="w-full max-w-md">
            <div className="text-center space-y-8">
              {/* Loading Animation */}
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <RefreshCw
                  className="w-12 h-12 text-blue-400 animate-spin"
                  strokeWidth={1.5}
                />
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-8 h-px bg-blue-400"></div>
                <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                  Verifying
                </span>
                <div className="w-8 h-px bg-blue-400"></div>
              </div>

              <h1 className="text-3xl md:text-4xl font-light text-black leading-tight tracking-tight">
                Verifying Your Email
              </h1>

              <p className="text-lg text-black font-light leading-relaxed max-w-sm mx-auto">
                Please wait while we verify your email address...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /*
   * ERROR STATE RENDERING
   * Handle invalid tokens, missing parameters, or verification failures
   */
  if (
    !token ||
    !userEmail ||
    (!state.success && state.message && verificationAttempted)
  ) {
    return (
      <div>
        <div className="pt-20 mb-2 bg-black h-16 w-full" />
        <main className="bg-white flex items-center justify-center px-6 py-12 min-h-screen">
          <div className="w-full max-w-md">
            <div
              className={`text-center space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              {/* Error Icon */}
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <AlertCircle
                  className="w-12 h-12 text-red-400"
                  strokeWidth={1.5}
                />
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-8 h-px bg-red-400"></div>
                <span className="text-sm font-medium text-red-400 tracking-widest uppercase">
                  Verification Failed
                </span>
                <div className="w-8 h-px bg-red-400"></div>
              </div>

              <h1 className="text-3xl md:text-4xl font-light text-black leading-tight tracking-tight">
                {!token || !userEmail
                  ? "Invalid Verification Link"
                  : "Verification Failed"}
              </h1>

              <p className="text-lg text-black font-light leading-relaxed max-w-sm mx-auto">
                {state.message ||
                  "The verification link is invalid or has expired. Please request a new verification email."}
              </p>

              {/* Error Details */}
              {state.message && (
                <div className="bg-red-50 p-6 border-l-4 border-red-400 rounded-r-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle
                      className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"
                      strokeWidth={1.5}
                    />
                    <div className="text-left">
                      <p className="text-sm font-medium text-black mb-1">
                        Error Details:
                      </p>
                      <p className="text-sm text-red-600 font-light">
                        {state.message}
                      </p>
                      {state.status && (
                        <p className="text-xs text-red-500 mt-1">
                          Status Code: {state.status}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Actions */}
            <div
              className={`mt-12 space-y-4 transition-all duration-1000 delay-700 ${showActions ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              {/* Retry if we have the necessary params */}
              {token && userEmail && (
                <button
                  onClick={handleRetry}
                  disabled={isPending}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-4 px-6 font-light tracking-wide transition-all duration-300 flex items-center justify-center space-x-3 group rounded-lg"
                >
                  <RefreshCw
                    className={`w-5 h-5 ${isPending ? "animate-spin" : ""}`}
                    strokeWidth={1.5}
                  />
                  <span>{isPending ? "Retrying..." : "Try Again"}</span>
                </button>
              )}

              {/* Resend Email */}
              <button
                onClick={handleResendEmail}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 font-light tracking-wide transition-all duration-300 flex items-center justify-center space-x-3 group rounded-lg"
              >
                <Mail className="w-5 h-5" strokeWidth={1.5} />
                <span>Request New Verification Email</span>
              </button>

              {/* Go Home */}
              <button
                onClick={handleGoHome}
                className="w-full border border-gray-200 text-black py-4 px-6 font-light tracking-wide transition-all duration-300 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center space-x-3 group rounded-lg"
              >
                <Home className="w-5 h-5" strokeWidth={1.5} />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /*
   * SUCCESS STATE RENDERING
   * Show success message and provide navigation options
   */
  return (
    <div>
      <div className="pt-20 mb-2 bg-black h-16 w-full" />

      <main className="bg-white flex items-center justify-center px-6 py-12 min-h-screen">
        <div className="w-full max-w-md">
          {/* Success Icon with Animation */}
          <div
            className={`text-center mb-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="relative inline-flex items-center justify-center">
              {/* Background Circle with pulse effect */}
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 animate-pulse">
                <CheckCircle
                  className="w-12 h-12 text-green-500"
                  strokeWidth={1.5}
                />
              </div>

              {/* Small accent dot */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full opacity-80 animate-bounce"></div>
            </div>
          </div>

          {/* Main Content */}
          <div
            className={`text-center space-y-8 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {/* Status Indicator */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-px bg-green-400"></div>
              <span className="text-sm font-medium text-green-500 tracking-widest uppercase">
                Success
              </span>
              <div className="w-8 h-px bg-green-400"></div>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl md:text-4xl font-light text-black leading-tight tracking-tight">
              Email Verified Successfully
            </h1>

            {/* Description */}
            <p className="text-lg text-black font-light leading-relaxed max-w-sm mx-auto">
              {state.message ||
                "Your account has been activated. You can now access all features and start your journey with us."}
            </p>

            {/* Email Confirmation Detail */}
            <div className="bg-green-50 p-6 border-l-4 border-green-400 rounded-r-lg">
              <div className="flex items-start space-x-3">
                <Mail
                  className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                  strokeWidth={1.5}
                />
                <div className="text-left">
                  <p className="text-sm font-medium text-black mb-1">
                    Verification completed{userEmail ? " for:" : ""}
                  </p>
                  {userEmail && (
                    <p className="text-sm text-gray-600 font-light">
                      {userEmail}
                    </p>
                  )}
                  {!userEmail && (
                    <p className="text-sm text-gray-600 font-light">
                      Your email has been successfully verified
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Auto-redirect notice */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 font-light">
                {`You'll be automatically redirected to your dashboard in a few
                seconds...`}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className={`mt-12 space-y-4 transition-all duration-1000 delay-700 ${showActions ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {/* Primary Action */}
            <button
              onClick={handleGoToDashboard}
              className="w-full bg-black text-white py-4 px-6 font-light tracking-wide transition-all duration-300 hover:bg-gray-800 flex items-center justify-center space-x-3 group rounded-lg"
            >
              <User className="w-5 h-5" strokeWidth={1.5} />
              <span>Go to Dashboard</span>
              <ArrowRight
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </button>

            {/* Secondary Action */}
            <button
              onClick={handleGoHome}
              className="w-full border border-gray-200 text-black py-4 px-6 font-light tracking-wide transition-all duration-300 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center space-x-3 group rounded-lg"
            >
              <Home className="w-5 h-5" strokeWidth={1.5} />
              <span>Return to Home</span>
            </button>
          </div>

          {/* Additional Info */}
          <div
            className={`mt-12 text-center transition-all duration-1000 delay-1000 ${showActions ? "opacity-100" : "opacity-0"}`}
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-6 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-500 tracking-widest uppercase">
                Need Help?
              </span>
              <div className="w-6 h-px bg-gray-200"></div>
            </div>

            <p className="text-sm text-gray-600 font-light">
              If you have any questions, feel free to{" "}
              <a
                href="/contact"
                className="text-blue-400 hover:text-blue-500 transition-colors duration-200 underline underline-offset-2"
              >
                contact our support team
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifyTokenComponent;
