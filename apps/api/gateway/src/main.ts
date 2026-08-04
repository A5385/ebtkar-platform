import { Logger } from '@nestjs/common';

import { generateMainConfig } from '@repo/api-shared';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
    await generateMainConfig(AppModule, { isMicroservice: false });
}

void bootstrap().catch((error: unknown) => {
    Logger.error(
        'Error starting the application',
        error instanceof Error ? error.stack : String(error),
    );

    process.exit(1);
});
