// src\api\combine\src\app.module.ts
import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AdminAppModule } from './admin/app/admin-app.module';
import { AuthAppModule } from './auth/app/auth-app.module';
import { MessagingAppModule } from './messaging/app/messaging-app.module';

@Module({
    imports: [AuthAppModule, AdminAppModule, MessagingAppModule],
    controllers: [],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ZodValidationPipe,
        },
    ],
})
export class AppModule {}
