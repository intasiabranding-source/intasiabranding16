import { PrismaClient } from "@prisma/client";


const url = process.env.DATABASE_URL ?? "";
const masked = url.replace(/:([^:@]+)@/, ":****@");

async function main() {
  console.log("DATABASE_URL (masked):", masked || "(not set)");

  if (!url || url.includes("localhost:5432")) {
    console.error("\nERROR: .env still points to localhost or DATABASE_URL is missing.");
    console.error("Fix: Save .env in project root with your Neon connection string.");
    process.exit(1);
  }

  if (!url.includes("sslmode=require") && url.includes("neon.tech")) {
    console.warn("\nWARN: Neon URLs should include ?sslmode=require");
  }

  const prisma = new PrismaClient(); 

  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("\nOK: Database connection successful.");
  } catch (e) {
    console.error("\nFAILED:", e instanceof Error ? e.message : e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
