-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Memorial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "deathDate" TEXT NOT NULL,
    "epitaph" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "mainImage" TEXT NOT NULL,
    "gallery" TEXT NOT NULL DEFAULT '[]',
    "email" TEXT,
    "txid" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "anchoringPriority" TEXT NOT NULL DEFAULT 'standard',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID'
);
INSERT INTO "new_Memorial" ("anchoringPriority", "bio", "birthDate", "createdAt", "deathDate", "email", "epitaph", "fullName", "gallery", "id", "mainImage", "paymentStatus", "slug", "status", "txid", "updatedAt") SELECT "anchoringPriority", "bio", "birthDate", "createdAt", "deathDate", "email", "epitaph", "fullName", "gallery", "id", "mainImage", "paymentStatus", "slug", "status", "txid", "updatedAt" FROM "Memorial";
DROP TABLE "Memorial";
ALTER TABLE "new_Memorial" RENAME TO "Memorial";
CREATE UNIQUE INDEX "Memorial_slug_key" ON "Memorial"("slug");
CREATE UNIQUE INDEX "Memorial_txid_key" ON "Memorial"("txid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
