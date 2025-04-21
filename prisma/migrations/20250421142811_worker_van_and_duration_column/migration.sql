/*
  Warnings:

  - Added the required column `duration` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quotationRef` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vanType` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `worker` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `createdAt` on the `Booking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "duration" TEXT NOT NULL,
ADD COLUMN     "quotationRef" TEXT NOT NULL,
ADD COLUMN     "vanType" TEXT NOT NULL,
ADD COLUMN     "worker" INTEGER NOT NULL,
DROP COLUMN "createdAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL;
