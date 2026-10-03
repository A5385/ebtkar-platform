import { Inject, Injectable, type OnModuleDestroy } from '@nestjs/common';
import type { Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis.provider.js';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private subscriber?: Redis;

    constructor(
        @Inject(REDIS_CLIENT)
        private readonly redis: Redis,
    ) {}

    async set<T>(key: string, value: T): Promise<void> {
        await this.redis.set(key, JSON.stringify(value));
    }

    async get<T>(key: string): Promise<T | null> {
        const value = await this.redis.get(key);

        if (!value) return null;

        return JSON.parse(value) as T;
    }

    async del(key: string) {
        await this.redis.del(key);
    }

    async publish(channel: string, message: string): Promise<void> {
        await this.redis.publish(channel, message);
    }

    getSubscriber(): Redis {
        if (!this.subscriber) {
            this.subscriber = this.redis.duplicate();
        }

        return this.subscriber;
    }

    async onModuleDestroy() {
        await this.subscriber?.quit();
        await this.redis.quit();
    }
}
