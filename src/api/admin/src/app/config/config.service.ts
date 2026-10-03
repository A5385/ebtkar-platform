import { Inject, Injectable, type OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
    AccessSettingsDTO,
    GlobalSettingsDTO,
    NetworkSettingsDTO,
    TokenSettingsDTO,
} from '@org/api-dto';
import {
    AdminConfigClient,
    AdminConfigService,
    MICROSERVICE_CLIENT,
    publishEvent,
    WinstonLoggerService,
    type AdminAccessSettings,
    type AdminConfigSnapshot,
    type AdminGlobalSettings,
    type AdminNetworkSettings,
    type AdminTokensConfig,
} from '@org/api-shared';
import { EVENT_PATTERN } from '@org/constants';
import { AdminPrismaService } from '@org/database-admin';
import { HttpMethod } from '@org/database-admin/prisma';
import type {
    AdminConfigChangeReason,
    AdminConfigScope,
    AdminConfigUpdatedEvent,
} from '@org/types';

@Injectable()
export class AdminConfigPublisherService implements OnModuleInit {
    private readonly moduleName = 'AdminConfig';

    constructor(
        private readonly prisma: AdminPrismaService,
        private readonly redisConfig: AdminConfigClient,
        private readonly localConfig: AdminConfigService,
        private readonly logger: WinstonLoggerService,
        @Inject(MICROSERVICE_CLIENT.adminEvents.name) private readonly events: ClientKafka,
    ) {}

    async onModuleInit() {
        await this.syncToRedis('boot', 'ALL');
    }

    getSnapshot() {
        return this.localConfig.tryGet() ?? this.buildSnapshotFromDb();
    }

    async syncToRedis(reason: AdminConfigChangeReason, scope: AdminConfigScope = 'ALL') {
        const snapshot = await this.buildSnapshotFromDb();
        await this.redisConfig.writeSnapshot(snapshot);
        this.localConfig.hydrate(snapshot);
        await this.notify(snapshot, reason, scope);
        this.logger.log(`Published admin config v${snapshot.version} (${reason})`);
        return snapshot;
    }

    async updateGlobal(patch: GlobalSettingsDTO) {
        await this.prisma.globalSettings.update({
            where: { id: true },
            data: patch,
        });
        return this.commitUpdate('GLOBAL');
    }

    async updateNetwork(patch: NetworkSettingsDTO) {
        await this.prisma.networkSettings.update({
            where: { id: true },
            data: patch,
        });
        return this.commitUpdate('NETWORK');
    }

    async updateTokens(patch: TokenSettingsDTO) {
        await this.prisma.tokensConfig.update({
            where: { id: true },
            data: patch,
        });
        return this.commitUpdate('AUTH');
    }

    async updateAccess(patch: AccessSettingsDTO) {
        await this.prisma.accessSettings.update({
            where: { id: true },
            data: { corsEnabled: patch.corsEnabled },
        });

        return this.commitUpdate('ACCESS');
    }

    async commitUpdate(scope: AdminConfigScope) {
        await this.prisma.configState.upsert({
            where: { id: true },
            create: { id: true, version: 1 },
            update: { version: { increment: 1 } },
        });

        return this.syncToRedis('update', scope);
    }

    private async notify(
        snapshot: AdminConfigSnapshot,
        reason: AdminConfigChangeReason,
        scope: AdminConfigScope,
    ) {
        await this.redisConfig.publishInvalidate(snapshot.version, reason);

        const payload: AdminConfigUpdatedEvent = {
            scope,
            version: snapshot.version,
            updatedAt: snapshot.updatedAt,
            reason,
        };

        await publishEvent<AdminConfigUpdatedEvent>({
            payload,
            client: this.events,
            pattern:
                reason === 'boot'
                    ? EVENT_PATTERN.admin.configSync
                    : EVENT_PATTERN.admin.configUpdated,
            logger: this.logger,
            moduleName: this.moduleName,
        });
    }

    private async buildSnapshotFromDb(): Promise<AdminConfigSnapshot> {
        const [state, global, access, network, tokens, warehouse, invoice] = await Promise.all([
            this.prisma.configState.upsert({
                where: { id: true },
                update: {},
                create: { id: true, version: 1 },
            }),
            this.prisma.globalSettings.findUnique({ where: { id: true } }),
            this.prisma.accessSettings.findUnique({
                where: { id: true },
                include: { origins: true },
            }),
            this.prisma.networkSettings.findUnique({ where: { id: true } }),
            this.prisma.tokensConfig.findUnique({ where: { id: true } }),
            this.prisma.warehouseSettings.findMany({ include: { roles: true } }),
            this.prisma.invoiceSettings.findMany({ include: { roles: true } }),
        ]);

        const globalSettings: AdminGlobalSettings | null = global
            ? {
                  platformName: global.platformName,
                  logo: global.logo,
                  favicon: global.favicon,
                  maintenanceMode: global.maintenanceMode,
                  registrationEnabled: global.registrationEnabled,
                  defaultLocale: global.defaultLocale,
                  defaultTimezone: global.defaultTimezone,
              }
            : null;

        const accessSettings: AdminAccessSettings | null = access
            ? {
                  corsEnabled: access.corsEnabled,
                  origins: access.origins.map((origin) => ({
                      originId: origin.originId,
                      origin: origin.origin,
                      credentials: origin.credentials,
                      methods: origin.methods as HttpMethod[],
                      allowedHeaders: origin.allowedHeaders,
                      exposedHeaders: origin.exposedHeaders,
                      accessSettingsId: true,
                  })),
              }
            : null;

        const networkSettings: AdminNetworkSettings | null = network
            ? {
                  httpClientRetries: network.httpClientRetries,
                  requestTimeoutMs: network.requestTimeoutMs,
              }
            : null;

        const tokensConfig: AdminTokensConfig | null = tokens
            ? {
                  accessTokenExp: tokens.accessTokenExp,
                  refreshTokenExp: tokens.refreshTokenExp,
              }
            : null;

        return {
            version: state.version,
            updatedAt: state.updatedAt.toISOString(),
            global: globalSettings,
            access: accessSettings,
            network: networkSettings,
            tokens: tokensConfig,
            warehouse,
            invoice,
        };
    }
}
