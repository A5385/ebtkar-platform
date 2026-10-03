import { Module } from '@nestjs/common';
import { RedisProvider } from './redis.provider.js';
import { RedisService } from './redis.service.js';

@Module({
    providers: [RedisProvider, RedisService],
    exports: [RedisService],
})
export class RedisModule {}
