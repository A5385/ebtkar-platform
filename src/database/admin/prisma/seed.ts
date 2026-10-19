import { createEnvInstance } from '@org/env';
import { PrismaPg } from '@prisma/adapter-pg';
import { parse } from 'dotenv';
import { expand } from 'dotenv-expand';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';

import { HttpMethod, PrismaClient, RateLimit } from '../src/generated/prisma/client.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const envPath = path.resolve(currentDir, '../../../../.env');

const parsedEnv = parse(readFileSync(envPath));

const expandedEnv = expand({
    parsed: parsedEnv,
    processEnv: {},
}).parsed;

const env = {
    ...process.env,
    ...expandedEnv,
};

const connectionString = createEnvInstance(env).get('ADMIN_DATABASE_URL');

const pool = new Pool({
    connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
});

const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'DELETE', 'OPTIONS'];

const allowedHeaders: string[] = [
    'Accept',
    'Authorization',
    'Content-Type',
    'X-Requested-With',
    'X-From-Mobile-App',
];

const origins = (env.ORIGIN ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

// console.log('🚀 > origins:', origins);
const minutes = (value = 1) => value * 60 * 1000;

export const RATE_LIMITS: Omit<RateLimit, 'rateLimitId' | 'updatedAt' | 'createdAt'>[] = [
    {
        name: 'default',
        ttl: minutes(),
        limit: 100,
        networkSettingId: true,
    },
    {
        name: 'login',
        ttl: minutes(),
        limit: 5,
        networkSettingId: true,
    },
    {
        name: 'otpAndPswReset',
        ttl: minutes(5),
        limit: 5,
        networkSettingId: true,
    },
    {
        name: 'reports',
        ttl: minutes(),
        limit: 20,
        networkSettingId: true,
    },
    { name: 'fileUpload', ttl: minutes(), limit: 10, networkSettingId: true },
];

async function main() {
    await Promise.all([
        prisma.configState.upsert({
            where: { id: true },
            update: {},
            create: { id: true },
        }),

        prisma.globalSettings.upsert({
            where: { id: true },
            update: {},
            create: { id: true },
        }),

        prisma.accessSettings.upsert({
            where: { id: true },
            update: {},
            create: { id: true },
        }),

        prisma.networkSettings.upsert({
            where: { id: true },
            update: {},
            create: { id: true },
        }),

        prisma.tokensConfig.upsert({
            where: { id: true },
            update: {},
            create: { id: true },
        }),
        ...RATE_LIMITS.map(({ name, ...rate }) =>
            prisma.rateLimit.upsert({
                where: { name },
                update: { ...rate },
                create: { name, ...rate },
            }),
        ),

        ...origins.map((origin) =>
            prisma.origin.upsert({
                where: {
                    origin,
                },
                update: {
                    credentials: true,
                    methods,
                    allowedHeaders,
                    accessSettingsId: true,
                },
                create: {
                    accessSettingsId: true,
                    origin,
                    credentials: true,
                    methods,
                    allowedHeaders,
                },
            }),
        ),
    ]);

    console.log('Admin configuration seeded successfully.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
        await pool.end();
    })
    .catch(async (error) => {
        console.error('Admin seed failed:', error);

        await prisma.$disconnect();
        await pool.end();

        process.exit(1);
    });
