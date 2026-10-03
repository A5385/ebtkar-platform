//src\api\combine\src\admin\app\admin-app.module.ts
import { Module } from '@nestjs/common';
import { SharedApiModule } from '@org/api-shared';
import { AdminPrismaModule } from '@org/database-admin';
import { AccessModule } from './access/access.module';
import { AdminConfigPublisherModule } from './config/config.module.js';

@Module({
    imports: [
        AdminPrismaModule,
        SharedApiModule.forRoot({
            appName: 'ADMIN API',
        }),
        AdminConfigPublisherModule,
        AccessModule,
    ],
    controllers: [],
})
export class AdminAppModule {}
