// Apply with lock, CAS, and an append-only install manifest for resume
// (impl-design §6.6/§7.6, AD-10, AT-INSTALL-1).
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { loadCatalog, servicesOf, catalogDigest, validateRigJson, isReviewAccepted, validateReview, effectiveChecks } = require('./catalog');
const { resolve } = require('./resolve');
const { materializeHostAdapters } = require('./host-capabilities');
const { planCiIntegration } = require('./ci-adapters');
const { GUARD_SCRIPT, SHIM } = require('./guard');
const { writeReport } = require('./reports');
const { containedPath, gitPath } = require('./path-safety');
const { policyPath, syncDirectory } = require('./policy-transaction');
const { parseJournalRecords } = require('./lifecycle');
const { scanBeforeActivation } = require('./secret-history');
const { validateBindingSources } = require('./lint-format');
const { ensureManagedBlock } = require('./graft');
const { writeCredentialOutputs } = require('./credentials');
const { readReceipt, writeReceipt } = require('./receipt');
const { verifyTrustRootApproval } = require('./trust-root');

const ROOT = path.join(__dirname, '..', '..');
const POINTER_LINE =
  'Before acting, read `.rig/catalog-routing.md` and route selected Rig catalogue services through it.';
const POINTER_GRAFT = 'catalog-routing';
const LEAK_SCANNER_SERVICE = 'product-security.secrets.precommit-leak-scanner';
const LINT_FORMAT_SERVICE = 'development.code-quality.lint-format';
const TEST_CASE_GENERATION_SERVICE = 'testing.unit.test-case-generation';

function resolveInstallIdAbs(target) {
  return gitPath(target, path.join('rig', 'install-id')) || containedPath(target, '.rig/install-id');
}

function readOrAllocateInstallId(target) {
  const abs = resolveInstallIdAbs(target);
  if (fs.existsSync(abs)) return { id: fs.readFileSync(abs, 'utf8').trim(), abs };
  return { id: crypto.randomUUID(), abs };
}

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

const MANIFEST_REL = '.rig/install-manifest.jsonl';

// Append-only journal, one record per line (§7.6). A crash mid-write
// truncates only the final line, which fails to parse and is discarded.
// A malformed non-final line is a broken ledger and is refused.
function readManifest(target) {
  const file = path.join(target, MANIFEST_REL);
  if (!fs.existsSync(file)) return [];
  const records = parseJournalRecords(fs.readFileSync(file, 'utf8'));
  const bySeq = new Map();
  for (const record of records) bySeq.set(record.seq, record); // last write per seq wins
  return [...bySeq.values()];
}

function appendManifestRecord(target, record) {
  const file = path.join(target, MANIFEST_REL);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file)) {
    const original = fs.readFileSync(file, 'utf8');
    const normalized = original.endsWith('\n') ? original : require('./lifecycle').canonicalJournalText(original);
    if (normalized !== original) fs.writeFileSync(file, normalized, { mode: 0o600 });
  }
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

