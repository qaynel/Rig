// Service run bindings (impl-design §8, AD-15).
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnGuardedSync } = require('./spawn-guarded');
// spawnSync-shaped results preserve the existing command-runner contract.
const { writeReport } = require('./reports');
const { loadCatalog, servicesOf } = require('./catalog');
const { containedPath } = require('./path-safety');

function runArgv(command, argv, cwd, timeoutMs = 10 * 60 * 1000) {
  return spawnGuardedSync(command, argv, {
    cwd,
    encoding: 'utf8',
    shell: false,
    timeout: timeoutMs,
  });
}

function loadBindings(target) {
  const file = path.join(target, '.rig', 'service-bindings.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
}

function runBinding(serviceId, binding, scope, target) {
  const checks = binding.checks && Object.entries(binding.checks);
  if (!checks) {
    const argv = binding[scope] || binding.repo;
    if (!argv || !Array.isArray(argv) || !argv.length) {
      return { status: 1, kind: 'coverage_gap', reason: `No argv binding for scope ${scope}` };
    }
    const [command, ...rest] = argv;
    return runArgv(command, rest, target);
  }

  for (const [checkId, check] of checks) {
    if (!check || typeof check !== 'object') {
      return { status: 1, kind: 'coverage_gap', reason: `${checkId}: malformed check binding` };
    }
    if (check.coverage_gap) {
      return { status: 1, kind: 'coverage_gap', reason: `${checkId}: ${check.coverage_gap}` };
    }
    for (const rel of check.required_paths || []) {
      const abs = typeof rel === 'string' ? path.resolve(target, rel) : '';
      if (!abs || (!abs.startsWith(path.resolve(target) + path.sep) && abs !== path.resolve(target))) {
        return { status: 1, kind: 'coverage_gap', reason: `${checkId}: invalid required path` };
      }
      if (!fs.existsSync(abs)) {
        return { status: 1, kind: 'coverage_gap', reason: `${checkId}: missing ${rel}` };
      }
    }
    if (check.fix && (!Array.isArray(check.fix) || !check.fix.length)) {
      return { status: 1, kind: 'coverage_gap', reason: `${checkId}: malformed explicit fix binding` };
    }
    if (check.commands) {
      for (const commandBinding of check.commands) {
        if (!Array.isArray(commandBinding.argv) || !commandBinding.argv.length) {
          return { status: 1, kind: 'coverage_gap', reason: `${checkId}: malformed component command` };
        }
        const cwd = path.resolve(target, commandBinding.cwd || '.');
        if (cwd !== path.resolve(target) && !cwd.startsWith(path.resolve(target) + path.sep)) {
          return { status: 1, kind: 'coverage_gap', reason: `${checkId}: component cwd escapes repository` };
        }
        const [command, ...rest] = commandBinding.argv;
        const result = runArgv(command, rest, cwd);
        if (result.error || result.status !== 0) return { ...result, checkId };
      }
      continue;
    }
    const argv = check[scope] || check.repo;
    if (!argv) continue;
    if (!Array.isArray(argv) || !argv.length) {
      return { status: 1, kind: 'coverage_gap', reason: `${checkId}: malformed ${scope} binding` };
    }
    const [command, ...rest] = argv;
    const result = runArgv(command, rest, target);
    if (result.error || result.status !== 0) return { ...result, checkId };
  }
  return { status: 0, stdout: '', stderr: '' };
}

function checkCopies(target) {
  const mapPath = path.join(target, '.rig', 'sync-map.json');
  if (fs.existsSync(mapPath)) {
    const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
    for (const group of map.groups || []) {
      const digests = new Set();
      for (const rel of group) {
        // sync-map.json is a repo-supplied config; refuse group entries that
        // resolve outside the install target — including through a symlink
        // whose lexical path looks contained but whose target isn't — so a
        // manipulated map cannot trick this drift-check into reading
        // arbitrary bytes from elsewhere on disk.
        if (typeof rel !== 'string' || !rel) continue;
        const abs = containedPath(target, rel);
        if (!fs.existsSync(abs)) continue;
        digests.add(fs.readFileSync(abs).toString('utf8'));
      }
      if (digests.size > 1) {
        throw new Error(`drift detected across sync group ${group.join(', ')}`);
      }
    }
  }
  const script = path.join(target, '.rig', 'bin', 'check-copies.js');
  if (!fs.existsSync(script)) return { status: 0 };
  return runArgv(process.execPath, [script], target);
}

function semanticDrift(target) {
  const findings = [];
  const indexPath = path.join(target, '.rig', 'context-index.json');
  if (fs.existsSync(indexPath)) {
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    for (const doc of index.documents || []) {
      if (!doc || typeof doc.path !== 'string') {
        findings.push({ path: '.rig/context-index.json', status: 'coverage_gap', reason: 'malformed_document_entry' });
        continue;
      }
      const abs = path.resolve(target, doc.path);
      if (abs !== path.resolve(target) && !abs.startsWith(path.resolve(target) + path.sep)) {
        findings.push({ path: doc.path, status: 'coverage_gap', reason: 'escaping_context_path' });
        continue;
      }
      if (!fs.existsSync(abs)) {
        findings.push({ path: doc.path, status: 'coverage_gap', reason: 'missing_context' });
        continue;
      }
      const current = require('node:crypto').createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
      if (doc.digest && doc.digest !== current) findings.push({ path: doc.path, status: 'stale', reason: 'digest_changed' });
      if (doc.status === 'deprecated') findings.push({ path: doc.path, status: 'stale', replaces: doc.replaces || null });
      if (doc.review && (doc.review.status !== 'pass' || !doc.review.input_digest)) {
        findings.push({ path: doc.path, status: 'coverage_gap', reason: 'missing_or_note_only_review' });
      }
    }
  }
  const wikiDir = path.join(target, 'wiki');
  if (fs.existsSync(wikiDir)) {
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, entry.name);
        if (entry.isDirectory()) { walk(abs); continue; }
        const rel = path.relative(target, abs);
        try {
          const body = fs.readFileSync(abs, 'utf8');
          const frontmatter = body.startsWith('---\n') ? body.slice(4, body.indexOf('\n---\n', 4)) : '';
          const explicitlyDeprecated = /^status:\s*deprecated\s*$/mi.test(frontmatter) ||
            /\b(?:use|follow) deprecated (?:tier|workflow|instructions?)\b/i.test(body);
          if (explicitlyDeprecated && !findings.some((f) => f.path === rel)) {
            findings.push({ path: rel, status: 'stale' });
          }
        } catch { /* ignore */ }
      }
    };
    walk(wikiDir);
  }
  return findings;
}

