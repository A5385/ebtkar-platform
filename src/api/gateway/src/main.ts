import { Logger } from '@nestjs/common';
import { CorsOptionsDelegate } from '@nestjs/common/internal';
import { NestFactory } from '@nestjs/core';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AdminConfigService, apiEnv, RpcHttpExceptionFilter } from '@org/api-shared';
import { RequestKeys } from '@org/constants';
import cookieParser from 'cookie-parser';
import type { Request } from 'express';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const adminService = app.get(AdminConfigService);

    await adminService.loadFromRedis();
    const access = adminService.tryGet()?.access;
    console.log('🚀 >  bootstrap >  access:', access);

    const corsOptionsDelegate: CorsOptionsDelegate<Request> = (req, callback) => {
        const requestOrigin = req.headers.origin;

        const originConfig = access?.origins.find(
            (config) => config.credentials && config.origin === requestOrigin,
        );

        console.log('matched config:', originConfig);

        if (!requestOrigin || !originConfig) {
            return callback(null, {
                origin: false,
            });
        }

        return callback(null, {
            origin: requestOrigin,
            credentials: originConfig.credentials ?? true,
            methods: originConfig.methods,
            allowedHeaders: [
                ...(originConfig.allowedHeaders ?? []),
                RequestKeys.apiKey,
                RequestKeys.deviceKey,
            ],
        });
    };

    const brokers = [
        `${apiEnv.get('KAFKA_HOST') || '127.0.0.1'}:${apiEnv.get('KAFKA_PORT') || '9092'}`,
    ];

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: 'api-gateway-notifications',
                brokers,
            },
            consumer: {
                groupId: 'api-gateway-notifications-v1',
            },
        },
    });

    const globalPrefix = apiEnv.get('API_GATEWAY_PREFIX') || '';
    const port = apiEnv.get('API_GATEWAY_PORT') || 4000;
    const host = apiEnv.get('API_GATEWAY_HOST') || '';

    app.enableCors(corsOptionsDelegate);

    app.use(cookieParser());

    app.setGlobalPrefix(globalPrefix);

    const uploadsPath = join(process.cwd(), 'uploads');

    app.use(
        `/${globalPrefix}/uploads`,
        express.static(uploadsPath, {
            index: false,
            fallthrough: false,
            redirect: false,
        }),
    );

    app.useGlobalFilters(new RpcHttpExceptionFilter());

    await app.startAllMicroservices();
    await app.listen(port);

    Logger.log(`🚀 API Gateway is running on: ${host}:${port}/${globalPrefix}`);
}

bootstrap();
