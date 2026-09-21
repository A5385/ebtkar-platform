import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ClientsModule } from '@nestjs/microservices';
import { SharedApiModule } from '@org/api-shared';
import { ZodValidationPipe } from 'nestjs-zod';
import { MICROSERVICE_CLIENT } from '../microservice';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth/auth.controller';
import { UserController } from './auth/user/user.controller';
import { NotificationEventsController } from './notification/notification-events.controller';
import { NotificationGateway } from './notification/notification.gateway';
import { ProfileController } from './auth/profile/profile.controller';

@Module({
    imports: [
        SharedApiModule.forRoot({
            appName: 'GATEWAY API',
        }),
        ClientsModule.register([
            { ...MICROSERVICE_CLIENT.auth },
            { ...MICROSERVICE_CLIENT.warehouse },
            { ...MICROSERVICE_CLIENT.messaging },
        ]),
    ],
    controllers: [AppController, AuthController, UserController, NotificationEventsController, ProfileController],
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
