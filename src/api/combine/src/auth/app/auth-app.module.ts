// src\api\combine\src\auth\app\auth-app.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MICROSERVICE_CLIENT, SharedApiModule } from '@org/api-shared';
import { AuthPrismaModule } from '@org/database-auth';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';

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
    controllers: [],
})
export class AuthAppModule {}
