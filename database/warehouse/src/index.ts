//packages\database\auth\src\index.ts
export { WarehousePrismaModule } from './prisma/prisma.module.js';
export { WarehousePrismaService } from './prisma/prisma.service.js';

export {
    Prisma as WarehousePrisma,
    PrismaClient as WarehousePrismaClient,
} from './generated/prisma/client.js';

// export type * from "./generated/prisma/client";

export * from './generated/prisma/internal/prismaNamespace.js';
