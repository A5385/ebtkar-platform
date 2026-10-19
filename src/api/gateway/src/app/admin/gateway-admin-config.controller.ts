import { Body, Controller, Inject, Patch } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GlobalSettingsDTO, TokenSettingsDTO } from '@org/api-dto';
import { MICROSERVICE_CLIENT } from '@org/api-shared';
import { MESSAGE_PATTERN } from '@org/constants';

@Controller('admin-config')
export class AdminConfigController {
    constructor(
        @Inject(MICROSERVICE_CLIENT.combine.name)
        private readonly adminService: ClientProxy,
    ) {}

    @Patch('global-settings')
    updateGlobalSettings(@Body() dto: GlobalSettingsDTO) {
        return this.adminService.send(MESSAGE_PATTERN.admin.config.updateGlobal, dto);
    }

    @Patch('token-settings')
    updateTokenSettings(@Body() dto: TokenSettingsDTO) {
        return this.adminService.send(MESSAGE_PATTERN.admin.config.updateTokens, dto);
    }
}
