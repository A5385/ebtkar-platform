import { createEnvInstance } from '@org/env';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

config({
    path: path.resolve(currentDir, '../../../.env'),
});

const connectionString = createEnvInstance(process.env).get('ADMIN_DATABASE_URL');

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const permissions = ['create', 'update', 'delete', 'read'];
const roles = [
    {
        name: 'SUPER_ADMIN',
        isSuperAdmin: true,
    },
    {
        name: 'TENANT',
        isSuperAdmin: false,
    },
];

async function main() {
    try {
        for (const permission of permissions) {
            const existingPermission = await prisma.permission.findFirst({
                where: { name: permission },
            });
            const res =
                existingPermission ??
                (await prisma.permission.create({
                    data: { name: permission },
                }));

            if (res && res.permissionId) console.log(`Permission: ${res.name} added successfully.`);
        }
    } catch (error) {
        console.log(`Error: ${JSON.stringify(error, null, 2)}`);
    }

    try {
        for (const role of roles) {
            const res = await prisma.role.upsert({
                where: { name: role.name },
                update: role,
                create: role,
            });

            if (res && res.roleId) console.log(`Role: ${res.name} added successfully.`);
        }
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
