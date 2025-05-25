/*
  Warnings:

  - The primary key for the `SiteAssignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `firstNane` on the `User` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SiteAssignment" DROP CONSTRAINT "SiteAssignment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SiteAssignment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SiteAssignment_id_seq";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstNane",
ADD COLUMN     "firstName" TEXT NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
