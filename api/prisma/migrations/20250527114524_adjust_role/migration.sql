/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('ADMIN', 'MANAGER', 'WORKER');

-- CreateEnum
CREATE TYPE "SITE_STATUS" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "status" "SITE_STATUS" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "ROLE" NOT NULL DEFAULT 'WORKER';

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "threshold" INTEGER NOT NULL,
    "siteId" TEXT NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
