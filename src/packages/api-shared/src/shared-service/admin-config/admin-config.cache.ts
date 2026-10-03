import { Injectable } from '@nestjs/common';
import { AdminConfigSnapshot } from './admin-config.interface.js';

@Injectable()
export class AdminConfigCache {
    private snapshot?: AdminConfigSnapshot;

    set(snapshot: AdminConfigSnapshot) {
        this.snapshot = snapshot;
    }

    tryGet(): AdminConfigSnapshot | undefined {
        return this.snapshot;
    }

    get(): AdminConfigSnapshot {
        if (!this.snapshot) {
            throw new Error('Admin configuration not loaded');
        }

        return this.snapshot;
    }

    isNewer(version: number): boolean {
        return !this.snapshot || version > this.snapshot.version;
    }

    clear() {
        this.snapshot = undefined;
    }
}
