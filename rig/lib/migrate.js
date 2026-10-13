// v5 -> corpus layout (6.0.0) migration: a journaled, resumable transaction.
//
// Rules, in the order they bite:
//  1. Validate before touching anything. The install journal is read strictly
//     (a corrupt line, an unsafe path or an interrupted install refuses with a
//     recoverable report), the onboarding state must parse, and the new corpus
//     is fully projected in memory (staged) before the first write.
//  2. Ownership decides, bytes prove it. A file is Rig's to replace or retire
//     only if the journal says Rig wrote it AND the live bytes still equal the
//     journaled digest. An edited owned file that the new layout would change
//     is a conflict that stops the migration; it is never overwritten. An edited
//     file the new layout would not change is kept as is. An edited orphan is
//     retained and reported. A path the journal does not own is never replaced.
//  3. Only installer-attributable content is retired: paths in the v5 installer
//     zones, minus anything the onboarding state records as the user's approved
//     selection. Services, reports, receipts, grafts, user files and original
//     graft preimages are never in scope.
//  4. Every change goes through the install journal writer, so uninstall after
//     migration reverses both versions. The plan is persisted to
//     .rig/migration.json before the first write; a rerun resumes from it, and
//     the old bytes of anything replaced or retired are kept under
//     .rig/migration-backup/ until the migration completes.
//  5. Onboarding state migrates last: valid selections are preserved, and an
//     approval, applied or checked result whose bytes changed is invalidated so
//     the old apply early return cannot claim the new layout was applied.
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { containedPath } = require('./path-safety');
const { journalWriter, applyEntry, MANIFEST_REL } = require('./payload');
const { loadCorpus } = require('./corpus');
const { projectAll } = require('./project');
const { REGISTRY } = require('./host-capabilities');

const MIGRATION_REL = '.rig/migration.json';
const BACKUP_REL = '.rig/migration-backup';
const V6_MARKER = '.rig/onboarding/README.md';
const RELEASE_REL = '.rig/release.json';

// Where the v5 installer wrote. Anything outside these zones was written by a
// later feature (services, reports, grafts) and is out of scope to retire.
const V5_ZONES = [
  /^\.rig\/(routing\.md|allowed-signers\.example\.md|catalog\.json|network-rules\.md|network-policy\.md)$/,
  /^\.rig\/(rules|skills|plumbing|bin|runtime)\//,
  /^\.(claude|agents)\/skills\//,
  /^\.agents\/workflows\/rig[a-z-]*\.md$/,
  /^\.agents\/rules\/rig\.md$/,
  /^\.cursor\/rules\/rig\.mdc$/,
  /^\.windsurf\/rules\/rig\.md$/,
  /^\.clinerules\/rig\.md$/,
  /^\.kiro\/steering\/rig\.md$/,
];

class MigrationRefusal extends Error {
  constructor(code, detail, extra = {}) {
    super(`rig: migration refused (${code}): ${detail}`);
    this.code = code;
    this.detail = detail;
    this.extra = extra;
  }
}

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function refuse(code, detail, extra) {
  throw new MigrationRefusal(code, detail, extra);
}

function liveDigest(target, rel) {
  const abs = containedPath(target, rel);
  if (!fs.existsSync(abs)) return null;
  return sha256(fs.readFileSync(abs));
}

// ---------------------------------------------------------------- journal

function readJournalStrict(target) {
  const abs = containedPath(target, MANIFEST_REL);
  if (!fs.existsSync(abs)) return { records: [], latest: new Map(), open: false, exists: false };
  const lines = fs.readFileSync(abs, 'utf8').split('\n');
  const records = [];
  const latest = new Map();
  let open = false;
  let openOwner = null;
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    let record;
    try { record = JSON.parse(line); } catch { refuse('journal-corrupt', `${MANIFEST_REL} line ${index + 1} is not valid JSON; restore it from a backup or re-run the installer. Nothing was changed.`); }
    if (!record || typeof record !== 'object' || Array.isArray(record)) refuse('journal-corrupt', `${MANIFEST_REL} line ${index + 1} is not a record`);
    if (record.kind === 'install_state') {
      open = record.complete !== true;
      openOwner = open ? (record.owner ?? null) : null;
      return;
    }
    if (!Number.isInteger(record.seq) || typeof record.path !== 'string' || !record.path
      || !['pending', 'applied'].includes(record.state)) {
      refuse('journal-corrupt', `${MANIFEST_REL} line ${index + 1} is not a valid install record`);
    }
    if (path.isAbsolute(record.path) || record.path.split('/').some((part) => part === '..' || part === '')) {
      refuse('journal-corrupt', `${MANIFEST_REL} line ${index + 1} names an unsafe path`);
    }
    records.push(record);
    latest.set(record.path, record);
  });
  return { records, latest, open, openOwner, exists: true };
}

