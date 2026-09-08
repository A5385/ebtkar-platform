// packages\database\auth\src\prisma\database-connection.ts
import * as dotenv from 'dotenv';
import { createEnvInstance } from '@org/env';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(currentDir, '../../../../../.env') });

const warehouseDatabaseUrl = createEnvInstance(process.env).get('WAREHOUSE_DATABASE_URL');

if (!warehouseDatabaseUrl) {
    throw new Error('Missing required environment variable: WAREHOUSE_DATABASE_URL');
}

export const datasourceUrl = warehouseDatabaseUrl;
