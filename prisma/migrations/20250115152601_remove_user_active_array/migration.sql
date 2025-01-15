-- DropIndex
DROP INDEX "unique_user_code";

-- CreateIndex
CREATE INDEX "VerificationCode_userId_email_idx" ON "VerificationCode"("userId", "email");
