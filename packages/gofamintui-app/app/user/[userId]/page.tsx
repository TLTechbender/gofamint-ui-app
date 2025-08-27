import { getUserDetails } from "@/actions/user/getUserDetails";
import { urlFor } from "@/sanity/sanityClient";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  joinedDate?: string;
  bio?: string;
  isAuthor?: boolean;
}

function InitialsAvatar({
  firstName,
  lastName,
  size = "w-32 h-32 md:w-40 md:h-40",
}: {
  firstName: string;
  lastName: string;
  size?: string;
}) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <div
      className={`${size} rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
    >
      <span className="text-white font-medium text-2xl md:text-3xl">
        {initials}
      </span>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> {
  const { userId } = await params;
  const user = await getUserDetails(userId);

  if (!user || !user.success || !user.data) {
    return {
      title: "User Not Found | GSF UI",
      description: "The requested user profile could not be found.",
    };
  }

  const userData = user.data;

  return {
    title: `${userData.firstName} ${userData.lastName} (@${userData.userName}) | GSF UI`,
    description: `View ${userData.firstName} ${userData.lastName}${`'`}s profile on GSF UI community.`,
    openGraph: {
      title: `${userData.firstName} ${userData.lastName} (@${userData.userName})`,
      description: `View ${userData.firstName} ${userData.lastName}${`'`}s profile on GSF UI community.`,
      images: userData.profilePicture
        ? [
            {
              url: urlFor(userData.profilePicture)
                .width(600)
                .height(600)
                .format("webp")
                .url(),
            },
          ]
        : [],
    },
  };
}

export default async function UserProfile({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const userResponse = await getUserDetails(userId);

  if (!userResponse || !userResponse.success || !userResponse.data) {
    return <UserNotFound />;
  }

  const user = userResponse.data;

  return (
    <>
      <div className="bg-black h-16 mb-2 w-full flex-shrink-0 relative top-0 z-10" />
      <main className="bg-white min-h-screen">
        <section className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-6 md:px-8 max-w-4xl">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                User Profile
              </span>
            </div>
          </div>
        </section>

        {/* Profile Content */}
        <section className="bg-white pb-24 md:pb-32">
          <div className="container mx-auto px-6 md:px-8 max-w-4xl">
            <div className="bg-white border border-gray-100 hover:border-gray-200 transition-colors duration-300">
              {/* Profile Header */}
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row md:items-start gap-8">
                  {/* Profile Picture */}
                  <div className="flex-shrink-0">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden group">
                      {user?.profilePicture ? (
                        <Image
                          src={urlFor(user.profilePicture)
                            .width(160)
                            .height(160)
                            .format("webp")
                            .url()}
                          alt={`${user.firstName} ${user.lastName}${`'`}s profile picture`}
                          fill
                          className="object-cover rounded-full transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 128px, 160px"
                        />
                      ) : (
                        user && (
                          <InitialsAvatar
                            firstName={user.firstName}
                            lastName={user.lastName}
                          />
                        )
                      )}
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-grow space-y-6">
                    {/* Name and Username */}
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        {user && (
                          <h1 className="text-3xl md:text-4xl font-light text-black leading-tight">
                            {user.firstName} {user.lastName}
                          </h1>
                        )}

                        {/* Author Badge */}
                        {user?.isAuthor && (
                          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 border border-blue-200">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-xs font-medium text-blue-600 tracking-widest uppercase">
                              Author
                            </span>
                          </div>
                        )}
                      </div>

                      {user && (
                        <p className="text-lg text-gray-600 font-light">
                          @{user.userName}
                        </p>
                      )}
                    </div>

                    {/* Additional Info */}
                    {user?.bio && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                          About
                        </h3>
                        <p className="text-black font-light leading-relaxed">
                          {user.bio}
                        </p>
                      </div>
                    )}

                    {user?.dateJoined && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                          Member Since
                        </h3>
                        <p className="text-black font-light">
                          {new Date(user.dateJoined).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function UserNotFound() {
  return (
    <>
      <div className="bg-black h-16 mb-2 w-full flex-shrink-0 relative top-0 z-10" />
      <main className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-px bg-blue-400"></div>
            <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
              404 Error
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-light text-black mb-6 leading-tight">
            User Not Found
          </h1>
          <p className="text-black font-light leading-relaxed mb-8">
            {`The user profile you're looking for doesn't exist or has been
            removed.`}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-400 hover:bg-blue-500 text-white font-medium transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </>
  );
}
