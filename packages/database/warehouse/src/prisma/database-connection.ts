// packages\database\auth\src\prisma\database-connection.ts
import * as dotenv from "dotenv";
dotenv.config();

export const datasourceUrl = process.env.DATABASE_URL;
