'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

function withTemp(run) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-memory-integrity-'));
  try { run(dir); } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function isolatedEmbedding(dir) {
  const source = path.resolve(__dirname, '../rig/catalog/baseline/embedding.js');
  const sourceAssets = path.join(path.dirname(source), 'assets', 'potion-base-2m');
  const install = path.join(dir, 'rig', 'catalog', 'baseline');
  const copy = path.join(install, 'embedding.js');
  fs.mkdirSync(install, { recursive: true });
  fs.copyFileSync(source, copy);
  fs.cpSync(sourceAssets, path.join(install, 'assets', 'potion-base-2m'), { recursive: true });
  return require(copy);
}

function memoryRepo(dir, name = 'repo') {
  const repo = path.join(dir, name);
  fs.mkdirSync(path.join(repo, '.rig', 'memory'), { recursive: true });
  return repo;
}

test('corrupt memory store is preserved and put refuses to overwrite it', () => withTemp((dir) => {
  const repo = memoryRepo(dir);
  const file = path.join(repo, '.rig', 'memory', 'records.json');
  const corrupt = '{"records": [ truncated';
  fs.writeFileSync(file, corrupt);
  const memory = require(path.resolve(__dirname, '../rig/catalog/baseline/memory.js'));

  assert.throws(() => memory.put(repo, { id: 'new', source: 'test', value: 'new value' }), /corrupt|invalid|parse|records/i);
  assert.equal(fs.readFileSync(file, 'utf8'), corrupt, 'the only existing durable bytes survive');
}));

test('memory records reject unsupported scope before writing', () => withTemp((dir) => {
  const repo = memoryRepo(dir);
  const memory = require(path.resolve(__dirname, '../rig/catalog/baseline/memory.js'));

  assert.throws(() => memory.put(repo, { id: 'bad-scope', scope: '../outside', source: 'test', value: 'x' }), /scope/i);
  assert.equal(fs.existsSync(path.join(repo, '.rig', 'memory', 'records.json')), false);
}));

test('forget removes only developer records attributed to the requesting repository', () => withTemp((dir) => {
  const repoA = memoryRepo(dir, 'repo-a');
  const repoB = memoryRepo(dir, 'repo-b');
  const home = path.join(dir, 'home');
  const previousHome = process.env.RIG_HOME;
  process.env.RIG_HOME = home;
  try {
    const memory = require(path.resolve(__dirname, '../rig/catalog/baseline/memory.js'));
    memory.put(repoA, { id: 'shared', scope: 'developer', source: 'notes/a.md', value: 'repo a value' });
    memory.put(repoB, { id: 'shared', scope: 'developer', source: 'notes/b.md', value: 'repo b value' });

    const result = memory.forget(repoA, ['shared']);

    assert.deepEqual(result.removed, ['shared']);
    const store = JSON.parse(fs.readFileSync(path.join(home, 'memory', 'records.json'), 'utf8'));
    assert.deepEqual(store.records.map((record) => record.origin), [path.resolve(repoB)]);
  } finally {
    if (previousHome === undefined) delete process.env.RIG_HOME;
    else process.env.RIG_HOME = previousHome;
  }
}));

test('embedding rechecks same-length asset corruption after its cache has loaded', () => withTemp((dir) => {
  const embedding = isolatedEmbedding(dir);
  const asset = path.join(dir, 'rig', 'catalog', 'baseline', 'assets', 'potion-base-2m', 'vocab.txt');
  assert.equal(embedding.available(), true);
  embedding.embed('cache check');
  const before = fs.readFileSync(asset);
  const changed = Buffer.from(before);
  changed[0] ^= 1;
  fs.writeFileSync(asset, changed);
  assert.equal(changed.length, before.length);

  assert.throws(() => embedding.embed('cache check'), /digest|integrity/i);
  assert.equal(embedding.available(), false);
}));

test('embedding asset report preserves declared digest and reports mismatch', () => withTemp((dir) => {
  const embedding = isolatedEmbedding(dir);
  const manifest = path.join(dir, 'rig', 'catalog', 'baseline', 'assets', 'potion-base-2m', 'model.json');
  const asset = path.join(dir, 'rig', 'catalog', 'baseline', 'assets', 'potion-base-2m', 'embeddings.i8');
  const model = JSON.parse(fs.readFileSync(manifest, 'utf8'));
  const row = model.assets.find((entry) => entry.kind === 'model');
  const declared = row.digest;
  const actualBytes = fs.readFileSync(asset);
  actualBytes[0] ^= 1;
  fs.writeFileSync(asset, actualBytes);

  const result = embedding.assets(dir).find((entry) => entry.kind === 'model');

  assert.equal(result.digest, declared, 'the public digest field remains the pinned expected digest');
  assert.notEqual(result.actual_digest, declared);
  assert.equal(result.bytes, row.bytes, 'the declared byte count remains pinned');
  assert.equal(result.actual_bytes, actualBytes.length);
  assert.equal(result.integrity, 'mismatch');
  assert.notEqual(sha(asset), declared);
}));

test('memory names asset integrity failure and uses only cited lexical fallback', () => withTemp((dir) => {
  const source = path.resolve(__dirname, '../rig/catalog/baseline');
  const install = path.join(dir, 'rig', 'catalog', 'baseline');
  fs.mkdirSync(install, { recursive: true });
  fs.copyFileSync(path.join(source, 'memory.js'), path.join(install, 'memory.js'));
  fs.mkdirSync(path.join(dir, 'rig', 'lib'), { recursive: true });
  fs.copyFileSync(path.join(source, '../../lib/path-safety.js'), path.join(dir, 'rig', 'lib', 'path-safety.js'));
  fs.copyFileSync(path.join(source, 'embedding.js'), path.join(install, 'embedding.js'));
  fs.cpSync(path.join(source, 'assets', 'potion-base-2m'), path.join(install, 'assets', 'potion-base-2m'), { recursive: true });
  const repo = memoryRepo(dir);
  const memory = require(path.join(install, 'memory.js'));
  memory.put(repo, { id: 'rotate', source: 'notes/security.md', value: 'Rotate credentials every month.' });
  const vocab = path.join(install, 'assets', 'potion-base-2m', 'vocab.txt');
  const bytes = fs.readFileSync(vocab);
  bytes[0] ^= 1;
  fs.writeFileSync(vocab, bytes);

  const result = memory.recallDetailed(repo, 'when should credentials rotate');

  assert.equal(result.mode, 'lexical-fallback');
  assert.match(result.semantic.failure, /digest mismatch/i);
  assert.equal(result.hits[0].source, 'notes/security.md');
}));

test('embedding rejects dimensions that do not describe the pinned table', () => withTemp((dir) => {
  const embedding = isolatedEmbedding(dir);
  const manifest = path.join(dir, 'rig', 'catalog', 'baseline', 'assets', 'potion-base-2m', 'model.json');
  const model = JSON.parse(fs.readFileSync(manifest, 'utf8'));
  model.dims += 1;
  fs.writeFileSync(manifest, `${JSON.stringify(model, null, 2)}\n`);

  assert.equal(embedding.available(), false);
  assert.match(embedding.failure(), /truncated|dimension|table/i);
}));
