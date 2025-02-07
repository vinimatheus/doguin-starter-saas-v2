/*
  Warnings:

  - You are about to drop the column `image` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "image",
ADD COLUMN     "icon" TEXT;
