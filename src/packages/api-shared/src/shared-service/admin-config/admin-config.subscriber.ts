import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { ADMIN_CONFIG_CHANNEL } from '@org/constants';
import type { AdminConfigInvalidateMessage } from '@org/types';
import { RedisService } from '../redis/redis.service.js';
import { AdminConfigService } from './admin-config.service.js';

@Injectable()
export class AdminConfigSubscriber implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(AdminConfigSubscriber.name);

    constructor(
        private readonly redis: RedisService,
        private readonly adminConfig: AdminConfigService,
    ) {}

    async onModuleInit() {
        const subscriber = this.redis.getSubscriber();
        await subscriber.subscribe(ADMIN_CONFIG_CHANNEL);
        subscriber.on('message', (channel: string, message: string) => {
            if (channel !== ADMIN_CONFIG_CHANNEL) {
                return;
            }

            void this.onInvalidate(message);
        });
        this.logger.log(`Subscribed to ${ADMIN_CONFIG_CHANNEL}`);
    }

    async onModuleDestroy() {
        await this.redis.getSubscriber().unsubscribe(ADMIN_CONFIG_CHANNEL);
    }

    private async onInvalidate(message: string) {
        try {
            const payload = JSON.parse(message) as AdminConfigInvalidateMessage;
            await this.adminConfig.applyRemoteVersion(payload.version);
        } catch (error) {
            this.logger.error(
                `Failed to apply Redis config invalidate: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }
}
