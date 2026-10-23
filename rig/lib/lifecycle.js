'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
// Installed uninstall removes its own runtime; load cleanup before removal.
const { cleanupEvidence, writeEvidence } = require('./evidence-artifacts');
const path = require('node:path');
const { containedPath, gitPath } = require('./path-safety');
const { removeGlobalConfig, removeGlobalMcp } = require('./global-writes');
const { removeOpenClawMcp } = require('./openclaw-mcp');
const { PROVIDERS: CI_PROVIDERS, GITHUB_WORKFLOW_POINTER, ciRegions, stripCiRegions } = require('./ci-adapters');
const { parseJournalRecords, readManifest, installState, latestOperations } = require('./journal-records');

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
// Provider files Rig only ever merges a marked job into; never deleted wholesale.
const MERGED_CI_FILES = new Set([
  ...Object.values(CI_PROVIDERS).map((provider) => provider.file).filter((file) => !INSTALL_UNIQUE_CI_FILES.has(file)),
  'azure-pipelines.yaml',
]);
const hasManagedRegions = (record) => record.ownership === 'merge_namespaced'
  && Array.isArray(record.managed_regions) && record.managed_regions.length > 0;
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
  if (MERGED_CI_FILES.has(rel)) return hasManagedRegions(record);
  return INSTALL_TOP_LEVEL.has(top);
}

