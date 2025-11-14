import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getBlogInfoForUpdateBlogPage } from "@/actions/blog/getInfoForUpdateBlogPage";
import EditArticlePublishedByAuthor from "./EditPageClient";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { BlogPost } from "@/sanity/interfaces/blog";
import { buildSingleBlogPostQuery } from "@/sanity/queries/blog";

function EditMobileBlockMessage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:hidden">
      <div className="text-center max-w-sm mx-auto">
        <div className="mb-6">
          <div className="text-6xl mb-4 animate-bounce">✏️</div>
          <div className="text-4xl animate-pulse">😅</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-dashed border-blue-200">
          <h1 className="text-xl font-bold text-gray-800 mb-3">
            {` Nah, you can't kill the frontend dev abeg! 🙏`}
          </h1>

          <p className="text-gray-600 mb-4 leading-relaxed">
            Editing requires precision and space to work properly. Please switch
            to desktop to edit your masterpiece! ✨
          </p>

          <div className="flex items-center justify-center space-x-2 text-sm text-blue-600 mb-4">
            <span>📱 → 💻</span>
            <span className="font-medium">Switch to desktop</span>
          </div>

          <Link
            href="/publishing/author"
            className="inline-block w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Back to your publishing dashboard
          </Link>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          Your words deserve a proper editor 📝
        </div>
      </div>
    </div>
  );
}

//No metadata here bro, don't want this page getting indexed for no reason
export default async function EditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  const formData = new FormData();
  formData.append("sanitySlug", slug);

  const getBlogDetailsForUpdate = await getBlogInfoForUpdateBlogPage(formData);

  function ArticleAccessDenied() {
    return (
      <>
        <div className="md:hidden">
          <EditMobileBlockMessage />
        </div>

        <div className="hidden md:block">
          <div className="bg-black h-16 mb-2 w-full flex-shrink-0" />
          <main className="min-h-screen bg-white flex items-center justify-center">
            <div className="container mx-auto px-6 md:px-8 max-w-2xl text-center">
              <div className="flex items-center justify-center space-x-3 mb-12">
                <div className="w-12 h-px bg-blue-400"></div>
                <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                  Access Restricted
                </span>
                <div className="w-12 h-px bg-blue-400"></div>
              </div>

              <h1 className="text-3xl md:text-4xl font-light text-black mb-8 leading-tight tracking-tight">
                Content Not Available
              </h1>

              <div className="space-y-6 mb-12">
                <p className="text-lg text-black font-light leading-relaxed max-w-lg mx-auto">
                  {` The content you're looking for cannot be accessed at this time.`}
                </p>

                <p className="text-base text-gray-600 font-light leading-relaxed max-w-md mx-auto">
                  This could be due to permissions, availability, or other
                  restrictions.
                </p>
              </div>

              <div className="space-y-4">
                <Link
                  href="/publishing/author"
                  className="inline-block px-8 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-colors duration-300"
                >
                  Return to Dashboard
                </Link>

                <div className="text-center">
                  <Link
                    href="/"
                    className="text-sm text-gray-500 hover:text-black font-light tracking-wide transition-colors duration-300"
                  >
                    or go home
                  </Link>
                </div>
              </div>

              <div className="mt-16 pt-8 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-light tracking-wide">
                  If you believe this is an error, please contact support
                </p>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (!getBlogDetailsForUpdate.success) {
    return <ArticleAccessDenied />;
  }

  let blogData;

  if (getBlogDetailsForUpdate.success) {
    blogData = await sanityFetchWrapper<BlogPost>(
      buildSingleBlogPostQuery(),
      {
        slug: slug,
      },
      ["blogPost", `blog/${slug}`, "blog"]
    );
  }

 

  return (
    <>
      <EditMobileBlockMessage />

      <div className="hidden md:block">
        <EditArticlePublishedByAuthor blogPost={blogData!} />
      </div>
    </>
  );
}
