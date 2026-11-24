/*
  Warnings:

  - You are about to drop the column `terrainId` on the `quiz_attempt` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "quiz_attempt" DROP CONSTRAINT "quiz_attempt_terrainId_fkey";

-- AlterTable
ALTER TABLE "quiz_attempt" DROP COLUMN "terrainId";
