const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { readEnv } = require('./env.cjs');
const root = path.resolve(__dirname, '../..');
const nxManifest = require(path.join(root, 'node_modules/nx/package.json'));
const nxBin = path.resolve(root, 'node_modules/nx', nxManifest.bin.nx);
const apps = {
    'api-gateway': { dir: 'src/api/gateway', port: 'API_GATEWAY_PORT' },
    'api-auth': { dir: 'src/api/auth', port: 'API_AUTH_PORT' },
    'api-messaging': { dir: 'src/api/messaging', port: 'API_MESSAGING_PORT' },
    admin: { dir: 'src/web/admin', project: '@org/admin', web: true, port: 'ADMIN_PORT' },
    auth: { dir: 'src/web/auth', project: '@org/auth', web: true, port: 'AUTH_PORT' },
};
function run(command, args, options = {}) {
    const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', ...options });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`${path.basename(command)} failed (${result.status})`);
}
function copy(from, to) {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.cpSync(from, to, { recursive: true });
}
function packages() {
    return ['api', 'web', 'packages', 'database'].flatMap((group) =>
        fs.readdirSync(path.join(root, 'src', group)).flatMap((name) => {
            const dir = `src/${group}/${name}`;
            const file = path.join(root, dir, 'package.json');
            return fs.existsSync(file)
                ? [{ dir, manifest: JSON.parse(fs.readFileSync(file, 'utf8')) }]
                : [];
        }),
    );
}
function quote(value) {
    return "'" + value.replace(/'/g, "'\\''") + "'";
}

function main() {
    const [action, requested = action === 'dev' ? 'api-gateway' : 'all', ...flags] =
        process.argv.slice(2);
    if (!['dev', 'build', 'dev:build'].includes(action))
        throw new Error('Use dev, build, or dev:build [app|all] [--local] [--package-only]');
    if (flags.some((flag) => !['--local', '--package-only'].includes(flag)))
        throw new Error('Unknown option');
    if (action === 'dev:build' && flags.includes('--local'))
        throw new Error('Deploy always uses .env.development');
    const names = requested === 'all' ? Object.keys(apps) : [requested];
    if (names.some((name) => !apps[name]))
        throw new Error(`Choose: ${Object.keys(apps).join(', ')}, all`);
    if (action === 'dev' && requested === 'all')
        throw new Error('Choose one app for dev; e.g. pnpm dev api-gateway');
    const ssh = 'ssh';
    const scp = 'scp';
    for (const name of names) {
        const app = apps[name];
        const profile =
            action === 'build'
                ? 'production'
                : action === 'dev' && (!app.web || flags.includes('--local'))
                  ? 'local'
                  : 'development';
        const envFile = path.join(root, `.env.${profile}`);
        if (!fs.existsSync(envFile))
            throw new Error(
                `Create ${path.basename(envFile)} from tools/deployment/env/${profile}.example first`,
            );
        const env = {
            ...readEnv(envFile),
            APP_ENV_FILE: envFile,
            NX_DAEMON: 'false',
            NX_LOAD_DOT_ENV_FILES: 'false',
            NODE_ENV: action === 'dev' ? 'development' : 'production',
        };
        if (
            Object.values(env).some(
                (value) => typeof value === 'string' && value.includes('CHANGE_ME'),
            )
        )
            throw new Error(`Complete placeholders in ${path.basename(envFile)} first`);
        if (action === 'dev') {
            run(process.execPath, [nxBin, 'serve', app.project || name], { env });
            continue;
        }
        const configFile = path.join(__dirname, 'dev.config.json');
        let config;
        if (action === 'dev:build' && !flags.includes('--package-only')) {
            config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
            if (
                !/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9.-]+$/.test(config.server) ||
                !/^\/[a-zA-Z0-9_./-]+$/.test(config.root) ||
                config.root.split('/').includes('..') ||
                config.root === '/'
            )
                throw new Error('Invalid deployment server/root');
        }
        console.log(`Building ${name} with ${path.basename(envFile)}`);
        run(process.execPath, [nxBin, 'build', app.project || name, '--skip-nx-cache'], { env });
        if (action === 'build') continue;
        const id = new Date().toISOString().replace(/[^0-9]/g, '') + '-' + process.pid;
        const stage = path.join(root, 'dist/deploy', name, id);
        fs.mkdirSync(stage, { recursive: true });
        const all = packages();
        const target = all.find((pkg) => pkg.dir === app.dir);
        if (app.web) {
            copy(path.join(root, app.dir, 'dist'), path.join(stage, 'public'));
            copy(path.join(__dirname, 'static.cjs'), path.join(stage, 'static.cjs'));
        } else {
            // Preserve lockfile importers and catalogs; upload compiled runtime only, never source or Windows node_modules.
            for (const file of ['package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml'])
                copy(path.join(root, file), path.join(stage, file));
            for (const pkg of all)
                copy(
                    path.join(root, pkg.dir, 'package.json'),
                    path.join(stage, pkg.dir, 'package.json'),
                );
            const seen = new Set();
            function include(pkg) {
                if (seen.has(pkg.manifest.name)) return;
                seen.add(pkg.manifest.name);
                const dist = path.join(root, pkg.dir, 'dist');
                if (!fs.existsSync(dist))
                    throw new Error(`Missing built dependency: ${pkg.manifest.name}`);
                copy(dist, path.join(stage, pkg.dir, 'dist'));
                for (const dep of Object.keys({
                    ...pkg.manifest.dependencies,
                    ...pkg.manifest.optionalDependencies,
                })) {
                    const dependency = all.find((item) => item.manifest.name === dep);
                    if (dependency) include(dependency);
                }
            }
            include(target);
            copy(envFile, path.join(stage, '.env.development'));
            copy(path.join(__dirname, 'env.cjs'), path.join(stage, 'env.cjs'));
            copy(path.join(__dirname, 'start.cjs'), path.join(stage, 'start.cjs'));
        }
        const port = Number(env[app.port]);
        if (!Number.isInteger(port) || port < 1 || port > 65535)
            throw new Error(`Invalid ${app.port}`);
        fs.writeFileSync(
            path.join(stage, 'release.json'),
            JSON.stringify(
                {
                    name,
                    id,
                    web: !!app.web,
                    port,
                    package: target.manifest.name,
                    entry: `${app.dir}/dist/main.js`,
                    nodeMajor: Number(process.versions.node.split('.')[0]),
                },
                null,
                2,
            ),
        );
        copy(path.join(__dirname, 'activate.sh'), path.join(stage, 'activate.sh'));
        copy(
            path.join(__dirname, 'ecosystem.config.cjs'),
            path.join(stage, 'ecosystem.config.cjs'),
        );
        copy(path.join(__dirname, 'health.cjs'), path.join(stage, 'health.cjs'));
        const archive = stage + '.tar.gz';

        if (process.platform === 'win32') {
            const relativeStage = path.relative(root, stage);
            const relativeArchive = path.relative(root, archive);

            run('tar', ['-czf', relativeArchive, '-C', relativeStage, '.']);
        } else {
            run('tar', ['-czf', archive, '-C', stage, '.']);
        }
        console.log(`Packaged ${archive}`);
        if (!config) continue;
        const base = `${config.root}/${name}`;
        const release = `${base}/releases/${id}`;
        const identity = config.identityFile ? ['-i', config.identityFile] : [];
        const connection = [
            '-o',
            'BatchMode=yes',
            '-o',
            'StrictHostKeyChecking=yes',
            '-o',
            'ConnectTimeout=10',
            ...identity,
        ];
        run(ssh, [...connection, config.server, `umask 077; mkdir -p ${quote(release)}`]);
        run(scp, [...connection, archive, `${config.server}:${release}/release.tar.gz`]);
        run(ssh, [
            ...connection,
            config.server,
            `set -eu; umask 077; cd ${quote(release)}; tar -xzf release.tar.gz; bash activate.sh ${quote(base)}`,
        ]);
    }
}
try {
    main();
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
