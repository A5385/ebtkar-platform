import { createEnvInstance } from '@org/env';
import { PrismaPg } from '@prisma/adapter-pg';
import { parse } from 'dotenv';
import { expand } from 'dotenv-expand';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';

import { HttpMethod, PrismaClient } from '../src/generated/prisma/client.js';

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
