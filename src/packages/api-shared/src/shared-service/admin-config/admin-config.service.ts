import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import type { AdminConfigUpdatedEvent } from '@org/types';
import { AdminConfigCache } from './admin-config.cache.js';
import type { AdminConfigPublicView, AdminConfigSnapshot } from './admin-config.interface.js';
import { AdminConfigClient } from './redis-config.client.js';

@Injectable()
export class AdminConfigService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(AdminConfigService.name);
    private retryTimer?: ReturnType<typeof setInterval>;

    constructor(
        private readonly cache: AdminConfigCache,
        private readonly client: AdminConfigClient,
    ) {}

    async onModuleInit() {
        await this.loadFromRedis();
        this.retryTimer = setInterval(() => {
            if (this.cache.tryGet()) {
                this.clearRetry();
                return;
            }

            void this.loadFromRedis();
        }, 5000);
    }

    onModuleDestroy() {
        this.clearRetry();
    }

    hydrate(snapshot: AdminConfigSnapshot) {
        this.cache.set(snapshot);
        this.clearRetry();
    }

    async loadFromRedis(): Promise<boolean> {
        const snapshot = await this.client.getSnapshot();

        if (!snapshot) {
            this.logger.warn('Admin config snapshot is not in Redis yet');
            return false;
        }

        this.hydrate(snapshot);
        this.logger.log(`Loaded admin config v${snapshot.version} into local cache`);
        return true;
    }

    async applyRemoteVersion(version: number): Promise<void> {
        if (!this.cache.isNewer(version)) {
            return;
        }

        const loaded = await this.loadFromRedis();

        if (!loaded || (this.cache.tryGet()?.version ?? 0) < version) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            await this.loadFromRedis();
        }
    }

    applyEvent(event: AdminConfigUpdatedEvent): Promise<void> {
        return this.applyRemoteVersion(event.version);
    }

    get(): AdminConfigSnapshot {
        return this.cache.get();
    }

    tryGet(): AdminConfigSnapshot | undefined {
        return this.cache.tryGet();
    }

    getPublic(): AdminConfigPublicView | null {
        const snapshot = this.cache.tryGet();
        const global = snapshot?.global;

        if (!snapshot || !global) {
            return null;
        }

        return {
            version: snapshot.version,
            updatedAt: snapshot.updatedAt,
            platformName: global.platformName,
            logo: global.logo,
            favicon: global.favicon,
            maintenanceMode: global.maintenanceMode,
            registrationEnabled: global.registrationEnabled,
            defaultLocale: global.defaultLocale,
            defaultTimezone: global.defaultTimezone,
        };
    }

    private clearRetry() {
        if (this.retryTimer) {
            clearInterval(this.retryTimer);
            this.retryTimer = undefined;
        }
    }
}
