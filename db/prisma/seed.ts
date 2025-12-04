import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { prisma } from "../client";

// Explicitly load root .env to ensure consistent behavior regardless of CWD
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Should be ablet to use env() later on https://github.com/prisma/prisma/issues/12535// Should be ablet to use env() later on https://github.com/prisma/prisma/issues/12535
config({ path: resolve(__dirname, "../../.env") });

async function main() {
  console.log("🌱 Starting seed...");

  // Sample Koans
  const koan1 = await prisma.koan.create({
    data: {
      text: 'A monk asked Joshu, "Has a dog Buddha-nature or not?"\n\nJoshu answered, "Mu."',
      source: "The Gateless Gate",
      author: "Joshu",
    },
  });

  const koan2 = await prisma.koan.create({
    data: {
      text: 'Two monks were arguing about a flag. One said, "The flag is moving."\n\nThe other said, "The wind is moving."\n\nThe sixth patriarch happened to be passing by. He told them, "Not the wind, not the flag; mind is moving."',
      source: "The Gateless Gate",
      author: "Huineng",
    },
  });

  const koan3 = await prisma.koan.create({
    data: {
      text: 'A student asked Yunmen, "What is the Buddha?"\n\nYunmen answered, "A dried shit-stick."',
      source: "The Blue Cliff Record",
      author: "Yunmen",
    },
  });

  const koan4 = await prisma.koan.create({
    data: {
      text: 'Nan-in, a Japanese master during the Meiji era, received a university professor who came to inquire about Zen.\n\nNan-in served tea. He poured his visitor\'s cup full, and then kept on pouring.\n\nThe professor watched the overflow until he no longer could restrain himself. "It is overfull. No more will go in!"\n\n"Like this cup," Nan-in said, "you are full of your own opinions and speculations. How can I show you Zen unless you first empty your cup?"',
      source: "101 Zen Stories",
      author: "Nan-in",
    },
  });

  const koan5 = await prisma.koan.create({
    data: {
      text: "Before enlightenment, chop wood, carry water.\n\nAfter enlightenment, chop wood, carry water.",
      source: "Zen Proverb",
      author: "Unknown",
    },
  });

  console.log("✅ Created 5 koans");

  // Sample Comments for Koan 1
  const comment1 = await prisma.comment.create({
    data: {
      text: 'The word "Mu" means "no" or "nothing," but it\'s not a simple negation. It points beyond yes and no.',
      author: "user_123",
      koanId: koan1.id,
      votes: { up: 15, down: 2 },
    },
  });

  const reply1 = await prisma.comment.create({
    data: {
      text: "Exactly! It's a response that transcends dualistic thinking.",
      author: "user_456",
      koanId: koan1.id,
      parentId: comment1.id,
      votes: { up: 8, down: 0 },
    },
  });

  await prisma.comment.create({
    data: {
      text: "I've been meditating on this for months. Still don't get it.",
      author: "user_789",
      koanId: koan1.id,
      parentId: comment1.id,
      votes: { up: 5, down: 1 },
    },
  });

  // Sample Comments for Koan 2
  const comment2 = await prisma.comment.create({
    data: {
      text: "This koan beautifully illustrates how our perception shapes reality.",
      author: "user_321",
      koanId: koan2.id,
      votes: { up: 12, down: 1 },
    },
  });

  await prisma.comment.create({
    data: {
      text: "The flag, wind, and mind are all interconnected. Nothing exists independently.",
      author: "user_654",
      koanId: koan2.id,
      parentId: comment2.id,
      votes: { up: 7, down: 0 },
    },
  });

  // Sample Comments for Koan 3
  await prisma.comment.create({
    data: {
      text: "Yunmen's response is shocking but profound. It breaks our conceptual understanding of what Buddha is.",
      author: "user_987",
      koanId: koan3.id,
      votes: { up: 10, down: 3 },
    },
  });

  // Sample Comments for Koan 4
  await prisma.comment.create({
    data: {
      text: "This is one of my favorites. It reminds me to approach learning with humility.",
      author: "user_111",
      koanId: koan4.id,
      votes: { up: 20, down: 0 },
    },
  });

  const reply2 = await prisma.comment.create({
    data: {
      text: "Same here! I think about this whenever I feel stuck in my practice.",
      author: "user_222",
      koanId: koan4.id,
      parentId: comment2.id,
      votes: { up: 6, down: 0 },
    },
  });

  // Sample Comments for Koan 5
  await prisma.comment.create({
    data: {
      text: "Enlightenment doesn't change what you do, it changes how you do it.",
      author: "user_333",
      koanId: koan5.id,
      votes: { up: 18, down: 1 },
    },
  });

  console.log("✅ Created sample comments");
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
