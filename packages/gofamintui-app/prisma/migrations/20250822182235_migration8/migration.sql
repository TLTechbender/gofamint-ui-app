-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_blogs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sanityId" TEXT NOT NULL,
    "sanitySlug" TEXT NOT NULL,
    "authorId" TEXT,
    "isPublishedInSanity" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "sanityUpdatedAt" DATETIME,
    "genericViewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastSyncedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_blogs" ("authorId", "createdAt", "genericViewCount", "id", "isPublishedInSanity", "lastSyncedAt", "publishedAt", "sanityId", "sanitySlug", "sanityUpdatedAt", "updatedAt") SELECT "authorId", "createdAt", "genericViewCount", "id", "isPublishedInSanity", "lastSyncedAt", "publishedAt", "sanityId", "sanitySlug", "sanityUpdatedAt", "updatedAt" FROM "blogs";
DROP TABLE "blogs";
ALTER TABLE "new_blogs" RENAME TO "blogs";
CREATE UNIQUE INDEX "blogs_sanityId_key" ON "blogs"("sanityId");
CREATE UNIQUE INDEX "blogs_sanitySlug_key" ON "blogs"("sanitySlug");
CREATE INDEX "blogs_sanityId_idx" ON "blogs"("sanityId");
CREATE INDEX "blogs_sanitySlug_idx" ON "blogs"("sanitySlug");
CREATE INDEX "blogs_authorId_idx" ON "blogs"("authorId");
CREATE INDEX "blogs_isPublishedInSanity_idx" ON "blogs"("isPublishedInSanity");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
