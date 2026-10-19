import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';
import {
    AccessSettingsDTO,
    GlobalSettingsDTO,
    NetworkSettingsDTO,
    TokenSettingsDTO,
} from '@org/api-dto';
import { MESSAGE_PATTERN } from '@org/constants';
import { AdminConfigPublisherService } from './config.service.js';

@Controller()
export class AdminConfigPublisherController {
    constructor(private readonly config: AdminConfigPublisherService) {}

    @MessagePattern(MESSAGE_PATTERN.admin.config.getSnapshot, Transport.TCP)
    getSnapshot() {
        return this.config.getSnapshot();
    }

    @MessagePattern(MESSAGE_PATTERN.admin.config.sync, Transport.TCP)
    sync() {
        return this.config.syncToRedis('boot', 'ALL');
    }

    @MessagePattern(MESSAGE_PATTERN.admin.config.updateGlobal, Transport.TCP)
    updateGlobal(@Payload() patch: GlobalSettingsDTO) {
        return this.config.updateGlobal(patch);
    }

    @MessagePattern(MESSAGE_PATTERN.admin.config.updateNetwork, Transport.TCP)
    updateNetwork(@Payload() patch: NetworkSettingsDTO) {
        return this.config.updateNetwork(patch);
    }

    @MessagePattern(MESSAGE_PATTERN.admin.config.updateTokens, Transport.TCP)
    updateTokens(@Payload() patch: TokenSettingsDTO) {
        return this.config.updateTokens(patch);
    }

    @MessagePattern(MESSAGE_PATTERN.admin.config.updateAccess, Transport.TCP)
    updateAccess(@Payload() patch: AccessSettingsDTO) {
        return this.config.updateAccess(patch);
    }
}
