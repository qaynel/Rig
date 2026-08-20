// Apply with lock, CAS, and an append-only install manifest for resume
// (impl-design §6.6/§7.6, AD-10, AT-INSTALL-1).
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { loadCatalog, servicesOf, catalogDigest, validateRigJson, isReviewAccepted, validateReview } = require('./catalog');
const { resolve } = require('./resolve');
const { materializeHostAdapters } = require('./host-capabilities');
const { planCiIntegration } = require('./ci-adapters');
const { GUARD_SCRIPT, SHIM } = require('./guard');
const { writeReport } = require('./reports');

const ROOT = path.join(__dirname, '..', '..');
const POINTER_LINE =
  'Before acting, read `.rig/catalog-routing.md` and route selected Rig catalogue services through it.';
const LEAK_SCANNER_SERVICE = 'product-security.secrets.precommit-leak-scanner';
const LINT_FORMAT_SERVICE = 'development.code-quality.lint-format';

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

const MANIFEST_REL = '.rig/install-manifest.jsonl';

// Clone-local, never committed (§4.2): a linked worktree must not share
// identity, and a shared committed ID would let one clone's uninstall strip
// entries from another clone's global config.
function gitPath(target, rel) {
  const result = spawnSync('git', ['rev-parse', '--git-path', rel], {
    cwd: target,
    encoding: 'utf8',
    shell: false,
  });
  const out = (result.stdout || '').trim();
  return path.isAbsolute(out) ? out : path.join(target, out);
}

function getInstallId(target) {
  const idPath = gitPath(target, path.join('rig', 'install-id'));
  fs.mkdirSync(path.dirname(idPath), { recursive: true });
  if (fs.existsSync(idPath)) return fs.readFileSync(idPath, 'utf8').trim();
  const id = crypto.randomUUID();
  fs.writeFileSync(idPath, `${id}\n`);
  return id;
}

// Append-only journal, one record per line (§7.6). A crash mid-write
// truncates only the final line, which fails to parse and is discarded.
function readManifest(target) {
  const file = path.join(target, MANIFEST_REL);
  if (!fs.existsSync(file)) return [];
  const records = [];
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try {
      records.push(JSON.parse(line));
    } catch {
      /* damaged final line; discard */
    }
  }
  const bySeq = new Map();
  for (const record of records) bySeq.set(record.seq, record); // last write per seq wins
  return [...bySeq.values()];
}

function appendManifestRecord(target, record) {
  const file = path.join(target, MANIFEST_REL);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, `${JSON.stringify(record)}\n`);
}

function readSource(rel) {
  return fs.readFileSync(path.join(ROOT, 'rig', rel));
}

function composeServiceMarkdown(service, grade, slices) {
  const parts = [];
  for (const key of ['identity', 'minimal', ...(grade === 'mid' || grade === 'maximal' ? ['mid'] : []), ...(grade === 'maximal' ? ['maximal'] : [])]) {
    const rel = service.fragments?.[key];
    if (rel) parts.push(fs.readFileSync(path.join(ROOT, 'rig', rel), 'utf8').trim());
  }
  for (const slice of slices || []) {
    const rel = service.slices?.[slice]?.fragment;
    if (rel && fs.existsSync(path.join(ROOT, 'rig', rel))) {
      parts.push(fs.readFileSync(path.join(ROOT, 'rig', rel), 'utf8').trim());
    }
  }
  return `${parts.join('\n\n')}\n`;
}

function planDigest(plan) {
  const snapshot = { ...plan };
  delete snapshot.digest;
  delete snapshot.plan_digest;
  delete snapshot.summary;
  return crypto.createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
}

function validatePlanSnapshot(plan, manifest, review, catalog) {
  if (!plan || typeof plan !== 'object' || !plan.plan_digest) {
    throw new Error('apply requires a plan digest');
  }
  const digest = planDigest(plan);
  if (plan.plan_digest !== digest || (plan.digest && plan.digest !== digest)) {
    throw new Error('apply: plan digest mismatch');
  }
  if (plan.catalog_digest !== catalogDigest(catalog)) {
    throw new Error('apply: plan catalog digest mismatch');
  }
  if (plan.harness_digest !== review.harness_digest) {
    throw new Error('apply: plan harness digest mismatch');
  }
  const resolved = resolve(catalog, manifest.services || {});
  const expectedServices = Object.entries(resolved.effective).map(([service_id, entry]) => ({
    service_id,
    ...entry,
  }));
  if (JSON.stringify(plan.order || []) !== JSON.stringify(resolved.order)) {
    throw new Error('apply: plan order does not match rig.json');
  }
  if (JSON.stringify(plan.effective_services || []) !== JSON.stringify(expectedServices)) {
    throw new Error('apply: plan services do not match rig.json');
  }
}

