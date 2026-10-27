'use strict';

// Offline meaning-based embedding for Rig memory (R052, R068, R077, R078).
//
// Bundles `potion-base-2M` (MIT), a static distillation of
// `baai/bge-base-en-v1.5`. A static model is a plain token -> vector table,
// so this runtime performs lookup and mean pooling. That buys the
// smallest complete installed footprint of the candidates considered —
// 2.2 MB of weights plus tokenizer, no native binary, no model server, no
// first-run download, and identical behaviour on every supported OS.
//
// The table is stored per-row symmetric int8 (see assets/.../model.json);
// quantisation was checked to leave ranking on the acceptance queries
// unchanged against the published float32 weights.

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '..', '..', '..');

const ASSETS = path.join(__dirname, 'assets', 'potion-base-2m');

// rig: retain only the static inference path: no transformer or tokenizers
// runtime is needed for this table. The mean-pool/normalise and WordPiece
// steps are source adaptations documented in assets/potion-base-2m/model.json.

let loaded = null;

function assetFingerprint() {
  return ['model.json', 'embeddings.i8', 'vocab.txt'].map(file => path.join(ASSETS, file))
    .concat(__filename).map(file => {
      const stat = fs.statSync(file, { bigint: true });
      return [stat.dev, stat.ino, stat.size, stat.mtimeNs, stat.ctimeNs].join(':');
    }).join('|');
}

function verify(manifest, root = ROOT) {
  if (!Number.isSafeInteger(manifest.rows) || manifest.rows <= 0
      || !Number.isSafeInteger(manifest.dims) || manifest.dims <= 0
      || !Array.isArray(manifest.assets)) throw new Error('embedding manifest has invalid dimensions or assets');
  const expected = {
    model: path.join(ASSETS, 'embeddings.i8'),
    tokenizer: path.join(ASSETS, 'vocab.txt'),
    runtime: path.join(__dirname, 'embedding.js'),
  };
  const byKind = new Map(manifest.assets.map((asset) => [asset.kind, asset]));
  if (byKind.size !== 3 || Object.keys(expected).some((kind) => !byKind.has(kind))) {
    throw new Error('embedding manifest must declare model, tokenizer and runtime assets');
  }
  const digests = {};
  for (const [kind, expectedPath] of Object.entries(expected)) {
    const asset = byKind.get(kind);
    if (!/^[0-9a-f]{64}$/.test(asset.digest || '') || !Number.isSafeInteger(asset.bytes) || asset.bytes < 0) {
      throw new Error(`embedding ${kind} asset has an invalid digest or byte count`);
    }
    const actualPath = path.resolve(root, asset.path);
    if (actualPath !== expectedPath) throw new Error(`embedding ${kind} asset path is invalid`);
    const raw = fs.readFileSync(actualPath);
    if (raw.length !== asset.bytes) throw new Error(`embedding ${kind} asset size mismatch`);
    const digest = crypto.createHash('sha256').update(raw).digest('hex');
    if (digest !== asset.digest) throw new Error(`embedding ${kind} asset digest mismatch`);
    digests[kind] = digest;
  }
  return digests;
}

function load() {
  const fingerprint = assetFingerprint();
  if (loaded?.fingerprint === fingerprint) return loaded;
  const manifest = JSON.parse(fs.readFileSync(path.join(ASSETS, 'model.json'), 'utf8'));
  verify(manifest);
  const { rows, dims } = manifest;
  const raw = fs.readFileSync(path.join(ASSETS, 'embeddings.i8'));
  if (raw.length !== rows * 4 + rows * dims) throw new Error('embedding table is truncated');
  // Copy the scale block so the Float32Array view is always 4-byte aligned.
  const scales = new Float32Array(new Uint8Array(raw.subarray(0, rows * 4)).buffer);
  const table = raw.subarray(rows * 4);

  const vocab = new Map();
  const lines = fs.readFileSync(path.join(ASSETS, 'vocab.txt'), 'utf8').split('\n');
  for (let i = 0; i < lines.length; i += 1) if (lines[i] !== '') vocab.set(lines[i], i);
  if (vocab.size !== rows) throw new Error('vocabulary does not match the embedding table');

  if (assetFingerprint() !== fingerprint) throw new Error('embedding assets changed while loading');
  loaded = { manifest, rows, dims, scales, table, vocab, fingerprint, vectors: new Map() };
  return loaded;
}

