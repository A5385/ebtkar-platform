import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ClientsModule } from '@nestjs/microservices';
import { MICROSERVICE_CLIENT, SharedApiModule } from '@org/api-shared';
import { AuthPrismaModule } from '@org/database-auth';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './auth/app.controller';
import { AppService } from './auth/app.service';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        AuthPrismaModule,
        UserModule,
        SharedApiModule.forRoot({
            appName: 'AUTH API',
        }),
        ProfileModule,
        ClientsModule.register([{ ...MICROSERVICE_CLIENT.admin }]),
        AuthModule,
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
