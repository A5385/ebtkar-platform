import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@repo/auth-database'; // Import client from shared package
import * as dotenv from 'dotenv';
dotenv.config();

const datasourceUrl = process.env.DATABASE_URL;
console.log('🚀 >  datasourceUrl:', datasourceUrl);

if (!datasourceUrl) {
    console.error('DATABASE_URL is not set in the environment variables. ');
    process.exit(1);
}

const adapter = new PrismaPg({ connectionString: datasourceUrl });

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    // Expose the client instance for queries
    public client = new PrismaClient({ adapter });

    async onModuleInit() {
        await this.client.$connect();
    }

    async onModuleDestroy() {
        await this.client.$disconnect();
    }
}
