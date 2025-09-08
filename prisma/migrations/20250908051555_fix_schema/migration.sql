/*
  Warnings:

  - The values [email_verification,password_reset] on the enum `VerificationCodeType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."VerificationCodeType_new" AS ENUM ('EmailVerification', 'PasswordReset');
ALTER TABLE "public"."VerificationCode" ALTER COLUMN "type" TYPE "public"."VerificationCodeType_new" USING ("type"::text::"public"."VerificationCodeType_new");
ALTER TYPE "public"."VerificationCodeType" RENAME TO "VerificationCodeType_old";
ALTER TYPE "public"."VerificationCodeType_new" RENAME TO "VerificationCodeType";
DROP TYPE "public"."VerificationCodeType_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Session" ALTER COLUMN "expiresAt" SET DEFAULT (NOW() + interval '30 days');
