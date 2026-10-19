import { promises as fs } from 'node:fs';
import path from 'node:path';
import { directoryExists, resolveFromRoot, workspaceRoot } from './script-helpers.js';

const schemasRoot = resolveFromRoot('src/packages/schemas/src');

const generatedDirectories = ['inputTypeSchemas', 'modelSchema'];

async function getTypeScriptFiles(directoryPath: string): Promise<string[]> {
    if (!(await directoryExists(directoryPath))) {
        return [];
    }

    const entries = await fs.readdir(directoryPath, {
        withFileTypes: true,
    });

    return entries
        .filter(
            (entry) =>
                entry.isFile() &&
                entry.name.endsWith('.ts') &&
                !entry.name.endsWith('.d.ts') &&
                entry.name !== 'index.ts' &&
                entry.name !== 'schema.ts',
        )
        .map((entry) => entry.name)
        .sort((left, right) => left.localeCompare(right));
}

function toJavaScriptSpecifier(fileName: string): string {
    return fileName.replace(/\.ts$/, '.js');
}

async function generateDatabaseSchemas(databaseName: string): Promise<boolean> {
    const databaseRoot = path.join(schemasRoot, databaseName);
    const generatedRoot = path.join(databaseRoot, 'generated');

    if (!(await directoryExists(generatedRoot))) {
        return false;
    }

    const exportLines = ['// This file is auto-generated. Do not edit manually.', ''];

    for (const generatedDirectory of generatedDirectories) {
        const directoryPath = path.join(generatedRoot, generatedDirectory);

        const files = await getTypeScriptFiles(directoryPath);

        if (files.length === 0) {
            continue;
        }

        exportLines.push(`// ${generatedDirectory}`);

        for (const fileName of files) {
            const moduleSpecifier = toJavaScriptSpecifier(fileName);

            exportLines.push(
                `export * from './generated/${generatedDirectory}/${moduleSpecifier}';`,
            );
        }

        exportLines.push('');
    }

    const schemaPath = path.join(databaseRoot, 'schema.ts');

    await fs.writeFile(schemaPath, `${exportLines.join('\n').trim()}\n`, 'utf8');

    console.log(`Generated: ${path.relative(workspaceRoot, schemaPath)}`);

    return true;
}

async function main(): Promise<void> {
    const entries = await fs.readdir(schemasRoot, {
        withFileTypes: true,
    });

    const databaseNames = entries
        .filter((entry) => entry.isDirectory() && entry.name !== 'node_modules')
        .map((entry) => entry.name)
        .sort((left, right) => left.localeCompare(right));

    const generatedDatabases: string[] = [];

    for (const databaseName of databaseNames) {
        const generated = await generateDatabaseSchemas(databaseName);

        if (generated) {
            generatedDatabases.push(databaseName);
        }
    }

    console.log(`Generated schemas for: ${generatedDatabases.join(', ')}`);
}

main().catch((error: unknown) => {
    console.error('Failed to generate schema barrel files.');
    console.error(error);
    process.exitCode = 1;
});
