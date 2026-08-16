//packages\database\auth\src\prisma\prisma.module.ts
import { Global, Module } from "@nestjs/common";
import { WarehousePrismaService } from "./prisma.service";

@Global()
@Module({
  providers: [WarehousePrismaService],
  exports: [WarehousePrismaService],
})
export class WarehousePrismaModule {}
