import { redirect } from "next/navigation";

export default function AuthPage() {
  // Redirect to the register page
  redirect("/auth/register");
}
