#!/usr/bin/env node
// Portable core: runs contract journeys through a host entrypoint, installs a
// downloaded public archive offline, and answers memory queries from shipped
// inference assets only. Projection and containment reuse rig/lib; no network.
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const { runPayload } = require('../../lib/payload');
const { REGISTRY } = require('../../lib/host-capabilities');
const { containedPath } = require('../../lib/path-safety');
const { readTar } = require('../../lib/tar-read');
const TRUSTED_ROOT = path.resolve(__dirname, '..', '..', '..');

const ROUTER = '.rig/routing.md';
const MANIFEST = '.rig/inference/manifest.json';
const ASSET_KINDS = ['model', 'tokenizer', 'runtime'];
const PLATFORMS = ['darwin', 'linux', 'win32'];
const ARCHIVE_MAX_BYTES = 1024 * 1024 * 1024;

// Step names are host-independent; each step's host-specific part is its body.
// A step returns { ok, runtime } where runtime names what it actually used.
const JOURNEYS = {
  J01: [
    ['project-corpus', ({ repo, host }) => {
      runPayload(repo, [host]);
      return { ok: true, runtime: 'node' };
    }],
    ['verify-router', ({ repo }) => {
      const abs = containedPath(repo, ROUTER);
      return { ok: fs.existsSync(abs) && fs.statSync(abs).isFile(), runtime: 'node' };
    }],
    ['verify-host-entrypoint-points-at-router', ({ repo, host }) => {
      const abs = containedPath(repo, REGISTRY[host].surfaces.instruction);
      const text = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';
      return { ok: text.includes(ROUTER), runtime: 'node' };
    }],
  ],
};

