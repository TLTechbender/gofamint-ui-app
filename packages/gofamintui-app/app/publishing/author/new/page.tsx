import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CreateNewBlog from "./NewPageClient";
import { prisma } from "@/lib/prisma/prisma";


function MobileBlockMessage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:hidden">
      <div className="text-center max-w-sm mx-auto">
        <div className="mb-6">
          {/* Crying laptop emoji effect */}
          <div className="text-6xl mb-4 animate-bounce">💻</div>
          <div className="text-4xl animate-pulse">😢</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-dashed border-purple-200">
          <h1 className="text-xl font-bold text-gray-800 mb-3">
            {`Nah, you can't kill the frontend dev abeg! 🙏`}
          </h1>

          <p className="text-gray-600 mb-4 leading-relaxed">
            This blog editor needs some breathing room to work its magic. Please
            open on a tablet or desktop for the full experience! ✨
          </p>

          <div className="flex items-center justify-center space-x-2 text-sm text-purple-600">
            <span>📱 → 💻</span>
            <span className="font-medium">Switch to desktop</span>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          Your content deserves a bigger canvas 🎨
        </div>
      </div>
    </div>
  );
}

export default async function NewPage() {
  const session = await auth();

  // Intentionally not doing metadata here, don't want this page to get indexed even in the slightest

  if (!session) {
    redirect("/auth/login");
  }

  const userId = session.user.id;

  const getDatabaseAuthorReference = await prisma.author.findUnique({
    where: {
      userId: userId,
    },
  });

  const databaseAuthorReferenceId = getDatabaseAuthorReference?.id;

  return (
    <>
      {/* Show mobile block on screens smaller than md */}
      <MobileBlockMessage />

      {/* Hide main content on mobile, show on md and up */}
      <div className="hidden md:block">
        <CreateNewBlog databaseAuthorReferenceId={databaseAuthorReferenceId!} />
      </div>
    </>
  );
}
