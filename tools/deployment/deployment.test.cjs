const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { readEnv } = require('./env.cjs');
test('explicit environment expands values and rejects missing/circular references', () => {
    const temp = fs.mkdtempSync(path.join(os.tmpdir(),'deploy-env-'));
    try {
        const file=path.join(temp,'.env');
        fs.writeFileSync(file,'HOST=dev.example\nURL=https://${HOST}/api\n');
        assert.equal(readEnv(file,{HOST:'localhost'}).URL,'https://dev.example/api');
        fs.writeFileSync(file,'A=${B}\nB=${A}\n');
        assert.throws(()=>readEnv(file,{}),/Circular/);
        fs.writeFileSync(file,'A=${MISSING}\n');
        assert.throws(()=>readEnv(file,{}),/Missing/);
    } finally { fs.rmSync(temp,{recursive:true,force:true}); }
});
test('package-only isolates env and ships compiled workspace dependencies without source or local node_modules', () => {
    const temp=fs.mkdtempSync(path.join(os.tmpdir(),'deploy-package-'));
    const put=(file,value)=>{const full=path.join(temp,file);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,value);};
    try {
        for(const file of ['run.cjs','env.cjs','start.cjs','activate.sh','ecosystem.config.cjs','health.cjs','static.cjs']) put('tools/deployment/'+file,fs.readFileSync(path.join(__dirname,file)));
        for(const group of ['api','web','packages','database']) fs.mkdirSync(path.join(temp,'src',group),{recursive:true});
        put('package.json','{"private":true}');put('pnpm-lock.yaml','lockfileVersion: 9');put('pnpm-workspace.yaml','packages: ["src/*/*"]');
        put('src/api/auth/package.json',JSON.stringify({name:'@org/api-auth',dependencies:{'@org/shared':'workspace:*'}}));
        put('src/api/auth/dist/main.js','console.log("compiled");');
        put('src/api/auth/src/main.ts','DO_NOT_SHIP_SOURCE');
        put('src/api/auth/node_modules/private.txt','DO_NOT_SHIP_WINDOWS_MODULES');
        put('src/packages/shared/package.json','{"name":"@org/shared"}');put('src/packages/shared/dist/index.js','exports.ready=true;');
        put('.env.local','SENTINEL=wrong');put('.env.development','API_AUTH_PORT=1001\nSENTINEL=right\n');
        put('node_modules/nx/package.json','{"bin":{"nx":"dist/bin/nx.js"}}');
        put('node_modules/nx/dist/bin/nx.js',`require('node:assert/strict').equal(process.env.SENTINEL,'right');require('node:assert/strict').equal(process.env.NODE_ENV,'production');require('node:assert/strict').equal(process.env.NX_LOAD_DOT_ENV_FILES,'false');`);
        const result=spawnSync(process.execPath,[path.join(temp,'tools/deployment/run.cjs'),'dev:build','api-auth','--package-only'],{encoding:'utf8'});
        assert.equal(result.status,0,result.stderr);
        const parent=path.join(temp,'dist/deploy/api-auth');
        const stage=path.join(parent,fs.readdirSync(parent).find(name=>!name.endsWith('.tar.gz')));
        assert.ok(fs.existsSync(path.join(stage,'src/packages/shared/dist/index.js')));
        assert.ok(!fs.existsSync(path.join(stage,'src/api/auth/src')));
        assert.ok(!fs.existsSync(path.join(stage,'src/api/auth/node_modules')));
        assert.ok(!fs.existsSync(path.join(stage,'.env.local')));
        assert.ok(fs.existsSync(stage+'.tar.gz'));
        const listing=spawnSync('tar',['-tzf',stage+'.tar.gz'],{encoding:'utf8'});
        assert.equal(listing.status,0);assert.match(listing.stdout,/shared\/dist\/index.js/);
        put('src/web/admin/package.json','{"name":"@org/admin"}');put('src/web/admin/dist/index.html','<html>ok</html>');
        put('.env.development','ADMIN_PORT=2000\nSENTINEL=right\nSECRET=never_ship\n');
        const web=spawnSync(process.execPath,[path.join(temp,'tools/deployment/run.cjs'),'dev:build','admin','--package-only'],{encoding:'utf8'});
        assert.equal(web.status,0,web.stderr);
        const webParent=path.join(temp,'dist/deploy/admin');
        const webStage=path.join(webParent,fs.readdirSync(webParent).find(name=>!name.endsWith('.tar.gz')));
        assert.ok(fs.existsSync(path.join(webStage,'public/index.html')));
        assert.ok(!fs.existsSync(path.join(webStage,'.env.development')));
    } finally { fs.rmSync(temp,{recursive:true,force:true}); }
});
