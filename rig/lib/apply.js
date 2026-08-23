// Apply with lock, CAS, and an append-only install manifest for resume
// (impl-design §6.6/§7.6, AD-10, AT-INSTALL-1).
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { loadCatalog, servicesOf, catalogDigest, validateRigJson, isReviewAccepted, validateReview } = require('./catalog');
const { resolve } = require('./resolve');
const { materializeHostAdapters } = require('./host-capabilities');
const { planCiIntegration } = require('./ci-adapters');
const { GUARD_SCRIPT, SHIM } = require('./guard');
const { writeReport } = require('./reports');
const { containedPath, gitPath } = require('./path-safety');
const { scanBeforeActivation } = require('./secret-history');
const { validateBindingSources } = require('./lint-format');

const ROOT = path.join(__dirname, '..', '..');
const POINTER_LINE =
  'Before acting, read `.rig/catalog-routing.md` and route selected Rig catalogue services through it.';
const LEAK_SCANNER_SERVICE = 'product-security.secrets.precommit-leak-scanner';
const LINT_FORMAT_SERVICE = 'development.code-quality.lint-format';
const TEST_CASE_GENERATION_SERVICE = 'testing.unit.test-case-generation';

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

const MANIFEST_REL = '.rig/install-manifest.jsonl';

function getInstallId(target) {
  // Non-git targets have no `.git` to scope an identity to; a repo-local file
  // is a fine fallback since there is no shared global config to leak into.
  const idPath = gitPath(target, path.join('rig', 'install-id')) || path.join(target, '.rig', 'install-id');
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

function testCaseGenerationBinding(target, service, grade) {
  const testFiles = [];
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === '.git' || entry.name === '.rig' || entry.name === 'node_modules') continue;
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(abs);
      else if (/\.(?:test|spec)\.[cm]?js$/.test(entry.name)) testFiles.push(path.relative(target, abs));
    }
  };
  visit(target);

  const checks = service.checks?.[grade] || [];
  return {
    disposition: 'executable',
    grade,
    checks: Object.fromEntries(checks.map((checkId) => [checkId, testFiles.length
      ? {
          diff: [process.execPath, '--test', ...testFiles],
          repo: [process.execPath, '--test'],
        }
      : { coverage_gap: 'no Node.js test files were discovered' }])),
  };
}