function isFileOwned(record) {
  return ['create_owned', 'replace_owned'].includes(record.ownership)
    && record.operation !== 'delete_owned' && !record.managed_line && !record.managed_block;
}

// ----------------------------------------------------------- detection

function detectInstall(target) {
  const abs = containedPath(target, MANIFEST_REL);
  if (fs.existsSync(containedPath(target, MIGRATION_REL))) return { kind: 'resume' };
  if (!fs.existsSync(abs)) return { kind: 'none' };
  // Lenient on purpose: whether the layout marker is the latest word for its
  // path is answerable without validating the whole journal, and a current
  // install must never be refused because of an unrelated damaged line.
  let marked = null;
  for (const line of fs.readFileSync(abs, 'utf8').split('\n')) {
    if (!line.includes(V6_MARKER)) continue;
    try {
      const record = JSON.parse(line);
      if (record.path === V6_MARKER) marked = record;
    } catch { /* strict validation happens when a migration is planned */ }
  }
  if (marked && marked.state === 'applied' && isFileOwned(marked)) return { kind: 'current' };
  return { kind: 'v5' };
}

// -------------------------------------------------------------- planning

function protectedPaths(target) {
  const keep = new Set();
  const statePath = containedPath(target, '.rig/state.json');
  if (!fs.existsSync(statePath)) return keep;
  let state;
  try { state = JSON.parse(fs.readFileSync(statePath, 'utf8')); } catch { refuse('state-invalid', '.rig/state.json is not valid JSON; fix or remove it, then retry. Nothing was changed.'); }
  const applied = state?.applied || {};
  for (const row of [...(applied.projections || []), ...(applied.skills || [])]) {
    if (typeof row.path === 'string') {
      keep.add(row.path);
      keep.add(`${path.posix.dirname(row.path)}/`);
    }
  }
  for (const row of applied.owned_files || []) keep.add(row.path);
  for (const row of applied.grafts || []) keep.add(row.path);
  for (const row of applied.upstream?.flatMap((u) => u.files) || []) keep.add(row.path);
  if (applied.projection_script) {
    keep.add(applied.projection_script.script_path);
    for (const row of applied.projection_script.outputs) keep.add(row.path);
  }
  return keep;
}

function isProtected(rel, keep) {
  if (keep.has(rel)) return true;
  for (const entry of keep) if (entry.endsWith('/') && rel.startsWith(entry)) return true;
  return false;
}

function symlinked(target, rel) {
  const root = fs.realpathSync(target);
  let cursor = root;
  for (const part of rel.split('/')) {
    cursor = path.join(cursor, part);
    let stat;
    try { stat = fs.lstatSync(cursor); } catch (error) { if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return false; throw error; }
    if (stat.isSymbolicLink()) return true;
  }
  return false;
}

function inferHosts(target, override) {
  if (override) return [...new Set(override)];
  const release = containedPath(target, RELEASE_REL);
  if (fs.existsSync(release)) {
    try {
      const hosts = JSON.parse(fs.readFileSync(release, 'utf8')).hosts;
      if (Array.isArray(hosts) && hosts.every((h) => typeof h === 'string')) return hosts;
    } catch { /* fall through to the refusal below */ }
    refuse('release-invalid', `${RELEASE_REL} is unreadable; pass --hosts explicitly. Nothing was changed.`);
  }
  return [];
}

