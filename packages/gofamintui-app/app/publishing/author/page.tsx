import { auth } from "@/auth";
import { Author } from "@/sanity/interfaces/author";
import { authorQuery } from "@/sanity/queries/author";
import { urlFor } from "@/sanity/sanityClient";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthorDashboardClient from "./authorDashboardClient";
import Link from "next/link";
import { getAuthorAnalytics } from "@/actions/author/authorAnalytics";
import { getAuthorId } from "@/actions/author/authorId";
import { SanityImage } from "@/sanity/interfaces/sanityImage";

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

type ApplicationStatus = "pending" | "approved" | "rejected";

interface AuthorApprovalQueryResult {
  userId: string;
  isApproved: boolean | null;
  status: ApplicationStatus;
  approvedAt: string | null;
  rejectionReason: string | null;
  firstName: string;
  lastName: string;
  authorBio: string;
  profilePic: SanityImage;
}

// Dynamic metadata generation
export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();

  // Default metadata for unauthenticated users, I'm choosing to really not expose the link
  if (!session) {
    return {
      title: "Author Dashboard | GSF UI Blog ",
      description:
        "Access your GSF UI Blog author dashboard to manage your faith-based articles and connect with the community.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
  const authorApprovalQuery = `*[_type == "author" && userId == $userId][0]{
    userId,
     firstName,
  lastName,
  authorBio,
    profilePic {
    asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height
        },
        lqip
      }
    },
    hotspot,
    crop
  },
    "isApproved": application.isApproved,
    "status": application.status,
    "approvedAt": application.approvedAt,
    "rejectionReason": application.rejectionReason
  }`;

  const authorApprovalStats =
    await sanityFetchWrapper<AuthorApprovalQueryResult>(authorApprovalQuery, {
      userId: session.user.id,
    });

  // Default metadata if no author data found
  if (
    !authorApprovalStats ||
    Object.keys(authorApprovalQuery).length ||
    !authorApprovalStats.isApproved
  ) {
    return {
      title: "Author Dashboard | GSF UI Blog - Profile Not Found",
      description:
        "Author profile not found. Please contact support if you believe this is an error.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const fullName = `${authorApprovalStats.firstName} ${authorApprovalStats.lastName}`;
  const optimizedImageUrl = authorApprovalStats.profilePic?.asset
    ? `${urlFor(authorApprovalStats.profilePic.asset).width(1200).height(630).fit("crop").auto("format").url()}`
    : null;

  // Fallback values
  const title = `${fullName}'s Author Dashboard | GSF UI Blog - Author Portal`;
  const description = authorApprovalStats.authorBio
    ? `${fullName}'s author dashboard on GSF UI Blog. ${authorApprovalStats.authorBio.slice(0, 100)}${authorApprovalStats.authorBio.length > 100 ? "..." : ""}`
    : `${fullName}'s author dashboard on GSF UI Blog. Manage faith-inspired content and connect with readers.`;

  return {
    title,
    description,
    keywords: [
      "author dashboard",
      "GSF UI Blog",
      fullName,
      "Christian author",
      "faith writer",
      "blog management",
      "Gofamint Students Fellowship",
      "spiritual writing",
      "content creation",
    ].join(", "),

    authors: [
      {
        name: fullName,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/publishing/author/`,
      },
      {
        name: "Gofamint Students' Fellowship UI Chapter",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      },
    ],
    creator: "Bolarinwa Paul Ayomide (https://github.com/TLTechbender)",
    publisher: "Gofamint Students' Fellowship UI",
    category: "Dashboard",

    robots: {
      index: false, // Dashboard pages shouldn't be indexed
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },

    verification: {
      google: `${process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE}`,
    },

    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/publishgin/author/dashboard`,
      siteName: "GSF UI Blog",
      images: optimizedImageUrl
        ? [
            {
              url: optimizedImageUrl,
              width: 1200,
              height: 630,
              alt: `${fullName} - GSF UI Blog Author`,
              type: "image/jpeg",
            },
          ]
        : [],
      locale: "en_NG",
      type: "profile",
      countryName: "Nigeria",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@gofamintui",
      creator: "@gofamintui",
      images: optimizedImageUrl
        ? [
            {
              url: optimizedImageUrl,
              alt: `${fullName} - GSF UI Blog Author`,
            },
          ]
        : [],
    },

    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/author/dashboard`,
    },

    other: {
      "theme-color": "#3b82f6",
      "color-scheme": "light",
    },

    metadataBase: new URL(`${process.env.NEXT_PUBLIC_SITE_URL}`),
  };
}

function AuthorNotFoundError() {
  return (
    <>
      <div className="bg-black h-16 mb-2 w-full flex-shrink-0" />
      <div className="h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Oops! Author Details Not Found
          </h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {` We couldn't find your author profile details. This might be because:`}
          </p>

          <ul className="text-left text-sm text-gray-500 mb-8 space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              Your author application is still pending review
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              There was a temporary issue loading your data
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              Your profile needs to be set up
            </li>
          </ul>

          <div className="space-y-3">
            <Link
              href="/profile"
              className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Go back to your default user Profile
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Need help? Contact our support team
          </p>
        </div>
      </div>
    </>
  );
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

  const authorAnalyticsData = await getAuthorAnalytics();
  let analyticsData;

  const authorId = await getAuthorId();

  if (authorAnalyticsData.success) {
    analyticsData = authorAnalyticsData.data;
  }

  // Show error component for missing or empty  data
  if (
    !authorProfileData ||
    Object.keys(authorProfileData).length === 0 ||
    !authorAnalyticsData.success ||
    !authorId.success
  ) {
    return <AuthorNotFoundError />;
  }

  const transformedProfileData =
    transformApiResponseToProfileData(authorProfileData);

  return (
    <AuthorDashboardClient
      analyticsData={analyticsData!}
      profileData={transformedProfileData}
      authorId={authorId.data!.authorId}
    />
  );
}