function stagedMcpReceipt(review) {
  const manualEntries = review.manualEntries && typeof review.manualEntries === 'object' && !Array.isArray(review.manualEntries)
    ? review.manualEntries
    : {};
  const noteHosts = [];
  if (review.host === 'antigravity' || (manualEntries.antigravity && Object.keys(manualEntries.antigravity).length)) {
    noteHosts.push('antigravity');
  }
  return {
    noteHosts,
    credentialNames: [],
    tierC: [],
    manualEntries,
  };
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

function planApprovalMessage(target, planDigestValue) {
  return `rig-catalog-apply\ntarget=${path.resolve(target)}\nplan=${planDigestValue}\n`;
}

function validatePlanApproval(target, approval, planDigestValue) {
  if (!approval || typeof approval !== 'object') {
    throw new Error('apply: --approval <plan-approval.json> is required');
  }
  if (approval.schema_version !== 1 || approval.kind !== 'plan-approval') {
    throw new Error('apply: invalid plan approval receipt');
  }
  if (approval.plan_digest !== planDigestValue) {
    throw new Error('apply: approval digest mismatch');
  }
  const signed = approval.approval;
  if (!signed || signed.method !== 'external-sshsig' || typeof signed.identity !== 'string' || typeof signed.signature !== 'string') {
    throw new Error('apply: signed Gate 1 SSHSIG approval required');
  }
  verifyTrustRootApproval(target, {
    identity: signed.identity,
    namespace: 'rig-catalog-apply',
    message: planApprovalMessage(target, planDigestValue),
    signature: signed.signature,
  });
  return true;
}

function acquireLock(target, purpose = 'catalog-install') {
  const lockPath = containedPath(target, '.rig/catalog-install.lock');
  fs.mkdirSync(path.dirname(lockPath), { recursive: true });
  try {
    const fd = fs.openSync(lockPath, 'wx');
    fs.writeFileSync(
      fd,
      `${JSON.stringify({ pid: process.pid, purpose, started_at: new Date().toISOString() }, null, 2)}\n`,
    );
    fs.closeSync(fd);
  } catch (error) {
    if (error && error.code === 'EEXIST') {
      if (['remediation', 'lint-coverage'].includes(purpose)) {
        // Serialize stale-owner reclamation so another reclaimer cannot unlink
        // a newly acquired live lock between its dead-PID check and unlink.
        const recovery = `${lockPath}.recovery`;
        let fd;
        try {
          fd = fs.openSync(recovery, 'wx', 0o600);
          const current = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
          let alive = true;
          if (Number.isInteger(current.pid) && current.pid > 0) {
            try { process.kill(current.pid, 0); } catch (probe) { alive = probe.code !== 'ESRCH'; }
          }
          if (current.purpose === purpose && !alive) {
            fs.rmSync(lockPath);
            return acquireLock(target, purpose);
          }
        } catch { /* malformed, live, or racing lock: fail closed below */ }
        finally { if (fd !== undefined) { fs.closeSync(fd); fs.rmSync(recovery, { force: true }); } }
      }
      throw new Error('apply: catalog-install.lock exists; refuse to auto-break');
    }
    throw error;
  }
  return lockPath;
}

function pointerGraft(source) {
  const start = `<!-- rig:${POINTER_GRAFT}:start -->`;
  if (!source.includes(start)) {
    const lines = source.split('\n');
    const legacy = lines.indexOf(POINTER_LINE);
    if (legacy !== -1) lines.splice(legacy, 1);
    source = lines.join('\n');
  }
  return ensureManagedBlock(source, POINTER_GRAFT, POINTER_LINE);
}

function resumablePointerGraft(target, hash, currentBytes) {
  const records = readManifest(target);
  const latest = records.filter((record) => record.path === 'AGENTS.md').at(-1);
  if (latest?.state !== 'applied' || latest.ownership !== 'append_managed'
      || latest.managed_block !== POINTER_GRAFT) return false;
  let original = Buffer.alloc(0);
  if (hash !== null) {
    const preimage = containedPath(target, `.rig/preimages/${hash}`);
    let stat;
    try { stat = fs.lstatSync(preimage); } catch { return false; }
    if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink !== 1) return false;
    original = fs.readFileSync(preimage);
    if (crypto.createHash('sha256').update(original).digest('hex') !== hash) return false;
  }
  const expected = Buffer.from(pointerGraft(original.toString('utf8')));
  const liveDigest = crypto.createHash('sha256').update(currentBytes).digest('hex');
  if (liveDigest === latest.digest) return expected.equals(currentBytes);
  // A user may have restored the exact legacy pointer while an older install
  // still owns this path. Permit only when normalizing that pointer in the
  // live file produces the same bytes as grafting the verified preimage, and
  // only when no managed block exists to hide edits to that owned region.
  if (currentBytes.includes(Buffer.from(`<!-- rig:${POINTER_GRAFT}:start -->`))) return false;
  return Buffer.from(pointerGraft(currentBytes.toString('utf8'))).equals(expected);
}

