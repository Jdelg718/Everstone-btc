-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "providerId" TEXT,
    "memorialId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_memorialId_fkey" FOREIGN KEY ("memorialId") REFERENCES "Memorial" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID'
);
INSERT INTO "new_Memorial" ("bio", "birthDate", "createdAt", "deathDate", "epitaph", "fullName", "gallery", "id", "mainImage", "slug", "status", "txid", "updatedAt") SELECT "bio", "birthDate", "createdAt", "deathDate", "epitaph", "fullName", "gallery", "id", "mainImage", "slug", "status", "txid", "updatedAt" FROM "Memorial";
DROP TABLE "Memorial";
ALTER TABLE "new_Memorial" RENAME TO "Memorial";
CREATE UNIQUE INDEX "Memorial_slug_key" ON "Memorial"("slug");
CREATE UNIQUE INDEX "Memorial_txid_key" ON "Memorial"("txid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
