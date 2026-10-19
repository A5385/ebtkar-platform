import { Module } from '@nestjs/common';
import { AdminPrismaModule } from '@org/database-admin';
import { AdminConfigPublisherModule } from '../config/config.module.js';
import { OriginController } from './origin.controller.js';
import { OriginService } from './origin.service.js';

@Module({
    imports: [AdminPrismaModule, AdminConfigPublisherModule],
    controllers: [OriginController],
    providers: [OriginService],
})
export class AccessModule {}
