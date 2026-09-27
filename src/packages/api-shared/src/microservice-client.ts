import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { apiEnv } from './api-env.js';

type MicroserviceType = 'auth' | 'warehouse' | 'messaging' | 'admin' | 'authEvents';

export const MICROSERVICE_CLIENT: Record<MicroserviceType, ClientProviderOptions> = {
    auth: {
        name: 'AUTH_MICROSERVICE',
        transport: Transport.TCP,
        options: {
            host: apiEnv.get('API_AUTH_HOST') || '127.0.0.1',
            port: Number(apiEnv.get('API_AUTH_PORT')) || 4001,
        },
    },
    admin: {
        name: 'ADMIN_MICROSERVICE',
        transport: Transport.TCP,
        options: {
            host: apiEnv.get('API_ADMIN_HOST') || '127.0.0.1',
            port: Number(apiEnv.get('API_ADMIN_PORT')) || 4002,
        },
    },
    messaging: {
        name: 'MESSAGING_MICROSERVICE',
        transport: Transport.TCP,
        options: {
            host: apiEnv.get('API_MESSAGING_HOST') || '127.0.0.1',
            port: Number(apiEnv.get('API_MESSAGING_PORT')) || 4003,
        },
    },
    warehouse: {
        name: 'WAREHOUSE_MICROSERVICE',
        transport: Transport.TCP,
        options: {
            host: apiEnv.get('API_WAREHOUSE_HOST') || '127.0.0.1',
            port: Number(apiEnv.get('API_WAREHOUSE_PORT')) || 5000,
        },
    },
    authEvents: {
        name: 'AUTH_EVENTS',
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: 'api-auth',
                brokers: [
                    `${apiEnv.get('KAFKA_HOST') || '127.0.0.1'}:${apiEnv.get('KAFKA_PORT') || '9092'}`,
                ],
            },
            producerOnlyMode: true,
        },
    },
};
