export const envKeys = [
    'API_GATEWAY_HOST',
    'API_GATEWAY_PORT',

    'API_AUTH_HOST',
    'API_AUTH_PORT',

    'API_WAREHOUSE_HOST',
    'API_WAREHOUSE_PORT',

    'AUTH_HOST',
    'AUTH_PORT',

    'WAREHOUSE_HOST',
    'WAREHOUSE_PORT',

    'AUTH_DATABASE_URL',
    'WAREHOUSE_DATABASE_URL',

    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
    'ACCESS_TOKEN_EXPIRES',
    'REFRESH_TOKEN_EXPIRES',

    'KAFKA_HOST',
    'KAFKA_PORT',

    'REDIS_HOST',
    'REDIS_PORT',
] as const;

export type EnvKey = (typeof envKeys)[number];

export type Env = Partial<Record<EnvKey, string>>;

export const getEnv = (env: Record<string, string | undefined>): Env => env;
