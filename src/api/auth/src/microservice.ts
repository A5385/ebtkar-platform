import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { apiEnv } from '@org/api-shared';

type MicroserviceType = 'authEvents';
const transport = Transport.KAFKA;

export const MICROSERVICE_CLIENT: Record<MicroserviceType, ClientProviderOptions> = {
    authEvents: {
        name: 'AUTH_EVENTS',
        transport,
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
