import { Logger, type Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
import { apiEnv } from './api-env.js';
import { MicroserviceExceptionFilter } from './filters/rpc-exception.filter.js';

export interface HybridMicroserviceOptions {
    appName: string;
    module: Type<unknown>;
    tcp: {
        host: string;
        port: number;
    };
    kafka: {
        clientId: string;
        groupId: string;
    };
}

export async function bootstrapHybridMicroservice({
    appName,
    module,
    tcp,
    kafka,
}: HybridMicroserviceOptions): Promise<void> {
    const brokers = [
        `${apiEnv.get('KAFKA_HOST') || '127.0.0.1'}:${apiEnv.get('KAFKA_PORT') || '9092'}`,
    ];
    const app = await NestFactory.create(module);

    app.connectMicroservice<MicroserviceOptions>(
        {
            transport: Transport.TCP,
            options: tcp,
        },
        { inheritAppConfig: true },
    );
    app.connectMicroservice<MicroserviceOptions>(
        {
            transport: Transport.KAFKA,
            options: {
                client: { clientId: kafka.clientId, brokers },
                consumer: { groupId: kafka.groupId },
            },
        },
        { inheritAppConfig: true },
    );

    app.useGlobalFilters(new MicroserviceExceptionFilter());
    app.enableShutdownHooks();
    await app.init();
    await app.startAllMicroservices();
    Logger.log(`${appName} listening on Kafka and TCP ${tcp.host}:${tcp.port}`);
}
