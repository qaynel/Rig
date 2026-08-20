// Service run bindings (impl-design §8, AD-15).
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { writeReport } = require('./reports');
const { loadCatalog, servicesOf } = require('./catalog');

function runArgv(command, argv, cwd, timeoutMs = 10 * 60 * 1000) {
  return spawnSync(command, argv, {
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
  const script = path.join(target, '.rig', 'bin', 'check-copies.js');
  if (!fs.existsSync(script)) return { status: 0 };
  return runArgv(process.execPath, [script], target);
}

function semanticDrift(target) {
  const indexPath = path.join(target, '.rig', 'context-index.json');
  if (!fs.existsSync(indexPath)) return null;
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const deprecated = (index.documents || []).filter((d) => d.status === 'deprecated');
  if (!deprecated.length) return null;
  for (const doc of deprecated) {
    const abs = path.join(target, doc.path);
    if (fs.existsSync(abs)) {
      return {
        status: 'failed',
        service_id: 'baseline.semantic-drift',
        summary: 'Semantic drift detected',
        reason: `stale/deprecated context at ${doc.path}`,
        fix_context: [`deprecated document ${doc.path} replaces ${doc.replaces || 'canonical'}`],
      };
    }
  }
  return null;
}

function runChecks(target, { scope = 'repo', service = null } = {}) {
  const copy = checkCopies(target);
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

  const drift = semanticDrift(target);
  if (drift) {
    writeReport(target, { ...drift, scope });
    return { status: 1, stdout: '', stderr: drift.reason };
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

  return failure || { status: 0, stdout: '', stderr: '' };
}

module.exports = { runArgv, runBinding, runChecks, checkCopies };
