import { prisma } from "../src/common/db/db.js";

async function main() {
  // 1. Create packs
  const varanasi = await prisma.pack.upsert({
    where: { slug: "varanasi" },
    update: {},
    create: {
      name: "Varanasi",
      slug: "varanasi",
      description: "Explore the river ecosystems of Varanasi.",
      location: "Varanasi",
      isPublished: true,
    },
  });

  const mountain = await prisma.pack.upsert({
    where: { slug: "mountain" },
    update: {},
    create: {
      name: "Mountain",
      slug: "mountain",
      description: "Explore mountain ecosystems.",
      location: "Himalayas",
      isPublished: true,
    },
  });

  // 2. Create terrains
  const terrainData = [
    { id: "river", name: "River", slug: "river" },
    { id: "forest", name: "Forest", slug: "forest" },
    { id: "mountain", name: "Mountain", slug: "mountain" },
    { id: "grassland", name: "Grassland", slug: "grassland" },
  ];

  for (const terrain of terrainData) {
    await prisma.terrain.upsert({
      where: { slug: terrain.slug },
      update: {},
      create: terrain,
    });
  }

  // 3. Associate terrains with packs
  const river = await prisma.terrain.findUniqueOrThrow({
    where: { slug: "river" },
  });

  const forest = await prisma.terrain.findUniqueOrThrow({
    where: { slug: "forest" },
  });

  const mountainTerrain = await prisma.terrain.findUniqueOrThrow({
    where: { slug: "mountain" },
  });

  const grassland = await prisma.terrain.findUniqueOrThrow({
    where: { slug: "grassland" },
  });

  const packTerrains = [
    { packId: varanasi.id, terrainId: river.id },
    { packId: varanasi.id, terrainId: forest.id },
    { packId: varanasi.id, terrainId: grassland.id },
    { packId: mountain.id, terrainId: mountainTerrain.id },
    { packId: mountain.id, terrainId: forest.id },
    { packId: mountain.id, terrainId: grassland.id },
  ];

  for (const relation of packTerrains) {
    await prisma.packTerrain.upsert({
      where: {
        packId_terrainId: relation,
      },
      update: {},
      create: relation,
    });
  }

  // 4. Create questions
  const questions = [
    {
      id: "question-001",
      text: "Why can the same kind of plant look different in different habitats?",
      terrainId: forest.id,
      type: "MULTIPLE_CHOICE" as const,
      points: 10,
      options: [
        { id: "option-001", text: "Different environmental conditions", isCorrect: true },
        { id: "option-002", text: "Someone painted it", isCorrect: false },
        { id: "option-003", text: "Plants never change", isCorrect: false },
      ],
    },
    {
      id: "question-002",
      text: "What is one important role of rivers in an ecosystem?",
      terrainId: river.id,
      type: "MULTIPLE_CHOICE" as const,
      points: 10,
      options: [
        { id: "option-004", text: "Providing water and habitats", isCorrect: true },
        { id: "option-005", text: "Creating deserts", isCorrect: false },
        { id: "option-006", text: "Stopping plant growth", isCorrect: false },
      ],
    },
    {
      id: "question-003",
      text: "How does altitude affect mountain vegetation?",
      terrainId: mountainTerrain.id,
      type: "MULTIPLE_CHOICE" as const,
      points: 10,
      options: [
        { id: "option-007", text: "It can change temperature and growing conditions", isCorrect: true },
        { id: "option-008", text: "It has no effect", isCorrect: false },
        { id: "option-009", text: "It makes all plants identical", isCorrect: false },
      ],
    },
  ];

  for (const question of questions) {
    const { options, ...questionData } = question;

    await prisma.question.upsert({
      where: { id: question.id },
      update: {},
      create: {
        ...questionData,
        isPublished: true,
        options: {
          create: options,
        },
      },
    });
  }

  // 5. Associate questions with packs
  const packQuestions = [
    { packId: varanasi.id, questionId: "question-001", sortOrder: 1 },
    { packId: mountain.id, questionId: "question-001", sortOrder: 1 },
    { packId: varanasi.id, questionId: "question-002", sortOrder: 2 },
    { packId: mountain.id, questionId: "question-003", sortOrder: 2 },
  ];

  for (const relation of packQuestions) {
    await prisma.packQuestion.upsert({
      where: {
        packId_questionId: {
          packId: relation.packId,
          questionId: relation.questionId,
        },
      },
      update: {
        sortOrder: relation.sortOrder,
      },
      create: relation,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });