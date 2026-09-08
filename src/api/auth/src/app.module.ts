import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { SharedApiModule } from '@org/api-shared';
import { AuthPrismaModule } from '@org/database-auth';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './auth/app.controller';
import { AppService } from './auth/app.service';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        AuthPrismaModule,
        UserModule,
        SharedApiModule.forRoot({
            appName: 'AUTH API',
        }),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_PIPE,
            useClass: ZodValidationPipe,
        },
    ],
})
export class AppModule {}
