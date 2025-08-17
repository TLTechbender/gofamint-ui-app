"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface ValidationState {
  loading: boolean;
  success: boolean;
  error: string | null;
  message: string;
}

const VerifyTokenComponent = ({ token }: { token: string }) => {
  const router = useRouter();
  const [state, setState] = useState<ValidationState>({
    loading: true,
    success: false,
    error: null,
    message: "",
  });

  const validateToken = async (tokenValue: string) => {
    // Ensure we have a valid token before making the request
    if (!tokenValue || !tokenValue.trim()) {
      setState({
        loading: false,
        success: false,
        error: "Verification token is required",
        message:
          "No verification token was provided. Please check your email link.",
      });
      return;
    }

    try {
      const response = await fetch("/api/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: tokenValue.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setState({
          loading: false,
          success: true,
          error: null,
          message:
            data.message ||
            "Email verified successfully! Welcome to our church community.",
        });

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } else {
        // Handle specific API error messages
        let userMessage = "";
        let errorType = data.error;

        switch (data.error) {
          case "Verification token is required":
            userMessage =
              "No verification token was provided. Please check your email link.";
            break;
          case "Invalid or expired verification token":
            userMessage =
              "This verification link is invalid or has already been used. Please request a new verification email.";
            break;
          case "Verification token has expired":
            userMessage =
              "This verification link has expired. Please request a new verification email to continue.";
            break;
          case "Email verification failed. Please try again.":
            userMessage =
              "Something went wrong during verification. Please try again or contact support.";
            break;
          default:
            userMessage =
              data.error || "Verification failed. Please try again.";
        }

        setState({
          loading: false,
          success: false,
          error: errorType,
          message: userMessage,
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      setState({
        loading: false,
        success: false,
        error: "Network error",
        message:
          "Unable to connect to the server. Please check your internet connection and try again.",
      });
    }
  };

  // Run validation on component mount
  useEffect(() => {
    if (token && token.trim()) {
      validateToken(token);
    } else {
      setState({
        loading: false,
        success: false,
        error: "Verification token is required",
        message:
          "No verification token was provided. Please check your email link.",
      });
    }
  }, [token]);

  const handleRetry = () => {
    setState((prev) => ({ ...prev, loading: true }));
    validateToken(token);
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleResendEmail = () => {
    router.push("/resend-verification");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Loading State */}
          {state.loading && (
            <div className="p-8 text-center">
              <div className="mb-6">
                <div className="animate-spin mx-auto h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Verifying Your Email
              </h2>
              <p className="text-gray-600">
                Please wait while we validate your verification token...
              </p>
            </div>
          )}

          {/* Success State */}
          {!state.loading && state.success && (
            <div className="p-8 text-center">
              <div className="mb-6">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                🎉 Email Verified!
              </h2>
              <p className="text-gray-700 mb-6">{state.message}</p>
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Redirecting to your dashboard in a few seconds...
                </p>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                >
                  Go to Dashboard Now
                </button>
              </div>
            </div>
          )}

          {/* Error State */}
          {!state.loading && !state.success && (
            <div className="p-8 text-center">
              <div className="mb-6">
                <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="h-8 w-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-red-800 mb-4">
                Verification Failed
              </h2>
              <p className="text-gray-700 mb-6">{state.message}</p>

              {/* Error-specific actions */}
              <div className="space-y-3">
                {state.error === "Network error" && (
                  <button
                    onClick={handleRetry}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                  >
                    Try Again
                  </button>
                )}

                {(state.error === "Verification token is required" ||
                  state.error === "Invalid or expired verification token" ||
                  state.error === "Verification token has expired") && (
                  <button
                    onClick={handleResendEmail}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                  >
                    Request New Verification Email
                  </button>
                )}

                {state.error ===
                  "Email verification failed. Please try again." && (
                  <>
                    <button
                      onClick={handleRetry}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={handleResendEmail}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                    >
                      Request New Verification Email
                    </button>
                  </>
                )}

                <button
                  onClick={handleGoHome}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                >
                  Back to Home
                </button>
              </div>

              {/* Additional help */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  Still having trouble?
                </p>
                <button
                  onClick={() =>
                    (window.location.href = "mailto:support@gracechurch.com")
                  }
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  Contact Support
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VerifyTokenComponent;
