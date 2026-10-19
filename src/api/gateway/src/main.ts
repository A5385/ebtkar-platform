import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AdminConfigService, apiEnv, RpcHttpExceptionFilter } from '@org/api-shared';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app/app.module';
import { createCorsOptionsDelegate } from './helpers/cors-options';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const adminService = app.get(AdminConfigService);

    await adminService.loadFromRedis();

    const corsOptionsDelegate = createCorsOptionsDelegate(adminService);

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
