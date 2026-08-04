import { Logger } from '@nestjs/common';
import { generateMainConfig } from '@repo/api-shared';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';

dotenv.config();

async function bootstrap(): Promise<void> {
    await generateMainConfig(AppModule, {});
}

void bootstrap().catch((error: unknown) => {
    Logger.error(
        'Error starting the application',
        error instanceof Error ? error.stack : String(error),
    );

    process.exit(1);
});
