/*
  Warnings:

  - Changed the type of `quotationRef` on the `Booking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "quotationRef",
ADD COLUMN     "quotationRef" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Quotation" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "price" INTEGER,
    "distance" DOUBLE PRECISION,
    "route" TEXT,
    "duration" TEXT,
    "pickupdDate" TEXT,
    "pickupdTime" TEXT,
    "pickupAddress" JSONB,
    "dropDate" TEXT,
    "dropTime" TEXT,
    "dropAddress" JSONB,
    "vanType" TEXT,
    "worker" INTEGER,
    "itemsToDismantle" INTEGER DEFAULT 0,
    "itemsToAssemble" INTEGER DEFAULT 0,
    "fromLocation" JSONB,
    "toLocation" JSONB,
    "details" JSONB,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);
