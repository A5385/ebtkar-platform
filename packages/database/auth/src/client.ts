import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const datasourceUrl = process.env.DATABASE_URL;

if (!datasourceUrl) {
  console.error("DATABASE_URL is not set in the environment variables.");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: datasourceUrl });

export const prismaClient = new PrismaClient({ adapter });
