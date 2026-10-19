import { Injectable, OnModuleInit } from '@nestjs/common';
import { Message } from '@nestjs/microservices/external/kafka.interface.js';
import { AdminConfigService } from '@org/api-shared';
import { EVENT_PATTERN, SOCKET_EVENT } from '@org/constants';
import { startKafkaConsumer } from '@org/infra';
import { SocketGateway } from './socket.gateway';

@Injectable()
export class SocketService implements OnModuleInit {
    constructor(
        private readonly socketGateway: SocketGateway,
        private readonly adminConfig: AdminConfigService,
    ) {}

    async onModuleInit(): Promise<void> {
        await startKafkaConsumer({
            groupId: 'gateway-config',
            topic: EVENT_PATTERN.admin.configUpdated,

            onMessage: async ({ message }) => {
                await this.handleAdminConfigUpdate(message);
            },
        });
    }

    private async handleAdminConfigUpdate(message: Message): Promise<void> {
        if (!message.value) {
            return;
        }

        const payload = JSON.parse(message.value.toString());

        console.log(`[SocketService] Admin config update v${payload.version} (${payload.scope})`);

        await this.adminConfig.loadFromRedis();

        if (payload.scope === 'NETWORK') {
            this.socketGateway.emit(SOCKET_EVENT.admin.networkSettingUpdate, {
                version: payload.version,
                updatedAt: payload.updatedAt,
            });
        }
    }
}
