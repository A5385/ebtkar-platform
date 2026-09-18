const fs = require('node:fs');
const { parseEnv } = require('node:util');

function readEnv(file, inherited = process.env) {
    const values = parseEnv(fs.readFileSync(file, 'utf8'));
    const result = { ...inherited, ...values };
    function expand(key, stack = []) {
        if (stack.includes(key)) throw new Error(`Circular environment reference: ${key}`);
        if (result[key] === undefined) throw new Error(`Missing environment reference: ${key}`);
        return result[key].replace(/\$\{([A-Z0-9_]+)\}/g, (_, name) => expand(name, [...stack, key]));
    }
    for (const key of Object.keys(values)) result[key] = expand(key);
    return result;
}
module.exports = { readEnv };
