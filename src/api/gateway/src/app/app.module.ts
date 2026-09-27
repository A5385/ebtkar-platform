import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ClientsModule } from '@nestjs/microservices';
import { MICROSERVICE_CLIENT, SharedApiModule } from '@org/api-shared';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth/auth.controller';
import { ProfileController } from './auth/profile/profile.controller';
import { UserController } from './auth/user/user.controller';
import { NotificationEventsController } from './notification/notification-events.controller';
import { NotificationGateway } from './notification/notification.gateway';

@Module({
    imports: [
        SharedApiModule.forRoot({
            appName: 'GATEWAY API',
        }),
        ClientsModule.register([
            { ...MICROSERVICE_CLIENT.auth },
            { ...MICROSERVICE_CLIENT.warehouse },
            { ...MICROSERVICE_CLIENT.messaging },
            { ...MICROSERVICE_CLIENT.admin },
        ]),
    ],
    controllers: [
        AppController,
        AuthController,
        UserController,
        NotificationEventsController,
        ProfileController,
    ],
    providers: [
        AppService,
        NotificationGateway,
        {
            provide: APP_PIPE,
            useClass: ZodValidationPipe,
        },
    ],
})
export class AppModule {}