function currentTag(target) {
  const release = containedPath(target, RELEASE_REL);
  if (!fs.existsSync(release)) return null;
  try { return JSON.parse(fs.readFileSync(release, 'utf8')).tag || null; } catch { return null; }
}

// Everything the new layout wants, projected in memory. Nothing is written.
function stage(target, hosts, delivery, toTag) {
  for (const host of hosts) if (!REGISTRY[host]) refuse('unknown-host', `release record names unknown host "${host}"`);
  const selection = { hosts, delivery };
  const entries = projectAll(loadCorpus(selection), selection);
  const release = {
    path: RELEASE_REL,
    bytes: Buffer.from(`${JSON.stringify({ tag: toTag, hosts: [...new Set(hosts)].sort() }, null, 2)}\n`),
    mode: undefined,
  };
  return { entries, release };
}

function plan(target, opts) {
  const journal = readJournalStrict(target);
  if (!journal.exists) refuse('no-install', 'there is no install journal; run the installer instead');
  // A transaction this migration left open is resumed work; any other open
  // transaction is an interrupted install and must be finished first.
  if (journal.open && !String(journal.openOwner || '').startsWith('migrate:')) {
    refuse('journal-open', 'an earlier install was interrupted (its journal transaction is still open). Re-run the installer to finish it, then migrate. Nothing was changed.');
  }
  const hosts = inferHosts(target, opts.hosts);
  const delivery = opts.delivery || (fs.existsSync(containedPath(target, '.rig/runtime/rig/manifest.json')) ? 'active' : 'default');
  const fromTag = currentTag(target);
  const toTag = opts.releaseTag || process.env.RIG_RELEASE_TAG || `v${require('../../package.json').version}`;
  const staged = stage(target, hosts, delivery, toTag);
  const keep = protectedPaths(target);

  const conflicts = [];
  const actions = [];
  const retained = [];
  const keptEdited = [];
  const desiredPaths = new Set();
  const writeEntries = [staged.release, ...staged.entries.filter((e) => !e.op || e.op === 'pinned_catalog' || e.op === 'seed_user_file')];
  for (const entry of writeEntries) {
    desiredPaths.add(entry.path);
    const rel = entry.path;
    const newDigest = sha256(entry.bytes);
    if (symlinked(target, rel)) { conflicts.push({ path: rel, reason: 'symlink', detail: 'the path or a parent is a symlink; Rig will not write through it' }); continue; }
    const live = liveDigest(target, rel);
    const owned = journal.latest.get(rel);
    const old = owned && owned.state === 'applied' && isFileOwned(owned) ? (owned.digest || null) : null;
    if (entry.op === 'seed_user_file') { if (live === null) actions.push({ path: rel, action: 'write', old: null, new: newDigest, op: 'seed_user_file' }); continue; }
    if (live === newDigest) { if (!owned || owned.digest !== newDigest) actions.push({ path: rel, action: 'adopt', old, new: newDigest }); continue; }
    if (live === null) { actions.push({ path: rel, action: 'write', old, new: newDigest }); continue; }
    if (old !== null && live === old) { actions.push({ path: rel, action: 'write', old, new: newDigest, backup: true }); continue; }
    if (old !== null && newDigest === old) { keptEdited.push({ path: rel, reason: 'edited-owned-unchanged-upstream' }); continue; }
    conflicts.push({
      path: rel,
      reason: old === null ? 'unowned-file' : 'edited-owned-file',
      detail: old === null ? 'a file the journal does not own already exists here and the new layout needs different bytes' : 'you edited this Rig-owned file and the new layout changes it; move your edit aside or re-apply it after migrating',
    });
  }
  for (const [rel, record] of journal.latest) {
    if (desiredPaths.has(rel) || !isFileOwned(record) || record.state !== 'applied') continue;
    if (!V5_ZONES.some((zone) => zone.test(rel)) || isProtected(rel, keep)) continue;
    if (symlinked(target, rel)) { conflicts.push({ path: rel, reason: 'symlink', detail: 'an owned orphan is now a symlink; left alone' }); continue; }
    const live = liveDigest(target, rel);
    if (live === null) continue;
    if (live !== record.digest) { retained.push({ path: rel, reason: 'edited-orphan' }); continue; }
    actions.push({ path: rel, action: 'retire', old: live, new: null });
  }
  if (conflicts.length) refuse('conflicts', `${conflicts.length} Rig-owned file(s) cannot be migrated safely; nothing was changed`, { conflicts });

  const body = {
    version: 1, from_tag: fromTag, to_tag: toTag, hosts, delivery,
    actions: actions.sort((a, b) => a.path.localeCompare(b.path)),
    retained: retained.sort((a, b) => a.path.localeCompare(b.path)),
    kept_edited: keptEdited.sort((a, b) => a.path.localeCompare(b.path)),
  };
  return { ...body, plan_digest: sha256(JSON.stringify(body)), staged };
}

