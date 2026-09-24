import { checkDatabaseConnection, prisma } from "../services/prisma.service";

async function main() {
  try {
    await checkDatabaseConnection();
    console.log("✅ Connected to PostgreSQL successfully.");
  } catch (error) {
    console.error("❌ Could not connect to PostgreSQL. Check DATABASE_URL in .env.");
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
