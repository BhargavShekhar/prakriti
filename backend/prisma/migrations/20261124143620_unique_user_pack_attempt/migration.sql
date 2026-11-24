/*
  Warnings:

  - A unique constraint covering the columns `[userId,packId]` on the table `quiz_attempt` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "quiz_attempt_userId_packId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "quiz_attempt_userId_packId_key" ON "quiz_attempt"("userId", "packId");
