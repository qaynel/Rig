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

    if (!binding) continue;
    const argv = binding[scope] || binding.repo;
    if (!argv || !Array.isArray(argv) || !argv.length) {
      writeReport(target, {
        service_id: serviceId,
        scope,
        status: 'coverage_gap',
        summary: 'Missing binding',
        reason: `No argv binding for scope ${scope}`,
        fix_context: ['coverage_gap'],
      });
      continue;
    }
    const [command, ...rest] = argv;
    const result = runArgv(command, rest, target);
    if (result.error || result.status !== 0) {
      failedEarlier = serviceId;
      writeReport(target, {
        service_id: serviceId,
        scope,
        status: result.error && /ENOENT/.test(String(result.error)) ? 'coverage_gap' : 'failed',
        summary: `${serviceId} failed`,
        reason: result.stderr || result.stdout || String(result.error || 'non-zero exit'),
        fix_context: [`rerun ${JSON.stringify(argv)}`],
      });
      return { status: 1, stdout: result.stdout, stderr: result.stderr };
    }
  }

  return { status: 0, stdout: '', stderr: '' };
}

module.exports = { runArgv, runChecks, checkCopies };
