//packages\database\admin\src\index.ts
export { AdminPrismaModule } from './prisma/prisma.module.js';
export { AdminPrismaService } from './prisma/prisma.service.js';

export {
    Prisma as AdminPrisma,
    PrismaClient as AdminPrismaClient,
} from './generated/prisma/client.js';

// export type * from "./generated/prisma/client";

export * from './generated/prisma/internal/prismaNamespace.js';
