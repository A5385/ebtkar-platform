import { createEnvInstance } from '@org/env';
import { config } from 'dotenv';
import { resolve } from 'node:path';

config({
    path: resolve(process.cwd(), '.env'),
});

export const apiEnv = createEnvInstance(process.env);
