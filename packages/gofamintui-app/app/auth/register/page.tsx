"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { registerSchema } from "@/schemas/registerSchema";
import { toast } from "react-toastify";
import { registerServerAction } from "@/actions/register";



export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [password, setPassword] = useState("");

  // Password validation rules component
  const PasswordRules = ({ password }: { password: string }) => {
    const rules = [
      { text: "At least 8 characters", valid: password.length >= 8 },
      { text: "One uppercase letter", valid: /[A-Z]/.test(password) },
      { text: "One lowercase letter", valid: /[a-z]/.test(password) },
      { text: "One number", valid: /[0-9]/.test(password) },
    ];

    return (
      <div className="mt-2 space-y-1">
        {rules.map((rule, index) => (
          <div
            key={index}
            className={`text-xs flex items-center gap-2 ${
              rule.valid ? "text-green-600" : "text-gray-500"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                rule.valid ? "bg-green-600" : "bg-gray-300"
              }`}
            ></span>
            {rule.text}
          </div>
        ))}
      </div>
    );
  };

  const [isPending, startTransition] = useTransition();
 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      department: formData.get("department") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    // Clear previous errors
    setErrors({});

    // Validate with Zod schema
    const validation = registerSchema.safeParse(data);

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
        const result = await registerServerAction(validation.data);
        console.log(result);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          // Reset form on success
          toast.success('A verification message has been sent to your email');
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
console.log(process.env.NEXT_SANITY_TOKEN);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white px-6 py-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Join Our Fellowship
          </h2>
          <p className="text-sm text-gray-600">
            Create your account to get started
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 ${
                errors.firstName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 ${
                errors.lastName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="john.doe@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phoneNumber"
            className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 ${
              errors.phoneNumber
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="+1234567890"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="department"
            className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 ${
              errors.department
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="e.g., Engineering, Marketing, Design"
          />
          {errors.department && (
            <p className="text-red-500 text-xs mt-1">{errors.department}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 pr-10 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
          <PasswordRules password={password} />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 pr-10 ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-2.5 rounded-md transition text-white font-medium ${
            isPending
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isPending ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
