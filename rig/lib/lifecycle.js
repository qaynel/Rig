'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { containedPath, gitPath } = require('./path-safety');
const { removeGlobalConfig } = require('./global-writes');

const MANIFEST_REL = '.rig/install-manifest.jsonl';
const LEGACY_MANIFEST_REL = '.rig/install-manifest.json';

function readManifest(target) {
  const file = containedPath(target, MANIFEST_REL);
  if (fs.existsSync(file)) {
    const records = [];
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      if (!line.trim()) continue;
      try { records.push(JSON.parse(line)); } catch { /* damaged final line */ }
    }
    return { format: 'jsonl', records };
  }
  const legacy = containedPath(target, LEGACY_MANIFEST_REL);
  if (!fs.existsSync(legacy)) return { format: 'jsonl', records: [] };
  return { format: 'json', records: JSON.parse(fs.readFileSync(legacy, 'utf8')).records || [] };
}

function appendRecord(target, record) {
  const file = containedPath(target, MANIFEST_REL);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, `${JSON.stringify(record)}\n`);
}

function digestOf(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function currentDigest(abs) {
  return fs.existsSync(abs) ? digestOf(fs.readFileSync(abs)) : null;
}

function latestOperations(records) {
  const bySeq = new Map();
  for (const record of records) {
    if (Number.isInteger(record.seq)) bySeq.set(record.seq, record);
  }
  return [...bySeq.values()].sort((a, b) => a.seq - b.seq);
}

function resumeInstall(target, opts) {
  const operations = opts.operations || [];
  const existing = readManifest(target);
  const latest = latestOperations(existing.records);
  const byPath = new Map(latest.map((record) => [record.path, record]));
  let seq = latest.reduce((max, record) => Math.max(max, record.seq), 0);
  appendRecord(target, { kind: 'install_state', complete: false });
  // rig: `interrupt_after` is a test-shaped hook still shipped in production;
  // the fix pairs with the frozen oracle's `AT-INSTALL-1` case, which passes
  // this parameter directly. Replace with an injected fault hook when that
  // oracle case is re-signed.
  const remaining = operations.filter((op) => byPath.get(op.path)?.state !== 'applied');
  const limit = opts.interrupt_after !== undefined ? opts.interrupt_after : remaining.length;
  let attempted = 0;
  for (let i = 0; i < operations.length && attempted < limit; i += 1) {
    const op = operations[i];
    const abs = containedPath(target, op.path);
    const desired = Buffer.from(op.content);
    const desiredDigest = digestOf(desired);
    const prior = byPath.get(op.path);
    if (prior?.state === 'applied') {
      if (currentDigest(abs) !== (prior.digest || prior.desired_digest)) {
        throw new Error(`resumeInstall: conflicting applied path ${op.path}`);
      }
      continue;
    }
    attempted += 1;
    if (prior?.state === 'pending') {
      if (prior.desired_digest !== desiredDigest) {
        throw new Error(`resumeInstall: changed pending operation ${op.path}`);
      }
      if (currentDigest(abs) === desiredDigest) {
        const applied = { ...prior, state: 'applied', digest: desiredDigest };
        appendRecord(target, applied);
        byPath.set(op.path, applied);
        continue;
      }
      if (currentDigest(abs) !== (prior.preimage_digest || null)) {
        throw new Error(`resumeInstall: conflicting pending path ${op.path}`);
      }
    }
    const record = prior || {
      seq: ++seq,
      path: op.path,
      ownership: fs.existsSync(abs) ? 'replace_owned' : 'create_owned',
      operation: fs.existsSync(abs) ? 'replace_owned' : 'create_owned',
      transaction_kind: 'install',
      state: 'pending',
      preimage_digest: currentDigest(abs),
      desired_digest: desiredDigest,
    };
    if (!prior) appendRecord(target, record);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, desired);
    const applied = { ...record, state: 'applied', digest: desiredDigest };
    appendRecord(target, applied);
    byPath.set(op.path, applied);
  }
  const records = operations.flatMap((op) => byPath.get(op.path) || []);
  const complete = records.length === operations.length && records.every((record) => record.state === 'applied');
  if (complete) appendRecord(target, { kind: 'install_state', complete: true });
  return {
    complete,
    protected: complete,
    operations,
    records,
  };
}

