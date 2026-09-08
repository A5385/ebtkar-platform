import { apiEnv, bootstrapHybridMicroservice } from '@org/api-shared';
import { AppModule } from './app.module';

async function bootstrap() {
    const port = Number(apiEnv.get('API_AUTH_PORT')) || 4001;
    const host = apiEnv.get('API_AUTH_HOST') || '127.0.0.1';

    await bootstrapHybridMicroservice({
        appName: 'Auth microservice',
        module: AppModule,
        tcp: { host, port },
        kafka: { clientId: 'api-auth-consumer', groupId: 'api-auth-v1' },
    });
}

void bootstrap();
