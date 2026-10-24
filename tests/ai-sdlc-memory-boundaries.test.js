'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const memory = require('../rig/catalog/baseline/memory');
test('project memory cannot escape through a symlinked state directory', (t) => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-memory-boundary-'));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  const repo = path.join(base, 'repo'), outside = path.join(base, 'outside');
  fs.mkdirSync(repo); fs.mkdirSync(outside);
  fs.symlinkSync(outside, path.join(repo, '.rig'), 'dir');
  assert.throws(() => memory.put(repo, { id: 'a', value: 'private' }), /symlink|outside|escape/i);
  assert.deepEqual(fs.readdirSync(outside), []);
});
test('concurrent project writers preserve all records or refuse before writing', (t) => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-memory-writers-'));
  t.after(() => fs.rmSync(repo, { recursive: true, force: true }));
  const modulePath = require.resolve('../rig/catalog/baseline/memory');
  const script = `const {spawn}=require('node:child_process');const m=${JSON.stringify(modulePath)},r=${JSON.stringify(repo)}; const jobs=[]; for(let i=0;i<8;i++)jobs.push(new Promise(resolve=>{const p=spawn(process.execPath,['-e', 'try {require('+JSON.stringify(m)+').put('+JSON.stringify(r)+',{id:'+JSON.stringify('id-'+i)+',value:"data"})}catch(e){if(!/lock/.test(e.message))process.exit(2);process.exit(3)}']);p.on('exit',code=>resolve(code));}));Promise.all(jobs).then(c=>process.stdout.write(JSON.stringify(c)));`;
  const result = spawnSync(process.execPath, ['-e', script], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const outcomes = JSON.parse(result.stdout);
  assert.ok(outcomes.every((code) => code === 0 || code === 3));
  const rows = JSON.parse(fs.readFileSync(path.join(repo, '.rig/memory/records.json'))).records;
  assert.equal(rows.length, outcomes.filter((code) => code === 0).length);
});
test('index rebuilding refuses a symlink to user data outside the project', (t) => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-index-boundary-'));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  const repo = path.join(base, 'repo'); fs.mkdirSync(repo);
  memory.put(repo, { id: 'fact', value: 'Rotate credentials monthly.' });
  const outside = path.join(base, 'user-data'); fs.writeFileSync(outside, 'precious');
  fs.symlinkSync(outside, path.join(repo, '.rig/memory/index.json'));
  assert.throws(() => memory.index(repo), /outside|symlink|escape/i);
  assert.equal(fs.readFileSync(outside, 'utf8'), 'precious');
});
