/*
  Warnings:

  - You are about to drop the column `pickupdDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `pickupdTime` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `pickupdDate` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `pickupdTime` on the `Quotation` table. All the data in the column will be lost.
  - Added the required column `pickupDate` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupTime` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "pickupdDate",
DROP COLUMN "pickupdTime",
ADD COLUMN     "pickupDate" TEXT NOT NULL,
ADD COLUMN     "pickupTime" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "pickupdDate",
DROP COLUMN "pickupdTime",
ADD COLUMN     "pickupDate" TEXT,
ADD COLUMN     "pickupTime" TEXT;
