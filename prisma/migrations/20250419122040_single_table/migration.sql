/*
  Warnings:

  - Added the required column `details` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "details" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "route" TEXT NOT NULL,
    "fromLocation" JSONB NOT NULL,
    "toLocation" JSONB NOT NULL,
    "createdAt" TEXT NOT NULL,
    "pickupdDate" TEXT NOT NULL,
    "pickupdTime" TEXT NOT NULL,
    "dropDate" TEXT NOT NULL,
    "dropTime" TEXT NOT NULL,
    "details" JSONB NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);
