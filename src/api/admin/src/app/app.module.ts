import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { SharedApiModule } from '@org/api-shared';
import { AdminPrismaModule } from '@org/database-admin';
import { ZodValidationPipe } from 'nestjs-zod';

@Module({
    imports: [
        AdminPrismaModule,
        SharedApiModule.forRoot({
            appName: 'ADMIN API',
        }),
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
