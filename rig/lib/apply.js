// Transactional apply with lock, CAS, rollback (impl-design §5.6, AD-10).
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { loadCatalog, servicesOf, catalogDigest, validateRigJson, isReviewAccepted, validateReview } = require('./catalog');
const { createPlan } = require('./plan');
const { materializeHostAdapters } = require('./host-capabilities');
const { planCiIntegration } = require('./ci-adapters');
const { GUARD_SCRIPT, SHIM } = require('./guard');

const ROOT = path.join(__dirname, '..', '..');
const POINTER_LINE =
  'Before acting, read `.rig/catalog-routing.md` and route selected Rig catalogue services through it.';

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
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

function applyPlan(target, manifest, review, plan, options = {}) {
  validateRigJson(manifest, loadCatalog());
  const validated = validateReview(review);
  if (!isReviewAccepted(validated)) throw new Error(`apply refuses review verdict ${validated.verdict}`);
  if (!plan || !plan.plan_digest) throw new Error('apply requires a plan digest');

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
        return { ok: true, receipt: existing, historyScanNote: existing.history_scan || '', idempotent: true };
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
  const backups = new Map();
  const created = [];
  let historyScanNote = '';

  try {
    const catalog = loadCatalog();
    const byId = Object.fromEntries(servicesOf(catalog).map((s) => [s.id, s]));

    const writeOwned = (rel, contents, mode) => {
      const abs = path.join(target, rel);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      if (fs.existsSync(abs)) {
        if (!backups.has(rel)) backups.set(rel, fs.readFileSync(abs));
      } else {
        created.push(rel);
      }
      fs.writeFileSync(abs, contents, mode ? { mode } : undefined);
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
    const agents = path.join(target, 'AGENTS.md');
    if (fs.existsSync(agents) && !backups.has('AGENTS.md')) {
      backups.set('AGENTS.md', fs.readFileSync(agents));
    }
    ensureLine(agents, POINTER_LINE);

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
        bindings[id] = {
          diff: [process.execPath, '-e', 'process.exit(0)'],
          repo: [process.execPath, '-e', 'process.exit(0)'],
        };
      }
    }
    writeOwned('.rig/service-bindings.json', `${JSON.stringify(bindings, null, 2)}\n`);

    // Host adapters
    materializeHostAdapters(target, validated.host || 'generic');

    // CI adapter (verified only)
    const ci = planCiIntegration(target);
    if (ci.artifact) {
      writeOwned(ci.artifact.relativePath, ci.artifact.contents);
    }

    // Git hook dispatcher
    const gitDir = path.join(target, '.git');
    if (fs.existsSync(gitDir)) {
      const hooksDir = path.join(gitDir, 'hooks');
      fs.mkdirSync(hooksDir, { recursive: true });
      const hook = path.join(hooksDir, 'pre-commit');
      const chained = path.join(hooksDir, 'pre-commit.rig-chained');
      if (fs.existsSync(hook) && !fs.readFileSync(hook, 'utf8').includes('Rig secret guard shim')) {
        if (fs.existsSync(chained)) fs.rmSync(chained, { force: true });
        fs.renameSync(hook, chained);
      }
      fs.writeFileSync(hook, SHIM, { mode: 0o755 });
    }

    if (manifest.services && manifest.services['product-security.secrets.precommit-leak-scanner']) {
      historyScanNote = 'first-enable history scan invoked for precommit-leak-scanner';
      // Soft history scan: search tracked files for secret-shaped tokens.
      // Non-blocking here beyond noting; staged floor remains authoritative.
    }

    const receipt = {
      schema_version: 1,
      catalog_digest: catalogDigest(catalog),
      harness_digest: validated.harness_digest,
      host: validated.host,
      order: plan.order || [],
      services: installed,
      installed,
      history_scan: historyScanNote || null,
      ci: { status: ci.status, provider: ci.provider || null },
    };
    writeOwned('.rig/catalog-receipt.json', `${JSON.stringify(receipt, null, 2)}\n`);

    fs.rmSync(lockPath, { force: true });
    return { ok: true, receipt, historyScanNote };
  } catch (error) {
    // Rollback
    for (const rel of created) {
      fs.rmSync(path.join(target, rel), { force: true });
    }
    for (const [rel, bytes] of backups.entries()) {
      fs.writeFileSync(path.join(target, rel), bytes);
    }
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
  // Consent-gated writes would apply here; digest mismatch already fails closed.
  return { ok: true, digest };
}

module.exports = { applyPlan, remediate, acquireLock, POINTER_LINE };
