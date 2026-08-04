// packages\database\auth\src\prisma\prisma.service.ts
import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { datasourceUrl } from "./database-connection";

@Injectable()
export class AuthPrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    if (datasourceUrl) {
      const pool = new PrismaPg({ connectionString: datasourceUrl });
      super({ adapter: pool });
    }
  }

  private readonly logger = new Logger(AuthPrismaService.name);

  async onModuleInit() {
    this.logger.log("Connecting to database...");
    await this.$connect();
    this.logger.log("Database connection established ✅");
  }

  async onModuleDestroy() {
    this.logger.log("Disconnecting from database...");
    await this.$disconnect();
    this.logger.log("Database connection closed ✅");
  }
}
