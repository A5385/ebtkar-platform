const net = require('node:net');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const release = require('./release.json');
const port = release.port;
const deadline = Date.now() + 45000;
function retry() {
    if (Date.now() >= deadline) process.exit(1);
    setTimeout(check, 1000);
}
function check() {
    // An unrelated listener on this port must not make a failed PM2 start look healthy.
    const result = spawnSync('pm2', ['jlist'], { encoding: 'utf8', timeout: 5000 });
    let processInfo;
    try { processInfo = JSON.parse(result.stdout).find(app => app.name === `ebtkar-${release.name}`)?.pm2_env; } catch { retry(); return; }
    const script = path.join(__dirname, release.web ? 'static.cjs' : 'start.cjs');
    if (processInfo?.status !== 'online' || processInfo.pm_exec_path !== script || Date.now() - processInfo.pm_uptime < 3000) { retry(); return; }
    const socket = net.connect({ host: '127.0.0.1', port });
    socket.setTimeout(1000);
    socket.once('connect', () => { socket.destroy(); process.exit(0); });
    socket.once('timeout', () => socket.destroy(new Error('timeout')));
    socket.once('error', () => {
        socket.destroy();
        retry();
    });
}
check();
