import { createEnvInstance } from '@org/env';
import * as dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(currentDir, '../../../../../.env') });
const notificationDatabaseUrl = createEnvInstance(process.env).get('NOTIFICATION_DATABASE_URL');

if (!notificationDatabaseUrl) {
    throw new Error('Missing required environment variable: NOTIFICATION_DATABASE_URL');
}

export const datasourceUrl = notificationDatabaseUrl;