// Adapted from easy-bert BasicTokenizer.tokenize (MIT; pinned in model.json).
// Unicode properties replace Java Character categories; this is the same
// category-based split with the supported Node Unicode database.
function basicTokens(text) {
  const clean = String(text).replace(/[\u0000\uFFFD]/gu, '')
    .replace(/[\p{Cc}\p{Cf}\p{Cs}\p{Co}\p{Cn}]/gu, (char) => /[\t\n\r]/u.test(char) ? char : '')
    .replace(/[\t\n\r\p{Zs}]/gu, ' ');
  const chinese = clean.replace(/[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\u{20000}-\u{2FA1F}]/gu, ' $& ');
  const tokens = [];
  for (const token of chinese.split(/\s+/u).filter(Boolean)) {
    const normalized = token.toLowerCase().normalize('NFD').replace(/\p{Mn}/gu, '');
    tokens.push(...normalized.split(/([\p{P}\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E])/u).filter(Boolean));
  }
  return tokens;
}

// Adapted from easy-bert WordpieceTokenizer.splitToken: longest-match-first,
// `##` continuation pieces, and one [UNK] for a failed/overlong word.
function wordpiece(vocab, word) {
  const chars = Array.from(word);
  if (chars.length > 200) return ['[UNK]'];
  const pieces = [];
  let start = 0;
  while (start < chars.length) {
    let end = chars.length;
    let piece = null;
    while (start < end) {
      const candidate = `${start ? '##' : ''}${chars.slice(start, end).join('')}`;
      if (vocab.has(candidate)) { piece = candidate; break; }
      end -= 1;
    }
    if (!piece) return ['[UNK]'];
    pieces.push(piece);
    start = end;
  }
  return pieces;
}

/** BERT wordpiece, uncased — the tokenizer the pinned model was published with. */
function tokenize(vocab, text) {
  const ids = [];
  const unknownId = vocab.get('[UNK]');
  for (const word of basicTokens(text)) {
    for (const piece of wordpiece(vocab, word)) {
      const id = vocab.get(piece);
      // Model2Vec StaticModel.tokenize removes unknown ids before pooling.
      if (id !== undefined && id !== unknownId) ids.push(id);
    }
  }
  return ids;
}

/** Adapted from Model2Vec StaticModel._encode_batch: token mean then L2 norm. */
function embed(text) {
  const { dims, scales, table, vocab, vectors } = load();
  const key = String(text);
  if (vectors.has(key)) return vectors.get(key).slice();
  const ids = tokenize(vocab, text);
  const vector = new Float64Array(dims);
  if (ids.length === 0) return vector;
  for (const id of ids) {
    const scale = scales[id];
    const offset = id * dims;
    for (let d = 0; d < dims; d += 1) vector[d] += (table[offset + d] - 128) * scale;
  }
  let norm = 0;
  for (let d = 0; d < dims; d += 1) { vector[d] /= ids.length; norm += vector[d] * vector[d]; }
  // Model2Vec adds 1e-32 to the norm; for this Float64 implementation it only
  // matters for the zero vector, which was returned above.
  norm = Math.sqrt(norm) + 1e-32;
  for (let d = 0; d < dims; d += 1) vector[d] /= norm;
  // rig: bounded process-local cache; index() warms the same verified vectors
  // used by recall. Larger corpora can use a separately verified persistent index.
  if (key.length <= 4096) {
    if (vectors.size >= 256) vectors.delete(vectors.keys().next().value);
    vectors.set(key, vector.slice());
  }
  return vector;
}

function cosine(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) sum += a[i] * b[i];
  return sum;
}

function revision() {
  return load().manifest.revision;
}

function dims() {
  return load().dims;
}

/** True when the shipped assets are present and self-consistent. */
function available() {
  try { load(); return true; } catch { return false; }
}

function failure() {
  try { load(); return null; } catch (error) { return error.message; }
}

/** Declared size, licence and integrity of every shipped inference asset. */
function assets(root = path.resolve(__dirname, '..', '..', '..')) {
  const manifest = JSON.parse(fs.readFileSync(path.join(ASSETS, 'model.json'), 'utf8'));
  return manifest.assets.map((asset) => {
    const abs = path.join(root, asset.path);
    const bytes = fs.existsSync(abs) ? fs.statSync(abs).size : 0;
    const actualDigest = fs.existsSync(abs)
      ? crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex')
      : '';
    return {
      ...asset,
      actual_bytes: bytes,
      actual_digest: actualDigest,
      integrity: !actualDigest ? 'missing' : (bytes !== asset.bytes || actualDigest !== asset.digest ? 'mismatch' : 'verified'),
    };
  });
}

module.exports = { embed, cosine, tokenize, revision, dims, available, failure, assets, ASSETS };