function canonicalJournalText(text) {
  const records = parseJournalRecords(text);
  if (records.truncated_tail) {
    const at = text.lastIndexOf('\n');
    const tail = text.slice(at + 1);
    // The recovery event retains the interrupted fragment without echoing it
    // in diagnostics, and prevents a preceding complete:true becoming clean.
    return text.slice(0, at + 1) + JSON.stringify({ kind: 'install_state', complete: false,
      recovery: 'truncated-final-record', truncated_record_base64: Buffer.from(tail).toString('base64') }) + '\n';
  }
  return text && !text.endsWith('\n') ? `${text}\n` : text;
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

// The installers add one "\n" before an appended block when the user's file lacked a final newline.
// Drop it again, but only when that restores the journaled preimage byte-for-byte.
function withoutAddedSeparator(stripped, record) {
  if (record.preimage_digest && stripped.endsWith('\n') && digestOf(Buffer.from(stripped)) !== record.preimage_digest
      && digestOf(Buffer.from(stripped.slice(0, -1))) === record.preimage_digest) return stripped.slice(0, -1);
  return stripped;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function resumeInstall(target, opts) {
  const operations = opts.operations || [];
  const existing = readManifest(target);
  const latest = latestOperations(existing.records);
  const byPath = new Map(latest.map((record) => [record.path, record]));
  let seq = latest.reduce((max, record) => Math.max(max, record.seq), 0);
  const manifestPath = containedPath(target, MANIFEST_REL);
  if (fs.existsSync(manifestPath)) {
    const text = fs.readFileSync(manifestPath, 'utf8');
    const canonical = canonicalJournalText(text);
    if (canonical !== text) fs.writeFileSync(manifestPath, canonical);
  }
  appendRecord(target, { kind: 'install_state', complete: false });
  // An install stops only when a real write fails or the process dies; the
  // pending record and install_state:false it leaves are what the next run resumes.
  for (let i = 0; i < operations.length; i += 1) {
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

// RIG-127.12: a legacy record names no block, so a wildcard strip would delete
// any other `rig:*` block in the file. Remove a block only when taking it out
// restores exactly the preimage digest the record journaled; otherwise leave
// the file untouched (the caller reports best-effort).
const LEGACY_BLOCK_PATTERNS = [
  /<!-- rig:([^\n]*?):start -->\n[\s\S]*?<!-- rig:\1:end -->\n?/g,
  /# rig:([^\n]*?):start\n[\s\S]*?# rig:\1:end\n?/g,
];

function stripLegacyNamelessBlock(body, record) {
  for (const pattern of LEGACY_BLOCK_PATTERNS) {
    for (const match of body.matchAll(pattern)) {
      const candidate = body.slice(0, match.index) + body.slice(match.index + match[0].length);
      const created = !record.preimage_digest && !candidate.trim();
      if (created || digestOf(Buffer.from(candidate)) === record.preimage_digest) return candidate;
    }
  }
  return body;
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
  if (opts.purge && opts.purgeGenerated) throw new Error('rig: choose either --purge or --purge-generated');
  const manifest = readManifest(target);
  if (manifest.records.truncated_tail) throw new Error('manifest final record is truncated; resume installation before removal');
  const latestByPath = new Map();
  for (const record of latestOperations(manifest.records)) {
    if ((record.transaction_kind || 'install') === 'install') latestByPath.set(record.path, record);
  }
  const records = [...latestByPath.values()].sort((a, b) => b.seq - a.seq);
  const resolvedRecordPaths = new Map(records.map((record) => [
    record,
    resolveRecordPath(target, record.path),
  ]));
  // rig: capture first-write evidence before teardown removes the store;
  // snapshots prove differences and are never restored over current bytes.
  const origins = new Map();
  for (const record of latestOperations(manifest.records)) {
    if ((record.transaction_kind || 'install') !== 'install') continue;
    if (record.operation === 'delete_owned' && record.state === 'applied') origins.delete(record.path);
    else if (!origins.has(record.path)) origins.set(record.path, record);
  }
  const preimages = Object.create(null);
  for (const record of records) {
    const origin = origins.get(record.path) || record;
    const digest = (record.operation === 'delete_owned' && record.state === 'applied')
      || record.path === '.git/hooks/pre-commit.rig-chained' ? null
      : Object.hasOwn(origin, 'preimage_digest') ? origin.preimage_digest
        : origin.ownership === 'create_owned' ? null : undefined;
    const snapshot = { digest, reason: null };
    // Hooks already keep their original bytes in a journaled chained backup.
    const chained = record.path === '.git/hooks/pre-commit'
      && records.find(row => row.path === '.git/hooks/pre-commit.rig-chained');
    if (chained) {
      const backup = resolvedRecordPaths.get(chained);
      if (fs.existsSync(backup) && currentDigest(backup) === (chained.digest || chained.desired_digest)) {
        snapshot.digest = currentDigest(backup);
        preimages[record.path] = snapshot;
        continue;
      }
    }
    if (digest !== null) {
      if (typeof digest !== 'string' || !/^[a-f0-9]{64}$/.test(digest)) snapshot.reason = 'preimage-unavailable';
      else {
        try {
          const file = containedPath(target, `.rig/preimages/${digest}`);
          const stat = fs.lstatSync(file);
          if (!stat.isFile() || stat.isSymbolicLink() || currentDigest(file) !== digest) snapshot.reason = 'preimage-corrupt';
        } catch {
          snapshot.reason = records.some(row => row.path === `.rig/preimages/${digest}`)
            ? 'preimage-missing' : 'preimage-unavailable';
        }
      }
    }
    preimages[record.path] = snapshot;
  }
  const bestEffort = [];
  const bestEffortDetails = [];
  const setupRecovery = require('./lint-format-setup').recoverSetup(target, records);
  bestEffort.push(...setupRecovery.conflicts);
  const removed = [...setupRecovery.removed];
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
    if (setupRecovery.handled.includes(record.path)) continue;
    if (setupRecovery.protectedPaths.includes(record.path)) continue;
    if (record.path === '.git/hooks/pre-commit.rig-chained') continue;
    // An *applied* journalled delete already restored absence for this path.
    // There is nothing left to reclaim, and routing it through the attribution
    // rules below would file an already-clean path as best-effort — wedging
    // every later uninstall in best_effort and never dropping the journal.
    // A pending delete carries the same null desired_digest but its unlink may
    // never have run, so it must still go through the reclaim path below or
    // uninstall would report a file still on disk as removed.
    if (record.operation === 'delete_owned' && record.desired_digest === null
      && record.state === 'applied') continue;
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
    if (MERGED_CI_FILES.has(rel) && hasManagedRegions(record)) {
      const stripped = stripCiRegions(fs.readFileSync(abs, 'utf8'), record.managed_regions);
      if (stripped === null) bestEffort.push(record.path);
      else { fs.writeFileSync(abs, stripped); removed.push(record.path); }
      continue;
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
      const stripped = withoutAddedSeparator(body.split('\n').filter((line) => line !== record.managed_line).join('\n'), record);
      if (dropEmptyOrWrite(abs, stripped) === 'deleted') deletedRels.push(record.path);
      removed.push(record.path);
    } else if (record.managed_block || record.ownership === 'append_managed') {
      const body = fs.readFileSync(abs, 'utf8');
      let stripped;
      if (typeof record.managed_block === 'string') {
        const marker = record.managed_block === 'rig' ? 'rig' : `rig:${escapeRegExp(record.managed_block)}`;
        stripped = body.replace(
          new RegExp(`<!-- ${marker}:start -->\\n[\\s\\S]*?<!-- ${marker}:end -->\\n?`, 'g'),
          '',
        );
        if (stripped === body) {
          stripped = body.replace(
            new RegExp(`# ${marker}:start\\n[\\s\\S]*?# ${marker}:end\\n?`, 'g'),
            '',
          );
        }
      } else {
        stripped = stripLegacyNamelessBlock(body, record);
      }
      if (stripped === body) bestEffort.push(record.path);
      else if (dropEmptyOrWrite(abs, withoutAddedSeparator(stripped, record)) === 'deleted') deletedRels.push(record.path);
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
  // Graft removal itself journals a fresh snapshot; reclaim only those new,
  // unchanged owned copies after all original preimages have been consumed.
  const lastInstallSeq = records.reduce((max, record) => Math.max(max, record.seq), 0);
  for (const record of latestOperations(readManifest(target).records)) {
    if (record.seq <= lastInstallSeq || record.ownership !== 'create_owned'
      || !record.path?.startsWith('.rig/preimages/')) continue;
    const abs = containedPath(target, record.path);
    if (!fs.existsSync(abs)) continue;
    const stat = fs.lstatSync(abs);
    if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink !== 1 || currentDigest(abs) !== record.digest) bestEffort.push(record.path);
    else {
      fs.rmSync(abs);
      removed.push(record.path);
      pruneEmptyParents(target, record.path);
    }
  }
  const evidence = {
    schema_version: 1,
    kind: 'uninstall',
    removed,
    best_effort: bestEffort,
    best_effort_details: bestEffortDetails,
    at: new Date().toISOString(),
  };
  let purgeList = [];
  if (opts.purge || opts.purgeGenerated) {
    // A seed is user-owned after editing. Only the unchanged, newly-created
    // network policy can restore its original absence during scoped cleanup.
    for (const record of latestOperations(manifest.records)) {
      if (record.transaction_kind !== 'user_seed' || record.path !== '.rig/network-policy.json'
          || record.preimage_digest !== null) continue;
      const seed = containedPath(target, record.path);
      if (!fs.existsSync(seed)) continue;
      const st = fs.lstatSync(seed);
      if (!st.isFile() || st.isSymbolicLink() || st.nlink !== 1
          || currentDigest(seed) !== (record.digest || record.desired_digest)) bestEffort.push(record.path);
      else { fs.unlinkSync(seed); removed.push(record.path); }
    }
    purgeList = [...(opts.purge ? ['reports/rig'] : []), 'journal-owned runtime evidence'];
    if (typeof opts.beforePurge === 'function') opts.beforePurge([...purgeList]);
    bestEffort.push(...cleanupEvidence(target));
    if (opts.purge) {
      // AT-UNINSTALL-3: only explicit broad purge authorizes deleting all reports.
      const reports = containedPath(target, 'reports/rig');
      if (fs.existsSync(reports)) fs.rmSync(reports, { recursive: true, force: true });
      pruneEmptyParents(target, 'reports/rig');
    }
  }
  const verification = records.length ? verifyRemoval(target, { records, preimages, best_effort: bestEffort }) : {
    status: 'best_effort', files: [MANIFEST_REL],
    differences: [{ path: MANIFEST_REL, preimage_digest: null, postimage_digest: null, status: 'best_effort', reason: 'manifest-unavailable' }],
  };
  for (const difference of verification.differences || []) {
    // Legacy journals without snapshot fields retain their teardown status,
    // but verification still discloses that unavailable evidence separately.
    if (difference.status === 'best_effort' && !['preimage-unavailable', 'manifest-unavailable'].includes(difference.reason)
      && !bestEffort.includes(difference.path)) bestEffort.push(difference.path);
  }
  evidence.verification = verification;
  if (!opts.purge && !opts.purgeGenerated) {
    writeEvidence(target, 'reports/rig/last-uninstall.json', `${JSON.stringify(evidence, null, 2)}\n`);
  }
  if (bestEffort.length === 0 && !(verification.differences || []).some(row => row.reason && row.reason !== 'preimage-unavailable')) {
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
    verification,
  };
}

function verifyRemoval(target, evidence) {
  if (evidence && Array.isArray(evidence.missing_markers) && evidence.missing_markers.length) {
    return { status: 'best_effort', files: [...evidence.missing_markers] };
  }
  if (evidence?.preimages && Object.keys(evidence.preimages).length) {
    const files = new Set(evidence.best_effort || []);
    const differences = [];
    for (const record of evidence.records || []) {
      const snapshot = evidence.preimages[record.path];
      let reason = snapshot?.reason;
      let postimage = null;
      try {
        const abs = resolveRecordPath(target, record.path);
        if (fs.existsSync(abs)) {
          const stat = fs.lstatSync(abs);
          if (!stat.isFile() || stat.isSymbolicLink()) reason ||= 'remaining-unsafe-path';
          else {
            const bytes = fs.readFileSync(abs);
            postimage = digestOf(bytes);
            const body = bytes.toString('utf8');
            const managedRemains = hasManagedRegions(record) ? ciRegions(body).some((region) => record.managed_regions.includes(region.digest))
              : record.managed_line ? body.split('\n').includes(record.managed_line)
              : record.ownership === 'graft_managed'
                ? (record.managed_grafts || []).some(({ capability }) => body.includes(`<!-- rig:graft capability="${capability}"`))
                : record.managed_block || record.ownership === 'append_managed'
                  ? files.has(record.path)
                  : postimage !== snapshot?.digest;
            if (managedRemains) reason ||= 'managed-content-remains';
          }
        }
      } catch { reason ||= 'post-removal-unreadable'; }
      if (files.has(record.path)) reason ||= 'removal-best-effort';
      if (reason) files.add(record.path);
      differences.push({
        path: record.path,
        preimage_digest: snapshot?.digest ?? null,
        postimage_digest: postimage,
        status: reason ? 'best_effort' : postimage === (snapshot?.digest ?? null) ? 'unchanged' : postimage === null ? 'removed' : 'outside_changes',
        ...(reason ? { reason } : {}),
      });
    }
    // Only paths needing attention are listed: a runtime install records thousands of removed files, and the public result must stay bounded.
    const counts = {};
    for (const row of differences) counts[row.status] = (counts[row.status] || 0) + 1;
    return {
      status: files.size ? 'best_effort' : 'verified_clean',
      files: [...files],
      checked: differences.length,
      counts,
      differences: differences.filter((row) => row.status === 'outside_changes' || row.status === 'best_effort'),
    };
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

module.exports = { canonicalJournalText, parseJournalRecords, readManifest, installState, resumeInstall, uninstall, verifyRemoval, isRigInstallPath };
