export const envKeys = [
    'NODE_ENV',
    'ORIGIN',
    // API Gateway
    'API_GATEWAY_HOST',
    'API_GATEWAY_PREFIX',
    'API_GATEWAY_PORT',
    'API_GATEWAY_URL',

    // Auth microservice
    'API_AUTH_HOST',
    'API_AUTH_PORT',
    'API_AUTH_URL',

    // Messaging microservice
    'API_MESSAGING_HOST',
    'API_MESSAGING_PORT',

    // Warehouse microservice
    'API_WAREHOUSE_HOST',
    'API_WAREHOUSE_PORT',
    'API_WAREHOUSE_URL',

    // Shared Web API
    'API_URL',

    // Auth Web
    'AUTH_HOST',
    'AUTH_PORT',
    'AUTH_PREFIX',
    'AUTH_URL',

    // Admin Web
    'ADMIN_HOST',
    'ADMIN_PORT',
    'ADMIN_URL',

    // Warehouse Web
    'WAREHOUSE_HOST',
    'WAREHOUSE_PORT',
    'WAREHOUSE_PREFIX',
    'WAREHOUSE_URL',

    // database,
    'NOTIFICATION_DATABASE_URL',
    'AUTH_DATABASE_URL',
    'WAREHOUSE_DATABASE_URL',

    // Tokens
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
    'ACCESS_TOKEN_EXPIRES',
    'REFRESH_TOKEN_EXPIRES',

    // Kafka
    'KAFKA_HOST',
    'KAFKA_PORT',

    // Email delivery
    'MAIL_HOST',
    'MAIL_PORT',
    'MAIL_SECURE',
    'MAIL_USER',
    'MAIL_PASSWORD',
    'MAIL_FROM',

    // Redis
    'REDIS_HOST',
    'REDIS_PORT',
] as const;

export type EnvKey = (typeof envKeys)[number];

export type EnvSource = Record<string, string | undefined>;

export interface Env {
    get(key: EnvKey): string | undefined;
}

export function createEnvInstance(source: EnvSource): Env {
    const resolveValue = (key: EnvKey, visited = new Set<string>()): string | undefined => {
        const value = source[key];
        if (value === undefined || visited.has(key)) return value;

        visited.add(key);
        return value.replace(/\$\{([A-Z0-9_]+)\}/g, (match, dependency: string) => {
            const dependencyValue = source[dependency];
            if (dependencyValue === undefined) return match;

            if (envKeys.includes(dependency as EnvKey)) {
                return resolveValue(dependency as EnvKey, visited) ?? '';
            }

            return dependencyValue;
        });
    };

    return {
        get(key) {
            return resolveValue(key);
        },
    };
}
