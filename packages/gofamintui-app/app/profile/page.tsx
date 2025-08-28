import { fetchProfile } from "@/actions/profile/profile";
import ProfileComponent from "@/components/profile/profileComponent";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const user = await fetchProfile();

  if (user.success && user.data) {
    const { firstName, lastName } = user.data;
    const fullName = `${firstName} ${lastName}`;

    return {
      title: `${fullName} - Profile`,
      description: `${fullName}'s profile and account information.`,
      robots: {
        index: false,
        follow: false,
      },

      openGraph: {
        title: `${fullName} - Profile`,
        description: `${fullName}'s profile page`,
        type: "profile",
      },

      twitter: {
        card: "summary",
        title: `${fullName} - Profile`,
        description: `View ${fullName}'s profile`,
      },
    };
  }

  // Fallback metadata when no user data or fetch fails
  return {
    title: "User Profile",
    description: "View user profile and account information.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ProfilePage() {
  const user = await fetchProfile();

  return user.data ? <ProfileComponent user={user.data} /> : <div></div>;
}