function validateDisposition(disposition) {
  if (!disposition || typeof disposition !== 'object') throw new Error('disposition required');
  const kind = disposition.kind;
  if (kind === 'executable') {
    if (!Array.isArray(disposition.argv) || disposition.argv.length === 0) {
      throw new Error('executable disposition needs argv: coverage gap');
    }
    return { kind: 'executable' };
  }
  if (kind === 'convention') {
    const reason = disposition.reason || '';
    if (!/repository|repo-specific|service-specific|tailored|convention:/i.test(reason)) {
      throw new Error('convention disposition needs service-specific reason');
    }
    return { kind: 'convention' };
  }
  if (kind === 'surfaceless') {
    if (!disposition.reason) throw new Error('surfaceless disposition needs reason');
    return { kind: 'surfaceless' };
  }
  throw new Error(`unknown disposition kind: ${kind}`);
}

function resolveRunScope({ environment, changed }) {
  if (environment === 'ci') return { kind: 'repo' };
  return { kind: 'diff', files: changed || [] };
}

function runChecks(target, { scope = 'repo', service = null } = {}) {
  let copy;
  try {
    copy = checkCopies(target);
  } catch (error) {
    copy = { status: 1, stdout: '', stderr: error.message };
  }
  if (copy.status !== 0) {
    writeReport(target, {
      service_id: 'baseline.exact-copy',
      scope,
      status: 'failed',
      summary: 'Exact-copy sync check failed',
      reason: copy.stderr || copy.stdout || 'byte drift',
      fix_context: ['restore duplicates to match canonical bytes in .rig/sync-map.json'],
    });
    return { status: 1, stdout: copy.stdout, stderr: copy.stderr };
  }

  const driftFindings = semanticDrift(target);
  if (driftFindings && driftFindings.length) {
    const first = driftFindings[0];
    writeReport(target, {
      status: 'failed',
      service_id: 'baseline.semantic-drift',
      summary: 'Semantic drift detected',
      reason: `stale/deprecated context at ${first.path}`,
      fix_context: [`deprecated document ${first.path}`],
      scope,
    });
    return { status: 1, stdout: '', stderr: `stale/deprecated context at ${first.path}` };
  }

  const bindings = loadBindings(target);
  const receiptPath = path.join(target, '.rig', 'catalog-receipt.json');
  const receipt = fs.existsSync(receiptPath)
    ? JSON.parse(fs.readFileSync(receiptPath, 'utf8'))
    : { order: Object.keys(bindings), services: {} };
  const order = receipt.order || Object.keys(bindings);
  const selected = service ? [service] : order;
  const catalog = loadCatalog();
  const byId = Object.fromEntries(servicesOf(catalog).map((s) => [s.id, s]));
  let failedEarlier = null;
  let failure = null;

  for (const serviceId of selected) {
    if (failedEarlier) {
      writeReport(target, {
        service_id: serviceId,
        scope,
        status: 'failed',
        summary: 'Not run due to earlier ladder failure',
        reason: `not_run_due_to_dependency:${failedEarlier}`,
        fix_context: ['not_run_due_to_dependency', `fix ${failedEarlier} first`],
      });
      continue;
    }

    const serviceMeta = byId[serviceId];
    const binding = bindings[serviceId];
    const needsUi =
      serviceMeta &&
      (serviceMeta.applicability?.not_recommended_without || []).includes('ui-surface');
    const hasUi =
      fs.existsSync(path.join(target, 'index.html')) ||
      fs.existsSync(path.join(target, 'public')) ||
      (() => {
        try {
          const pkg = JSON.parse(fs.readFileSync(path.join(target, 'package.json'), 'utf8'));
          return /react|vue|svelte|angular|browser|next/i.test(JSON.stringify(pkg));
        } catch {
          return false;
        }
      })();

    if (needsUi && !hasUi) {
      writeReport(target, {
        service_id: serviceId,
        scope,
        status: 'vacuous',
        summary: 'Nothing to pin here.',
        reason: serviceMeta.surfaceless_reason || 'No browser or UI surface was detected.',
        fix_context: ['surfaceless'],
      });
      continue;
    }

    if (!binding) {
      // rig: dependency-only slices predate runnable slice bindings; keep their
      // legacy skip until the first authored dependency adapter defines one.
      if (!service && !receipt.services?.[serviceId] && !receipt.installed?.[serviceId]) continue;
      writeReport(target, {
        service_id: serviceId,
        scope,
        status: 'coverage_gap',
        summary: 'Missing binding',
        reason: 'No service binding is installed',
        fix_context: ['coverage_gap'],
      });
      return { status: 1, stdout: '', stderr: `${serviceId}: coverage gap: binding is missing\n` };
    }
    const result = runBinding(serviceId, binding, scope, target);
    if (result.error || result.status !== 0) {
      failedEarlier = serviceId;
      const reason = result.reason || result.stderr || result.stdout || String(result.error || 'non-zero exit');
      writeReport(target, {
        service_id: serviceId,
        scope,
        status:
          result.kind === 'coverage_gap' || (result.error && /ENOENT/.test(String(result.error)))
            ? 'coverage_gap'
            : 'failed',
        summary: `${serviceId} failed`,
        reason,
        fix_context: result.checkId ? [`check ${result.checkId}`] : ['coverage_gap'],
      });
      failure = { status: 1, stdout: result.stdout || '', stderr: result.stderr || `${reason}\n` };
    }
  }

  return failure || { status: 0, stdout: 'Rig check passed.\n', stderr: '' };
}

module.exports = {
  runArgv,
  runBinding,
  runChecks,
  checkCopies,
  semanticDrift,
  validateDisposition,
  resolveRunScope,
};
