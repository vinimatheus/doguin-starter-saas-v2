-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('basic', 'pro', 'enterprise');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'basic';