function validatePlanApproval(approval, planDigestValue) {
  if (!approval || typeof approval !== 'object') {
    throw new Error('apply: --approval <plan-approval.json> is required');
  }
  if (approval.schema_version !== 1 || approval.kind !== 'plan-approval') {
    throw new Error('apply: invalid plan approval receipt');
  }
  if (approval.plan_digest !== planDigestValue) {
    throw new Error('apply: approval digest mismatch');
  }
  const method = approval.approval && approval.approval.method;
  if (
    approval.approval?.verified !== true ||
    !['host-native', 'external-sshsig'].includes(method)
  ) {
    throw new Error('apply: approval receipt is not verified');
  }
}

function findExecutable(name) {
  for (const dir of (process.env.PATH || '').split(path.delimiter)) {
    if (!dir) continue;
    const candidate = path.join(dir, name);
    try {
      fs.accessSync(candidate, fs.constants.X_OK);
      return candidate;
    } catch {
      /* keep looking */
    }
  }
  return null;
}

function gitStateDigest(target) {
  const hash = crypto.createHash('sha256');
  for (const args of [
    ['show-ref', '--head'],
    ['rev-list', '--objects', '--all'],
  ]) {
    const result = spawnSync('git', args, {
      cwd: target,
      encoding: 'utf8',
      shell: false,
      timeout: 60 * 1000,
    });
    hash.update(result.status === 0 ? result.stdout : `git:${args.join(' ')}:${result.status}`);
  }
  return hash.digest('hex');
}

function runFirstEnableHistoryScan(target) {
  const scanner =
    (findExecutable('gitleaks') && {
      name: 'gitleaks',
      command: findExecutable('gitleaks'),
      args: ['detect', '--source', '.', '--no-banner', '--redact'],
    }) ||
    (findExecutable('trufflehog') && {
      name: 'trufflehog',
      command: findExecutable('trufflehog'),
      args: ['git', 'file://.', '--only-verified', '--fail'],
    });
  if (!scanner) {
    return { ok: false, status: 'missing_scanner', reason: 'no vetted history scanner found on PATH' };
  }
  const before = gitStateDigest(target);
  const result = spawnSync(scanner.command, scanner.args, {
    cwd: target,
    encoding: 'utf8',
    shell: false,
    timeout: 10 * 60 * 1000,
  });
  const after = gitStateDigest(target);
  if (before !== after) {
    return { ok: false, status: 'stale_history', scanner: scanner.name, reason: 'git history changed during scan' };
  }
  if (result.error || result.status !== 0) {
    return {
      ok: false,
      status: 'failed',
      scanner: scanner.name,
      reason: result.stderr || result.stdout || String(result.error || 'history scanner exited non-zero'),
    };
  }
  return { ok: true, status: 'verified', scanner: scanner.name, git_state_digest: after };
}

function acquireLock(target) {
  const lockPath = path.join(target, '.rig', 'catalog-install.lock');
  fs.mkdirSync(path.dirname(lockPath), { recursive: true });
  try {
    const fd = fs.openSync(lockPath, 'wx');
    fs.writeFileSync(
      fd,
      `${JSON.stringify({ pid: process.pid, started_at: new Date().toISOString() }, null, 2)}\n`,
    );
    fs.closeSync(fd);
  } catch (error) {
    if (error && error.code === 'EEXIST') {
      throw new Error('apply: catalog-install.lock exists; refuse to auto-break');
    }
    throw error;
  }
  return lockPath;
}

function ensureLine(file, line) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const body = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (body.split('\n').includes(line)) return;
  const sep = body && !body.endsWith('\n') ? '\n' : '';
  fs.writeFileSync(file, `${body}${sep}${line}\n`);
}

