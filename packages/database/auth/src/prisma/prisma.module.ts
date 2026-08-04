//packages\database\auth\src\prisma\prisma.module.ts
import { Global, Module } from "@nestjs/common";
import { AuthPrismaService } from "./prisma.service";

@Global()
@Module({
  providers: [AuthPrismaService],
  exports: [AuthPrismaService],
})
export class AuthPrismaModule {}
