import { apiEnv, bootstrapHybridMicroservice } from '@org/api-shared';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const port = Number(apiEnv.get('API_ADMIN_PORT')) || 4002;
    const host = apiEnv.get('API_ADMIN_HOST') || '127.0.0.1';

    await bootstrapHybridMicroservice({
        appName: 'Admin microservice',
        module: AppModule,
        tcp: { host, port },
        kafka: { clientId: 'api-admin-consumer', groupId: 'api-admin-v1' },
    });
}

void bootstrap();
