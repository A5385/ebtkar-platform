export const ADMIN_CONFIG_KEYS = {
    SNAPSHOT: 'admin:config:snapshot',
    VERSION: 'admin:config:version',
    GLOBAL: 'admin:config:global',
    ACCESS: 'admin:config:access',
    NETWORK: 'admin:config:network',
    AUTH: 'admin:config:auth',
    WAREHOUSE: 'admin:config:warehouse',
    INVOICE: 'admin:config:invoice',
} as const;

export const ADMIN_CONFIG_CHANNEL = 'admin:config:invalidate';
