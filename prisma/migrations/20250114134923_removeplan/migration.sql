/*
  Warnings:

  - You are about to drop the column `planName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeProductId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionExpiresAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionStatus` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "planName",
DROP COLUMN "stripeCustomerId",
DROP COLUMN "stripeProductId",
DROP COLUMN "stripeSubscriptionId",
DROP COLUMN "subscriptionExpiresAt",
DROP COLUMN "subscriptionStatus";
