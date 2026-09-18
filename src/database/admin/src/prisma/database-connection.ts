// packages\database\admin\src\prisma\database-connection.ts
import { createEnvInstance } from '@org/env';
import * as dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: process.env.APP_ENV_FILE || path.resolve(currentDir, '../../../../../.env') });

const adminDatabaseUrl = createEnvInstance(process.env).get('ADMIN_DATABASE_URL');

if (!adminDatabaseUrl) {
    throw new Error('Missing required environment variable: ADMIN_DATABASE_URL');
}

export const datasourceUrl = adminDatabaseUrl;
