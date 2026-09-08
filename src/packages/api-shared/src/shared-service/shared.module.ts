// shared.module.ts
import { DynamicModule, Global, Module } from '@nestjs/common';

import { APP_NAME, SharedApiOptions } from './shared-api.constants.js';

import { createKeyv } from '@keyv/redis';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorService } from './error/error.service.js';
import { WinstonLoggerService } from './logger/logger.service.js';
import { ResponseHelperService } from './response-handler/response-helper.service.js';

@Global()
@Module({})
export class SharedApiModule {
    static forRoot(options: SharedApiOptions): DynamicModule {
        return {
            imports: [
                CacheModule.registerAsync({
                    useFactory: async () => ({
                        stores: [createKeyv('redis://localhost:6379')],
                        ttl: 60 * 1000,
                    }),
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
            exports: [WinstonLoggerService, ResponseHelperService, ErrorService],
        };
    }
}
