//packages\database\auth\src\index.ts
export { WarehousePrismaModule } from "./prisma/prisma.module.js";
export { WarehousePrismaService } from "./prisma/prisma.service.js";

export {
  PrismaClient as WarehousePrismaClient,
  Prisma as WharehousePrisma,
} from "./generated/prisma/client.js";

// export type * from "./generated/prisma/client";

export * from "./generated/prisma/internal/prismaNamespace.js";
