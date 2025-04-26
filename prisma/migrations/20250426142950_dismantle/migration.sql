/*
  Warnings:

  - You are about to drop the column `itemsToDismental` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "itemsToDismental",
ADD COLUMN     "itemsToDismantle" INTEGER NOT NULL DEFAULT 0;
