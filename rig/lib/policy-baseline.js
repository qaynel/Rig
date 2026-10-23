'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnGuardedSync } = require('./spawn-guarded');
const { spawnSync } = require('node:child_process');
const { loadActivePolicy, effectiveStatus, controlEnabled } = require('./policy');
const { containedPath } = require('./path-safety');
const { atomicWrite } = require('./policy-transaction');
const { scanHarnessText } = require('./inspect');
const { FLOOR_PATTERN, GUARD_SCRIPT } = require('./guard');
const FLOOR_RE = new RegExp(FLOOR_PATTERN);
const { isHarness, stagedFiles } = require('./git-dispatch');
const { checkCopies, semanticDrift } = require('./checks');
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
function repositoryFiles(target) {
  const list = spawnSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: target, encoding: 'utf8', shell: false, maxBuffer: 32 * 1024 * 1024 });
  if (list.error || list.status !== 0) return { ok: false, reason: 'repository_scan_unavailable' };
  try {
    const files = [...new Set(list.stdout.split('\0').filter(Boolean))].filter((rel) => !rel.startsWith('reports/rig/') && !rel.startsWith('.rig/policy/') && !rel.startsWith('.rig/approvals/')).sort().flatMap((rel) => {
      const abs = containedPath(target, rel);
      if (!fs.existsSync(abs)) return [];
      const stat = fs.lstatSync(abs);
      if (!stat.isFile()) throw new Error(`unsupported repository scan input ${rel}`);
      const bytes = fs.readFileSync(abs);
      return [{ path: rel, bytes, text: bytes.toString('utf8') }];
    });
    return { ok: true, files };
  } catch (error) { return { ok: false, reason: error.message }; }
}
function surfaceEnabled(policy, surface) {
  const status = effectiveStatus(policy);
  return Object.hasOwn(policy.enforcement || {}, surface) ? status.enforcement[surface] === 'enabled' : controlEnabled(policy, 'git_ci', 'git_ci');
}
function stagedMetadataPaths(target) {
  const changed = spawnSync('git', ['diff', '--cached', '--name-only', '-z'], { cwd: target, encoding: 'utf8', shell: false, maxBuffer: 16 * 1024 * 1024 });
  return changed.error || changed.status !== 0 ? null : new Set(changed.stdout.split('\0').filter(Boolean));
}
function readMetadataInput(target, rel, stagedChanges) {
  if (!stagedChanges) throw new Error('staged metadata status unavailable');
  const staged = spawnSync('git', ['show', `:${rel}`], { cwd: target, encoding: null, shell: false, maxBuffer: 16 * 1024 * 1024 });
  if (staged.error) throw new Error('staged metadata unavailable');
  if (staged.status === 0) return staged.stdout;
  if (stagedChanges.has(rel)) throw new Error('staged metadata was removed');
  const abs = containedPath(target, rel);
  return fs.existsSync(abs) ? fs.readFileSync(abs) : null;
}
function baselineSnapshot(target, scope) {
  const scanned = scope === 'repo' ? repositoryFiles(target) : stagedFiles(target);
  const files = scanned.files || [];
  const inputDigest = hash(JSON.stringify(files.map((file) => [file.path, hash(file.bytes || Buffer.from(file.text))])));
  const implementation = hash(['policy-baseline.js', 'git-dispatch.js', 'checks.js', 'inspect.js', 'redaction.js', 'policy.js', 'guard.js', 'path-safety.js', 'trust-root.js', 'policy-transaction.js'].map((name) => fs.readFileSync(path.join(__dirname, name))).reduce((a, b) => Buffer.concat([a, b]), Buffer.alloc(0)));
  const stagedChanges = scope === 'diff' ? stagedMetadataPaths(target) : null;
  // Metadata drives the checks too; changing a review or sync relation must
  // invalidate a prior pass even when the ordinary source bytes are unchanged.
  const metadata = ['.rig/context-index.json', '.rig/sync-map.json'].map((rel) => {
    const abs = containedPath(target, rel);
    if (scope === 'diff') {
      try {
        const bytes = readMetadataInput(target, rel, stagedChanges);
        return [rel, bytes === null ? null : hash(bytes)];
      } catch { return [rel, hash('unavailable')]; }
    }
    return [rel, fs.existsSync(abs) ? hash(fs.readFileSync(abs)) : null];
  });
  return { scanned, files, inputDigest: hash(JSON.stringify([inputDigest, metadata])), implementation, stagedChanges };
}
function stagedHarnessPaths(target) {
  const indexed = spawnSync('git', ['ls-files', '--stage', '-z'], { cwd: target, encoding: 'utf8', shell: false, maxBuffer: 32 * 1024 * 1024 });
  if (indexed.error || indexed.status !== 0) return null;
  const paths = new Set();
  for (const row of indexed.stdout.split('\0').filter(Boolean)) {
    const tab = row.indexOf('\t');
    if (tab < 0) return null;
    const [mode, object, stage] = row.slice(0, tab).split(' ');
    const rel = row.slice(tab + 1);
    if (!/^[0-7]{6}$/.test(mode || '') || !/^[a-f0-9]{40,64}$/.test(object || '') || !/^[0-3]$/.test(stage || '')) return null;
    if (isHarness(rel)) {
      if (stage !== '0') return null;
      paths.add(rel);
    }
  }
  return [...paths].sort();
}
function runBaseline(target, { surface = 'ci.repo', scope = surface === 'ci.repo' ? 'repo' : 'diff' } = {}) {
  const active = loadActivePolicy(target);
  const results = [];
  const enabledSurface = surfaceEnabled(active.policy, surface);
  const { scanned, files, inputDigest, implementation, stagedChanges } = baselineSnapshot(target, scope);
  const requiredPaths = scope === 'diff' ? stagedHarnessPaths(target) : files.filter((file) => isHarness(file.path)).map((file) => file.path);
  const indexRead = (rel) => {
    if (['.rig/context-index.json', '.rig/sync-map.json'].includes(rel)) return readMetadataInput(target, rel, stagedChanges);
    const result = spawnSync('git', ['show', `:${rel}`], { cwd: target, encoding: null, shell: false, maxBuffer: 16 * 1024 * 1024 });
    if (result.error) throw new Error('index input unavailable');
    if (result.status !== 0) throw new Error('index input unavailable');
    return result.stdout;
  };
  const diagnostics = [];
  const secretChecks = () => {
    if (scope === 'diff') {
      // Reuse the established additions-only floor and optional staged scanner;
      // scanning a whole modified blob would reject unchanged historical bytes.
      const observed = spawnGuardedSync('/bin/sh', ['-c', GUARD_SCRIPT], { cwd: target, encoding: 'utf8', shell: false, timeout: 10 * 60 * 1000 });
      const messages = String(observed.stderr || '').trim().split('\n').filter(Boolean);
      const safe = messages.filter(line => /^rig (?:secret guard|warn):/.test(line));
      diagnostics.push(...safe.filter(line => line.startsWith('rig warn:')));
      if (observed.error || observed.status === null) return [{ kind: 'staged_scanner_unavailable' }];
      return observed.status === 0 ? [] : [{ kind: 'staged_secret', reason: safe.find(line => line.startsWith('rig secret guard:')) || 'staged secret check failed' }];
    }
    return files.flatMap(file => /(^|\/)\.env$/.test(file.path) || FLOOR_RE.test(file.text) ? [{ path: file.path, kind: 'repository_secret' }] : []);
  };
  const definitions = [
    ['sanitation', 'sanitation', 'sanitation.harness', () => files.filter((file) => isHarness(file.path)).flatMap((file) => scanHarnessText(file.text).map((finding) => ({ path: file.path, kind: finding.kind })))],
    ['exact-copy', 'drift', 'drift.exact_copy', () => {
      try { const result = checkCopies(target, scope === 'diff' ? { readFile: indexRead } : {}); return result.status === 0 ? [] : [{ kind: 'exact_copy_failed' }]; }
      catch { return [{ kind: 'exact_copy_failed' }]; }
    }],
    ['semantic-drift', 'drift', 'drift.semantic', () => semanticDrift(target, scope === 'diff' ? { readFile: indexRead, requiredPaths: requiredPaths || ['<index-unavailable>'] } : {}).map((finding) => ({ ...finding, kind: finding.reason || 'semantic_drift' }))],
    ['secrets', 'secrets', 'secrets.deterministic', secretChecks],
  ];
  for (const [control, legacy, current, run] of definitions) {
    const enabled = enabledSurface && controlEnabled(active.policy, legacy, current);
    const evidence = { policy_digest: active.digest, generation: active.generation, implementation, input_digest: inputDigest, control, surface, scope };
    if (!enabled) { results.push({ ...evidence, status: 'disabled', protection: false }); continue; }
    let findings;
    try { findings = scanned.ok ? run() : [{ kind: scanned.reason || 'scan_unavailable' }]; }
    catch (error) { findings = [{ kind: 'check_unavailable', reason: error.message }]; }
    results.push({ ...evidence, status: findings.length ? 'failed' : 'passed', protection: findings.length === 0, findings });
  }
  if (!require('./journal-records').installState(target).complete) {
    for (const result of results) result.protection = false;
  }
  // A fresh run is the only evidence that can claim the current generation.
  // Merely disabling/re-enabling policy never republishes a prior success.
  atomicWrite(target, '.rig/policy/control-evidence.json', `${JSON.stringify({ schema_version: 1, results }, null, 2)}\n`);
  return { status: results.some((entry) => entry.status === 'failed') ? 1 : 0, results, surface_enabled: enabledSurface, diagnostics };
}
module.exports = { runBaseline, surfaceEnabled, repositoryFiles, baselineSnapshot };
