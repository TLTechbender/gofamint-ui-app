-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'GOOGLE');

-- CreateEnum
CREATE TYPE "AuthorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'EMAIL_CHANGE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "password" TEXT,
    "bio" TEXT,
    "authProvider" "AuthProvider" NOT NULL DEFAULT 'LOCAL',
    "googleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authors" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "authorBio" TEXT,
    "profilePic" TEXT,
    "status" "AuthorStatus" NOT NULL DEFAULT 'PENDING',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "author_socials" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "handle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "author_socials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blogs" (
    "id" TEXT NOT NULL,
    "sanityId" TEXT NOT NULL,
    "sanitySlug" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "isPublishedInSanity" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "sanityUpdatedAt" TIMESTAMP(3),
    "genericViewCount" INTEGER NOT NULL DEFAULT 0,
    "verifiedViewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSyncedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_reads" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_reads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" "TokenType" NOT NULL DEFAULT 'EMAIL_VERIFICATION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE INDEX "User_authProvider_idx" ON "User"("authProvider");

-- CreateIndex
CREATE INDEX "User_isDeleted_idx" ON "User"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "authors_userId_key" ON "authors"("userId");

-- CreateIndex
CREATE INDEX "authors_status_idx" ON "authors"("status");

-- CreateIndex
CREATE INDEX "authors_appliedAt_idx" ON "authors"("appliedAt");

-- CreateIndex
CREATE INDEX "authors_userId_status_idx" ON "authors"("userId", "status");

-- CreateIndex
CREATE INDEX "authors_isDeleted_idx" ON "authors"("isDeleted");

-- CreateIndex
CREATE INDEX "authors_status_isDeleted_idx" ON "authors"("status", "isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "author_socials_authorId_platform_key" ON "author_socials"("authorId", "platform");

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

-- CreateIndex
CREATE INDEX "blogs_authorId_isPublishedInSanity_idx" ON "blogs"("authorId", "isPublishedInSanity");

-- CreateIndex
CREATE INDEX "blogs_publishedAt_idx" ON "blogs"("publishedAt");

-- CreateIndex
CREATE INDEX "blogs_isDeleted_idx" ON "blogs"("isDeleted");

-- CreateIndex
CREATE INDEX "blogs_isPublishedInSanity_isDeleted_idx" ON "blogs"("isPublishedInSanity", "isDeleted");

-- CreateIndex
CREATE INDEX "comments_blogId_idx" ON "comments"("blogId");

-- CreateIndex
CREATE INDEX "comments_userId_idx" ON "comments"("userId");

-- CreateIndex
CREATE INDEX "comments_parentId_idx" ON "comments"("parentId");

-- CreateIndex
CREATE INDEX "comments_blogId_createdAt_idx" ON "comments"("blogId", "createdAt");

-- CreateIndex
CREATE INDEX "comments_isDeleted_idx" ON "comments"("isDeleted");

-- CreateIndex
CREATE INDEX "comment_likes_commentId_idx" ON "comment_likes"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "comment_likes_userId_commentId_key" ON "comment_likes"("userId", "commentId");

-- CreateIndex
CREATE INDEX "blog_likes_blogId_idx" ON "blog_likes"("blogId");

-- CreateIndex
CREATE INDEX "blog_likes_userId_idx" ON "blog_likes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "blog_likes_userId_blogId_key" ON "blog_likes"("userId", "blogId");

-- CreateIndex
CREATE INDEX "blog_reads_blogId_idx" ON "blog_reads"("blogId");

-- CreateIndex
CREATE INDEX "blog_reads_userId_readAt_idx" ON "blog_reads"("userId", "readAt");

-- CreateIndex
CREATE UNIQUE INDEX "blog_reads_userId_blogId_key" ON "blog_reads"("userId", "blogId");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_userId_expiresAt_idx" ON "sessions"("userId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_sessionId_idx" ON "refresh_tokens"("sessionId");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_expiresAt_idx" ON "refresh_tokens"("token", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE INDEX "verification_tokens_userId_type_idx" ON "verification_tokens"("userId", "type");

-- AddForeignKey
ALTER TABLE "authors" ADD CONSTRAINT "authors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "author_socials" ADD CONSTRAINT "author_socials_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_likes" ADD CONSTRAINT "blog_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_likes" ADD CONSTRAINT "blog_likes_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_reads" ADD CONSTRAINT "blog_reads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_reads" ADD CONSTRAINT "blog_reads_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
