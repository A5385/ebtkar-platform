import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createEnvInstance } from '@org/env';
import { defineConfig } from 'prisma/config';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

config({
    path: path.resolve(currentDir, '../../../.env'),
});
const databaseUrl = createEnvInstance(process.env).get('AUTH_DATABASE_URL');

if (!databaseUrl) {
    throw new Error('Missing required environment variable: AUTH_DATABASE_URL');
}

export default defineConfig({
    schema: 'prisma/schema.prisma',
    datasource: {
        url: databaseUrl,
    },
});
