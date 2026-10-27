'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const { buildArchive, tarEntry } = require('../scripts/build-public-archive');
const { readTar } = require('../rig/lib/tar-read');
const { runPayload } = require('../rig/lib/payload');
const portability = require('../rig/catalog/baseline/portability');

const root = path.resolve(__dirname, '..');
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

function fixture(fn) {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-archive-install-'));
  try { return fn(work); } finally { fs.rmSync(work, { recursive: true, force: true }); }
}

function archive(work, changes = {}) {
  const source = buildArchive(root, path.join(work, 'dist')).file;
  const files = readTar(zlib.gunzipSync(fs.readFileSync(source)));
  for (const [rel, body] of Object.entries(changes)) files.set(rel, Buffer.from(body));
  const meta = JSON.parse(files.get('rig-archive.json'));
  meta.files = Object.fromEntries([...files].filter(([rel]) => rel !== 'rig-archive.json').map(([rel, bytes]) => [rel, sha(bytes)]));
  files.set('rig-archive.json', Buffer.from(`${JSON.stringify(meta, null, 2)}\n`));
  const blocks = [...files].flatMap(([rel, bytes]) => tarEntry(`release/${rel}`, { bytes, mode: 0o644 }));
  const file = path.join(work, 'download.tar.gz');
  fs.writeFileSync(file, zlib.gzipSync(Buffer.concat([...blocks, Buffer.alloc(1024)])));
  return file;
}

test('archive install uses the complete trusted release bytes and never executes downloaded installer code', () => fixture((work) => {
  const repo = path.join(work, 'repo');
  fs.mkdirSync(repo);
  const file = archive(work);
  const result = portability.installArchive(repo, file);
  try {
    assert.equal(fs.readFileSync(path.join(repo, '.rig/routing.md'), 'utf8'), fs.readFileSync(path.join(root, 'rig/corpus/routing.md'), 'utf8'));
    assert.doesNotMatch(fs.readFileSync(path.join(repo, '.rig/kit/rig/lib/payload.js'), 'utf8'), /UNTRUSTED_INSTALLER_EXECUTED/);
    const other = path.join(work, 'host-repo');
    fs.mkdirSync(other);
    runPayload(other, ['claude'], { sourceRoot: result.extracted_to });
    assert.ok(fs.existsSync(path.join(other, 'CLAUDE.md')), 'trusted projector handles downloaded data');
  } finally { fs.rmSync(result.extracted_to, { recursive: true, force: true }); }
}));

test('self-consistent archive digests cannot authorize changed release bytes', () => fixture((work) => {
  const repo = path.join(work, 'repo');
  fs.mkdirSync(repo);
  const file = archive(work, {
    'rig/catalog/baseline/embedding.js': 'throw new Error("FORGED_RUNTIME_EXECUTED");',
  });
  assert.throws(() => portability.installArchive(repo, file), /complete trusted release bytes/);
  assert.equal(fs.existsSync(path.join(repo, '.rig')), false);
}));

test('default payload ships the complete inert capability kit and working installed inference', () => fixture((work) => {
  runPayload(work, []);
  const baseline = path.join(work, '.rig/kit/rig/catalog/baseline');
  for (const file of fs.readdirSync(path.join(root, 'rig/catalog/baseline')).filter((name) => name.endsWith('.js'))) {
    assert.ok(fs.existsSync(path.join(baseline, file)), `${file} ships in the kit`);
  }
  assert.ok(fs.existsSync(path.join(work, '.rig/kit/rig/lib/apply.js')), 'baseline dependencies ship');
  const embedding = require(path.join(baseline, 'embedding.js'));
  assert.equal(embedding.available(), true, embedding.failure());
  assert.ok([...embedding.embed('cancel a recurring subscription')].some((value) => value !== 0));
  assert.ok(require(path.join(baseline, 'memory.js')));
  assert.equal(fs.existsSync(path.join(work, '.rig/runtime/rig/manifest.json')), false, 'kit does not activate runtime delivery');
  assert.equal(fs.existsSync(path.join(work, '.rig/adaptation.json')), false, 'kit does not choose grafts');
}));

test('archive query uses installed runtime and refuses altered downloaded executable bytes', () => fixture((work) => {
  const repo = path.join(work, 'repo');
  fs.mkdirSync(repo);
  const result = portability.installArchive(repo, archive(work));
  try {
    const assets = portability.inferenceAssets(repo);
    const runtime = path.join(repo, assets.find((asset) => asset.kind === 'runtime').path);
    assert.equal(require(runtime).available(), true);
    const query = { store: 'Steps to stop an automatic subscription charge.', query: 'How do I cancel a recurring payment?' };
    const answer = portability.memoryQuery(repo, query);
    assert.ok(answer.hit.score > 0);
    fs.appendFileSync(runtime, '\nthrow new Error("UNTRUSTED_RUNTIME_EXECUTED");\n');
    assert.throws(() => portability.memoryQuery(repo, query), /digest|trusted runtime/);
  } finally { fs.rmSync(result.extracted_to, { recursive: true, force: true }); }
}));

test('self-consistent archive cannot change trusted projection destinations', () => fixture((work) => {
  const repo = path.join(work, 'repo');
  fs.mkdirSync(repo);
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'rig/manifest.json')));
  manifest.payload[0].to = '.git/hooks/post-checkout';
  assert.throws(() => portability.installArchive(repo, archive(work, { 'rig/manifest.json': JSON.stringify(manifest) })), /trusted.*release bytes|trusted.*projection|projection.*trusted/);
  assert.equal(fs.existsSync(path.join(repo, '.git/hooks/post-checkout')), false);
}));

test('archive cannot replace the trust anchor or introduce Windows path aliases', () => fixture((work) => {
  for (const changes of [
    { 'rig/corpus/trust/gate1.allowed-signers': 'untrusted replacement' },
    { 'rig/corpus/routing.md:alternate': 'alternate data stream' },
    { 'rig/corpus/ROUTING.md': 'case alias' },
  ]) {
    const repo = fs.mkdtempSync(path.join(work, 'repo-'));
    assert.throws(() => portability.installArchive(repo, archive(work, changes)), /trusted release bytes|trusted projection|not portable/);
    assert.equal(fs.existsSync(path.join(repo, '.rig')), false);
  }
}));
