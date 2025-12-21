-- CreateTable
CREATE TABLE "Memorial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "deathDate" TEXT NOT NULL,
    "epitaph" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "mainImage" TEXT NOT NULL,
    "gallery" TEXT NOT NULL,
    "txid" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Memorial_slug_key" ON "Memorial"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Memorial_txid_key" ON "Memorial"("txid");