function applyPlan(target, manifest, review, plan, options = {}) {
  const catalog = loadCatalog();
  validateRigJson(manifest, catalog);
  const validated = validateReview(review);
  if (!isReviewAccepted(validated)) throw new Error(`apply refuses review verdict ${validated.verdict}`);
  validatePlanSnapshot(plan, manifest, validated, catalog);
  validatePlanApproval(options.approval, plan.plan_digest);
  if (plan.lint_format) validateBindingSources(target, plan.lint_format);

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

  // Lock acquisition itself must stay outside the try: on EEXIST it throws
  // before creating anything, so there is nothing of ours to clean up. Once
  // acquired, every following step (including install-identity resolution)
  // must run inside the guarded section so any failure still releases it.
  const lockPath = acquireLock(target);
  let historyScanNote = '';

  try {
    const installId = getInstallId(target);
    const existingRecords = readManifest(target);
    const latestByPath = new Map();
    let seq = 0;
    for (const record of existingRecords) {
      seq = Math.max(seq, record.seq || 0);
      if (Number.isInteger(record.seq) && record.path) latestByPath.set(record.path, record);
    }

    appendManifestRecord(target, { kind: 'install_state', complete: false });
    const byId = Object.fromEntries(servicesOf(catalog).map((s) => [s.id, s]));

    // Record-before-mutate (§7.6): a `pending` record lands, then the write,
    // then an `applied` record carrying the post-write digest supersedes it.
    // A failure between the two leaves a truthful `pending` entry, never an
    // unrecorded write. Resuming skips any path whose applied digest already
    // matches what's on disk, so applied work is never redone or duplicated.
    const writeOwned = (rel, contents, mode, ownershipOverride, details = {}) => {
      const abs = containedPath(target, rel);
      const desired = Buffer.isBuffer(contents) ? contents : Buffer.from(contents);
      const desiredDigest = crypto.createHash('sha256').update(desired).digest('hex');
      const already = latestByPath.get(rel);
      if (already?.state === 'applied') {
        const current = fs.existsSync(abs) ? sha256File(abs) : null;
        if (current === already.digest && current === desiredDigest) return;
      }
      if (already?.state === 'pending') {
        if (already.desired_digest !== desiredDigest) throw new Error(`apply: changed pending write ${rel}`);
        const current = fs.existsSync(abs) ? sha256File(abs) : null;
        if (current === desiredDigest) {
          const applied = { ...already, state: 'applied', digest: desiredDigest };
          appendManifestRecord(target, applied);
          latestByPath.set(rel, applied);
          return;
        }
        if (current !== (already.preimage_digest || null)) {
          throw new Error(`apply: conflicting pending write ${rel}`);
        }
      }
      const ownership = ownershipOverride || (fs.existsSync(abs) ? 'replace_owned' : 'create_owned');
      const pending = already?.state === 'pending' ? already : {
        seq: ++seq,
        path: rel,
        ownership,
        operation: ownership,
        install_id: installId,
        transaction_kind: 'install',
        state: 'pending',
        preimage_digest: fs.existsSync(abs) ? sha256File(abs) : null,
        desired_digest: desiredDigest,
        ...(ownership === 'append_managed' ? { managed_block: 'rig-graft' } : {}),
        ...details,
      };
      if (already?.state !== 'pending') appendManifestRecord(target, pending);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, desired, mode ? { mode } : undefined);
      const applied = {
        ...pending,
        state: 'applied',
        digest: desiredDigest,
      };
      appendManifestRecord(target, applied);
      latestByPath.set(rel, applied);
    };

    const ensureLineOwned = (rel, line) => {
      const abs = containedPath(target, rel);
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
    writeOwned('.rig/network-rules.md', readSource('catalog/baseline/network-rules.md'));
    writeOwned('.rig/network-policy.md', readSource('catalog/baseline/network-policy.md'));
    if (!fs.existsSync(containedPath(target, '.rig/network-policy.json'))) {
      writeOwned(
        '.rig/network-policy.json',
        readSource('catalog/baseline/network-policy.json'),
        undefined,
        'user_owned',
        { transaction_kind: 'user_seed' },
      );
    }

    // Pointer graft
    ensureLineOwned('AGENTS.md', POINTER_LINE);

    // AT-CI-2: creation of a CI artifact needs both a real trigger (a plan
    // entry that actually asks for the maximal CI gate) and a verified
    // approval carrying that plan. Detection alone was self-fabrication —
    // Rig would write `.github/workflows/rig.yml` for any repo with a
    // detected provider even at Policy grade with no maximal service in the
    // plan. Now the graft only lands when the approved plan includes at
    // least one maximal-grade service and the plan-approval is verified.
    //
    // The provider itself comes from `plan.ci` — computed once at plan time
    // and folded into `plan_digest`, which the approval signs — instead of a
    // fresh `detectProvider(target)` scan here. Re-detecting let the target
    // drift after signing (a CI file added or swapped between plan and
    // apply) silently change which provider's workflow gets written; the
    // plan the approver actually signed is the only source of truth for it.
    const plannedProvider = plan.ci && plan.ci.provider ? plan.ci.provider : null;
    const planNeedsCi = (plan.effective_services || []).some((entry) => entry.selected_grade === 'maximal');
    const approvalVerified = Boolean(
      options.approval && (
        options.approval.ci_approved
          || (options.approval.approval && options.approval.approval.verified)
      ),
    );
    const ci = plannedProvider
      ? planCiIntegration(target, { provider: plannedProvider, approved: planNeedsCi && approvalVerified })
      : (plan.ci || planCiIntegration(target));

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
          ? {
              ...plan.lint_format,
              checks: {
                ...plan.lint_format.checks,
                ...(grade === 'maximal' && ci.artifact ? {
                  'lint-format-ci-gate-and-explicit-fix': {
                    required_paths: [ci.artifact.relativePath],
                    fix: plan.lint_format.components.find((component) => component.root === '.')?.format?.argv,
                  },
                } : {}),
              },
            }
          : id === TEST_CASE_GENERATION_SERVICE
            ? testCaseGenerationBinding(target, service, grade)
          : {
              disposition: service.disposition?.kind || 'convention',
              grade,
              checks: Object.fromEntries(
                (service.checks?.[grade] || []).map((checkId) => [checkId, {
                  coverage_gap: `${id} requires a repository-selected binding for ${checkId}`,
                }]),
              ),
            };
      }
    }
    writeOwned('.rig/service-bindings.json', `${JSON.stringify(bindings, null, 2)}\n`);

    // Host adapters
    materializeHostAdapters(target, validated.host || 'generic', writeOwned);

    // CI adapter (verified only). The write is allowed only for a path the
    // signed plan listed — apply must not introduce a file the approver never
    // saw, and must not skip CAS for a path that was never in preimages.
    if (ci.artifact) {
      const rel = ci.artifact.relativePath;
      const signed = Object.prototype.hasOwnProperty.call(plan.preimages || {}, rel)
        || (plan.operations || []).some((op) => op.path === rel);
      if (signed) {
        writeOwned(rel, ci.artifact.contents, undefined, ci.artifact.ownership);
      }
    }

    // Git hook dispatcher. `.git` is a file, not a directory, in a linked
    // worktree, so a hardcoded `.git/hooks` join throws ENOTDIR there.
    // Resolving through git itself gives the real hooks directory — shared
    // across worktrees — and returns null cleanly for a non-git target.
    const hooksDirAbs = gitPath(target, 'hooks');
    if (hooksDirAbs) {
      const hooksDirRel = path.relative(target, hooksDirAbs);
      const insideTarget = !path.isAbsolute(hooksDirRel) && !hooksDirRel.startsWith('..');
      if (insideTarget) {
        const hooksDir = containedPath(target, hooksDirRel);
        fs.mkdirSync(hooksDir, { recursive: true });
        const hook = path.join(hooksDir, 'pre-commit');
        if (fs.existsSync(hook) && !fs.readFileSync(hook, 'utf8').includes('Rig secret guard shim')) {
          writeOwned(path.join(hooksDirRel, 'pre-commit.rig-chained'), fs.readFileSync(hook), 0o755);
        }
        writeOwned(path.join(hooksDirRel, 'pre-commit'), SHIM, 0o755);
      } else {
        // A linked worktree's hooks directory lives outside `target`, in the
        // main clone's shared git-common dir — `writeOwned`/`containedPath`
        // assume target-relative bookkeeping and don't apply here, and the
        // hook isn't owned by any single worktree's install anyway: every
        // worktree of this repo shares and re-resolves the same shim (via
        // `git rev-parse --show-toplevel` at commit time, see guard.js).
        // Writing it directly, untracked by this install's manifest, is the
        // same idempotent backup-then-shim behavior `writeOwned` gives the
        // common case, applied to a path outside this install's ownership.
        fs.mkdirSync(hooksDirAbs, { recursive: true });
        const hook = path.join(hooksDirAbs, 'pre-commit');
        const chained = path.join(hooksDirAbs, 'pre-commit.rig-chained');
        if (fs.existsSync(hook) && !fs.readFileSync(hook, 'utf8').includes('Rig secret guard shim')) {
          fs.renameSync(hook, chained);
        }
        fs.writeFileSync(hook, SHIM, { mode: 0o755 });
      }
    }

    let historyScan = null;
    if (manifest.services && manifest.services[LEAK_SCANNER_SERVICE]) {
      const scan = scanBeforeActivation(target);
      historyScan = scan.history_scan;
      if (!scan.activated) {
        historyScanNote = `first-enable history scan failed: ${historyScan.status}`;
        writeReport(target, {
          service_id: LEAK_SCANNER_SERVICE,
          status: 'failed',
          summary: 'First-enable history scan failed',
          reason: historyScan.status,
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

    const jsonRecords = readManifest(target)
      .filter((record) => record.state === 'applied')
      .map(({ seq: recordSeq, path: recordPath, ownership, digest, managed_block }) => ({
        seq: recordSeq,
        path: recordPath,
        ownership,
        digest: digest || null,
        ...(managed_block ? { managed_block } : {}),
      }));
    writeOwned(
      '.rig/install-manifest.json',
      `${JSON.stringify({ schema_version: 1, records: jsonRecords }, null, 2)}\n`,
    );

    appendManifestRecord(target, { kind: 'install_state', complete: true });

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
      const abs = containedPath(target, action.path);
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
    for (const rel of created) fs.rmSync(containedPath(target, rel), { force: true });
    for (const [rel, bytes] of backups.entries()) fs.writeFileSync(containedPath(target, rel), bytes);
    throw error;
  }
  return { ok: true, status: 'applied', digest };
}

module.exports = { applyPlan, remediate, acquireLock, POINTER_LINE };
