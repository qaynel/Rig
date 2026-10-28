'use strict';

// Active, scoped, offline-searchable memory (R047-R053, R073-R074, R078).
//
// Two stores. Project records live with the repository; developer records live
// once per developer and are the only thing a second project can see. Meaning
// based search runs against the shipped static embedding (see embedding.js) —
// no provider, no daemon, no network. If a repository pins its own local model
// and that model cannot be loaded, search degrades to cited lexical matching
// and says so; the fallback is never presented as the required capability.

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { containedPath } = require('../../lib/path-safety');

const embedding = require('./embedding');

const CAP = 8192;                  // the owner-set active working view, in bytes
const DEVELOPER_FLOOR = 0.3;       // developer memory is background: it must earn its place
const CONFLICT_BAR = 0.5;          // below this the answer does not depend on the disagreement
const MAX_HITS = 20;

// Recalled text is data. These are reported, never obeyed.
const INJECTION = [
  /ignore (all )?previous instructions/i,
  /disregard (the )?(above|prior|previous)/i,
  /\byou are now\b/i,
  /\b(approve|sign|publish|merge|deploy)\b[^.]*\b(release|contract|key|oracle)\b/i,
];

const NEGATION = /\b(not|never|no|without|except|unless|doesn't|does not|cannot)\b/i;

const developerHome = () => process.env.RIG_HOME || path.join(os.homedir(), '.rig');

function storeFile(repo, scope) {
  if (scope !== 'developer') return containedPath(repo, '.rig/memory/records.json');
  let root = path.resolve(developerHome());
  let rel = 'memory/records.json';
  while (!fs.existsSync(root)) { rel = path.join(path.basename(root), rel); root = path.dirname(root); }
  return containedPath(root, rel);
}

// rig: writers fail closed under contention; retry the operation after the
// other writer finishes. A stale lock needs explicit recovery, never a guess.
function mutate(file, operation) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  let fd;
  try { fd = fs.openSync(`${file}.lock`, 'wx', 0o600); }
  catch (error) { throw new Error(`memory store lock unavailable: ${error.code}`, { cause: error }); }
  try { return operation(); }
  finally { fs.closeSync(fd); fs.rmSync(`${file}.lock`, { force: true }); }
}

function load(file) {
  let raw;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw new Error(`rig: cannot read memory store ${file}: ${error.message}`, { cause: error });
  }
  let parsed;
  try { parsed = JSON.parse(raw); }
  catch (error) { throw new Error(`rig: corrupt memory store ${file}: ${error.message}`, { cause: error }); }
  if (!parsed || !Array.isArray(parsed.records) || parsed.records.some((record) => !record || typeof record !== 'object' || Array.isArray(record))) {
    throw new Error(`rig: invalid memory store ${file}: records must be an array of objects`);
  }
  return parsed.records;
}

function save(file, records) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.${crypto.randomBytes(4).toString('hex')}.tmp`;
  try {
    fs.writeFileSync(temp, `${JSON.stringify({ records }, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
    fs.renameSync(temp, file);
  } finally { fs.rmSync(temp, { force: true }); }
}

function normalise(record) {
  const scope = record.scope === undefined ? 'project' : record.scope;
  if (scope !== 'project' && scope !== 'developer') throw new Error(`rig: invalid memory scope "${scope}"`);
  return {
    id: record.id,
    scope,
    source: record.source || 'unknown',
    value: String(record.value == null ? '' : record.value),
    protected: record.protected === true,
    sole_source: record.sole_source === true,
    superseded: record.superseded === true,
    stored_at: record.stored_at || new Date().toISOString(),
    ...(record.origin ? { origin: record.origin } : {}),
  };
}

/** Store one record. `supersedes` names the source whose value it replaces. */
function put(repo, input) {
  const record = normalise(input);
  // D9: a write outside the repository is attributed to the install that made
  // it, so the user-global store stays accountable and safely removable.
  if (record.scope === 'developer') record.origin = path.resolve(repo);
  const file = storeFile(repo, record.scope);
  return mutate(file, () => {
  const records = load(file).map(normalise);
  for (const existing of records) {
    if (existing.id !== record.id) continue;
    if (input.supersedes && existing.source === input.supersedes) existing.superseded = true;
    if (existing.source === record.source) existing.superseded = true;
  }
  records.push(record);
  save(file, records);
  return record;
  });
}

