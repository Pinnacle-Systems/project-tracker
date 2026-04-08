-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "amc_date" TIMESTAMP(3),
ADD COLUMN     "go_live_date" TIMESTAMP(3),
ADD COLUMN     "project_commit_date" TIMESTAMP(3);
