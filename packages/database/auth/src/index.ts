//packages\database\auth\src\index.ts
export { AuthPrismaModule } from "./prisma/prisma.module";
export { AuthPrismaService } from "./prisma/prisma.service";

export {
  Prisma as AuthPrisma,
  PrismaClient as AuthPrismaClient,
} from "./generated/prisma/client";

// export type * from "./generated/prisma/client";

export * from "./generated/prisma/internal/prismaNamespace";
