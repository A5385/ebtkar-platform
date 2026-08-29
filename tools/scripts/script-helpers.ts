import { promises as fs } from 'node:fs';
import path from 'node:path';

export const workspaceRoot = process.cwd();

export const resolveFromRoot = (...paths: string[]): string =>
    path.resolve(workspaceRoot, ...paths);

export async function pathExists(targetPath: string): Promise<boolean> {
    try {
        await fs.access(targetPath);
        return true;
    } catch {
        return false;
    }
}

export async function directoryExists(directoryPath: string): Promise<boolean> {
    try {
        return (await fs.stat(directoryPath)).isDirectory();
    } catch (error: unknown) {
        if (isNodeError(error) && error.code === 'ENOENT') {
            return false;
        }

        throw error;
    }
}

export async function walkFiles(
    directoryPath: string,
    predicate: (fileName: string) => boolean = () => true,
): Promise<string[]> {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
        const fullPath = path.join(directoryPath, entry.name);

        if (entry.isDirectory()) {
            files.push(...(await walkFiles(fullPath, predicate)));
        } else if (entry.isFile() && predicate(entry.name)) {
            files.push(fullPath);
        }
    }

    return files;
}

export const isTypeScriptFile = (fileName: string): boolean =>
    fileName.endsWith('.ts') && !fileName.endsWith('.d.ts');

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
    return error instanceof Error && 'code' in error;
}
