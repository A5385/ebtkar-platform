import { Module } from '@nestjs/common';
import { AdminConfigModule } from '@org/api-shared';
import { AdminConfigPublisherService } from '../config/config.service';
import { NetworkController } from './network.controller';
import { NetworkService } from './network.service';

@Module({
    imports: [AdminConfigModule],
    controllers: [NetworkController],
    providers: [NetworkService, AdminConfigPublisherService],
})
export class NetworkModule {}
