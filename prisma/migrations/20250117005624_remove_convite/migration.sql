/*
  Warnings:

  - You are about to drop the `UserInvitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VerificationCode" DROP CONSTRAINT "VerificationCode_userId_fkey";

-- DropTable
DROP TABLE "UserInvitation";

-- DropTable
DROP TABLE "VerificationCode";
