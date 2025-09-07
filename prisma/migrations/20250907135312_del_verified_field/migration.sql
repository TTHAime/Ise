/*
  Warnings:

  - You are about to drop the column `verified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Session" ALTER COLUMN "expiresAt" SET DEFAULT (NOW() + interval '30 days');

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "verified";
