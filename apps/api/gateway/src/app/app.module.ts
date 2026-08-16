import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ClientsModule } from '@nestjs/microservices';
import { HttpExceptionFilter } from '@repo/api-shared';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { MICROSERVICES_CLIENTS } from '../utils/constants';
import { registerMicroservice } from '../utils/register-microservice';
import { RpcToHttpInterceptor } from '../utils/rpc-to-http.interceptor';
import { AppController } from './app.controller';
import { UserController } from './auth-service/user.-gatewaucontroller';
@Module({
    imports: [
        ClientsModule.register([
            registerMicroservice({
                name: MICROSERVICES_CLIENTS.AUTH_SERVICE,
                host: process.env.AUTH_MICROSERVICE_HOST ?? '127.0.0.1',
                port: Number(process.env.AUTH_MICROSERVICE_PORT ?? 5002),
            }),
            registerMicroservice({
                name: MICROSERVICES_CLIENTS.WAREHOUSE_SERVICE,
                host: process.env.WAREHOUSE_MICROSERVICE_HOST ?? '127.0.0.1',
                port: Number(process.env.WAREHOUSE_MICROSERVICE_PORT ?? 5002),
            }),
        ]),
    ],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ZodValidationPipe,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ZodSerializerInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: RpcToHttpInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
    controllers: [UserController, AppController],
})
export class AppModule {}
