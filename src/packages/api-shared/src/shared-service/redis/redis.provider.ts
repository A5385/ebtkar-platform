import { Provider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { apiEnv } from '../../api-env.js';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const RedisProvider: Provider = {
    provide: REDIS_CLIENT,
    useFactory: () => {
        return new Redis({
            host: apiEnv.get('REDIS_HOST') || '127.0.0.1',
            port: Number(apiEnv.get('REDIS_PORT')) || 6379,
        });
    },
};
