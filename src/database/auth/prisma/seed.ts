import { createEnvInstance } from '@org/env';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from 'dotenv';
import { hash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';
import { Prisma, PrismaClient } from '../src/generated/prisma/client.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

config({
    path: path.resolve(currentDir, '../../../.env'),
});

const connectionString = createEnvInstance(process.env).get('AUTH_DATABASE_URL');

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const superAdmin = {
        email: 'ahmed.5aled1985@gmail.com',
        role: 'SUPER_ADMIN',
        password: hash('sha256', 'Ebt@123456789'),
        isVerified: new Date(),
    } satisfies Prisma.UserCreateInput;

    try {
        const res = await prisma.user.upsert({
            where: { email: superAdmin.email },
            update: superAdmin,
            create: superAdmin,
        });

        if (res && res.userId) console.log(`User: ${res.email} added successfully.`);
    } catch (error) {
        console.log(`Error: ${JSON.stringify(error, null, 2)}`);
    }
}
main()
    .then(async () => {
        await prisma.$disconnect();
        await pool.end();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        await pool.end();
        process.exit(1);
    });
