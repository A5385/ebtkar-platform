// src\api\combine\src\main.ts
import { apiEnv, bootstrapHybridMicroservice } from '@org/api-shared';
import { AppModule } from './app.module';

async function bootstrap() {
    const port = Number(apiEnv.get('API_COMBINE_PORT')) || 4001;
    const host = apiEnv.get('API_COMBINE_HOST') || '127.0.0.1';

    await bootstrapHybridMicroservice({
        appName: 'Combine microservice',
        module: AppModule,
        tcp: { host, port },
        kafka: { clientId: 'api-combine-consumer', groupId: 'api-combine-v1' },
    });
}

void bootstrap();
