/*
  Warnings:

  - The primary key for the `authors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `blog_likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `blog_reads` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `comment_likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `socials` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_authors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "authorBio" TEXT,
    "profilePic" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "authors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_authors" ("authorBio", "createdAt", "id", "profilePic", "updatedAt", "userId") SELECT "authorBio", "createdAt", "id", "profilePic", "updatedAt", "userId" FROM "authors";
DROP TABLE "authors";
ALTER TABLE "new_authors" RENAME TO "authors";
CREATE UNIQUE INDEX "authors_userId_key" ON "authors"("userId");
CREATE TABLE "new_blog_likes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sanityPostId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "blog_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_blog_likes" ("createdAt", "id", "sanityPostId", "userId") SELECT "createdAt", "id", "sanityPostId", "userId" FROM "blog_likes";
DROP TABLE "blog_likes";
ALTER TABLE "new_blog_likes" RENAME TO "blog_likes";
CREATE INDEX "blog_likes_sanityPostId_idx" ON "blog_likes"("sanityPostId");
CREATE UNIQUE INDEX "blog_likes_userId_sanityPostId_key" ON "blog_likes"("userId", "sanityPostId");
CREATE TABLE "new_blog_reads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sanityPostId" TEXT NOT NULL,
    "readAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "blog_reads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_blog_reads" ("id", "readAt", "sanityPostId", "userId") SELECT "id", "readAt", "sanityPostId", "userId" FROM "blog_reads";
DROP TABLE "blog_reads";
ALTER TABLE "new_blog_reads" RENAME TO "blog_reads";
CREATE INDEX "blog_reads_sanityPostId_idx" ON "blog_reads"("sanityPostId");
CREATE UNIQUE INDEX "blog_reads_userId_sanityPostId_key" ON "blog_reads"("userId", "sanityPostId");
CREATE TABLE "new_comment_likes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "comment_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comment_likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_comment_likes" ("commentId", "createdAt", "id", "userId") SELECT "commentId", "createdAt", "id", "userId" FROM "comment_likes";
DROP TABLE "comment_likes";
ALTER TABLE "new_comment_likes" RENAME TO "comment_likes";
CREATE UNIQUE INDEX "comment_likes_userId_commentId_key" ON "comment_likes"("userId", "commentId");
CREATE TABLE "new_comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "sanityPostId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_comments" ("content", "createdAt", "id", "parentId", "sanityPostId", "updatedAt", "userId") SELECT "content", "createdAt", "id", "parentId", "sanityPostId", "updatedAt", "userId" FROM "comments";
DROP TABLE "comments";
ALTER TABLE "new_comments" RENAME TO "comments";
CREATE INDEX "comments_sanityPostId_idx" ON "comments"("sanityPostId");
CREATE TABLE "new_socials" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "handle" TEXT,
    CONSTRAINT "socials_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_socials" ("authorId", "handle", "id", "platform", "url") SELECT "authorId", "handle", "id", "platform", "url" FROM "socials";
DROP TABLE "socials";
ALTER TABLE "new_socials" RENAME TO "socials";
CREATE UNIQUE INDEX "socials_authorId_platform_key" ON "socials"("authorId", "platform");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "password" TEXT,
    "bio" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isAuthor" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_users" ("bio", "createdAt", "email", "firstName", "id", "isAuthor", "isVerified", "lastName", "password", "phoneNumber", "updatedAt", "userName") SELECT "bio", "createdAt", "email", "firstName", "id", "isAuthor", "isVerified", "lastName", "password", "phoneNumber", "updatedAt", "userName" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_userName_key" ON "users"("userName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