function lintFormatBinding(target, grade, ci) {
  let scripts = {};
  let packageError = null;
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(target, 'package.json'), 'utf8'));
    if (!pkg.scripts || typeof pkg.scripts !== 'object' || Array.isArray(pkg.scripts)) {
      packageError = 'package.json has no scripts object';
    } else {
      scripts = pkg.scripts;
    }
  } catch (error) {
    packageError = `package.json is missing or malformed: ${error.message}`;
  }

  const binding = {
    disposition: 'convention',
    grade,
    checks: {},
  };
  const npmCheck = (id, script) => {
    if (scripts[script]) {
      binding.checks[id] = {
        diff: ['npm', 'run', '--silent', script],
        repo: ['npm', 'run', '--silent', script],
      };
    } else {
      binding.checks[id] = {
        coverage_gap: packageError
          ? `${packageError}; required script "${script}" is not discoverable`
          : `package.json script "${script}" is missing`,
      };
    }
  };

  npmCheck('lint-format-formatter-clean', 'format:check');
  if (grade === 'mid' || grade === 'maximal') {
    npmCheck('lint-format-linter-clean', 'lint');
  }
  if (grade === 'maximal') {
    const fixScript = scripts.format ? 'format' : scripts['lint:fix'] ? 'lint:fix' : null;
    binding.checks['lint-format-ci-gate-and-explicit-fix'] =
      ci.artifact && fixScript
        ? {
            required_paths: [ci.artifact.relativePath],
            fix: ['npm', 'run', '--silent', fixScript],
          }
        : {
            coverage_gap: !ci.artifact
              ? 'no supported CI adapter was emitted for maximal lint-format'
              : 'package.json script "format" or "lint:fix" is missing',
          };
  }
  return binding;
}

