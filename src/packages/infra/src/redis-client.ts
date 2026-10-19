// src/packages/infra/src/redis-client.ts

import { createEnvInstance } from '@org/env';
import { Redis } from 'ioredis';

const env = createEnvInstance(process.env);

export const redis = new Redis({
    host: env.get('REDIS_HOST') ?? '127.0.0.1',
    port: Number(env.get('REDIS_PORT') ?? 6379),

    connectTimeout: 10_000,
    enableReadyCheck: true,
    lazyConnect: true,

    retryStrategy(times: number) {
        return Math.min(times * 500, 5000);
    },

    maxRetriesPerRequest: 3,
});

redis.on('connect', () => {
    console.info('Redis connecting');
});

redis.on('ready', () => {
    console.info('Redis ready');
});

redis.on('error', (error: Error) => {
    console.error('Redis connection error:', error.message);
});

redis.on('close', () => {
    console.warn('Redis connection closed');
});

export async function getCachedData<T = unknown>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? (JSON.parse(data) as T) : null;
}

export async function setCacheData(key: string, value: string): Promise<'OK' | null> {
    return redis.set(key, value);
}
