-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
INSERT INTO "new_users" ("bio", "createdAt", "email", "firstName", "id", "isAuthor", "lastName", "password", "phoneNumber", "updatedAt", "userName") SELECT "bio", "createdAt", "email", "firstName", "id", "isAuthor", "lastName", "password", "phoneNumber", "updatedAt", "userName" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_userName_key" ON "users"("userName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
