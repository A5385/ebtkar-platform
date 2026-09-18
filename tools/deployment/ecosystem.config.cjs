const path = require('node:path');
const release = require('./release.json');
module.exports = { apps: [{
    name: `ebtkar-${release.name}`,
    cwd: path.resolve(__dirname, '../..'),
    script: path.join(__dirname, release.web ? 'static.cjs' : 'start.cjs'),
    instances: 1,
    exec_mode: 'fork',
    env: { NODE_ENV: 'development' },
    max_restarts: 5,
    min_uptime: '10s',
}] };
