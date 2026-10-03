import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module.js';
import { AdminConfigCache } from './admin-config.cache.js';
import { AdminConfigEventsController } from './admin-config.events.controller.js';
import { AdminConfigService } from './admin-config.service.js';
import { AdminConfigSubscriber } from './admin-config.subscriber.js';
import { AdminConfigClient } from './redis-config.client.js';

@Module({
    imports: [RedisModule],
    controllers: [AdminConfigEventsController],
    providers: [AdminConfigService, AdminConfigCache, AdminConfigClient, AdminConfigSubscriber],
    exports: [AdminConfigService, AdminConfigCache, AdminConfigClient],
})
export class AdminConfigModule {}
