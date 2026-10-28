'use strict';

// Trace retention for the reasoning wiki: a cadence audit, a deterministic
// fact map over traces and protected evidence, and fidelity-checked compaction
// that archives only duplicate traces (same instant and body). Local work only; no
// provider is ever called.

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const MINUTE = 60000;

const rel = (repo, abs) => path.relative(repo, abs).split(path.sep).join('/');
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const readJson = (file, fallback) => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback);
const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
};
const manifestFile = (repo) => path.join(repo, '.rig', 'archive', 'manifest.json');

// Only flat `key: value` lines in the leading `---` block are read.
function frontmatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  const out = {};
  if (m) for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i > 0) out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return out;
}

function traceFiles(repo) {
  const dir = path.join(repo, 'wiki', 'reasoning');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((n) => n.endsWith('.md') && n !== 'README.md').sort().map((n) => {
    const text = fs.readFileSync(path.join(dir, n), 'utf8');
    const front = frontmatter(text);
    // Identity is instant + body, so the same entry re-stamped in another ISO form is one record.
    const time = timeOf(front);
    const body = text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '').trim();
    return { rel: rel(repo, path.join(dir, n)), sha: sha(Number.isFinite(time) ? `${time}\n${body}` : text), front };
  });
}

// `at` is the timestamp; a bare `date` falls back to midnight UTC.
function timeOf(front) {
  if (front.at) return Date.parse(front.at);
  if (front.date) return Date.parse(`${front.date}T00:00:00Z`);
  return NaN;
}

const decisionsOf = (front) => (front.decisions || '').split(',').map((s) => s.trim()).filter(Boolean);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

// Facts are first-wins over files in name order; `skip` removes files from the projection.
function factsOf(repo, skip = new Set()) {
  const facts = {};
  const put = (key, origin) => { if (!Object.hasOwn(facts, key)) facts[key] = origin; };
  for (const t of traceFiles(repo)) {
    if (skip.has(t.rel)) continue;
    put(`trace:${t.sha}`, t.rel);
    for (const id of decisionsOf(t.front)) put(`decision:${id}`, t.rel);
  }
  for (const abs of [...walk(path.join(repo, '.rig', 'evidence')), ...walk(path.join(repo, 'wiki', 'gate1'))]) {
    put(`evidence:${rel(repo, abs)}`, rel(repo, abs));
  }
  return facts;
}

function sourceMap(repo) {
  const facts = factsOf(repo);
  return { facts, count: Object.keys(facts).length };
}

function lookup(repo, fact) {
  const live = sourceMap(repo).facts;
  if (Object.hasOwn(live, fact)) return { fact, origin: live[fact], archived: false };
  const moved = readJson(manifestFile(repo), { moved: [] }).moved.find((m) => fact === `trace:${m.sha256}`);
  return moved ? { fact, origin: moved.archived_to, archived: true } : null;
}

function cadence(repo, { started, cadence_minutes = 3, now } = {}) {
  const traces = traceFiles(repo)
    .map((t) => ({ rel: t.rel, time: timeOf(t.front) }))
    .filter((t) => Number.isFinite(t.time))
    .sort((a, b) => a.time - b.time || (a.rel < b.rel ? -1 : 1));
  const gaps = [];
  let prev = { label: 'start', time: new Date(started).getTime() };
  const check = (label, time) => {
    const minutes = (time - prev.time) / MINUTE;
    if (minutes > cadence_minutes) gaps.push({ after: prev.label, before: label, minutes });
    prev = { label, time };
  };
  for (const t of traces) check(t.rel, t.time);
  if (now !== undefined) check('now', new Date(now).getTime());
  return { within_cadence: gaps.length === 0, gaps, traces: traces.map((t) => t.rel) };
}

// Only later duplicates (same instant and body) are archived; the first by name stays live.
// shortcut: the fidelity check is the only guard, so a lossy decision re-map is caught by facts, not by content diff.
function compact(repo, { inject_omission } = {}) {
  const before = factsOf(repo);
  const seen = new Map();
  const moves = [];
  for (const t of traceFiles(repo)) {
    if (seen.has(t.sha)) {
      moves.push({ file: t.rel, archived_to: `.rig/archive/reasoning/${path.basename(t.rel)}`, sha256: t.sha, duplicate_of: seen.get(t.sha) });
    } else seen.set(t.sha, t.rel);
  }
  for (const m of moves) {
    if (fs.existsSync(path.join(repo, m.archived_to))) throw new Error(`archive collision: ${m.archived_to}`);
  }

  const after = factsOf(repo, new Set(moves.map((m) => m.file)));
  if (inject_omission) {
    for (const key of Object.keys(after)) {
      if (path.posix.basename(after[key]) === inject_omission) delete after[key];
    }
  }
  const missing = Object.keys(before).filter((k) => after[k] !== before[k]).map((k) => before[k]);
  if (missing.length) return { applied: false, archived: [], missing_source: [...new Set(missing)].join(', ') };

  for (const m of moves) {
    fs.mkdirSync(path.dirname(path.join(repo, m.archived_to)), { recursive: true });
    fs.renameSync(path.join(repo, m.file), path.join(repo, m.archived_to));
  }
  if (moves.length) {
    const manifest = readJson(manifestFile(repo), { moved: [] });
    writeJson(manifestFile(repo), { moved: [...manifest.moved, ...moves] });
  }
  writeJson(path.join(repo, '.rig', 'memory', 'source-map.json'), { generated_at: new Date().toISOString(), facts: before });
  return { applied: true, archived: moves.map((m) => m.file) };
}

// The second argument (a provider) is accepted for the contract and never called.
function upkeep(repo) {
  const result = compact(repo);
  const summary = { at: new Date().toISOString(), steps: ['index', 'compact'], applied: result.applied, paid_calls: 0 };
  writeJson(path.join(repo, '.rig', 'memory', 'last-upkeep.json'), summary);
  return summary;
}

function lastUpkeep(repo) {
  return readJson(path.join(repo, '.rig', 'memory', 'last-upkeep.json'), null);
}

module.exports = { cadence, sourceMap, lookup, compact, upkeep, lastUpkeep };
