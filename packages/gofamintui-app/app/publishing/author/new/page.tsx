import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CreateNewBlog from "./NewPageClient";
import { prisma } from "@/lib/prisma/prisma";

export default async function NewPage() {
  const session = await auth();

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
    <CreateNewBlog databaseAuthorReferenceId={databaseAuthorReferenceId!} />
  );
}