function applyPlan(target, manifest, review, plan, options = {}) {
  const catalog = loadCatalog();
  validateRigJson(manifest, catalog);
  const validated = validateReview(review);
  if (!isReviewAccepted(validated)) throw new Error(`apply refuses review verdict ${validated.verdict}`);
  validatePlanSnapshot(plan, manifest, validated, catalog);
  validatePlanApproval(options.approval, plan.plan_digest);

  // Idempotent short-circuit: identical selection already applied.
  const receiptPath = path.join(target, '.rig', 'catalog-receipt.json');
  if (fs.existsSync(receiptPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
      const desiredServices = manifest.services || {};
      const existingServices = {};
      for (const [id, meta] of Object.entries(existing.services || existing.installed || {})) {
        existingServices[id] = typeof meta === 'string' ? meta : meta.grade;
      }
      const normalize = (obj) =>
        JSON.stringify(
          Object.keys(obj)
            .sort()
            .map((k) => [k, obj[k]]),
        );
      if (
        existing.catalog_digest === catalogDigest(loadCatalog()) &&
        normalize(existingServices) === normalize(desiredServices) &&
        existing.harness_digest === validated.harness_digest
      ) {
        // Still ensure pointer line once (no-op if present).
        ensureLine(path.join(target, 'AGENTS.md'), POINTER_LINE);
        const historyScanNote = existing.history_scan ? 'history scan already verified' : '';
        return { ok: true, receipt: existing, historyScanNote, idempotent: true };
      }
    } catch {
      /* fall through to full apply */
    }
  }

  // Compare-and-swap on preimages. Rig-owned `.rig/**` paths may change across
  // idempotent re-applies; user-owned paths must still match unless the planned
  // ensure_line is already present.
  for (const [rel, hash] of Object.entries(plan.preimages || {})) {
    if (rel.startsWith('.rig/')) continue;
    const abs = path.join(target, rel);
    const current = fs.existsSync(abs) ? sha256File(abs) : null;
    if (current === hash) continue;
    if (rel === 'AGENTS.md' && fs.existsSync(abs)) {
      const body = fs.readFileSync(abs, 'utf8');
      if (body.split('\n').includes(POINTER_LINE)) continue;
    }
    throw new Error(`apply: stale preimage for ${rel}`);
  }

  const lockPath = acquireLock(target);
  const installId = getInstallId(target);
  const existingRecords = readManifest(target);
  const appliedByPath = new Map();
  let seq = 0;
  for (const record of existingRecords) {
    seq = Math.max(seq, record.seq);
    if (record.state === 'applied') appliedByPath.set(record.path, record);
  }
  let historyScanNote = '';

  try {
    const byId = Object.fromEntries(servicesOf(catalog).map((s) => [s.id, s]));

    // Record-before-mutate (§7.6): a `pending` record lands, then the write,
    // then an `applied` record carrying the post-write digest supersedes it.
    // A failure between the two leaves a truthful `pending` entry, never an
    // unrecorded write. Resuming skips any path whose applied digest already
    // matches what's on disk, so applied work is never redone or duplicated.
    const writeOwned = (rel, contents, mode, ownershipOverride) => {
      const abs = path.join(target, rel);
      const already = appliedByPath.get(rel);
      if (already) {
        const current = fs.existsSync(abs) ? sha256File(abs) : null;
        if (current === already.digest) return;
      }
      const ownership = ownershipOverride || (fs.existsSync(abs) ? 'replace_owned' : 'create_owned');
      seq += 1;
      appendManifestRecord(target, {
        seq,
        path: rel,
        ownership,
        operation: ownership,
        install_id: installId,
        state: 'pending',
      });
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, contents, mode ? { mode } : undefined);
      appendManifestRecord(target, {
        seq,
        path: rel,
        ownership,
        operation: ownership,
        install_id: installId,
        state: 'applied',
        digest: sha256File(abs),
      });
    };

    const ensureLineOwned = (rel, line) => {
      const abs = path.join(target, rel);
      const body = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';
      if (body.split('\n').includes(line)) return;
      const sep = body && !body.endsWith('\n') ? '\n' : '';
      writeOwned(rel, `${body}${sep}${line}\n`, undefined, 'append_managed');
    };

    // Baseline phase
    writeOwned('.rig/baseline/drift-rule.md', readSource('catalog/baseline/drift-rule.md'));
    writeOwned(
      '.rig/baseline/sanitation-review.json',
      `${JSON.stringify(validated, null, 2)}\n`,
    );
    writeOwned(
      '.rig/context-index.json',
      `${JSON.stringify({ documents: [{ path: 'AGENTS.md', status: 'canonical' }] }, null, 2)}\n`,
    );
    writeOwned('.rig/sync-map.json', `${JSON.stringify({ groups: [] }, null, 2)}\n`);
    writeOwned('.rig/bin/check.js', readSource('catalog/baseline/check.js'), 0o755);
    writeOwned('.rig/bin/check-copies.js', readSource('catalog/baseline/check-copies.js'), 0o755);
    writeOwned('.rig/bin/secret-guard.sh', GUARD_SCRIPT, 0o755);
    writeOwned('.rig/hooks/secret-guard.sh', GUARD_SCRIPT, 0o755);
    writeOwned('.rig/catalog-routing.md', readSource('catalog/baseline/catalog-routing.md'));

    // Pointer graft
    ensureLineOwned('AGENTS.md', POINTER_LINE);

    const ci = planCiIntegration(target);

    // Services
    const bindings = {};
    const installed = {};
    for (const entry of plan.effective_services || []) {
      const id = entry.service_id;
      const service = byId[id];
      if (!service) continue;
      const grade = entry.selected_grade || null;
      const body = composeServiceMarkdown(service, grade || 'minimal', entry.required_slices || []);
      writeOwned(`.rig/services/${id}.md`, body);
      if (grade) {
        installed[id] = { grade, slices: entry.required_slices || [] };
        // rig: author convention adapters one leaf at a time; generalize after
        // a second real binding proves a shared shape.
        bindings[id] = id === LINT_FORMAT_SERVICE
          ? lintFormatBinding(target, grade, ci)
          : {
              diff: [process.execPath, '-e', 'process.exit(0)'],
              repo: [process.execPath, '-e', 'process.exit(0)'],
            };
      }
    }
    writeOwned('.rig/service-bindings.json', `${JSON.stringify(bindings, null, 2)}\n`);

    // Host adapters
    materializeHostAdapters(target, validated.host || 'generic', writeOwned);

    // CI adapter (verified only)
    if (ci.artifact) {
      writeOwned(ci.artifact.relativePath, ci.artifact.contents);
    }

    // Git hook dispatcher
    const gitDir = path.join(target, '.git');
    if (fs.existsSync(gitDir)) {
      const hooksDir = path.join(gitDir, 'hooks');
      fs.mkdirSync(hooksDir, { recursive: true });
      const hook = path.join(hooksDir, 'pre-commit');
      if (fs.existsSync(hook) && !fs.readFileSync(hook, 'utf8').includes('Rig secret guard shim')) {
        writeOwned('.git/hooks/pre-commit.rig-chained', fs.readFileSync(hook), 0o755);
      }
      writeOwned('.git/hooks/pre-commit', SHIM, 0o755);
    }

    let historyScan = null;
    if (manifest.services && manifest.services[LEAK_SCANNER_SERVICE]) {
      historyScan = runFirstEnableHistoryScan(target);
      if (!historyScan.ok) {
        historyScanNote = `first-enable history scan failed: ${historyScan.reason}`;
        writeReport(target, {
          service_id: LEAK_SCANNER_SERVICE,
          status: 'failed',
          summary: 'First-enable history scan failed',
          reason: historyScan.reason,
          fix_context: ['install gitleaks or trufflehog, remediate findings, then re-run apply'],
        });
        fs.rmSync(lockPath, { force: true });
        return { ok: false, historyScanNote, historyScan };
      }
      historyScanNote = 'first-enable history scan verified for precommit-leak-scanner';
    }

    const receipt = {
      schema_version: 1,
      catalog_digest: catalogDigest(catalog),
      harness_digest: validated.harness_digest,
      host: validated.host,
      order: plan.order || [],
      services: installed,
      installed,
      history_scan: historyScan || null,
      ci: { status: ci.status, provider: ci.provider || null },
    };
    writeOwned('.rig/catalog-receipt.json', `${JSON.stringify(receipt, null, 2)}\n`);

    fs.rmSync(lockPath, { force: true });
    return { ok: true, receipt, historyScanNote };
  } catch (error) {
    // No rollback (§6.6/§7.6, AT-INSTALL-1): writes already recorded
    // `applied` in the manifest stay in place. `.rig/catalog-receipt.json`
    // is the last write in the sequence, so its absence is itself the
    // "incomplete" signal — nothing else claims to be installed until it
    // exists. Re-running apply resumes from the manifest instead of
    // restarting or duplicating what already landed.
    fs.rmSync(lockPath, { force: true });
    throw error;
  }
}

