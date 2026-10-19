// src\api\gateway\src\app\app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ClientsModule } from '@nestjs/microservices';
import { ThrottlerModule } from '@nestjs/throttler';
import { CustomThrottlerGuard, MICROSERVICE_CLIENT, SharedApiModule } from '@org/api-shared';
import { RATE_LIMITS } from '@org/constants';
import { ZodValidationPipe } from 'nestjs-zod';
import { AdminConfigController } from './admin/gateway-admin-config.controller';
import { AdminNetworkController } from './admin/gateway-admin-network.controller';
import { AdminOriginController } from './admin/gateway-origin.controller.js';
import { AuthController } from './auth/auth/gateway-auth.controller';
import { ProfileController } from './auth/profile/gateway-profile.controller';
import { UserController } from './auth/user/gateway-user.controller';
import { NotificationEventsController } from './notification/gateway-notification-events.controller';
import { NotificationGateway } from './notification/gateway-notification.gateway';
import { SocketModule } from './socket/socket..module';
@Module({
    imports: [
        SocketModule,
        ThrottlerModule.forRoot({
            throttlers: [{ ...RATE_LIMITS.default }],
        }),
        SharedApiModule.forRoot({
            appName: 'GATEWAY API',
        }),
        ClientsModule.register([
            { ...MICROSERVICE_CLIENT.combine },
            // { ...MICROSERVICE_CLIENT.auth },
            // { ...MICROSERVICE_CLIENT.warehouse },
            // { ...MICROSERVICE_CLIENT.messaging },
            // { ...MICROSERVICE_CLIENT.admin },
        ]),
    ],
    controllers: [
        AuthController,
        UserController,
        NotificationEventsController,
        ProfileController,
        AdminConfigController,
        AdminOriginController,
        AdminNetworkController,
    ],
    providers: [
        NotificationGateway,
        {
            provide: APP_PIPE,
            useClass: ZodValidationPipe,
        },
        {
            provide: APP_GUARD,
            useClass: CustomThrottlerGuard,
        },
    ],
})
export class AppModule {}
