/*
  Warnings:

  - You are about to drop the column `sanityPostId` on the `blog_likes` table. All the data in the column will be lost.
  - You are about to drop the column `sanityPostId` on the `blog_reads` table. All the data in the column will be lost.
  - You are about to drop the column `sanityPostId` on the `comments` table. All the data in the column will be lost.
  - Added the required column `blogId` to the `blog_likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blogId` to the `blog_reads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blogId` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "blogs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sanityId" TEXT NOT NULL,
    "sanitySlug" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "isPublishedInSanity" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "sanityUpdatedAt" DATETIME,
    "genericViewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastSyncedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_blog_likes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "blog_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "blog_likes_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_blog_likes" ("createdAt", "id", "userId") SELECT "createdAt", "id", "userId" FROM "blog_likes";
DROP TABLE "blog_likes";
ALTER TABLE "new_blog_likes" RENAME TO "blog_likes";
CREATE INDEX "blog_likes_blogId_idx" ON "blog_likes"("blogId");
CREATE UNIQUE INDEX "blog_likes_userId_blogId_key" ON "blog_likes"("userId", "blogId");
CREATE TABLE "new_blog_reads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "readAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "blog_reads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "blog_reads_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_blog_reads" ("id", "readAt", "userId") SELECT "id", "readAt", "userId" FROM "blog_reads";
DROP TABLE "blog_reads";
ALTER TABLE "new_blog_reads" RENAME TO "blog_reads";
CREATE INDEX "blog_reads_blogId_idx" ON "blog_reads"("blogId");
CREATE UNIQUE INDEX "blog_reads_userId_blogId_key" ON "blog_reads"("userId", "blogId");
CREATE TABLE "new_comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "comments_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_comments" ("content", "createdAt", "id", "parentId", "updatedAt", "userId") SELECT "content", "createdAt", "id", "parentId", "updatedAt", "userId" FROM "comments";
DROP TABLE "comments";
ALTER TABLE "new_comments" RENAME TO "comments";
CREATE INDEX "comments_blogId_idx" ON "comments"("blogId");
CREATE INDEX "comments_userId_idx" ON "comments"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "blogs_sanityId_key" ON "blogs"("sanityId");

-- CreateIndex
CREATE UNIQUE INDEX "blogs_sanitySlug_key" ON "blogs"("sanitySlug");

-- CreateIndex
CREATE INDEX "blogs_sanityId_idx" ON "blogs"("sanityId");

-- CreateIndex
CREATE INDEX "blogs_sanitySlug_idx" ON "blogs"("sanitySlug");

-- CreateIndex
CREATE INDEX "blogs_authorId_idx" ON "blogs"("authorId");

-- CreateIndex
CREATE INDEX "blogs_isPublishedInSanity_idx" ON "blogs"("isPublishedInSanity");
