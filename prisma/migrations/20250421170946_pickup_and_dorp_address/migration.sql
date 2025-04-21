/*
  Warnings:

  - Added the required column `dropAddress` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupAddress` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "dropAddress" JSONB NOT NULL,
ADD COLUMN     "pickupAddress" JSONB NOT NULL;
