-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gmailConnected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gmailRefreshToken" TEXT;
