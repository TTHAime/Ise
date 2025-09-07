-- AlterTable
ALTER TABLE "public"."Session" ALTER COLUMN "expiresAt" SET DEFAULT (NOW() + interval '30 days');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
