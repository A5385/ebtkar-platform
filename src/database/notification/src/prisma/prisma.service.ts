import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { datasourceUrl } from './database-connection.js';

@Injectable()
export class NotificationPrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(NotificationPrismaService.name);

    constructor() {
        super({ adapter: new PrismaPg({ connectionString: datasourceUrl }) });
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Notification database connected');
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
