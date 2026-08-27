import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, env } from 'prisma/config';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

config({
    path: path.resolve(currentDir, '../../../.env'),
});

export default defineConfig({
    schema: 'prisma/schema.prisma',
    datasource: {
        url: env('WAREHOUSE_DATABASE_URL'),
    },
});
