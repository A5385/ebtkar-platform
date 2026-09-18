import { createEnvInstance } from '@org/env';
import { config } from 'dotenv';
import { resolve } from 'node:path';

config({
    path: process.env.APP_ENV_FILE || resolve(process.cwd(), '.env'),
});

export const apiEnv = createEnvInstance(process.env);
