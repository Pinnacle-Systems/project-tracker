/*
  Warnings:

  - Made the column `date` on table `Schedule` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Schedule" ALTER COLUMN "date" SET NOT NULL;
