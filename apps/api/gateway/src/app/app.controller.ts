import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MSM_PATTERN } from '@repo/api-shared';
import { MICROSERVICES_CLIENTS } from '../utils/constants';

@Controller()
export class AppController {
    constructor(
        @Inject(MICROSERVICES_CLIENTS.AUTH_SERVICE)
        private readonly authService: ClientProxy,

        @Inject(MICROSERVICES_CLIENTS.WAREHOUSE_SERVICE)
        private readonly warehouseService: ClientProxy,
    ) {}

    @Get('welcome')
    welcome() {
        return 'Welcome to ebtkar gateway !';
    }

    @Get('welcome-auth')
    welcomeAuth() {
        return this.authService.send(MSM_PATTERN['auth-service'].welcome, {});
    }

    @Get('welcome-warehouse')
    welcomeWarehouse() {
        return this.warehouseService.send(MSM_PATTERN['warehouse-service'].welcome, {});
    }
}
