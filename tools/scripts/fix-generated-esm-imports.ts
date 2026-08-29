import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathExists, resolveFromRoot, walkFiles, workspaceRoot } from './script-helpers.js';

const databasesRoot = resolveFromRoot('src/database');
const schemasRoot = resolveFromRoot('src/packages/schemas/src');

interface Database {
    name: string;
    packageName: string;
    generatedSchemasPath: string;
}

async function discoverDatabases(): Promise<Database[]> {
    const entries = await fs.readdir(databasesRoot, {
        withFileTypes: true,
    });

    const databases = [];

    for (const entry of entries) {
        if (!entry.isDirectory()) {
            continue;
        }

        const databaseName = entry.name;
        const packageJsonPath = path.join(databasesRoot, databaseName, 'package.json');

        const generatedSchemasPath = path.join(schemasRoot, databaseName, 'generated');

        if (!(await pathExists(packageJsonPath)) || !(await pathExists(generatedSchemasPath))) {
            continue;
        }

        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8')) as {
            name?: string;
        };

        if (!packageJson.name) {
            console.warn(`Skipped ${databaseName}: package.json has no package name.`);
            continue;
        }

        databases.push({
            name: databaseName,
            packageName: packageJson.name,
            generatedSchemasPath,
        });
    }

    return databases.sort((left, right) => left.name.localeCompare(right.name));
}

function replacePrismaImports(source: string, packageName: string): string {
    return source.replace(
        /(['"])([^'"]*generated\/prisma\/(?:client|internal\/prismaNamespace))(?:\.js)?\1/g,
        (match, quote, importPath) => {
            if (importPath.endsWith('/internal/prismaNamespace')) {
                return `${quote}${packageName}/prisma-namespace${quote}`;
            }

            if (importPath.endsWith('/client')) {
                return `${quote}${packageName}/prisma${quote}`;
            }

            return match;
        },
    );
}

function addJavaScriptExtensions(source: string): string {
    return source.replace(
        /((?:from\s+|import\s*\(\s*)['"])(\.\.?\/[^'"]+)(['"])/g,
        (match, prefix, specifier, suffix) => {
            const hasExtension = /\.(?:js|mjs|cjs|json|node)$/.test(specifier);

            if (hasExtension) {
                return match;
            }

            return `${prefix}${specifier}.js${suffix}`;
        },
    );
}

async function fixDatabase(database: Database): Promise<void> {
    const files = await walkFiles(
        database.generatedSchemasPath,
        (fileName) => fileName.endsWith('.ts') && !fileName.endsWith('.d.ts'),
    );

    let fixedFilesCount = 0;

    for (const filePath of files) {
        const original = await fs.readFile(filePath, 'utf8');

        let updated = replacePrismaImports(original, database.packageName);

        updated = addJavaScriptExtensions(updated);

        if (updated === original) {
            continue;
        }

        await fs.writeFile(filePath, updated, 'utf8');
        fixedFilesCount += 1;

        console.log(`Fixed: ${path.relative(workspaceRoot, filePath)}`);
    }

    console.log(`${database.name}: ${fixedFilesCount} file(s) updated.`);
}

async function main(): Promise<void> {
    const databases = await discoverDatabases();

    if (databases.length === 0) {
        console.warn('No generated database schemas were found.');
        return;
    }

    for (const database of databases) {
        console.log(`Processing ${database.name} → ${database.packageName}`);

        await fixDatabase(database);
    }
}

main().catch((error: unknown) => {
    console.error('Failed to fix generated schema imports.');
    console.error(error);
    process.exitCode = 1;
});
