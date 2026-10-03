// shared.module.ts
import { DynamicModule, Global, Module } from '@nestjs/common';

import { APP_NAME, SharedApiOptions } from './shared-api.constants.js';

import { createKeyv } from '@keyv/redis';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { apiEnv } from '../api-env.js';
import { AdminConfigModule } from './admin-config/admin-config.module.js';
import { ErrorService } from './error/error.service.js';
import { WinstonLoggerService } from './logger/logger.service.js';
import { RedisModule } from './redis/redis.module.js';
import { ResponseHelperService } from './response-handler/response-helper.service.js';

@Global()
@Module({})
export class SharedApiModule {
    static forRoot(options: SharedApiOptions): DynamicModule {
        return {
            imports: [
                RedisModule,
                AdminConfigModule,
                CacheModule.registerAsync({
                    useFactory: async () => {
                        const host = apiEnv.get('REDIS_HOST') || '127.0.0.1';
                        const port = apiEnv.get('REDIS_PORT') || '6379';

                        return {
                            stores: [createKeyv(`redis://${host}:${port}`)],
                            ttl: 60 * 1000,
                        };
                    },
                    isGlobal: true,
                }),
            ],
            module: SharedApiModule,
            providers: [
                {
                    provide: APP_NAME,
                    useValue: options.appName,
                },
                {
                    provide: APP_INTERCEPTOR,
                    useClass: CacheInterceptor,
                },
                WinstonLoggerService,
                ResponseHelperService,
                ErrorService,
            ],
            exports: [
                WinstonLoggerService,
                ResponseHelperService,
                ErrorService,
                RedisModule,
                AdminConfigModule,
            ],
        };
    }
}
