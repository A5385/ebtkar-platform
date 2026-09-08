// packages\database\auth\src\prisma\database-connection.ts
import * as dotenv from 'dotenv';
import { createEnvInstance } from '@org/env';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(currentDir, '../../../../../.env') });

const authDatabaseUrl = createEnvInstance(process.env).get('AUTH_DATABASE_URL');

if (!authDatabaseUrl) {
    throw new Error('Missing required environment variable: AUTH_DATABASE_URL');
}

export const datasourceUrl = authDatabaseUrl;

