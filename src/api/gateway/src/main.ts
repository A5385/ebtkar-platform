/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
import { apiEnv, RpcHttpExceptionFilter } from '@org/api-shared';
import { RequestKeys } from '@org/constants';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app/app.module';

const origin = [...(apiEnv.get('ORIGIN') || '').split(',').map((value) => value.trim())].filter(
    Boolean,
);
console.log('🚀 >  origin:', origin);

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const brokers = [
        `${apiEnv.get('KAFKA_HOST') || '127.0.0.1'}:${apiEnv.get('KAFKA_PORT') || '9092'}`,
    ];
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.KAFKA,
        options: {
            client: { clientId: 'api-gateway-notifications', brokers },
            consumer: { groupId: 'api-gateway-notifications-v1' },
        },
    });

    const globalPrefix = apiEnv.get('API_GATEWAY_PREFIX') || '';
    const port = apiEnv.get('API_GATEWAY_PORT') || 4000;
    const host = apiEnv.get('API_GATEWAY_HOST') || '';

    app.use(cookieParser());
    app.enableCors({
        origin,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Accept',
            'Authorization',
            'Content-Type',
            'X-Requested-With',
            'X-From-Mobile-App',
            RequestKeys.apiKey,
            RequestKeys.deviceKey,
            // LANG_KEY,
            // API_KEY,
            // DEVICE_KEY,
        ],
    });

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
