/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Quotation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "stoppage" TEXT[];

-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "stoppage" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_email_key" ON "Quotation"("email");
