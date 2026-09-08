import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { apiEnv } from '@org/api-shared';

type MicroserviceType = 'auth' | 'warehouse' | 'messaging';
const transport = Transport.TCP;

export const MICROSERVICE_CLIENT: Record<MicroserviceType, ClientProviderOptions> = {
    auth: {
        name: 'AUTH_MICROSERVICE',
        transport,
        options: {
            host: apiEnv.get('API_AUTH_HOST') || '127.0.0.1',
            port: Number(apiEnv.get('API_AUTH_PORT')) || 4001,
        },
    },
    warehouse: {
        name: 'WAREHOUSE_MICROSERVICE',
        transport,
        options: {
            host: apiEnv.get('API_WAREHOUSE_HOST') || '127.0.0.1',
            port: Number(apiEnv.get('API_WAREHOUSE_PORT')) || 4002,
        },
    },
    messaging: {
        name: 'MESSAGING_MICROSERVICE',
        transport,
        options: {
            host: apiEnv.get('API_MESSAGING_HOST') || '127.0.0.1',
            port: Number(apiEnv.get('API_MESSAGING_PORT')) || 4003,
        },
    },
};
