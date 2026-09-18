//packages\database\admin\src\prisma\prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { AdminPrismaService } from './prisma.service.js';

@Global()
@Module({
    providers: [AdminPrismaService],
    exports: [AdminPrismaService],
})
export class AdminPrismaModule {}
