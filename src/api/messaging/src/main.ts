import { apiEnv, bootstrapHybridMicroservice } from '@org/api-shared';
import { AppModule } from './app.module.js';

async function bootstrap() {
    const host = apiEnv.get('API_MESSAGING_HOST') || '127.0.0.1';
    const port = Number(apiEnv.get('API_MESSAGING_PORT')) || 4003;
    await bootstrapHybridMicroservice({
        appName: 'Messaging microservice',
        module: AppModule,
        tcp: { host, port },
        kafka: { clientId: 'api-messaging', groupId: 'api-messaging-v1' },
    });
}

void bootstrap();
