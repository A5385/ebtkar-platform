import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';

dotenv.config();

function normalizePrefix(value: string): string {
    return String(value ?? '').replace(/^\/+|\/+$/g, '');
}

const allowedOrigins = new Set<string>(['*']);

const prefix = process.env.SERVER_PREFIX || 'auth/api';
const port = Number(process.env.PORT || 4002);

const microserviceHost = process.env.AUTH_MICROSERVICE_HOST || '127.0.0.1';

const microservicePort = Number(process.env.AUTH_MICROSERVICE_PORT || 5002);

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.use(cookieParser());

    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.has('*') || allowedOrigins.has(origin)) {
                return callback(null, true);
            }

            return callback(new Error(`CORS blocked for origin: ${origin}`), false);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Accept',
            'Authorization',
            'Content-Type',
            'X-Requested-With',
            'X-From-Mobile-App',
        ],
    });

    app.setGlobalPrefix(normalizePrefix(prefix));

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.TCP,
        options: {
            host: microserviceHost,
            port: microservicePort,
        },
    });

    await app.startAllMicroservices();
    await app.listen(port);

    Logger.log(`Auth HTTP: http://localhost:${port}/${normalizePrefix(prefix)}`);

    Logger.log(`Auth TCP: ${microserviceHost}:${microservicePort}`);
}

void bootstrap().catch((error: unknown) => {
    Logger.error(
        'Error starting the application',
        error instanceof Error ? error.stack : String(error),
    );

    process.exit(1);
});
