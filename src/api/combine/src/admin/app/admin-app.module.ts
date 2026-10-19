//src\api\combine\src\admin\app\admin-app.module.ts
import { Module } from '@nestjs/common';
import { SharedApiModule } from '@org/api-shared';
import { AdminPrismaModule } from '@org/database-admin';
import { AdminConfigPublisherModule } from './config/config.module.js';
import { InvoiceModule } from './invoice/invoice.module';
import { NetworkModule } from './network/network.module';
import { AccessModule } from './origin/origin.module';
import { WarehouseModule } from './warehouse/warehouse.module';

@Module({
    imports: [
        AdminPrismaModule,
        SharedApiModule.forRoot({
            appName: 'ADMIN API',
        }),
        AdminConfigPublisherModule,
        AccessModule,
        NetworkModule,
        WarehouseModule,
        InvoiceModule,
    ],
    controllers: [],
})
export class AdminAppModule {}
