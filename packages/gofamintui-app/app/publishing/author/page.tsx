import { auth } from "@/auth";
import { Author } from "@/sanity/interfaces/author";
import { authorQuery } from "@/sanity/queries/author";
import { urlFor } from "@/sanity/sanityClient";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";

import { redirect } from "next/navigation";
import AuthorDashboardClient from "./authorDashboardClient";

export interface ProfileData {
  firstName: string;
  lastName: string;
  bio: string;
  email: string;
  joinedDate: string;
  profileImage: string;
  socials: SocialMedia[];
}

export interface SocialMedia {
  platform:
    | "twitter"
    | "linkedin"
    | "instagram"
    | "facebook"
    | "github"
    | "website";
  url: string;
  handle?: string;
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);

  const day: number = date.getUTCDate();
  const month: string = date.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });
  const year: number = date.getUTCFullYear();

  // Add ordinal suffix (st, nd, rd, th)
  function getOrdinal(n: number): string {
    if (n > 3 && n < 21) return `${n}th`;
    switch (n % 10) {
      case 1:
        return `${n}st`;
      case 2:
        return `${n}nd`;
      case 3:
        return `${n}rd`;
      default:
        return `${n}th`;
    }
  }

  return `${getOrdinal(day)} ${month} ${year}`;
}

function transformApiResponseToProfileData(apiData: Author): ProfileData {
  return {
    firstName: apiData.firstName,
    lastName: apiData.lastName,
    bio: apiData.authorBio || "",
    email: apiData.email,
    joinedDate: formatDate(apiData._createdAt),
    profileImage:
      (apiData.profilePic &&
        urlFor(apiData.profilePic?.asset)
          .width(200)
          .height(200)
          .quality(100)
          .url()) ||
      "",
    socials: apiData.socials || [],
  };
}

export default async function AuthorDashboard() {
  const session = await auth();

  // Server-side redirect for unauthenticated users
  if (!session) {
    redirect("/auth/signin");
  }

  const authorProfileData = await sanityFetchWrapper<Author>(authorQuery, {
    userId: session.user.id,
  });

  // Server-side redirect for non-authors
  if (!authorProfileData) {
    redirect("/profile");
  }

  const transformedProfileData =
    transformApiResponseToProfileData(authorProfileData);

  console.log(transformedProfileData);

  return <AuthorDashboardClient profileData={transformedProfileData} />;
}
