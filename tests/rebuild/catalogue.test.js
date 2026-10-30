'use strict';

const test = require('node:test');
const { assert, fs, path, ROOT, tempDir, write, run } = require('./_harness');

const catalogue = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'rig/corpus/catalogue.json'), 'utf8'));

test('RB-CAT-1 each mapped role has one complete plain-language catalogue entry', () => {
  const roles = JSON.parse(fs.readFileSync(path.join(ROOT, 'wiki/specs/rebuild/role-map.json'), 'utf8')).roles;
  const entries = catalogue().roles;
  assert.ok(Array.isArray(entries));
  assert.equal(new Set(entries.map((row) => row.id)).size, entries.length);
  assert.deepEqual(new Set(entries.map((row) => row.id)), new Set(roles.map((row) => row.id)));
  const upstreamNames = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'rig/upstreams/lock.json'), 'utf8')).upstreams.map((row) => row.id));
  for (const row of entries) {
    for (const key of ['whatItIs', 'whenItHelps', 'recommendation']) assert.ok(row[key]?.trim(), `${row.id}.${key}`);
    for (const name of upstreamNames) assert.ok(!row.whenItHelps.toLowerCase().includes(name.toLowerCase()), `${row.id} exposes upstream name`);
  }
});

test('RB-CAT-2 every catalogue piece path exists in the applied overlay output', () => {
  const entries = catalogue().roles;
  const build = path.join(ROOT, 'rig/build/upstreams');
  for (const row of entries) for (const piece of row.pieces) {
    assert.ok(fs.existsSync(path.join(build, piece.upstream, piece.path)), `${row.id}: ${piece.upstream}/${piece.path}`);
  }
});

test('RB-CAT-3 inspect-repo reports dependency and existing harness facts without decisions', () => {
  const repo = tempDir('rig-inspect-repo-');
  write(repo, 'package.json', JSON.stringify({ dependencies: { react: '^19.0.0' } }));
  write(repo, '.claude/skills/superpowers/SKILL.md', '# local skill\n');
  const result = run(process.execPath, [path.join(ROOT, 'rig/bin/inspect-repo.js'), repo, '--json'], { cwd: ROOT });
  assert.equal(result.status, 0, result.stderr);
  const data = JSON.parse(result.stdout);
  assert.ok(data.facts.some((fact) => fact.kind === 'dependency' && fact.value === 'react'));
  assert.ok(data.existingHarness.some((row) => row.path.includes('superpowers')));
  for (const key of ['recommend', 'should', 'needs']) assert.equal(Object.hasOwn(data, key), false);
});

test('RB-CAT-4 inspect-repo makes no outbound network request', () => {
  const repo = tempDir('rig-inspect-offline-');
  write(repo, 'package.json', '{"name":"offline-fixture"}');
  const deny = write(repo, 'deny-network.cjs', `const net=require('node:net');const http=require('node:http');const https=require('node:https');const fail=()=>{throw Error('network denied')};net.Socket.prototype.connect=fail;http.request=fail;https.request=fail;global.fetch=fail;`);
  const result = run(process.execPath, [path.join(ROOT, 'rig/bin/inspect-repo.js'), repo, '--json'], { cwd: ROOT, env: { ...process.env, NODE_OPTIONS: `--require=${deny}` } });
  assert.equal(result.status, 0, result.stderr);
});

test('RB-CAT-5 first-session report has an outcome and recommendation for every role question', () => {
  const text = fs.readFileSync(path.join(ROOT, 'rig/corpus/onboarding/report-template.md'), 'utf8');
  const roles = catalogue().roles;
  assert.ok(roles.length > 0);
  for (const role of roles) assert.ok(text.includes(role.id) || text.includes('{{roles}}'), `template omits ${role.id}`);
  assert.match(text, /recommend/i);
  assert.match(text, /outcome|adds|helps|protects/i);
});
