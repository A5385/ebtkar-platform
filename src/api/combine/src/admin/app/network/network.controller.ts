// src\api\combine\src\admin\app\network\network.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NetworkSettingsDTO } from '@org/api-dto';
import { MESSAGE_PATTERN } from '@org/constants';
import { NetworkService } from './network.service';

@Controller()
export class NetworkController {
    constructor(private readonly networkService: NetworkService) {}

    @MessagePattern(MESSAGE_PATTERN.admin.config.updateNetwork)
    async update(@Payload() dto: NetworkSettingsDTO) {
        return await this.networkService.update(dto);
    }

    @MessagePattern(MESSAGE_PATTERN.admin.config.getNetworkSetting)
    async getNetwork() {
        return await this.networkService.getNetwork();
    }
}