function runJourney(repo, { host, journey } = {}) {
  if (typeof journey !== 'string' || !/^J\d{2}$/.test(journey)) throw new Error(`invalid journey id: ${journey}`);
  if (typeof host !== 'string' || !host) throw new Error('host must be a non-empty string');
  if (!Object.hasOwn(REGISTRY, host)) throw new Error(`unknown host "${host}"`);
  if (!JOURNEYS[journey]) throw new Error('unknown journey');

  const runs = [];
  for (const [name, step] of JOURNEYS[journey]) {
    const { ok, runtime } = step({ repo, host });
    runs.push({ name, runtime, ok });
    if (!ok) break;
  }
  const result = {
    host,
    journey,
    steps: runs.map((run) => run.name),
    completed: runs.every((run) => run.ok) && runs.length === JOURNEYS[journey].length,
    required_vendor_runtime: runs.some((run) => run.runtime !== 'node'),
  };
  const file = containedPath(repo, `.rig/journeys/${journey}-${host}.json`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(result, null, 2)}\n`);
  return result;
}

const ARCHIVE_META = 'rig-archive.json';
const KIT = '.rig/kit';
const MODEL_DIR = 'rig/catalog/baseline/assets/potion-base-2m';
const RUNTIME_SRC = 'rig/catalog/baseline/embedding.js';
const INSTALLED = [`${MODEL_DIR}/model.json`, `${MODEL_DIR}/embeddings.i8`, `${MODEL_DIR}/vocab.txt`, RUNTIME_SRC];

const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

// Tar names must work without aliases on every claimed OS, including Windows
// reserved names, alternate data streams and case-insensitive filesystems.
function portableNames(files) {
  const seen = new Set();
  for (const rel of files.keys()) {
    const key = rel.toLowerCase();
    if (seen.has(key) || rel.split('/').some((part) => /[<>:"|?*\x00-\x1f]|[. ]$/.test(part)
      || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part))) {
      throw new Error(`archive path is not portable: ${rel}`);
    }
    seen.add(key);
  }
}

// Self-declared digests prove consistency, not permission to execute code or
// replace the projection plan. Use this trusted installer/projectors with the
// downloaded data only. An incompatible plan needs an installer upgrade.
function installArchive(repo, archive) {
  if (typeof archive !== 'string' || !fs.existsSync(archive) || !fs.statSync(archive).isFile()) {
    throw new Error(`archive is not a file: ${archive}`);
  }
  const files = readTar(zlib.gunzipSync(fs.readFileSync(archive), { maxOutputLength: ARCHIVE_MAX_BYTES }));
  portableNames(files);
  if (!files.has(ARCHIVE_META)) throw new Error(`archive has no ${ARCHIVE_META}`);
  const meta = JSON.parse(files.get(ARCHIVE_META).toString('utf8'));
  if (!meta || !meta.files || typeof meta.files !== 'object' || Array.isArray(meta.files)
    || !Array.isArray(meta.platforms) || !meta.platforms.includes(process.platform)
    || meta.platforms.some((platform) => !PLATFORMS.includes(platform))) throw new Error(`${ARCHIVE_META} is malformed or does not support this platform`);
  for (const [rel, bytes] of files) {
    if (rel !== ARCHIVE_META && meta.files[rel] !== sha256(bytes)) throw new Error(`archive file "${rel}" does not match its declared digest`);
  }
  for (const rel of [...Object.keys(meta.files), ...INSTALLED]) {
    if (!files.has(rel)) throw new Error(`archive is missing declared file "${rel}"`);
  }
  for (const rel of ['rig/manifest.json', 'rig/corpus/corpus.json', 'rig/corpus/trust/gate1.allowed-signers']) {
    if (!files.has(rel) || !files.get(rel).equals(fs.readFileSync(path.join(TRUSTED_ROOT, rel)))) {
      throw new Error(`archive differs from the trusted projection plan: ${rel}; upgrade the installer`);
    }
  }
  const extracted_to = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-archive-'));
  try {
    for (const [rel, bytes] of files) {
      const dst = containedPath(extracted_to, rel);
      fs.mkdirSync(path.dirname(dst), { recursive: true });
      fs.writeFileSync(dst, bytes);
    }
    runPayload(repo, [], { sourceRoot: extracted_to });
    const installedFiles = Object.fromEntries(INSTALLED.map((rel) => [rel, meta.files[rel]]));
    const manifest = containedPath(repo, MANIFEST);
    fs.mkdirSync(path.dirname(manifest), { recursive: true });
    fs.writeFileSync(manifest, `${JSON.stringify({ platforms: meta.platforms, files: installedFiles }, null, 2)}\n`);
    return { installed: true, archive, extracted_to };
  } catch (error) {
    fs.rmSync(extracted_to, { recursive: true, force: true });
    throw error;
  }
}

function readManifest(repo) {
  const abs = containedPath(repo, MANIFEST);
  if (!fs.existsSync(abs)) throw new Error(`no shipped inference assets: ${MANIFEST} is missing`);
  const manifest = JSON.parse(fs.readFileSync(abs, 'utf8'));
  if (!Array.isArray(manifest.platforms) || !manifest.files || typeof manifest.files !== 'object'
    || manifest.platforms.some((platform) => !PLATFORMS.includes(platform))) {
    throw new Error('no shipped inference assets: manifest is malformed');
  }
  return manifest;
}

// Reads the installed model.json; each asset's size, licence and digest come from
// it (the runtime's digest, empty there, from the archive's list) and the bytes on
// disk must match before the asset is reported or used.
// shortcut: hashes each asset fully in memory, stream it if assets grow past ~1 GB.
function inferenceAssets(repo) {
  const { files } = readManifest(repo);
  const modelFile = containedPath(repo, `${KIT}/${MODEL_DIR}/model.json`);
  if (!fs.existsSync(modelFile)) throw new Error(`no shipped inference assets: ${KIT}/${MODEL_DIR}/model.json is missing`);
  const model = JSON.parse(fs.readFileSync(modelFile, 'utf8'));
  if (!Array.isArray(model.assets)) throw new Error('no shipped inference assets: model.json has no assets');
  return model.assets.map((asset) => {
    if (!asset || !ASSET_KINDS.includes(asset.kind)) throw new Error(`inference asset has unknown kind: ${asset && asset.kind}`);
    if (typeof asset.path !== 'string') throw new Error(`${asset.kind} asset has no path`);
    const expected = asset.kind === 'runtime' ? RUNTIME_SRC : `${MODEL_DIR}/${asset.kind === 'model' ? 'embeddings.i8' : 'vocab.txt'}`;
    if (asset.path !== expected) throw new Error(`inference ${asset.kind} asset path is invalid`);
    const label = `${asset.kind} asset "${asset.path}"`;
    const declared = asset.digest || files[asset.path];
    if (typeof declared !== 'string' || !/^[0-9a-f]{64}$/.test(declared)) throw new Error(`${label} has no valid digest`);
    if (asset.digest && files[asset.path] && asset.digest !== files[asset.path]) throw new Error(`${label} digest disagrees with the archive list`);
    if (asset.downloaded_at_first_run !== false) throw new Error(`${label} must not be downloaded at first run`);
    if (typeof asset.licence !== 'string' || !asset.licence) throw new Error(`${label} declares no licence`);
    const rel = `${KIT}/${asset.path}`;
    const abs = containedPath(repo, rel);
    if (!fs.existsSync(abs)) throw new Error(`${label} is missing`);
    const bytes = fs.readFileSync(abs);
    if (sha256(bytes) !== declared) throw new Error(`${label} digest does not match`);
    if (asset.bytes && asset.bytes !== bytes.length) throw new Error(`${label} size does not match`);
    return { kind: asset.kind, path: rel, bytes: bytes.length, digest: declared, licence: asset.licence, downloaded_at_first_run: false };
  });
}

function supportedPlatforms(repo) {
  return readManifest(repo).platforms;
}

function memoryQuery(repo, { store, query } = {}) {
  if (typeof store !== 'string' || !store || typeof query !== 'string' || !query) {
    throw new Error('memoryQuery needs non-empty store and query text');
  }
  const assets = inferenceAssets(repo);
  for (const kind of ASSET_KINDS) {
    if (!assets.some((asset) => asset.kind === kind)) throw new Error(`no shipped ${kind} asset: semantic query unavailable`);
  }
  const runtime = assets.find((asset) => asset.kind === 'runtime');
  const runtimeFile = containedPath(repo, runtime.path);
  if (sha256(fs.readFileSync(runtimeFile)) !== sha256(fs.readFileSync(path.join(__dirname, 'embedding.js')))) {
    throw new Error('installed embedding differs from the trusted runtime; upgrade the installer before executing it');
  }
  // Only byte-identical trusted implementation code executes. Its canonical
  // installed layout resolves and validates the installed model/tokenizer.
  const embedding = require(runtimeFile);
  const storeVector = embedding.embed(store);
  const queryVector = embedding.embed(query);
  if (![...storeVector].some((value) => value !== 0) || ![...queryVector].some((value) => value !== 0)) {
    throw new Error('text has no tokens the shipped vocabulary knows; semantic query unavailable');
  }
  return {
    provider_account_required: false,
    separate_service_required: false,
    hit: { source: 'memory:store', text: store, score: embedding.cosine(queryVector, storeVector) },
    engine: assets.find((asset) => asset.kind === 'model').path,
  };
}

module.exports = { runJourney, installArchive, memoryQuery, inferenceAssets, supportedPlatforms };
