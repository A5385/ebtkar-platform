export type AdminConfigScope = 'ALL' | 'GLOBAL' | 'ACCESS' | 'NETWORK' | 'AUTH' | 'WAREHOUSE' | 'INVOICE';

export type AdminConfigChangeReason = 'boot' | 'update';

export interface AdminConfigUpdatedEvent {
    scope: AdminConfigScope;
    version: number;
    updatedAt: string;
    reason: AdminConfigChangeReason;
}

export interface AdminConfigInvalidateMessage {
    version: number;
    reason: AdminConfigChangeReason;
}
