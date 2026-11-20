-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_TEXT');

-- CreateTable
CREATE TABLE "pack" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "location" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terrain" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "terrain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pack_terrain" (
    "id" TEXT NOT NULL,
    "packId" TEXT NOT NULL,
    "terrainId" TEXT NOT NULL,

    CONSTRAINT "pack_terrain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL DEFAULT 'MULTIPLE_CHOICE',
    "explanation" TEXT,
    "points" INTEGER NOT NULL DEFAULT 10,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "terrainId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pack_question" (
    "id" TEXT NOT NULL,
    "packId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "pack_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_option" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "question_option_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pack_slug_key" ON "pack"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "terrain_slug_key" ON "terrain"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "pack_terrain_packId_terrainId_key" ON "pack_terrain"("packId", "terrainId");

-- CreateIndex
CREATE INDEX "question_terrainId_idx" ON "question"("terrainId");

-- CreateIndex
CREATE INDEX "pack_question_packId_sortOrder_idx" ON "pack_question"("packId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "pack_question_packId_questionId_key" ON "pack_question"("packId", "questionId");

-- CreateIndex
CREATE INDEX "question_option_questionId_idx" ON "question_option"("questionId");

-- AddForeignKey
ALTER TABLE "pack_terrain" ADD CONSTRAINT "pack_terrain_packId_fkey" FOREIGN KEY ("packId") REFERENCES "pack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pack_terrain" ADD CONSTRAINT "pack_terrain_terrainId_fkey" FOREIGN KEY ("terrainId") REFERENCES "terrain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_terrainId_fkey" FOREIGN KEY ("terrainId") REFERENCES "terrain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pack_question" ADD CONSTRAINT "pack_question_packId_fkey" FOREIGN KEY ("packId") REFERENCES "pack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pack_question" ADD CONSTRAINT "pack_question_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_option" ADD CONSTRAINT "question_option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
