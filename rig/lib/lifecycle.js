'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { containedPath, gitPath } = require('./path-safety');
const { removeGlobalConfig, removeGlobalMcp } = require('./global-writes');
const { removeOpenClawMcp } = require('./openclaw-mcp');
const { PROVIDERS: CI_PROVIDERS, GITHUB_WORKFLOW_POINTER } = require('./ci-adapters');

const MANIFEST_REL = '.rig/install-manifest.jsonl';
const LEGACY_MANIFEST_REL = '.rig/install-manifest.json';
const PRUNE_TOP = new Set(['.rig', '.claude', '.agents', '.github']);
const INSTALL_TOP_LEVEL = new Set([
  '.rig', '.claude', '.agents',
  '.cursor', '.codex', '.openclaw', '.opencode', '.devin', '.kiro', '.gemini',
  '.windsurf', '.swival', '.codewhale', '.pi', '.clinerules', '.vscode',
]);
const INSTALL_GRAFT_FILES = new Set([
  'AGENTS.md', 'CLAUDE.md', 'GEMINI.md', '.github/copilot-instructions.md', '.gitignore',
]);
const INSTALL_UNIQUE_CI_FILES = new Set([CI_PROVIDERS['github-actions'].file]);
const INSTALL_HOOK_PATHS = new Set([
  '.git/hooks/pre-commit',
  '.git/hooks/pre-commit.rig-chained',
]);

function isManagedAddition(record) {
  return Boolean(record.managed_line || record.managed_block || record.ownership === 'append_managed' || record.ownership === 'graft_managed');
}

function isGitResolvedPath(rel) {
  return INSTALL_HOOK_PATHS.has(rel) || rel === '.rig/install-id';
}

function classifiedRel(target, record, abs) {
  if (isGitResolvedPath(record.path)) return record.path;
  const root = fs.realpathSync(target);
  let resolved = abs;
  try {
    if (fs.existsSync(abs)) resolved = fs.realpathSync(abs);
  } catch {
    resolved = abs;
  }
  const rel = path.relative(root, resolved);
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`repository path escapes target: ${record.path}`);
  }
  return rel.split(path.sep).join('/');
}

function isRigInstallPath(rel, record = {}) {
  if (typeof rel !== 'string' || !rel || path.isAbsolute(rel)) return false;
  if (rel.split(/[/\\]/).some((part) => part === '..' || part === '.' || part === '')) return false;
  if (INSTALL_HOOK_PATHS.has(rel)) return true;
  const top = rel.split(/[/\\]/)[0];
  if (INSTALL_GRAFT_FILES.has(rel)) return isManagedAddition(record);
  if (INSTALL_UNIQUE_CI_FILES.has(rel) || rel.startsWith('.github/workflows/')) {
    // rig: journal fields are editable. CI removal is two positive attributions
    // only: the dedicated Rig workflow as a whole file, or the exact pointer
    // line ci-adapters appends. A second managed CI line needs its own marker
    // here, not a generic managed_line / managed_block / ownership claim.
    return (rel.startsWith('.github/workflows/')
      && record.ownership === 'append_managed'
      && record.managed_line === GITHUB_WORKFLOW_POINTER)
      || (INSTALL_UNIQUE_CI_FILES.has(rel) && record.ownership === 'create_owned');
  }
  return INSTALL_TOP_LEVEL.has(top);
}

function parseJournalRecords(text) {
  const lines = String(text).split('\n');
  const records = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim()) continue;
    try {
      records.push(JSON.parse(line));
    } catch {
      const later = lines.slice(i + 1).some((next) => next.trim());
      if (later) throw new Error(`manifest record is not valid JSON (line ${i + 1})`);
    }
  }
  return records;
}