function assertPlanPreimages(target, plan) {
  for (const [rel, hash] of Object.entries(plan.preimages || {})) {
    if (rel.startsWith('.rig/')) continue;
    const abs = path.join(target, rel);
    const bytes = fs.existsSync(abs) ? fs.readFileSync(abs) : null;
    const current = bytes ? crypto.createHash('sha256').update(bytes).digest('hex') : null;
    if (current === hash || (rel === 'AGENTS.md' && bytes && resumablePointerGraft(target, hash, bytes))) continue;
    throw new Error(`apply: stale preimage for ${rel}`);
  }
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

  const checks = effectiveChecks(service, grade);
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
  const approvalVerified = validatePlanApproval(target, options.approval, plan.plan_digest);
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
        const agents = path.join(target, 'AGENTS.md');
        const body = fs.existsSync(agents) ? fs.readFileSync(agents, 'utf8') : '';
        if (pointerGraft(body) === body) {
          const historyScanNote = existing.history_scan ? 'history scan already verified' : '';
          return { ok: true, receipt: existing, historyScanNote, idempotent: true };
        }
      }
    } catch {
      /* fall through to full apply */
    }
  }

  // Compare-and-swap on preimages. Rig-owned `.rig/**` paths may change across
  // idempotent re-applies; user-owned paths remain bound to signed bytes. The
  // sole resume exception proves the exact managed pointer graft from its
  // hash-addressed, verified preimage.
  assertPlanPreimages(target, plan);

  // Lock acquisition itself must stay outside the try: on EEXIST it throws
  // before creating anything, so there is nothing of ours to clean up. Once
  // acquired, every following step (including install-identity resolution)
  // must run inside the guarded section so any failure still releases it.
  const lockPath = acquireLock(target);
  let historyScanNote = '';

  try {
    // The first CAS avoids needless lock work. Repeat it under the exclusive
    // lock before install identity allocation or any journal/file mutation.
    assertPlanPreimages(target, plan);
    const { id: installId, abs: installIdAbs } = readOrAllocateInstallId(target);
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
      const { abs: absOverride, ...recordDetails } = details;
      const abs = absOverride || containedPath(target, rel);
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
      // rig: use the same journal writer so the backup precedes the mutation.
      if (already?.state !== 'pending' && fs.existsSync(abs) && !rel.startsWith('.rig/preimages/')) {
        const before = fs.readFileSync(abs);
        const preimageRel = `.rig/preimages/${crypto.createHash('sha256').update(before).digest('hex')}`;
        const preimage = containedPath(target, preimageRel);
        if (!fs.existsSync(preimage)) writeOwned(preimageRel, before, 0o600, 'create_owned');
        else if (!fs.lstatSync(preimage).isFile() || fs.lstatSync(preimage).isSymbolicLink()
          || !fs.readFileSync(preimage).equals(before)) throw new Error(`apply: corrupt preimage ${preimageRel}`);
      }
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
        ...recordDetails,
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

    writeOwned('.rig/install-id', `${installId}\n`, undefined, undefined, { abs: installIdAbs });

    const ensurePointerOwned = (rel) => {
      const abs = containedPath(target, rel);
      const body = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';
      const desired = pointerGraft(body);
      if (desired === body) return;
      writeOwned(rel, desired, undefined, 'append_managed', { managed_block: POINTER_GRAFT });
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
    for (const entry of require('./baseline-payload').entries) writeOwned(entry.to, readSource(entry.from), entry.mode);
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
    if (!fs.existsSync(containedPath(target, '.rig/execution-policy.json'))) {
      writeOwned(
        '.rig/execution-policy.json',
        readSource('catalog/baseline/execution-policy.json'),
        undefined,
        'user_owned',
        { transaction_kind: 'user_seed' },
      );
    }

    // Pointer graft
    ensurePointerOwned('AGENTS.md');

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
    const ci = plannedProvider
      ? planCiIntegration(target, { provider: plannedProvider, approved: planNeedsCi && approvalVerified })
      : (plan.ci || planCiIntegration(target));
    const ciArtifactSigned = ci.artifact && (Object.prototype.hasOwnProperty.call(plan.preimages || {}, ci.artifact.relativePath)
      || (plan.operations || []).some((op) => op.path === ci.artifact.relativePath));

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
                ...(grade === 'maximal' && ciArtifactSigned ? {
                  'lint-format-ci-gate-and-explicit-fix': {
                    required_paths: [ci.artifact.relativePath],
                    commands: [
                      ...(plan.lint_format.checks['lint-format-formatter-clean']?.commands || []),
                      ...(plan.lint_format.checks['lint-format-linter-clean']?.commands || []),
                    ],
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
                effectiveChecks(service, grade).map((checkId) => [checkId, {
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
    if (ciArtifactSigned) {
      const rel = ci.artifact.relativePath;
      writeOwned(rel, ci.artifact.contents, undefined, ci.artifact.ownership);
    }

    // Git hook dispatcher. `.git` is a file, not a directory, in a linked
    // worktree, so a hardcoded `.git/hooks` join throws ENOTDIR there.
    // Resolving through git itself gives the real hooks directory — shared
    // across worktrees — and returns null cleanly for a non-git target.
    // Journal canonical `.git/hooks/...` paths so uninstall can restore via
    // the same git-path resolution, including when the hooks dir is outside
    // this worktree.
    const hooksDirAbs = gitPath(target, 'hooks');
    if (hooksDirAbs) {
      fs.mkdirSync(hooksDirAbs, { recursive: true });
      const hookAbs = path.join(hooksDirAbs, 'pre-commit');
      const chainedAbs = path.join(hooksDirAbs, 'pre-commit.rig-chained');
      if (fs.existsSync(hookAbs) && !fs.readFileSync(hookAbs, 'utf8').includes('Rig secret guard shim')) {
        writeOwned('.git/hooks/pre-commit.rig-chained', fs.readFileSync(hookAbs), 0o755, undefined, { abs: chainedAbs });
      }
      writeOwned('.git/hooks/pre-commit', SHIM, 0o755, undefined, { abs: hookAbs });
    }

    let historyScan = null;
    if (manifest.services && manifest.services[LEAK_SCANNER_SERVICE]) {
      const scan = scanBeforeActivation(target, { waiver: options.approval?.history_waiver || plan.history_waiver });
      historyScan = scan.history_scan;
      if (!scan.activated) {
        historyScanNote = `first-enable history scan failed: ${historyScan.status}`;
        writeReport(target, {
          service_id: LEAK_SCANNER_SERVICE,
          status: 'failed',
          summary: 'First-enable history scan failed',
          reason: historyScan.status,
          fix_context: [historyScan.guidance || 'Install the supported official Gitleaks release, remediate findings, then rerun apply'],
        });
        fs.rmSync(lockPath, { force: true });
        return { ok: false, historyScanNote, historyScan };
      }
      historyScanNote = historyScan.status === 'accepted_findings' ? 'first-enable history scan accepted exact waived findings' : 'first-enable history scan verified clean';
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
      manualEntries: validated.manualEntries || {},
    };
    const staged = stagedMcpReceipt(validated);
    writeOwned('.rig/catalog-receipt.json', `${JSON.stringify(receipt, null, 2)}\n`);
    writeCredentialOutputs(target, { hosts: staged.noteHosts, mcp_servers: [] }, staged);
    writeReceipt(target, { ...(readReceipt(target) || {}), ...staged });

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

function remediationChallenge(target, proposal) {
  if (!proposal || typeof proposal !== 'object' || Array.isArray(proposal)) throw new Error('remediate: proposal required');
  if (!Array.isArray(proposal.actions) || proposal.actions.length === 0) throw new Error('remediate: actions required');
  const actions = proposal.actions.map((action) => {
    if (!action || action.op !== 'rewrite' || typeof action.path !== 'string' || typeof action.content !== 'string') {
      throw new Error(`remediate: unsupported or malformed action ${action?.op || ''}`);
    }
    const abs = containedPath(target, action.path);
    const before = fs.existsSync(abs) ? fs.readFileSync(abs) : null;
    return {
      path: action.path,
      before_digest: before ? crypto.createHash('sha256').update(before).digest('hex') : null,
      before_mode: before ? fs.statSync(abs).mode & 0o777 : null,
      after_digest: crypto.createHash('sha256').update(action.content).digest('hex'),
    };
  });
  const proposal_digest = crypto.createHash('sha256').update(JSON.stringify(proposal)).digest('hex');
  const preimage_digest = crypto.createHash('sha256').update(JSON.stringify(actions)).digest('hex');
  const policyFiles = ['.rig/policy/active.json', '.rig/policy/activation-receipt.json'];
  const policy_digest = crypto.createHash('sha256').update(JSON.stringify(policyFiles.map((rel) => {
    const abs = containedPath(target, rel);
    return [rel, fs.existsSync(abs) ? crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex') : null];
  }))).digest('hex');
  const message = `rig-remediation\ntarget=${path.resolve(target)}\nproposal=${proposal_digest}\npreimages=${preimage_digest}\npolicy=${policy_digest}\n`;
  return { schema_version: 1, kind: 'remediation-challenge', proposal_digest, preimage_digest, policy_digest, actions, message };
}

function remediationJournalPath(target) {
  const file = policyPath(target, '.rig/remediation.jsonl');
  try {
    const stat = fs.lstatSync(file);
    if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink !== 1) {
      throw new Error('remediate: unsafe transaction journal; expected an unlinked regular file');
    }
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  return file;
}

function journalStatMatches(file, stat) {
  let current;
  try { current = fs.lstatSync(file); } catch (error) { if (error.code === 'ENOENT') return false; throw error; }
  return current.isFile() && !current.isSymbolicLink() && current.nlink === 1
    && current.dev === stat.dev && current.ino === stat.ino;
}

function readRemediationJournal(target) {
  const file = remediationJournalPath(target);
  if (!fs.existsSync(file)) return null;
  const fd = fs.openSync(file, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW || 0));
  try {
    const stat = fs.fstatSync(fd);
    if (!stat.isFile() || stat.nlink !== 1 || !journalStatMatches(file, stat)) {
      throw new Error('remediate: transaction journal changed while opening');
    }
    return fs.readFileSync(fd, 'utf8');
  } finally { fs.closeSync(fd); }
}

function appendRemediationRecord(target, record) {
  let file = remediationJournalPath(target);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  file = remediationJournalPath(target);
  const fd = fs.openSync(file, fs.constants.O_WRONLY | fs.constants.O_APPEND | fs.constants.O_CREAT | (fs.constants.O_NOFOLLOW || 0), 0o600);
  try {
    const stat = fs.fstatSync(fd);
    if (!stat.isFile() || stat.nlink !== 1 || !journalStatMatches(file, stat)) {
      throw new Error('remediate: transaction journal changed while opening');
    }
    if (fs.fstatSync(fd).nlink !== 1 || !journalStatMatches(file, stat)) {
      throw new Error('remediate: transaction journal changed before append');
    }
    fs.writeFileSync(fd, `${JSON.stringify(record)}\n`);
    fs.fsyncSync(fd);
  } finally { fs.closeSync(fd); }
  syncDirectory(path.dirname(file));
}

function recoverRemediation(target) {
  const journal = readRemediationJournal(target);
  if (journal === null) return;
  const records = journal.split('\n').filter(Boolean).map((line, index) => {
    try { return JSON.parse(line); } catch { throw new Error(`remediate: corrupt transaction journal at line ${index + 1}`); }
  });
  const operations = new Map();
  for (const record of records) {
    if (!record || typeof record.operation !== 'string' || typeof record.state !== 'string') throw new Error('remediate: malformed transaction journal record');
    const state = operations.get(record.operation) || { pending: [], terminal: false };
    if (record.state === 'pending') state.pending.push(record);
    if (['complete', 'rolled_back'].includes(record.state)) state.terminal = true;
    operations.set(record.operation, state);
  }
  for (const [operation, state] of operations) {
    if (state.terminal) continue;
    for (const record of state.pending.reverse()) {
      const abs = containedPath(target, record.path);
      const current = fs.existsSync(abs) ? fs.readFileSync(abs) : null;
      const currentDigest = current && crypto.createHash('sha256').update(current).digest('hex');
      if (currentDigest === record.after_digest) {
        if (record.backup) {
          const backup = containedPath(target, record.backup);
          if (!fs.existsSync(backup) || crypto.createHash('sha256').update(fs.readFileSync(backup)).digest('hex') !== record.before_digest) {
            throw new Error(`remediate: missing or invalid recovery preimage for ${record.path}`);
          }
          fs.writeFileSync(abs, fs.readFileSync(backup), { mode: record.before_mode || 0o600 });
          fs.chmodSync(abs, record.before_mode || 0o600);
        } else fs.rmSync(abs, { force: true });
      } else if (currentDigest !== record.before_digest) {
        throw new Error(`remediate: interrupted transaction conflicts with current file ${record.path}`);
      }
    }
    appendRemediationRecord(target, { operation, state: 'rolled_back', reason: 'recovered interrupted transaction' });
  }
}

function readRemediationTarget(abs, rel) {
  let pathStat;
  try { pathStat = fs.lstatSync(abs); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
  if (!pathStat.isFile() || pathStat.isSymbolicLink() || pathStat.nlink !== 1) {
    throw new Error(`remediate: unsafe target file ${rel}`);
  }
  const fd = fs.openSync(abs, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW || 0));
  try {
    const stat = fs.fstatSync(fd);
    if (!stat.isFile() || stat.nlink !== 1 || stat.dev !== pathStat.dev || stat.ino !== pathStat.ino) {
      throw new Error(`remediate: target changed while reading ${rel}`);
    }
    const bytes = fs.readFileSync(fd);
    if (!journalStatMatches(abs, stat)) throw new Error(`remediate: target changed while reading ${rel}`);
    return { bytes, stat };
  } finally { fs.closeSync(fd); }
}

function remediate(target, proposal, approval) {
  if (!proposal || typeof proposal !== 'object' || Array.isArray(proposal)) throw new Error('remediate: proposal required');
  if (!Array.isArray(proposal.actions) || proposal.actions.length === 0) throw new Error('remediate: actions required');
  for (const action of proposal.actions) {
    if (!action || action.op !== 'rewrite' || typeof action.path !== 'string' || typeof action.content !== 'string') {
      throw new Error(`remediate: unsupported or malformed action ${action?.op || ''}`);
    }
    containedPath(target, action.path);
  }
  const proposalDigest = crypto.createHash('sha256').update(JSON.stringify(proposal)).digest('hex');
  if (!approval || approval.schema_version !== 1 || approval.kind !== 'remediation-approval' ||
      approval.proposal_digest !== proposalDigest || typeof approval.preimage_digest !== 'string') {
    throw new Error('remediate: a matching signed approval is required');
  }
  const signed = approval.approval;
  if (!signed || signed.method !== 'external-sshsig' || typeof signed.identity !== 'string' || typeof signed.signature !== 'string') {
    throw new Error('remediate: signed Gate 1 SSHSIG approval required');
  }
  remediationJournalPath(target);
  const lockPath = acquireLock(target, 'remediation');
  const operation = crypto.randomUUID();
  const backupRoot = containedPath(target, `.rig/remediation-preimages/${operation}`);
  const written = [];
  const temps = [];
  let challenge;
  try {
    recoverRemediation(target);
    challenge = remediationChallenge(target, proposal);
    if (approval.preimage_digest !== challenge.preimage_digest) throw new Error('remediate: stale input preimage; create a new challenge');
    verifyTrustRootApproval(target, {
      identity: signed.identity,
      namespace: 'rig-remediation',
      message: challenge.message,
      signature: signed.signature,
    });
    // rig: preflight the whole proposal under the remediation lock so a
    // no-op or stale later action cannot cause earlier actions to write.
    for (let index = 0; index < proposal.actions.length; index += 1) {
      const action = proposal.actions[index];
      const meta = challenge.actions[index];
      const abs = containedPath(target, action.path);
      const before = readRemediationTarget(abs, action.path)?.bytes || null;
      const beforeDigest = before ? crypto.createHash('sha256').update(before).digest('hex') : null;
      if (beforeDigest !== meta.before_digest) throw new Error(`remediate: stale input preimage for ${action.path}`);
      if (before && before.toString('utf8') === action.content) throw new Error(`remediate: no-op rewrite ${action.path}`);
    }
    fs.mkdirSync(backupRoot, { recursive: true });
    appendRemediationRecord(target, { operation, state: 'started', proposal_digest: challenge.proposal_digest, preimage_digest: challenge.preimage_digest });
    for (let index = 0; index < proposal.actions.length; index += 1) {
      const action = proposal.actions[index];
      const meta = challenge.actions[index];
      const abs = containedPath(target, action.path);
      const beforeState = readRemediationTarget(abs, action.path);
      const before = beforeState?.bytes || null;
      const beforeDigest = before ? crypto.createHash('sha256').update(before).digest('hex') : null;
      if (beforeDigest !== meta.before_digest) throw new Error(`remediate: stale input preimage for ${action.path}`);
      const backupPath = path.join(backupRoot, String(index));
      if (before) fs.writeFileSync(backupPath, before, { flag: 'wx', mode: 0o600 });
      appendRemediationRecord(target, {
        operation, state: 'pending', index, path: action.path,
        before_digest: meta.before_digest, before_mode: meta.before_mode,
        after_digest: meta.after_digest, backup: before ? path.relative(fs.realpathSync(target), backupPath) : null,
      });
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      const temp = `${abs}.rig-remediate-${operation}`;
      temps.push(temp);
      fs.writeFileSync(temp, action.content, { flag: 'wx', mode: meta.before_mode || 0o600 });
      const currentState = readRemediationTarget(abs, action.path);
      if ((beforeState === null && currentState !== null)
          || (beforeState !== null && (!currentState || currentState.stat.dev !== beforeState.stat.dev
            || currentState.stat.ino !== beforeState.stat.ino || !currentState.bytes.equals(beforeState.bytes)))) {
        throw new Error(`remediate: target changed before publish for ${action.path}`);
      }
      fs.renameSync(temp, abs);
      temps.pop();
      written.push({ abs, action, meta, backupPath, existed: Boolean(before) });
      appendRemediationRecord(target, { operation, state: 'applied', index, path: action.path, after_digest: meta.after_digest });
    }
    appendRemediationRecord(target, { operation, state: 'complete' });
  } catch (error) {
    for (const temp of temps) fs.rmSync(temp, { force: true });
    for (const item of written.reverse()) {
      const current = fs.existsSync(item.abs) ? fs.readFileSync(item.abs) : null;
      const currentDigest = current && crypto.createHash('sha256').update(current).digest('hex');
      if (currentDigest !== item.meta.after_digest) continue;
      if (item.existed) {
        fs.writeFileSync(item.abs, fs.readFileSync(item.backupPath), { mode: item.meta.before_mode || 0o600 });
        fs.chmodSync(item.abs, item.meta.before_mode || 0o600);
      } else fs.rmSync(item.abs, { force: true });
    }
    appendRemediationRecord(target, { operation, state: 'rolled_back', reason: error.message });
    throw error;
  } finally {
    fs.rmSync(lockPath, { force: true });
  }
  const inspection = require('./inspect').inspectTarget(target);
  const scan = { ...inspection, status: inspection.findings.length ? 1 : 0 };
  return { ok: scan.status === 0, status: scan.status === 0 ? 'clean' : 'remaining_findings', proposal_digest: challenge.proposal_digest, scan };
}

module.exports = { applyPlan, remediate, remediationChallenge, acquireLock, POINTER_LINE };
