import { promises as fs } from 'node:fs';
import path from 'node:path';
import { isTypeScriptFile, resolveFromRoot, walkFiles, workspaceRoot } from './script-helpers.js';

const gatewayPath = resolveFromRoot('src/api/gateway/src/app');
const endpointPath = resolveFromRoot('src/packages/types/src/endpoint.ts');
const controllerPattern = /@Controller\(\s*(?:['"]([^'"]*)['"])?\s*\)/;
const routePattern =
    /@(Get|Post|Put|Patch|Delete|Options|Head|All)\(\s*(?:['"]([^'"]*)['"])?\s*\)/g;

function joinRoute(controllerPath = '', routePath = ''): string {
    const route = [controllerPath, routePath]
        .map((part) => part.replace(/^\/+|\/+$/g, ''))
        .filter(Boolean)
        .join('/');

    return route || '/';
}

function toEndpointType(route: string): string {
    if (!route.includes(':')) {
        return `'${route}'`;
    }

    const parameterizedRoute = route.replace(/:[^/]+/g, '${string}');
    return `\`${parameterizedRoute}\``;
}

async function discoverEndpoints(): Promise<string[]> {
    const controllerFiles = (await walkFiles(gatewayPath, isTypeScriptFile))
        .filter((filePath) => filePath.endsWith('.controller.ts'))
        .sort((left, right) => left.localeCompare(right));
    const endpoints = new Set<string>();

    for (const controllerFile of controllerFiles) {
        const source = await fs.readFile(controllerFile, 'utf8');
        const controllerMatch = controllerPattern.exec(source);

        if (!controllerMatch) {
            console.warn(
                `Skipped controller without @Controller(): ${path.relative(workspaceRoot, controllerFile)}`,
            );
            continue;
        }

        for (const routeMatch of source.matchAll(routePattern)) {
            endpoints.add(joinRoute(controllerMatch[1], routeMatch[2]));
        }
    }

    return [...endpoints].sort((left, right) => left.localeCompare(right));
}

async function main(): Promise<void> {
    const endpoints = await discoverEndpoints();

    if (endpoints.length === 0) {
        throw new Error(`No endpoints found in ${path.relative(workspaceRoot, gatewayPath)}.`);
    }

    const output = [
        '// This file is auto-generated. Do not edit manually.',
        '',
        'export type EndpointType =',
        ...endpoints.map((endpoint) => `    | ${toEndpointType(endpoint)}`),
        ';',
        '',
    ].join('\n');

    await fs.writeFile(endpointPath, output, 'utf8');
    console.log(`Generated: ${path.relative(workspaceRoot, endpointPath)}`);
}

main().catch((error: unknown) => {
    console.error('Failed to generate endpoint types.');
    console.error(error);
    process.exitCode = 1;
});
