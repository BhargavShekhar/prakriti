-- CreateEnum
CREATE TYPE "PhotoType" AS ENUM ('WHOLE', 'CLOSE_UP', 'HABITAT');

-- CreateTable
CREATE TABLE "observation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packId" TEXT NOT NULL,
    "photoType" "PhotoType" NOT NULL,
    "imageKey" TEXT NOT NULL,
    "nameGuess" TEXT,
    "spot" TEXT,
    "elevationM" INTEGER,
    "waterLevel" TEXT,
    "wonder" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "observation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "observation_imageKey_key" ON "observation"("imageKey");

-- CreateIndex
CREATE INDEX "observation_userId_createdAt_idx" ON "observation"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "observation_packId_createdAt_idx" ON "observation"("packId", "createdAt");

-- AddForeignKey
ALTER TABLE "observation" ADD CONSTRAINT "observation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observation" ADD CONSTRAINT "observation_packId_fkey" FOREIGN KEY ("packId") REFERENCES "pack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
