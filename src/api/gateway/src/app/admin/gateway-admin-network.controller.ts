// src\api\gateway\src\app\admin\gateway-admin-network.controller.ts
import { Body, Controller, Get, Inject, Patch } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NetworkSettingsDTO } from '@org/api-dto';
import { MICROSERVICE_CLIENT } from '@org/api-shared';
import { MESSAGE_PATTERN } from '@org/constants';

@Controller('admin-network')
export class AdminNetworkController {
    constructor(
        @Inject(MICROSERVICE_CLIENT.combine.name)
        private readonly adminService: ClientProxy,
    ) {}

    @Get('get-network')
    getNetworkSettings() {
        return this.adminService.send(MESSAGE_PATTERN.admin.config.getNetworkSetting, {});
    }

    @Patch('update-network')
    updateNetworkSettings(@Body() dto: NetworkSettingsDTO) {
        return this.adminService.send(MESSAGE_PATTERN.admin.config.updateNetwork, dto);
    }
}
