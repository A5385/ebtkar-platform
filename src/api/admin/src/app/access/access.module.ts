import { Module } from '@nestjs/common';
import { AdminPrismaModule } from '@org/database-admin';
import { AdminConfigPublisherModule } from '../config/config.module.js';
import { OriginController } from './access.controller.js';
import { OriginService } from './access.service.js';

@Module({
    imports: [AdminPrismaModule, AdminConfigPublisherModule],
    controllers: [OriginController],
    providers: [OriginService],
})
export class AccessModule {}
