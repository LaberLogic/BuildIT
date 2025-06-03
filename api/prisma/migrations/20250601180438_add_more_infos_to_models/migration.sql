-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "priority" TEXT;

-- AlterTable
ALTER TABLE "SiteAssignment" ADD COLUMN     "lastVisited" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';
