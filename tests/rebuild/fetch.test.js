'use strict';

const test = require('node:test');
const { assert, fs, path, ROOT, tempDir, run } = require('./_harness');

function filesUnder(root) {
  const out = [];
  if (!fs.existsSync(root)) return out;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const file = path.join(root, entry.name);
    if (entry.isDirectory()) out.push(...filesUnder(file));
    else out.push(file);
  }
  return out;
}

test('RB-FETCH-1 fresh install succeeds while outbound sockets are blocked', () => {
  const target = tempDir('rig-fetch-install-');
  const deny = path.join(target, 'deny-network.cjs');
  fs.writeFileSync(deny, `const net=require('node:net');const http=require('node:http');const https=require('node:https');const fail=()=>{throw Error('unexpected network')};net.Socket.prototype.connect=fail;http.request=fail;https.request=fail;global.fetch=fail;`);
  const result = run('sh', [path.join(ROOT, 'install.sh'), '--target', target, '--hosts', 'codex'], {
    cwd: ROOT,
    env: { ...process.env, NODE_OPTIONS: `--require=${deny}` },
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test('RB-FETCH-2 installed .rig contains no fetched-upstream state or metadata', () => {
  const target = tempDir('rig-fetch-state-');
  const installer = run('sh', [path.join(ROOT, 'install.sh'), '--target', target, '--hosts', 'codex'], { cwd: ROOT });
  assert.equal(installer.status, 0, installer.stderr || installer.stdout);
  assert.equal(fs.existsSync(path.join(target, '.rig', 'fetched')), false);
  assert.equal(fs.existsSync(path.join(target, '.rig', 'upstream')), false);
});

test('RB-FETCH-3 no payload module supports fetching upstreams during setup', () => {
  const payload = filesUnder(path.join(ROOT, 'rig'));
  const oldModuleName = ['upstream', 'fetch'].join('-');
  assert.equal(payload.some((file) => path.basename(file) === `${oldModuleName}.js`), false);
});

test('RB-FETCH-4 source, scripts, and tests contain no old fetch module references', () => {
  const roots = ['rig', 'scripts', 'tests'].map((item) => path.join(ROOT, item));
  const marker = ['upstream', 'fetch'].join('-');
  const hits = roots.flatMap(filesUnder).filter((file) => {
    if (file.startsWith(path.join(ROOT, 'tests', 'rebuild'))) return false;
    try { return fs.readFileSync(file, 'utf8').includes(marker); } catch { return false; }
  });
  assert.deepEqual(hits, []);
});
