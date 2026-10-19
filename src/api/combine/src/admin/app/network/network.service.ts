// src\api\combine\src\admin\app\network\network.service.ts
import { Injectable } from '@nestjs/common';
import { NetworkSettingsDTO } from '@org/api-dto';
import { ResponseHelperService, WinstonLoggerService } from '@org/api-shared';
import { AdminPrismaService } from '@org/database-admin';
import { AdminConfigPublisherService } from '../config/config.service';

@Injectable()
export class NetworkService {
    constructor(
        private readonly logger: WinstonLoggerService,
        private readonly prisma: AdminPrismaService,
        private readonly apiHandler: ResponseHelperService,
        // private readonly error: ErrorService,
        private readonly adminConfig: AdminConfigPublisherService,
        // private readonly socket: SocketService,
    ) {}

    // private readonly moduleName = 'Admin Network';

    async update(dto: NetworkSettingsDTO) {
        return await this.apiHandler.handle({
            method: 'update',
            successMessage: 'network_settings_update_successfully',
            logger: this.logger,
            fn: async () => {
                const config = await this.prisma.networkSettings.upsert({
                    where: { id: true },
                    create: { ...dto },
                    update: {
                        ...dto,
                    },
                });

                // this.logger.log?.('NETWORK UPSERT SUCCESS');

                await this.adminConfig.commitUpdate('NETWORK');

                this.logger.log?.('NETWORK COMMIT SUCCESS');

                return { ...config };
            },
        });
    }

    async getNetwork() {
        return await this.apiHandler.handle({
            method: 'getById',
            logger: this.logger,
            fn: async () => await this.prisma.networkSettings.findUnique({ where: { id: true } }),
        });
    }
}
