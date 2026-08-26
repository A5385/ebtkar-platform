import { promises as fs } from 'node:fs';
import path from 'node:path';

const workspaceRoot = process.cwd();
const databasesRoot = path.join(workspaceRoot, 'database');
const schemasRoot = path.join(workspaceRoot, 'packages', 'schemas', 'src');

async function pathExists(targetPath) {
    try {
        await fs.access(targetPath);
        return true;
    } catch {
        return false;
    }
}

async function walk(directoryPath) {
    const entries = await fs.readdir(directoryPath, {
        withFileTypes: true,
    });

    const files = [];

    for (const entry of entries) {
        const fullPath = path.join(directoryPath, entry.name);

        if (entry.isDirectory()) {
            files.push(...(await walk(fullPath)));
            continue;
        }

        if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
            files.push(fullPath);
        }
    }

    return files;
}

async function discoverDatabases() {
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

        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

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

function replacePrismaImports(source, packageName) {
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

function addJavaScriptExtensions(source) {
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

async function fixDatabase(database) {
    const files = await walk(database.generatedSchemasPath);

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

async function main() {
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

main().catch((error) => {
    console.error('Failed to fix generated schema imports.');
    console.error(error);
    process.exitCode = 1;
});