function readManifest(target) {
  const file = containedPath(target, MANIFEST_REL);
  if (fs.existsSync(file)) {
    return { format: 'jsonl', records: parseJournalRecords(fs.readFileSync(file, 'utf8')) };
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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
  if (rel === '.rig/install-id') {
    const abs = gitPath(target, path.join('rig', 'install-id'));
    if (abs) return abs;
  }
  return containedPath(target, rel);
}

function pruneEmptyParents(target, rel) {
  if (typeof rel !== 'string') return;
  const top = rel.split(/[/\\]/)[0];
  if (!PRUNE_TOP.has(top)) return;
  let abs;
  try {
    abs = containedPath(target, rel);
  } catch {
    return;
  }
  const root = fs.realpathSync(target);
  let dir = path.dirname(abs);
  while (dir !== root && dir.startsWith(`${root}${path.sep}`)) {
    const relDir = path.relative(root, dir);
    if (!PRUNE_TOP.has(relDir.split(path.sep)[0])) break;
    if (!fs.existsSync(dir)) {
      dir = path.dirname(dir);
      continue;
    }
    let entries;
    try { entries = fs.readdirSync(dir); } catch { break; }
    if (entries.length) break;
    fs.rmdirSync(dir);
    dir = path.dirname(dir);
  }
}

function dropEmptyOrWrite(abs, stripped) {
  if (!stripped.trim()) {
    fs.rmSync(abs, { force: true });
    return 'deleted';
  }
  fs.writeFileSync(abs, stripped);
  return 'rewritten';
}

function uninstall(target, opts = {}) {
  const manifest = readManifest(target);
  const latestByPath = new Map();
  for (const record of latestOperations(manifest.records)) {
    if ((record.transaction_kind || 'install') === 'install') latestByPath.set(record.path, record);
  }
  const records = [...latestByPath.values()].sort((a, b) => b.seq - a.seq);
  const resolvedRecordPaths = new Map(records.map((record) => [
    record,
    resolveRecordPath(target, record.path),
  ]));
  const bestEffort = [];
  const bestEffortDetails = [];
  const removed = [];
  const deletedRels = [];
  const preservePrefixes = [];
  let stopped = false;
  const globalLedger = containedPath(target, '.rig/global-writes.json');
  if (fs.existsSync(globalLedger)) {
    let ledger;
    try {
      ledger = JSON.parse(fs.readFileSync(globalLedger, 'utf8'));
    } catch {
      bestEffort.push('.rig/global-writes.json');
      ledger = null;
    }
    if (ledger) {
      const retainedEntries = [];
      for (const entry of ledger.entries || []) {
        if (!entry || typeof entry.path !== 'string' || typeof entry.install_id !== 'string') {
          bestEffort.push('.rig/global-writes.json');
          retainedEntries.push(entry);
          continue;
        }
        const result = entry.kind === 'openclaw-mcp'
          ? removeOpenClawMcp(target, entry)
          : entry.kind === 'global-mcp'
            ? removeGlobalMcp(entry)
            : entry.kind === undefined || entry.kind === 'json-namespace'
              ? removeGlobalConfig(entry.path, entry.install_id)
              : { removed: false };
        if (result.removed) removed.push(entry.path);
        else {
          bestEffort.push(entry.path);
          bestEffortDetails.push(`${entry.path} (${entry.server_key || entry.install_id})`);
          retainedEntries.push(entry);
          if (entry.kind === 'openclaw-mcp') {
            if (entry.runtime) preservePrefixes.push(entry.runtime);
            // Missing tooling: keep removing unrelated local files (RIG-127.9).
            // Present tooling that fails unregister: stop so a live global
            // entry cannot be left pointing at deleted runtime bytes.
            if (!result.tooling_missing) stopped = true;
          }
        }
      }
      if (retainedEntries.length === 0 && (ledger.entries || []).length > 0) {
        fs.rmSync(globalLedger, { force: true });
        deletedRels.push('.rig/global-writes.json');
      } else if (retainedEntries.length !== (ledger.entries || []).length) {
        fs.writeFileSync(globalLedger, `${JSON.stringify({ ...ledger, entries: retainedEntries }, null, 2)}\n`);
      }
    }
  }
  // The chained path holds the user's original hook so uninstall can restore
  // it. Skip it in the main pass so a higher-seq backup record cannot delete
  // it before the shim decision; restore consumes it by rename, and a
  // best-effort shim still needs it for a later retry.
  let retainChainedBackup = false;
  if (!stopped) for (const record of records) {
    if (record.path === '.git/hooks/pre-commit.rig-chained') continue;
    const abs = resolvedRecordPaths.get(record);
    const rel = classifiedRel(target, record, abs);
    if (preservePrefixes.some((prefix) => rel === prefix || rel.startsWith(`${prefix}/`))) {
      bestEffort.push(record.path);
      continue;
    }
    if (!isRigInstallPath(rel, record)) {
      bestEffort.push(record.path);
      continue;
    }
    if (record.ownership === 'graft_managed') {
      const capabilities = Array.isArray(record.managed_grafts)
        ? record.managed_grafts.map(({ capability }) => capability).filter(Boolean).sort()
        : [];
      if (!capabilities.length) {
        bestEffort.push(record.path);
        continue;
      }
      const { journalWriter, removeGraftSection } = require('./payload');
      const writer = journalWriter(target);
      try {
        for (const capability of capabilities) {
          if (!fs.existsSync(abs)) break;
          const result = removeGraftSection(target, {
            path: record.path,
            capability,
            expected_file_digest: currentDigest(abs),
          }, writer);
          if (!result.changed) throw new Error(`missing managed graft ${capability}`);
        }
        writer.finish();
        removed.push(record.path);
      } catch {
        writer.finish();
        bestEffort.push(record.path);
      }
      continue;
    }
    if (record.path === '.git/hooks/pre-commit') {
      const chained = resolveRecordPath(target, '.git/hooks/pre-commit.rig-chained');
      const expected = record.digest || record.desired_digest || null;
      if (fs.existsSync(abs) && expected && currentDigest(abs) !== expected) {
        bestEffort.push(record.path);
        retainChainedBackup = true;
        continue;
      }
      if (fs.existsSync(chained)) {
        fs.renameSync(chained, abs);
        removed.push(record.path);
        continue;
      }
      if (!fs.existsSync(abs)) continue;
    } else if (!fs.existsSync(abs)) {
      continue;
    } else {
      const st = fs.lstatSync(abs);
      if (st.isSymbolicLink() || (st.isFile() && st.nlink > 1)) {
        // rig: never write through an in-repo symlink or extra hard link;
        // journal path and mutation target must be the same file name.
        bestEffort.push(record.path);
        continue;
      }
    }
    const uniqueCi = INSTALL_UNIQUE_CI_FILES.has(rel) && record.ownership === 'create_owned';
    const pointerStrip = rel.startsWith('.github/workflows/')
      && record.ownership === 'append_managed'
      && record.managed_line === GITHUB_WORKFLOW_POINTER;
    if (pointerStrip) {
      const body = fs.readFileSync(abs, 'utf8');
      if (!body.split('\n').includes(GITHUB_WORKFLOW_POINTER)) {
        bestEffort.push(record.path);
        continue;
      }
      const stripped = body.split('\n').filter((line) => line !== GITHUB_WORKFLOW_POINTER).join('\n');
      if (dropEmptyOrWrite(abs, stripped) === 'deleted') deletedRels.push(rel);
      removed.push(record.path);
    } else if (uniqueCi) {
      const expected = record.digest || record.desired_digest || null;
      if (!expected || currentDigest(abs) !== expected) {
        bestEffort.push(record.path);
        continue;
      }
      fs.rmSync(abs, { recursive: true, force: true });
      removed.push(record.path);
      deletedRels.push(rel);
    } else if (record.managed_line) {
      const body = fs.readFileSync(abs, 'utf8');
      const stripped = body.split('\n').filter((line) => line !== record.managed_line).join('\n');
      if (dropEmptyOrWrite(abs, stripped) === 'deleted') deletedRels.push(record.path);
      removed.push(record.path);
    } else if (record.managed_block || record.ownership === 'append_managed') {
      const body = fs.readFileSync(abs, 'utf8');
      const name = typeof record.managed_block === 'string'
        ? escapeRegExp(record.managed_block)
        : '[^\\n]*';
      const marker = record.managed_block === 'rig' ? 'rig' : `rig:${name}`;
      let stripped = body.replace(
        new RegExp(`<!-- ${marker}:start -->\\n[\\s\\S]*?<!-- ${marker}:end -->\\n?`, 'g'),
        '',
      );
      if (stripped === body) {
        stripped = body.replace(
          new RegExp(`# ${marker}:start\\n[\\s\\S]*?# ${marker}:end\\n?`, 'g'),
          '',
        );
      }
      if (stripped === body) bestEffort.push(record.path);
      else if (dropEmptyOrWrite(abs, stripped) === 'deleted') deletedRels.push(record.path);
      if (stripped !== body) removed.push(record.path);
    } else {
      const expected = record.digest || record.desired_digest || null;
      if (expected && currentDigest(abs) !== expected) {
        bestEffort.push(record.path);
        continue;
      }
      fs.rmSync(abs, { recursive: true, force: true });
      removed.push(record.path);
      deletedRels.push(record.path);
    }
  }
  if (!stopped && !retainChainedBackup) {
    const chainedRel = '.git/hooks/pre-commit.rig-chained';
    const chainedRecord = records.find((record) => record.path === chainedRel);
    if (chainedRecord) {
      const chainedAbs = resolvedRecordPaths.get(chainedRecord);
      if (fs.existsSync(chainedAbs)) {
        const expected = chainedRecord.digest || chainedRecord.desired_digest || null;
        if (expected && currentDigest(chainedAbs) !== expected) {
          bestEffort.push(chainedRel);
        } else {
          fs.rmSync(chainedAbs, { force: true });
          removed.push(chainedRel);
        }
      }
    }
  }
  for (const rel of deletedRels) pruneEmptyParents(target, rel);
  const evidence = {
    schema_version: 1,
    kind: 'uninstall',
    removed,
    best_effort: bestEffort,
    best_effort_details: bestEffortDetails,
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
  }
  if (bestEffort.length === 0) {
    const mfile = containedPath(target, MANIFEST_REL);
    if (fs.existsSync(mfile)) fs.rmSync(mfile, { force: true });
    const legacy = containedPath(target, LEGACY_MANIFEST_REL);
    if (fs.existsSync(legacy)) fs.rmSync(legacy, { force: true });
    pruneEmptyParents(target, MANIFEST_REL);
    pruneEmptyParents(target, LEGACY_MANIFEST_REL);
  }
  return {
    status: bestEffort.length ? 'best_effort' : 'removed',
    removed,
    best_effort: bestEffort,
    best_effort_details: bestEffortDetails,
    purge_list: purgeList,
  };
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

module.exports = { parseJournalRecords, readManifest, resumeInstall, uninstall, verifyRemoval, isRigInstallPath };
