/*
  Warnings:

  - You are about to drop the column `amc_date` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `go_live_date` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `project_commit_date` on the `Schedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "amc_date" TIMESTAMP(3),
ADD COLUMN     "commit_date" TIMESTAMP(3),
ADD COLUMN     "go_live_date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "amc_date",
DROP COLUMN "go_live_date",
DROP COLUMN "project_commit_date";
