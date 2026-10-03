import { EVENT_PATTERN } from '@org/constants';

export const ADMIN_CONFIG_EVENTS = {
    UPDATED: EVENT_PATTERN.admin.configUpdated,
    SYNC: EVENT_PATTERN.admin.configSync,
} as const;