function allRecords(repo, { include_superseded = false } = {}) {
  const project = load(storeFile(repo, 'project')).map(normalise).map((r) => ({ ...r, scope: r.scope || 'project' }));
  const developer = load(storeFile(repo, 'developer')).map(normalise).map((r) => ({ ...r, scope: 'developer' }));
  const all = [...project, ...developer];
  return include_superseded ? all : all.filter((r) => !r.superseded);
}

/** The full record behind a pointer in the active view. */
function get(repo, id) {
  const live = allRecords(repo).filter((r) => r.id === id);
  if (live.length) return live[live.length - 1];
  return allRecords(repo, { include_superseded: true }).filter((r) => r.id === id).pop();
}

/**
 * The 8 KB working view. Records are admitted newest-first; from the first one
 * that does not fit, every remaining record is represented by its pointer, so
 * evicted content is still findable by identifier.
 */
function activeView(repo) {
  const records = allRecords(repo).slice().reverse();
  const full = (r) => `${r.id} [${r.scope}] ${r.source}: ${r.value}`;
  const pointer = (r) => `${r.id} [${r.scope}] ${r.source} -> memory.get("${r.id}")`;

  const lines = [];
  let used = 0;
  let overflowed = false;
  for (const record of records) {
    const text = overflowed ? pointer(record) : full(record);
    const cost = Buffer.byteLength(text, 'utf8') + 1;
    if (!overflowed && used + cost > CAP) {
      overflowed = true;
      const short = pointer(record);
      const shortCost = Buffer.byteLength(short, 'utf8') + 1;
      if (used + shortCost > CAP) break;
      lines.push(short);
      used += shortCost;
      continue;
    }
    if (used + cost > CAP) break;
    lines.push(text);
    used += cost;
  }
  // Only whole lines are ever appended, so no multibyte character can be split.
  return lines.join('\n');
}

/** A repository may pin its own local model; an unloadable pin is a named failure. */
function localModelFailure(repo) {
  const dir = path.join(repo, '.rig', 'memory');
  let pinned;
  try {
    pinned = fs.readdirSync(dir).filter((name) => /^model\./.test(name) && name !== 'model.json');
  } catch {
    return null;
  }
  if (!pinned.length) return null;
  const manifest = path.join(dir, 'model.json');
  if (!fs.existsSync(manifest)) {
    return `pinned local model ${pinned[0]} has no model.json manifest and cannot be loaded`;
  }
  return `pinned local model ${pinned[0]} is not a supported Rig embedding table`;
}

function words(text) {
  return (String(text).toLowerCase().match(/[a-z0-9]+/g) || []);
}

function lexicalScore(query, value) {
  const q = new Set(words(query));
  if (!q.size) return 0;
  const v = words(value);
  if (!v.length) return 0;
  let shared = 0;
  for (const word of new Set(v)) if (q.has(word)) shared += 1;
  return shared / q.size;
}

function flagged(value) {
  return INJECTION.some((pattern) => pattern.test(value));
}

/**
 * Rank live records against a query. Project records of this repository are
 * always offered; developer records must clear a relevance floor, because they
 * are shared background rather than this project's answer.
 */
