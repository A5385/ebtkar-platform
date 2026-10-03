import { Injectable } from '@nestjs/common';
import { ADMIN_CONFIG_CHANNEL, ADMIN_CONFIG_KEYS } from '@org/constants';
import type { AdminConfigChangeReason, AdminConfigInvalidateMessage } from '@org/types';
import { RedisService } from '../redis/redis.service.js';
import { AdminConfigSnapshot } from './admin-config.interface.js';

@Injectable()
export class AdminConfigClient {
    constructor(private readonly redis: RedisService) {}

    async getSnapshot(): Promise<AdminConfigSnapshot | null> {
        return this.redis.get<AdminConfigSnapshot>(ADMIN_CONFIG_KEYS.SNAPSHOT);
    }

    async writeSnapshot(snapshot: AdminConfigSnapshot): Promise<void> {
        await Promise.all([
            this.redis.set(ADMIN_CONFIG_KEYS.SNAPSHOT, snapshot),
            this.redis.set(ADMIN_CONFIG_KEYS.VERSION, snapshot.version),
            this.redis.set(ADMIN_CONFIG_KEYS.GLOBAL, snapshot.global),
            this.redis.set(ADMIN_CONFIG_KEYS.ACCESS, snapshot.access),
            this.redis.set(ADMIN_CONFIG_KEYS.NETWORK, snapshot.network),
            this.redis.set(ADMIN_CONFIG_KEYS.AUTH, snapshot.tokens),
            this.redis.set(ADMIN_CONFIG_KEYS.WAREHOUSE, snapshot.warehouse),
            this.redis.set(ADMIN_CONFIG_KEYS.INVOICE, snapshot.invoice),
        ]);
    }

    async publishInvalidate(version: number, reason: AdminConfigChangeReason): Promise<void> {
        const message: AdminConfigInvalidateMessage = { version, reason };
        await this.redis.publish(ADMIN_CONFIG_CHANNEL, JSON.stringify(message));
    }
}
