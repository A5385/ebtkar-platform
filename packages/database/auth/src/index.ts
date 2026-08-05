//packages\database\auth\src\index.ts
export { AuthPrismaModule } from "./prisma/prisma.module.js";
export { AuthPrismaService } from "./prisma/prisma.service.js";

export {
  Prisma as AuthPrisma,
  PrismaClient as AuthPrismaClient,
} from "./generated/prisma/client.js";

// export type * from "./generated/prisma/client";

export * from "./generated/prisma/internal/prismaNamespace.js";
