import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { SharedApiModule } from '@org/api-shared';
import { AdminPrismaModule } from '@org/database-admin';
import { ZodValidationPipe } from 'nestjs-zod';
import { AdminConfigPublisherModule } from './config/config.module.js';
import { AccessModule } from './access/access.module';

@Module({
    imports: [
        AdminPrismaModule,
        SharedApiModule.forRoot({
            appName: 'ADMIN API',
        }),
        AdminConfigPublisherModule,
        AccessModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ZodValidationPipe,
        },
    ],
})
export class AppModule {}
