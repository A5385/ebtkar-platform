import { Module } from '@nestjs/common';
import {
    ClientsModule,
    Transport,
} from '@nestjs/microservices';

import { AuthGatewayController } from './auth-gateway.controller';
import { AuthMicroserviceClient } from './auth-microservice.client';

export const AUTH_SERVICE = Symbol('AUTH_SERVICE');

@Module({
    imports: [
        ClientsModule.register([
            {
                name: AUTH_SERVICE,
                transport: Transport.TCP,
                options: {
                    host:
                        process.env
                            .AUTH_MICROSERVICE_HOST ||
                        '127.0.0.1',

                    port: Number(
                        process.env
                            .AUTH_MICROSERVICE_PORT ||
                            5002,
                    ),
                },
            },
        ]),
    ],
    controllers: [AuthGatewayController],
    providers: [AuthMicroserviceClient],
    exports: [AuthMicroserviceClient],
})
export class AuthClientModule {}