function remediate(target, proposal, approveDigest) {
  if (!proposal || typeof proposal !== 'object') throw new Error('remediate: proposal required');
  const digest = crypto.createHash('sha256').update(JSON.stringify(proposal)).digest('hex');
  if (!approveDigest || approveDigest !== digest) {
    throw new Error('remediate: approval digest mismatch; refusing write');
  }
  if (!Array.isArray(proposal.actions) || proposal.actions.length === 0) {
    throw new Error('remediate: actions required');
  }
  const root = path.resolve(target);
  const backups = new Map();
  const created = [];
  try {
    for (const action of proposal.actions) {
      if (!action || action.op !== 'rewrite') {
        throw new Error(`remediate: unsupported action ${action && action.op}`);
      }
      if (typeof action.path !== 'string' || typeof action.content !== 'string') {
        throw new Error('remediate: rewrite requires path and content');
      }
      const abs = path.resolve(root, action.path);
      if (!abs.startsWith(root + path.sep) && abs !== root) {
        throw new Error(`remediate: out-of-root path ${action.path}`);
      }
      const before = fs.existsSync(abs) ? fs.readFileSync(abs) : null;
      if (before && before.toString('utf8') === action.content) {
        throw new Error(`remediate: no-op rewrite ${action.path}`);
      }
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      if (before) backups.set(action.path, before);
      else created.push(action.path);
      fs.writeFileSync(abs, action.content);
    }
  } catch (error) {
    for (const rel of created) fs.rmSync(path.join(root, rel), { force: true });
    for (const [rel, bytes] of backups.entries()) fs.writeFileSync(path.join(root, rel), bytes);
    throw error;
  }
  return { ok: true, digest };
}

module.exports = { applyPlan, remediate, acquireLock, POINTER_LINE };