// ------------------------------------------------------------- execution

function atomicJson(target, rel, value) {
  const abs = containedPath(target, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  const tmp = `${abs}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(tmp, abs);
}

function backup(target, rel, digest) {
  const dst = containedPath(target, `${BACKUP_REL}/${digest}`);
  if (fs.existsSync(dst)) return;
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(containedPath(target, rel), dst);
}

function pruneEmpty(target, rel) {
  const root = fs.realpathSync(target);
  let dir = path.dirname(containedPath(target, rel));
  while (dir !== root && dir.startsWith(`${root}${path.sep}`)) {
    const top = path.relative(root, dir).split(path.sep)[0];
    if (!['.rig', '.claude', '.agents', '.cursor', '.windsurf', '.kiro', '.clinerules'].includes(top)) break;
    if (!fs.existsSync(dir) || fs.readdirSync(dir).length) break;
    fs.rmdirSync(dir);
    dir = path.dirname(dir);
  }
}

function execute(target, planned, opts) {
  const writer = journalWriter(target, { transactionOwner: `migrate:${planned.plan_digest}` });
  writer.begin();
  const byPath = new Map(planned.staged.entries.filter((e) => !e.op || e.op === 'pinned_catalog' || e.op === 'seed_user_file').concat(planned.staged.release).map((e) => [e.path, e]));
  const result = { written: [], retired: [], adopted: [] };
  let step = 0;
  const tick = (name) => { if (opts.onStep) opts.onStep(name, step); step += 1; };

  for (const action of planned.actions.filter((a) => a.action !== 'retire' && a.path !== V6_MARKER)) {
    const entry = byPath.get(action.path);
    if (!entry || sha256(entry.bytes) !== action.new) refuse('plan-drift', `the new layout for ${action.path} changed since the plan was made; remove ${MIGRATION_REL} only after restoring the previous Rig checkout`);
    tick(`write:${action.path}`);
    const live = liveDigest(target, action.path);
    if (action.action === 'write' && live !== null && live !== action.old && live !== action.new) {
      refuse('conflicts', `${action.path} changed while migrating`, { conflicts: [{ path: action.path, reason: 'edited-owned-file', detail: 'edited after the plan was made' }] });
    }
    if (action.backup && live === action.old) backup(target, action.path, action.old);
    const prior = writer.latest(action.path);
    if (live === action.new && prior?.state === 'applied' && prior.digest === action.new) { result.adopted.push(action.path); continue; }
    writer(target, action.path, entry.bytes, entry.mode, action.op === 'seed_user_file' ? 'user_owned' : undefined,
      action.op === 'seed_user_file' ? { transaction_kind: 'user_seed' } : {});
    (action.action === 'adopt' ? result.adopted : result.written).push(action.path);
  }
  for (const entry of planned.staged.entries.filter((e) => e.op === 'ensure_line' || e.op === 'ensure_gitignore_block')) {
    applyEntry(target, entry, writer);
  }
  for (const action of planned.actions.filter((a) => a.action === 'retire')) {
    tick(`retire:${action.path}`);
    const live = liveDigest(target, action.path);
    if (live === null) { result.retired.push(action.path); continue; }
    if (live !== action.old) { planned.retained.push({ path: action.path, reason: 'edited-orphan' }); continue; }
    backup(target, action.path, action.old);
    const removed = writer.remove(target, action.path, action.old);
    if (removed.removed) { result.retired.push(action.path); pruneEmpty(target, action.path); } else planned.retained.push({ path: action.path, reason: 'preexisting-file' });
  }
  writer.finish();
  return result;
}

// The layout marker is the last thing written: until it lands, the repository
// still reads as a v5 install, so a lost transaction record re-plans from the
// journal instead of mistaking a half-migrated tree for a finished one.
function writeMarker(target, planned) {
  const action = planned.actions.find((a) => a.path === V6_MARKER);
  if (!action) return;
  const entry = planned.staged.entries.find((e) => e.path === V6_MARKER);
  const writer = journalWriter(target, { transactionOwner: `migrate:${planned.plan_digest}` });
  writer.begin();
  const prior = writer.latest(V6_MARKER);
  if (!(liveDigest(target, V6_MARKER) === action.new && prior?.state === 'applied' && prior.digest === action.new)) {
    writer(target, V6_MARKER, entry.bytes, entry.mode);
  }
  writer.finish();
}

// ---------------------------------------------------------------- public

function summarize(planned, result, state) {
  return {
    status: 'migrated',
    from: planned.from_tag,
    to: planned.to_tag,
    hosts: planned.hosts,
    written: result.written,
    adopted: result.adopted,
    retired: result.retired,
    retained: planned.retained,
    kept_edited: planned.kept_edited,
    onboarding_state: state,
  };
}

function migrate(target, opts = {}) {
  const root = fs.realpathSync(target);
  void root;
  try {
    const detected = detectInstall(target);
    if (detected.kind === 'none') return { status: 'noop', reason: 'no-install' };
    if (detected.kind === 'current') return { status: 'noop', reason: 'already-current' };

    let planned;
    const persisted = containedPath(target, MIGRATION_REL);
    if (detected.kind === 'resume') {
      let saved;
      try { saved = JSON.parse(fs.readFileSync(persisted, 'utf8')); } catch { refuse('migration-corrupt', `${MIGRATION_REL} is unreadable. The install is unchanged beyond what the journal records; delete that file to start over (the journal and ${BACKUP_REL} keep everything needed to uninstall or retry).`); }
      const { plan_digest: digest, ...body } = saved;
      const claimed = { ...body };
      delete claimed.phase;
      if (saved.version !== 1 || sha256(JSON.stringify(claimed)) !== digest) refuse('migration-corrupt', `${MIGRATION_REL} does not match its own digest; delete it to start over`);
      const staged = stage(target, saved.hosts, saved.delivery, saved.to_tag);
      planned = { ...claimed, plan_digest: digest, staged };
    } else {
      planned = plan(target, opts);
      if (opts.dryRun) return { status: 'plan', ...describe(planned) };
      atomicJson(target, MIGRATION_REL, { ...stripStaged(planned), phase: 'planned' });
    }

    const result = execute(target, planned, opts);
    if (opts.onStep) opts.onStep('state', -1);
    const state = require('./onboarding').migrateState(target, { fromTag: planned.from_tag, toTag: planned.to_tag });
    if (opts.onStep) opts.onStep('marker', -1);
    writeMarker(target, planned);
    if (opts.onStep) opts.onStep('complete', -1);
    fs.rmSync(containedPath(target, MIGRATION_REL), { force: true });
    fs.rmSync(containedPath(target, BACKUP_REL), { recursive: true, force: true });
    return summarize(planned, result, state);
  } catch (error) {
    if (error instanceof MigrationRefusal) {
      return {
        status: 'refused', code: error.code, detail: error.detail, ...error.extra, recoverable: true,
      };
    }
    throw error;
  }
}

function stripStaged(planned) {
  const { staged, ...rest } = planned;
  void staged;
  return rest;
}

function describe(planned) {
  const { staged, ...rest } = planned;
  void staged;
  return rest;
}

module.exports = {
  migrate, detectInstall, readJournalStrict, MigrationRefusal, MIGRATION_REL, BACKUP_REL, V6_MARKER,
};
