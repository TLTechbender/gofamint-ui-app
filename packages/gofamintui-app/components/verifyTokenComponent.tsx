"use client";

import verifyEmail from "@/actions/forms/verifyEmail";
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
import { useState, useEffect, useActionState } from "react";



const initialState: VerifyEmailActionState= {
  success: false,
  status: 0,
  message: "",
};

const VerifyTokenComponent = ({ token }: { token: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // useActionState hook for server action
  const [state, formAction, isPending] = useActionState(
    verifyEmail,
    initialState
  );

  // Track if verification has been attempted
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  // Extract user ID from search params or other source
  const userId = searchParams.get("id") || searchParams.get("userId");
  const userEmail = searchParams.get("email"); // Optional: for display

  // Trigger verification on component mount
  useEffect(() => {
    if (token && userId && !verificationAttempted) {
      const formData = new FormData();
      formData.append("token", token.trim());
      formData.append("id", userId);

      formAction(formData);
      setVerificationAttempted(true);
    } else if (!token || !userId) {
      // Handle missing token or userId
      setVerificationAttempted(true);
    }
  }, [token, userId, formAction, verificationAttempted]);

  // Handle successful verification redirect
  useEffect(() => {
    if (state.success) {
      // Redirect to dashboard after 3 seconds
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

  // Animation effects
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setShowActions(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Action handlers
  const handleRetry = () => {
    if (token && userId) {
      setVerificationAttempted(false); // Reset to trigger re-verification
      const formData = new FormData();
      formData.append("token", token.trim());
      formData.append("id", userId);
      formAction(formData);
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoToDashboard = () => {
    router.push("/profile");
  };


  //Would be handling this
  // const handleResendEmail = () => {
  //   router.push("/auth/resend-verification");
  // };

  // Loading state
  if (isPending || (!verificationAttempted && token && userId)) {
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

  // Error state - Invalid token or missing parameters
  if (
    !token ||
    !userId ||
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
                {!token || !userId
                  ? "Invalid Verification Link"
                  : "Verification Failed"}
              </h1>

              <p className="text-lg text-black font-light leading-relaxed max-w-sm mx-auto">
                {state.message ||
                  "The verification link is invalid or has expired. Please request a new verification email."}
              </p>

              {/* Error Details */}
              {state.message && (
                <div className="bg-red-50 p-6 border-l-2 border-red-400">
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
              {token && userId && (
                <button
                  onClick={handleRetry}
                  disabled={isPending}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-4 px-6 font-light tracking-wide transition-all duration-300 flex items-center justify-center space-x-3 group"
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
                // onClick={handleResendEmail}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 font-light tracking-wide transition-all duration-300 flex items-center justify-center space-x-3 group"
              >
                <Mail className="w-5 h-5" strokeWidth={1.5} />
                <span>Request New Verification Email</span>
              </button>

              {/* Go Home */}
              <button
                onClick={handleGoHome}
                className="w-full border border-gray-200 text-black py-4 px-6 font-light tracking-wide transition-all duration-300 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center space-x-3 group"
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

  // Success state
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
              {/* Background Circle */}
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-8">
                <CheckCircle
                  className="w-12 h-12 text-blue-400"
                  strokeWidth={1.5}
                />
              </div>

              {/* Small accent dot */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full opacity-80"></div>
            </div>
          </div>

          {/* Main Content */}
          <div
            className={`text-center space-y-8 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {/* Status Indicator */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Success
              </span>
              <div className="w-8 h-px bg-blue-400"></div>
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
            <div className="bg-gray-50 p-6 border-l-2 border-blue-400">
              <div className="flex items-start space-x-3">
                <Mail
                  className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
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
            <div className="bg-blue-50 p-4 rounded-lg">
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
              className="w-full bg-black text-white py-4 px-6 font-light tracking-wide transition-all duration-300 hover:bg-gray-900 flex items-center justify-center space-x-3 group"
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
              className="w-full border border-gray-200 text-black py-4 px-6 font-light tracking-wide transition-all duration-300 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center space-x-3 group"
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
