'use strict';

// Worker briefs, independent-evidence acceptance and file-ownership leases.
// A brief is built by copying only the sources a scope names, so nothing is
// read speculatively and nothing has to be stripped afterwards.

const fs = require('fs');
const path = require('path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { acquireLock } = require('../../lib/apply');
const { containedPath } = require('../../lib/path-safety');
const { sourceDigest } = require('./release-evidence');
const journal = require('./run-journal');
const { redact } = require('../../lib/redaction');

/* Scoped state exclusion ported from LangChain DeepAgents, MIT:
 * https://github.com/langchain-ai/deepagents/blob/0f7ddb463fc6a0164756a98eed9ccb6f590cf797/libs/deepagents/deepagents/middleware/subagents.py
 * Components: _EXCLUDED_STATE_KEYS and non-fork subagent_state filtering.
 * Keep: excluded/private-key filtering; discard: LangGraph runtime, messages,
 * reducers, fork support and all tools. Rig supplies only explicit task context.
 * Copyright (c) LangChain, Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const EXCLUDED_STATE_KEYS = new Set(['messages', 'todos', 'structured_response',
  'skills_metadata', 'pinned_skills', '_skill_tools_disclosed', '_deepagents_forked_context', 'rubric']);
const SECRET_STATE_KEY = /token|passw|secret|credential|api.?key|private.?key|signer|authorization/i;

function scopedContext(value, privateKeys = [], seen = new Set(), depth = 0) {
  if (!Array.isArray(privateKeys) || privateKeys.some((k) => typeof k !== 'string')) throw new Error('private state keys must be JSON strings');
  if (value === null || typeof value === 'boolean') return value;
  if (typeof value === 'string') return redact(value);
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (!value || typeof value !== 'object' || (!Array.isArray(value)
    && ![Object.prototype, null].includes(Object.getPrototypeOf(value)))) throw new Error('worker context must contain only plain JSON values');
  if (seen.has(value)) throw new Error('cyclic worker context is not JSON');
  // rig: bounded recursion rejects pathological input; use iterative traversal
  // if legitimate task context ever requires more than 64 nested containers.
  if (depth >= 64) throw new Error('worker JSON context exceeds nesting limit');
  seen.add(value);
  const descriptors = Object.getOwnPropertyDescriptors(value);
  const entries = [];
  for (const key of Reflect.ownKeys(descriptors)) {
    if (Array.isArray(value) && key === 'length') continue;
    const descriptor = descriptors[key];
    if (typeof key !== 'string' || !Object.hasOwn(descriptor, 'value')) throw new Error('worker context must be plain JSON without accessors or symbols');
    if (EXCLUDED_STATE_KEYS.has(key) || SECRET_STATE_KEY.test(key)
      || ['__proto__', 'constructor', 'prototype'].includes(key)
      || privateKeys.some((k) => k.toLowerCase() === key.toLowerCase())) continue;
    entries.push([key, scopedContext(descriptor.value, privateKeys, seen, depth + 1)]);
  }
  seen.delete(value);
  if (!Array.isArray(value)) return Object.fromEntries(entries);
  if (entries.length !== value.length || entries.some(([key], i) => key !== String(i))) throw new Error('worker context arrays must be dense JSON arrays');
  return entries.map(([, item]) => item);
}

const DEFAULT_LEASE_SECONDS = 900;
const SAFE_ID = /^[A-Za-z0-9_-]+$/;

// Repo-relative key for a path. Refuses traversal, dotfiles and private/ state.
function key(root, rel) {
  if (typeof rel !== 'string' || rel === '') throw new Error('path must be a non-empty string');
  const r = path.relative(root, path.resolve(root, rel));
  const parts = r.split(path.sep);
  if (r === '' || parts[0] === '..' || path.isAbsolute(r)
    || parts.some((p) => p.startsWith('.') || p === 'private')) {
    throw new Error(`refused path outside the allowed repository surface: ${rel}`);
  }
  return parts.join('/');
}

// A source is also checked after symlink resolution, so a link cannot smuggle in .env or outside files.
function sourceKey(repo, rel) {
  const root = fs.realpathSync(repo);
  const k = key(root, rel);
  return key(root, path.relative(root, fs.realpathSync(path.join(root, k))));
}

function brief(repo, scope) {
  if (typeof scope.id !== 'string' || !SAFE_ID.test(scope.id)) throw new Error(`invalid scope id: ${scope.id}`);
  return {
    id: scope.id,
    owns: scope.owns.map((f) => key(repo, f)),
    criteria: scope.criteria.slice(),
    sources: scope.sources.map((p) => {
      const k = sourceKey(repo, p);
      return { path: k, content: fs.readFileSync(path.join(repo, k), 'utf8') };
    }),
    ...(Object.hasOwn(scope, 'context') ? { context: scopedContext(scope.context, scope.private_state_keys) } : {}),
  };
}

function publish(repo, scope) {
  const b = brief(repo, scope);
  const rel = path.join('.rig', 'workers', b.id, 'artifact.json');
  const abs = containedPath(repo, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, JSON.stringify(b, null, 2));
  return rel;
}

function load(file, fallback) {
  const value = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback;
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('worker state must be a JSON object');
  return Object.assign(Object.create(null), value);
}

function save(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2));
  fs.renameSync(tmp, file);
}

function locked(repo, operation) {
  let lock;
  try { lock = acquireLock(repo, 'worker-state'); }
  catch (e) { return { granted: false, accepted: false, conflict: e.message, reason: e.message }; }
  try { return operation(); } finally { fs.unlinkSync(lock); }
}

function ownershipKey(repo, rel) {
  const root = fs.realpathSync(repo);
  let cursor = containedPath(root, key(root, rel));
  const tail = [];
  while (!fs.existsSync(cursor)) { tail.unshift(path.basename(cursor)); cursor = path.dirname(cursor); }
  return key(root, path.relative(root, path.join(fs.realpathSync(cursor), ...tail)));
}
const overlaps = (a, b) => a === b || a.startsWith(`${b}/`) || b.startsWith(`${a}/`);

function ownedSnapshot(repo, rel) {
  const abs = containedPath(repo, rel);
  const hash = crypto.createHash('sha256');
  const locks = [];
  const visit = (file) => {
    let stat;
    try { stat = fs.lstatSync(file); } catch (error) { if (error.code !== 'ENOENT') throw error; hash.update('missing'); return; }
    const name = path.relative(abs, file);
    if (path.basename(file).endsWith('.lock')) locks.push(path.relative(repo, file));
    hash.update(`${name}\0${stat.mode & 0o777}\0`);
    if (stat.isDirectory()) for (const entry of fs.readdirSync(file).sort()) visit(path.join(file, entry));
    else if (stat.isSymbolicLink()) hash.update(`link\0${fs.readlinkSync(file)}\0`);
    else if (stat.isFile()) hash.update(fs.readFileSync(file)).update('\0');
    else throw new Error('worker ownership contains an unsupported file type');
  };
  visit(abs);
  if (fs.existsSync(`${abs}.lock`)) locks.push(`${rel}.lock`);
  return { digest: hash.digest('hex'), locks };
}

function ownerAlive(pid) {
  if (!Number.isSafeInteger(pid) || pid < 1) return null;
  try { process.kill(pid, 0); return true; } catch (error) { return error.code === 'ESRCH' ? false : null; }
}

// Start time distinguishes a recycled PID from the process that reserved the work.
// rig: Windows has no portable start-time read here, so a live PID stays "alive"
// and is not reclaimed. Upgrade with a process-creation counter when that OS is in the lane.
function observeProcess(pid) {
  const alive = ownerAlive(pid);
  if (alive !== true) return { alive, started_at: null };
  let started_at = null;
  if (process.platform === 'linux') {
    try {
      const stat = fs.readFileSync(`/proc/${pid}/stat`, 'utf8');
      const fields = stat.slice(stat.lastIndexOf(')') + 2).trim().split(/\s+/);
      started_at = fields[19] || null;
    } catch { started_at = null; }
  } else if (process.platform === 'darwin') {
    const result = spawnSync('ps', ['-p', String(pid), '-o', 'lstart='], { encoding: 'utf8' });
    if (result.status === 0) started_at = result.stdout.trim() || null;
  }
  return { alive, started_at };
}

function classifyOwner(recorded, observed) {
  if (!observed || observed.alive === null) return 'unknown';
  if (observed.alive === false) return 'exited';
  if (recorded && recorded.started_at && observed.started_at && recorded.started_at !== observed.started_at) return 'reused';
  if (observed.alive === true) return 'alive';
  return 'unknown';
}

const workersDir = (repo) => containedPath(repo, '.rig/workers');
const leasesFile = (repo) => path.join(workersDir(repo), 'leases.json');
const stateFile = (repo) => path.join(workersDir(repo), 'state.json');

// Shared receipt lineage for package acceptance and efficiency promotion.
function verification(repo, pkg) {
  const digest = sourceDigest(repo);
  const tool = journal.evidence(repo, pkg);
  if (!tool || !journal.verify(repo, pkg).current || tool.candidate_digest !== digest
    || tool.green?.exit_code !== 0 || typeof tool.green?.command !== 'string' || !tool.green.command.trim()
    || !Array.isArray(tool.required) || !tool.required.includes('full gate')
    || typeof tool.full_gate_command !== 'string' || !tool.full_gate_command.trim()
    || tool.checks?.[tool.green.command] !== digest
    || tool.checks?.['full gate'] !== digest) return { valid: false, reason: 'missing current tool verification and full gate evidence' };
  const file = containedPath(repo, '.rig/review/ledger.json');
  let ledger;
  try { ledger = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return { valid: false, reason: 'missing independent review ledger' }; }
  const review = Array.isArray(ledger.rounds) ? ledger.rounds.at(-1) : null;
  if (!review || review.verdict !== 'pass' || review.candidate_digest !== digest || review.findings_count !== 0
    || typeof ledger.author !== 'string' || !ledger.author.trim()
    || typeof review.reviewer !== 'string' || !review.reviewer.trim()
    || review.reviewer === pkg || review.reviewer === ledger.author
    || !Array.isArray(ledger.findings) || ledger.findings.some((f) => f.status === 'open')) {
    return { valid: false, reason: 'missing current completed independent passing review' };
  }
  return { valid: true, candidate_digest: digest, tool, review };
}

// Only entries from outside the worker count; the worker's own self_report is never read.
function accept(repo, { package: pkg, evidence }) {
  if (typeof pkg !== 'string' || !SAFE_ID.test(pkg)) throw new Error('invalid package id');
  const digest = sourceDigest(repo);
  const independent = Array.isArray(evidence) && evidence.length > 0
    && evidence.every((e) => e && typeof e === 'object' && typeof e.source === 'string'
      && e.source.trim() && e.source !== 'worker' && e.status === 'pass'
      && e.passed !== false && (e.exit_code === undefined || e.exit_code === 0)
      && e.package === pkg && e.candidate_digest === digest);
  if (!independent) return { accepted: false, reason: 'worker self-report is not independent evidence' };
  return locked(repo, () => {
    if (sourceDigest(repo) !== digest) return { accepted: false, reason: 'candidate changed during acceptance' };
    const verified = verification(repo, pkg);
    if (!verified.valid) return { accepted: false, reason: verified.reason };
    const states = load(stateFile(repo), {});
    states[pkg] = { status: 'accepted', candidate_digest: digest, evidence, verification: verified };
    save(stateFile(repo), states);
    return { accepted: true };
  });
}

function state(repo, pkg) {
  return load(stateFile(repo), {})[pkg] || { status: 'open' };
}

function reserve(repo, { package: pkg, owns, lease_seconds: leaseSeconds = DEFAULT_LEASE_SECONDS, owner_pid = process.pid }) {
  // rig: the default identifies same-process writers only. External workers
  // must supply their actual lifetime PID; unknown host ownership is a gap.
  if (typeof pkg !== 'string' || !SAFE_ID.test(pkg) || !Array.isArray(owns) || !owns.length
    || !Number.isFinite(leaseSeconds) || leaseSeconds < 0 || !Number.isFinite(Date.now() + leaseSeconds * 1000)) throw new Error('invalid worker lease');
  return locked(repo, () => {
    const leases = load(leasesFile(repo), {});
    if (ownerAlive(owner_pid) !== true) return { granted: false, conflict: 'worker owner PID is absent or cannot be verified alive' };
    const now = Date.now();
    const keys = owns.map((f) => ownershipKey(repo, f));
    const conflicts = [];
    for (const f of keys) {
      for (const [held, l] of Object.entries(leases)) {
        if (!overlaps(f, held)) continue;
        if (!l || l.package === pkg) continue;
        conflicts.push(l.expires_at_ms <= now
          ? `${f} is held by stale/expired owner ${l.package}; reclaim it with evidence`
          : `${f} is held by ${l.package}`);
      }
    }
    if (conflicts.length) return { granted: false, conflict: conflicts.join('; ') };
    const observed = observeProcess(owner_pid);
    for (const f of keys) leases[f] = {
      package: pkg, owner_pid, owner_started_at: observed.started_at, source_snapshot: ownedSnapshot(repo, f).digest, expires_at_ms: now + leaseSeconds * 1000,
    };
    save(leasesFile(repo), leases);
    return { granted: true };
  });
}

function reclaim(repo, { package: pkg, owns, evidence }) {
  if (typeof pkg !== 'string' || !SAFE_ID.test(pkg) || !Array.isArray(owns) || !owns.length) throw new Error('invalid package id or ownership');
  return locked(repo, () => {
    const ev = evidence || {};
    const leases = load(leasesFile(repo), {});
    const now = Date.now();
    const keys = owns.map((f) => ownershipKey(repo, f));
    const held = Object.keys(leases).filter((f) => keys.some((k) => overlaps(k, f)));
    if (!held.length) return { granted: false, reason: 'no recorded owner to recover; reserve unowned paths normally' };
    const live = held.filter((f) => leases[f].expires_at_ms > now);
    if (live.length) return { granted: false, reason: `held by an unexpired lease: ${live.join(', ')}` };
    const owner_verdicts = [];
    for (const f of held) {
      const verdict = classifyOwner({ started_at: leases[f].owner_started_at || null }, observeProcess(leases[f].owner_pid));
      if (verdict !== 'exited' && verdict !== 'reused') {
        return { granted: false, reason: 'recorded owner is still alive or its exit cannot be verified' };
      }
      owner_verdicts.push(verdict);
      const snapshot = ownedSnapshot(repo, f);
      if (!leases[f].source_snapshot || snapshot.digest !== leases[f].source_snapshot) return { granted: false, reason: `owned source snapshot changed or missing for ${f}; reconcile partial worker writes` };
      if (snapshot.locks.length) return { granted: false, reason: `pending file locks require reconciliation: ${snapshot.locks.join(', ')}` };
    }
    const journalFile = containedPath(repo, '.rig/journal.json');
    if (fs.existsSync(journalFile)) {
      let recorded;
      try { recorded = JSON.parse(fs.readFileSync(journalFile, 'utf8')); } catch { return { granted: false, reason: 'journal is corrupt; reconcile pending effects before recovery' }; }
      if (!recorded || typeof recorded !== 'object' || Array.isArray(recorded)
        || (recorded.pending && (typeof recorded.pending !== 'object' || Object.keys(recorded.pending).length))) {
        return { granted: false, reason: 'pending journal side effects require reconciliation before recovery' };
      }
    }
    const checked = { ...ev, owner_pid: leases[held[0]].owner_pid, owner_verdicts,
      verified_owner_pids: [...new Set(held.map((f) => leases[f].owner_pid))], journal_reconciled: true, owned_sources_unchanged: true };
    for (const f of held) delete leases[f];
    for (const f of keys) {
      leases[f] = { package: pkg, owner_pid: process.pid, source_snapshot: ownedSnapshot(repo, f).digest,
        expires_at_ms: now + DEFAULT_LEASE_SECONDS * 1000, evidence: checked };
    }
    save(leasesFile(repo), leases);
    return { granted: true, evidence_checked: checked };
  });
}

module.exports = { brief, publish, accept, state, reserve, reclaim, verification, ownershipKey, overlaps, classifyOwner, observeProcess };
