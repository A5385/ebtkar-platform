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
                entry.name !== 'index.ts',
        )
        .map((entry) => entry.name)
        .sort((left, right) => left.localeCompare(right));
}

function toJavaScriptSpecifier(fileName: string): string {
    return fileName.replace(/\.ts$/, '.js');
}

async function generateDatabaseIndex(databaseName: string): Promise<boolean> {
    const databaseRoot = path.join(schemasRoot, databaseName);
    const generatedRoot = path.join(databaseRoot, 'generated');

    if (!(await directoryExists(generatedRoot))) {
        return false;
    }

    const exportLines = [`// This file is auto-generated. Do not edit manually.`, ''];

    const inputsRoot = path.join(databaseRoot, 'inputs');
    const responseRoot = path.join(databaseRoot, 'response');

    if (await directoryExists(inputsRoot)) {
        exportLines.push(`// Custom input schemas`);
        exportLines.push(`export * from './inputs/index.js';`, '');
    }
    if (await directoryExists(responseRoot)) {
        exportLines.push(`// Custom response type`);
        exportLines.push(`export * from './response/index.js';`, '');
    }

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

    const indexPath = path.join(databaseRoot, 'index.ts');

    await fs.writeFile(indexPath, `${exportLines.join('\n').trim()}\n`, 'utf8');

    console.log(`Generated: ${path.relative(workspaceRoot, indexPath)}`);

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

    const generatedDatabases = [];

    for (const databaseName of databaseNames) {
        const generated = await generateDatabaseIndex(databaseName);

        if (generated) {
            generatedDatabases.push(databaseName);
        }
    }

    const rootIndexLines = [
        `// This file is auto-generated. Do not edit manually.`,
        '',
        ...generatedDatabases.map(
            (databaseName) => `export * as ${databaseName} from './${databaseName}/index.js';`,
        ),
        '',
    ];

    const rootIndexPath = path.join(schemasRoot, 'index.ts');

    await fs.writeFile(rootIndexPath, rootIndexLines.join('\n'), 'utf8');

    console.log(`Generated: ${path.relative(workspaceRoot, rootIndexPath)}`);
}

main().catch((error: unknown) => {
    console.error('Failed to generate schema barrel files.');
    console.error(error);
    process.exitCode = 1;
});