function recallDetailed(repo, query, options = {}) {
  const records = allRecords(repo, options);
  const failure = localModelFailure(repo) || embedding.failure();
  const semantic = { ok: !failure };
  if (failure) semantic.failure = failure;

  const rank = (useSemantic) => {
    const queryVector = useSemantic ? embedding.embed(query) : null;
    const score = (record) => (useSemantic
      ? embedding.cosine(queryVector, embedding.embed(record.value))
      : lexicalScore(query, record.value));
    return records
      .map((record) => ({ record, score: score(record) }))
      .filter(({ record, score: s }) => (record.scope === 'developer'
        ? s >= (useSemantic ? DEVELOPER_FLOOR : Number.EPSILON)
        : true))
      // This project's own records answer first; developer memory is portable
      // background that only fills the gaps it is relevant to.
      .sort((a, b) => (a.record.scope === b.record.scope
        ? b.score - a.score
        : (a.record.scope === 'developer' ? 1 : -1)))
      .slice(0, MAX_HITS);
  };
  let scored;
  try { scored = rank(semantic.ok); }
  catch (error) {
    semantic.ok = false;
    semantic.failure = `local semantic search failed: ${error.message}`;
    scored = rank(false);
  }

  const hits = scored.map(({ record, score: s }) => ({
    id: record.id,
    value: record.value,
    scope: record.scope,
    source: record.source,
    score: s,
    kind: 'data',
    grants_authority: false,
    superseded: record.superseded === true,
  }));

  const result = {
    hits,
    mode: semantic.ok ? 'semantic' : 'lexical-fallback',
    semantic,
    injection_flagged: hits.some((hit) => flagged(hit.value)),
  };

  const conflict = detectConflict(scored, semantic);
  if (conflict) result.conflict = conflict;
  return result;
}

/**
 * Two near-identical claims of opposite polarity, both relevant enough that the
 * answer turns on which one holds. Anything weaker is not worth a question.
 */
function detectConflict(scored, semantic) {
  const relevant = scored.filter(({ score }) => score >= CONFLICT_BAR);
  for (let i = 0; i < relevant.length; i += 1) {
    for (let j = i + 1; j < relevant.length; j += 1) {
      const a = relevant[i].record;
      const b = relevant[j].record;
      if (NEGATION.test(a.value) === NEGATION.test(b.value)) continue;
      if (!semantic.ok) continue;
      if (embedding.cosine(embedding.embed(a.value), embedding.embed(b.value)) < CONFLICT_BAR) continue;
      return {
        sources: [a, b].map((r) => ({ id: r.id, source: r.source, value: r.value })),
        resolved_silently: false,
        needs_owner: true,
      };
    }
  }
  return null;
}

function recall(repo, query, options = {}) {
  return recallDetailed(repo, query, options).hits;
}

/** Forgetting never removes the only surviving oracle, decision or evidence. */
function forget(repo, ids) {
  const wanted = new Set(ids);
  const origin = path.resolve(repo);
  const removed = [];
  const refused = [];
  for (const scope of ['project', 'developer']) {
    const file = storeFile(repo, scope);
    if (!fs.existsSync(file)) continue;
    mutate(file, () => {
    const records = load(file).map(normalise);
    const keep = [];
    for (const record of records) {
      if (!wanted.has(record.id)) { keep.push(record); continue; }
      if (scope === 'developer' && record.origin !== origin) { keep.push(record); continue; }
      if (record.protected || record.sole_source) {
        refused.push({
          id: record.id,
          reason: `${record.id} is the sole protected source of a decision or evidence record`,
        });
        keep.push(record);
        continue;
      }
      removed.push(record.id);
    }
    if (keep.length !== records.length) save(file, keep);
    });
  }
  return { removed, refused };
}

/** Build the offline vector index for this repository's project records. */
function index(repo) {
  const records = load(storeFile(repo, 'project')).map(normalise);
  const vectors = {};
  for (const record of records) vectors[record.id] = Array.from(embedding.embed(record.value));
  const payload = { model_revision: embedding.revision(), dims: embedding.dims(), vectors };
  const file = containedPath(repo, '.rig/memory/index.json');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  mutate(file, () => {
    const temp = `${file}.${process.pid}.${crypto.randomBytes(4).toString('hex')}.tmp`;
    try {
      fs.writeFileSync(temp, `${JSON.stringify(payload, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
      fs.renameSync(temp, file);
    } finally { fs.rmSync(temp, { force: true }); }
  });
  return payload;
}

module.exports = { CAP, put, get, activeView, recall, recallDetailed, forget, index, storeFile };
