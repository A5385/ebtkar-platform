//src\packages\api-shared\src\shared-service\admin-config\redis-config.client.ts
import { Injectable } from '@nestjs/common';
import { ADMIN_CONFIG_KEYS } from '@org/constants';
import { getCachedData, setCacheData } from '@org/infra';
import type { AdminConfigSnapshot } from './admin-config.interface.js';

@Injectable()
export class AdminConfigClient {
    async getSnapshot(): Promise<AdminConfigSnapshot | null> {
        return getCachedData(ADMIN_CONFIG_KEYS.SNAPSHOT) as Promise<AdminConfigSnapshot | null>;
    }

    async writeSnapshot(snapshot: AdminConfigSnapshot): Promise<void> {
        await Promise.all([
            setCacheData(ADMIN_CONFIG_KEYS.SNAPSHOT, JSON.stringify(snapshot)),
            setCacheData(ADMIN_CONFIG_KEYS.VERSION, JSON.stringify(snapshot.version)),
            setCacheData(ADMIN_CONFIG_KEYS.GLOBAL, JSON.stringify(snapshot.global)),
            setCacheData(ADMIN_CONFIG_KEYS.ACCESS, JSON.stringify(snapshot.access)),
            setCacheData(ADMIN_CONFIG_KEYS.NETWORK, JSON.stringify(snapshot.network)),
            setCacheData(ADMIN_CONFIG_KEYS.AUTH, JSON.stringify(snapshot.tokens)),
            setCacheData(ADMIN_CONFIG_KEYS.WAREHOUSE, JSON.stringify(snapshot.warehouse)),
            setCacheData(ADMIN_CONFIG_KEYS.INVOICE, JSON.stringify(snapshot.invoice)),
        ]);
    }
}
