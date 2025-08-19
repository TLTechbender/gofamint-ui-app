"use client";
import {
  loginSchemaClient,
  LoginSchemaClientData,
} from "@/lib/formSchemas/loginSchemaClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function Signin() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,

    reset,
    handleSubmit,

    formState: { errors },
  } = useForm<LoginSchemaClientData>({
    resolver: zodResolver(loginSchemaClient),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginSchemaClientData) => {
    try {
      // Validate input
      const result = loginSchemaClient.safeParse(data);
      if (!result.success) {
        toast.error("Invalid input credentials. Please try again.");
        reset();
        return;
      }


      //Todo: bro fix them callback urls too

      setIsLoading(true);
      console.log("Submitting credentials:", result.data);

      
      const res = await signIn("credentials", {
        redirect: false,
        emailOrUsername: result.data.emailOrUserName, 
        password: result.data.password,
      });

      console.log("SignIn response:", res); 

      if (res?.error) {
        switch (res.error) {
          case "CredentialsSignin":
            toast.error(
              "Invalid credentials. Check your email/username and password."
            );
            break;
          case "AccessDenied":
            toast.error("Access denied. Your account may not be verified.");
            break;
          case "Configuration":
            toast.error(
              "Authentication configuration error. Please contact support."
            );
            break;
          default:
            toast.error("Login failed: " + res.error);
            console.error("Unexpected error:", res.error);
        }
        return;
      }

      // Check if sign-in was successful
      if (res?.ok) {
        toast.success("Logged in successfully!");

        if (callbackUrl) {
          router.push(callbackUrl);
        } else {
          router.push(`/profile`);
        }
      } else {
        toast.error("Login failed. Please try again.");
        console.error("Sign-in failed without specific error:", res);
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" bg-white flex flex-col">
      {/* Top Header/Divider */}
      <div className="bg-black h-16 mb-2 w-full flex-shrink-0" />

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center py-4 justify-center px-6 md:px-8">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-px bg-blue-400"></div>
                <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                  Welcome Back
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-light text-black mb-4 leading-tight tracking-tight">
                Sign In
              </h1>
              <p className="text-black font-light leading-relaxed">
                Access your account to continue your journey with us.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="text"
                    className="block text-sm font-medium text-black tracking-wide"
                  >
                    Email Address or Username
                  </label>
                  <input
                    type="text"
                    id="emailOrUserName"
                    {...register("emailOrUserName")}
                    className={`w-full px-4 py-3 border  bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-1  transition-colors duration-200 font-light
                     ${
                       errors.emailOrUserName
                         ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                         : "border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                     }
                    
                    `}
                    placeholder="your@email.com or Your UserName"
                    required
                  />
                  {errors.emailOrUserName && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.emailOrUserName.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-black tracking-wide"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      {...register("password")}
                      className={`w-full px-4 py-3 pr-12 border border-gray-200 bg-white text-black placeholder-gray-400 focus:outline-none  focus:ring-1  transition-colors duration-200 font-light
                      
                      ${
                        errors.password
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                      }
                      `}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>

                    {errors.password && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <a
                    href="/forgot-password"
                    className="text-sm text-blue-500 hover:text-blue-600 font-light transition-colors duration-200"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 px-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-4 text-sm text-gray-500 font-light">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Social Login Options */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-black transition-colors duration-200">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-light">Continue with Google</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-black font-light">
                {`  Don't have an account?{" "}`}
                <a
                  href="/register"
                  className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Visual Element */}
        <div className="hidden lg:flex flex-1 bg-[#f4f4f4] items-center justify-center p-12">
          <div className="max-w-md text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-12 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                GSF UI
              </span>
              <div className="w-12 h-px bg-blue-400"></div>
            </div>

            <h2 className="text-3xl md:text-4xl font-light text-black mb-6 leading-tight">
              Join Our Community
            </h2>
            <p className="text-lg text-black font-light leading-relaxed mb-8">
              Connect with fellow believers, access exclusive content, and stay
              updated with our latest events and activities.
            </p>

            {/* Feature List */}
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 flex-shrink-0"></span>
                <span className="text-black font-light">
                  Connect with our Spirit filled articles
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 flex-shrink-0"></span>
                <span className="text-black font-light">
                  Stay up to date with announcements and more features
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
