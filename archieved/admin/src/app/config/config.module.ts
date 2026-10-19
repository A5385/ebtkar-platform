import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MICROSERVICE_CLIENT } from '@org/api-shared';
import { AdminConfigPublisherController } from './config.controller.js';
import { AdminConfigPublisherService } from './config.service.js';

@Module({
    imports: [ClientsModule.register([{ ...MICROSERVICE_CLIENT.adminEvents }])],
    controllers: [AdminConfigPublisherController],
    providers: [AdminConfigPublisherService],
    exports: [AdminConfigPublisherService],
})
export class AdminConfigPublisherModule {}
