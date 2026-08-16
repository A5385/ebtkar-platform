import { startBootStrap } from '@repo/api-shared';
import { AppModule } from './app/app.module';

void startBootStrap(AppModule, { isMicroservice: false });
