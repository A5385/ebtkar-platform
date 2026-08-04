import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ClientsModule } from '@nestjs/microservices';
import { EnvConfigModule, ErrorModule, HttpExceptionFilter } from '@repo/api-shared';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { MICROSERVICES_CLIENTS } from './constants';
import { RpcToHttpInterceptor } from './rpc-to-http.interceptor';
import { UserController } from './user/user.controller';
import { registerMicroservice } from './utils/register-microservice';
@Module({
    imports: [
        ClientsModule.register([
            registerMicroservice({
                name: MICROSERVICES_CLIENTS.AUTH_SERVICE,
                host: process.env.AUTH_MICROSERVICE_HOST ?? '127.0.0.1',
                port: Number(process.env.AUTH_MICROSERVICE_PORT ?? 5002),
            }),
        ]),
        EnvConfigModule,
        ErrorModule,
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
        // {
        //     provide: APP_FILTER,
        //     useClass: httpFilter,
        // },
    ],
    controllers: [UserController],
})
export class AppModule {}