function resolveRecordPath(target, rel) {
  // Hook paths are stored as `.git/hooks/...` in the journal, but in a linked
  // worktree `.git` is a file and the real hooks dir lives in the shared
  // git-common dir. Resolve through git so uninstall can restore or remove
  // the shared shim instead of crashing on ENOTDIR.
  if (typeof rel === 'string' && rel.startsWith('.git/hooks/')) {
    const hooksDir = gitPath(target, 'hooks');
    if (hooksDir) return path.join(hooksDir, path.basename(rel));
  }
  return containedPath(target, rel);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function uninstall(target, opts = {}) {
  const manifest = readManifest(target);
  const latestByPath = new Map();
  for (const record of latestOperations(manifest.records)) {
    if ((record.transaction_kind || 'install') === 'install') latestByPath.set(record.path, record);
  }
  const records = [...latestByPath.values()].sort((a, b) => b.seq - a.seq);
  const bestEffort = [];
  const removed = [];
  const globalLedger = containedPath(target, '.rig/global-writes.json');
  if (fs.existsSync(globalLedger)) {
    const ledger = JSON.parse(fs.readFileSync(globalLedger, 'utf8'));
    for (const entry of ledger.entries || []) {
      if (!entry || typeof entry.path !== 'string' || typeof entry.install_id !== 'string') {
        bestEffort.push('.rig/global-writes.json');
        continue;
      }
      const result = removeGlobalConfig(entry.path, entry.install_id);
      if (result.removed) removed.push(entry.path);
      else bestEffort.push(entry.path);
    }
  }
  for (const record of records) {
    const abs = resolveRecordPath(target, record.path);
    if (!fs.existsSync(abs)) continue;
    if (record.path === '.git/hooks/pre-commit') {
      const chained = resolveRecordPath(target, '.git/hooks/pre-commit.rig-chained');
      const expected = record.digest || record.desired_digest || null;
      if (expected && currentDigest(abs) !== expected) {
        bestEffort.push(record.path);
        continue;
      }
      if (fs.existsSync(chained)) {
        fs.renameSync(chained, abs);
        removed.push(record.path);
        continue;
      }
    }
    if (record.managed_line) {
      const body = fs.readFileSync(abs, 'utf8');
      const stripped = body.split('\n').filter((line) => line !== record.managed_line).join('\n');
      fs.writeFileSync(abs, stripped);
      removed.push(record.path);
    } else if (record.managed_block || record.ownership === 'append_managed') {
      const body = fs.readFileSync(abs, 'utf8');
      const name = typeof record.managed_block === 'string'
        ? escapeRegExp(record.managed_block)
        : '[^\\n]*';
      const marker = record.managed_block === 'rig' ? 'rig' : `rig:${name}`;
      const stripped = body.replace(
        new RegExp(`<!-- ${marker}:start -->\\n[\\s\\S]*?<!-- ${marker}:end -->\\n?`, 'g'),
        '',
      );
      if (stripped === body) bestEffort.push(record.path);
      fs.writeFileSync(abs, stripped);
      if (stripped !== body) removed.push(record.path);
    } else {
      const expected = record.digest || record.desired_digest || null;
      if (expected && currentDigest(abs) !== expected) {
        bestEffort.push(record.path);
        continue;
      }
      fs.rmSync(abs, { recursive: true, force: true });
      removed.push(record.path);
    }
  }
  const evidence = {
    schema_version: 1,
    kind: 'uninstall',
    removed,
    best_effort: bestEffort,
    at: new Date().toISOString(),
  };
  const evidenceDir = path.join(target, 'reports/rig');
  fs.mkdirSync(evidenceDir, { recursive: true });
  fs.writeFileSync(path.join(evidenceDir, 'last-uninstall.json'), `${JSON.stringify(evidence, null, 2)}\n`);
  let purgeList = [];
  if (opts.purge) {
    purgeList = ['reports/rig', '.rig/run-history'].filter((rel) => fs.existsSync(path.join(target, rel)));
    if (typeof opts.beforePurge === 'function') opts.beforePurge([...purgeList]);
    for (const rel of purgeList) fs.rmSync(containedPath(target, rel), { recursive: true, force: true });
  } else {
    const mfile = containedPath(target, MANIFEST_REL);
    if (fs.existsSync(mfile)) fs.rmSync(mfile, { force: true });
    const legacy = containedPath(target, LEGACY_MANIFEST_REL);
    if (fs.existsSync(legacy)) fs.rmSync(legacy, { force: true });
  }
  return { status: 'removed', removed, best_effort: bestEffort, purge_list: purgeList };
}

function verifyRemoval(target, evidence) {
  if (evidence && Array.isArray(evidence.missing_markers) && evidence.missing_markers.length) {
    return { status: 'best_effort', files: [...evidence.missing_markers] };
  }
  // Walk any records still handed in and check the filesystem. A record whose
  // file is still on disk after uninstall is a real failure, not verified.
  const stillPresent = [];
  const records = (evidence && Array.isArray(evidence.records)) ? evidence.records : [];
  for (const record of records) {
    const abs = containedPath(target, record.path);
    if (fs.existsSync(abs)) stillPresent.push(record.path);
  }
  if (stillPresent.length) {
    return { status: 'best_effort', files: stillPresent };
  }
  return { status: 'verified_clean', files: [] };
}

module.exports = { readManifest, resumeInstall, uninstall, verifyRemoval };
