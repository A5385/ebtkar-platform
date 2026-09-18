const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { readEnv } = require('./env.cjs');
const release = require('./release.json');
const envFile = path.join(__dirname, '.env.development');
Object.assign(process.env, readEnv(envFile));
process.env.APP_ENV_FILE = envFile;
process.env.NODE_ENV = 'development';
import(pathToFileURL(path.join(__dirname, release.entry)).href).catch(error => { console.error(error); process.exit(1); });
