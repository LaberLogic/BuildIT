import { seedDatabase } from "./seed";

async function main() {
  try {
    await seedDatabase();
    console.log("Database seeded successfully.");
  } catch (err) {
    console.error("Failed to seed database:", err);
  }
}

await main();
