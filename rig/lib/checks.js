// Service run bindings (impl-design §8, AD-15).
'use strict';

const fs = require('node:fs');
const path = require('node:path');
// spawnSync-shaped results preserve the existing command-runner contract.
const writeReport = (...args) => require('./reports').writeReport(...args);
const conventionReasonGap = (...args) => require('./catalog').conventionReasonGap(...args);
const { containedPath } = require('./path-safety');
// runArgv/runBinding are the canonical implementation shared with the
// installed CI/git-floor runner (rig/catalog/baseline/check.js) — see
// GA-38. Do not re-implement containment or argv-execution logic here; a
// hand-duplicated copy is exactly the defect class RIG-144 found and fixed.
const { runArgv, runBinding, renderDiagnostic, genericSuccessBinding } = require('./check-runner');
const { redact } = require('./redaction');
const crypto = require('node:crypto');
const { isHarness } = require('./git-dispatch');

function loadBindings(target) {
  const file = path.join(target, '.rig', 'service-bindings.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
}

function checkCopies(target, { readFile } = {}) {
  const mapPath = containedPath(target, '.rig/sync-map.json');
  let mapBytes = null;
  if (readFile) {
    mapBytes = readFile('.rig/sync-map.json');
    if (mapBytes == null && fs.existsSync(mapPath)) mapBytes = fs.readFileSync(mapPath);
  } else if (fs.existsSync(mapPath)) mapBytes = fs.readFileSync(mapPath);
  if (mapBytes !== null) {
    const map = JSON.parse(Buffer.from(mapBytes).toString('utf8'));
    if (!Array.isArray(map.groups)) throw new Error('exact-copy: malformed sync groups');
    for (const group of map.groups) {
      const entries = Array.isArray(group) ? group : (group && Array.isArray(group.copies) ? [group.canonical, ...group.copies] : null);
      if (!entries || entries.some((rel) => typeof rel !== 'string' || !rel)) throw new Error('exact-copy: malformed sync group');
      const bytes = entries.map((rel) => {
        const abs = containedPath(target, rel);
        return readFile ? readFile(rel) : fs.readFileSync(abs);
      });
      if (bytes.some((body) => !Buffer.from(body).equals(Buffer.from(bytes[0])))) throw new Error(`drift detected across sync group ${entries.join(', ')}`);
    }
    return { status: 0 };
  }
  const script = path.join(target, '.rig', 'bin', 'check-copies.js');
  return fs.existsSync(script) ? runArgv(process.execPath, [script], target) : { status: 0 };
}

function contextHarnesses(target) {
  const found = [];
  const walk = (directory, relative = '') => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (!relative && ['.git', 'node_modules', '.rig'].includes(entry.name)) continue;
      const rel = relative ? `${relative}/${entry.name}` : entry.name;
      const abs = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(abs, rel);
      else if (entry.isFile() && isHarness(rel)) found.push(rel);
    }
  };
  walk(target);
  return found.sort();
}

function semanticDrift(target, { readFile, requiredPaths = contextHarnesses(target) } = {}) {
  const findings = [];
  const read = readFile || ((rel) => fs.readFileSync(containedPath(target, rel)));
  let index;
  try {
    let bytes = readFile ? read('.rig/context-index.json') : null;
    // Installed host metadata can be ignored by Git. Use it only when no
    // staged blob exists; an actual staged blob always owns this decision.
    const indexPath = containedPath(target, '.rig/context-index.json');
    if (bytes == null && fs.existsSync(indexPath)) bytes = readFile ? fs.readFileSync(indexPath) : read('.rig/context-index.json');
    index = bytes === null ? null : JSON.parse(Buffer.from(bytes).toString('utf8'));
  } catch { return [{ path: '.rig/context-index.json', status: 'coverage_gap', reason: 'malformed_context_index' }]; }
  if (!index && requiredPaths.length) findings.push({ path: '.rig/context-index.json', status: 'coverage_gap', reason: 'missing_context_index' });
  const documents = index?.documents || requiredPaths.map((path) => ({ path }));
  if (!Array.isArray(documents)) return [{ path: '.rig/context-index.json', status: 'coverage_gap', reason: 'malformed_document_entries' }];
  const listed = new Set(documents.map((doc) => doc?.path).filter((rel) => typeof rel === 'string'));
  const omitted = requiredPaths.filter((rel) => !listed.has(rel));
  if (omitted.length) findings.push({ path: '.rig/context-index.json', status: 'coverage_gap', reason: 'context_harness_omitted', documents: omitted });
  const current = new Map();
  for (const doc of documents) {
    if (!doc || typeof doc.path !== 'string' || !doc.path || current.has(doc.path)) {
      findings.push({ path: '.rig/context-index.json', status: 'coverage_gap', reason: 'malformed_document_entry' }); continue;
    }
    try {
      try { containedPath(target, doc.path); } catch {
        findings.push({ path: doc.path, status: 'coverage_gap', reason: 'escaping_context_path' }); continue;
      }
      current.set(doc.path, crypto.createHash('sha256').update(read(doc.path)).digest('hex'));
    } catch {
      findings.push({ path: doc.path, status: 'coverage_gap', reason: 'missing_or_escaping_context' }); continue;
    }
    if (doc.digest && doc.digest !== current.get(doc.path)) findings.push({ path: doc.path, status: 'stale', reason: 'digest_changed' });
    if (doc.status === 'deprecated') findings.push({ path: doc.path, status: 'stale', reason: 'deprecated_context' });
  }
  if (current.size || requiredPaths.length) {
    const review = index?.review;
    const valid = review?.schema_version === 1 && review.reviewer?.kind === 'host-agent' && typeof review.reviewer.identity === 'string' && review.reviewer.identity.trim() &&
      ['pass', 'fail'].includes(review.status) && Array.isArray(review.inputs) && Array.isArray(review.relationships);
    if (!valid) findings.push({ path: '.rig/context-index.json', status: 'coverage_gap', reason: 'missing_or_note_only_review' });
    else {
      const inputs = new Map(review.inputs.map((input) => [input?.path, input?.digest]));
      if (inputs.size !== current.size || inputs.size !== review.inputs.length || [...current].some(([rel, hash]) => inputs.get(rel) !== hash)) {
        findings.push({ path: '.rig/context-index.json', status: 'stale', reason: 'semantic_review_input_digest_changed' });
      }
      const judged = new Set();
      for (const relation of review.relationships) {
        if (!relation || !current.has(relation.from) || !current.has(relation.to) || relation.from === relation.to ||
            !['consistent', 'contradiction'].includes(relation.status) || typeof relation.reason !== 'string' || !relation.reason.trim()) {
          findings.push({ path: '.rig/context-index.json', status: 'coverage_gap', reason: 'malformed_semantic_relationship' }); continue;
        }
        const pair = [relation.from, relation.to].sort().join('\0');
        if (judged.has(pair)) findings.push({ path: '.rig/context-index.json', status: 'coverage_gap', reason: 'duplicate_semantic_relationship' });
        judged.add(pair);
        if (relation.status === 'contradiction') findings.push({ path: relation.from, related: relation.to, status: 'failed', reason: 'semantic_contradiction' });
      }
      // rig: all-pairs review is intentionally bounded by the explicit context
      // index. Split large context sets into reviewed relationship groups if
      // repositories outgrow this simple, auditable coverage contract.
      if (judged.size !== current.size * (current.size - 1) / 2) findings.push({ path: '.rig/context-index.json', status: 'coverage_gap', reason: 'missing_semantic_relationship_review' });
      if (review.status !== 'pass') findings.push({ path: '.rig/context-index.json', status: 'failed', reason: 'semantic_review_failed' });
    }
  }
  const wikiDir = path.join(target, 'wiki');
  if (fs.existsSync(wikiDir)) {
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, entry.name);
        if (entry.isDirectory()) { walk(abs); continue; }
        if (!entry.isFile()) continue;
        const rel = path.relative(target, abs);
        const body = fs.readFileSync(containedPath(target, rel), 'utf8');
        const frontmatter = body.startsWith('---\n') ? body.slice(4, body.indexOf('\n---\n', 4)) : '';
        if (/^status:\s*deprecated\s*$/mi.test(frontmatter) || /\b(?:use|follow) deprecated (?:tier|workflow|instructions?)\b/i.test(body)) {
          if (!findings.some((f) => f.path === rel)) findings.push({ path: rel, status: 'stale', reason: 'deprecated_context' });
        }
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
    const stub = genericSuccessBinding(disposition.argv);
    if (stub) throw new Error(`executable disposition is a ${stub}: coverage gap`);
    return { kind: 'executable' };
  }
  if (kind === 'convention') {
    if (conventionReasonGap(disposition.reason, disposition.service)) {
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

function runChecksLocal(target, { scope, service = null } = {}) {
  const ci = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
  scope = scope || (ci ? 'repo' : 'diff');
  let baseline;
  try { baseline = require('./policy-baseline').runBaseline(target, { surface: ci ? 'ci.repo' : 'git.pre_commit', scope }); }
  catch (error) { return { status: 1, stdout: '', stderr: `baseline: ${redact(error.message)}\n` }; }
  for (const entry of baseline.results.filter((entry) => entry.status === 'failed')) {
    writeReport(target, { service_id: `baseline.${entry.control}`, scope, status: 'failed',
      summary: `${entry.control} check failed`, reason: entry.findings.map((finding) => finding.kind).join(', '),
      evidence: [entry], fix_context: ['Resolve the reported current-input failure and rerun the check.'] });
  }
  if (baseline.status !== 0) return { status: 1, findings: baseline.results.filter(entry => entry.status === 'failed').flatMap(entry => entry.findings.map(finding => ({ rule: `baseline.${entry.control}.${finding.kind}` }))), stdout: '', stderr: `baseline failed: ${baseline.results.filter((entry) => entry.status === 'failed').map((entry) => entry.control).join(', ')}\n` };
  if (!baseline.surface_enabled) return { status: 0, stdout: 'Rig checks disabled on this surface.\n', stderr: '' };

  const bindings = loadBindings(target);
  const receiptPath = path.join(target, '.rig', 'catalog-receipt.json');
  const receipt = fs.existsSync(receiptPath)
    ? JSON.parse(fs.readFileSync(receiptPath, 'utf8'))
    : { order: Object.keys(bindings), services: {} };
  const order = receipt.order || Object.keys(bindings);
  const selected = service ? [service] : order;
  let failedEarlier = null;
  let failure = null;
  let diagnostics = '';

  for (const serviceId of selected) {
    if (failedEarlier) {
      writeReport(target, {
        service_id: serviceId,
        scope,
        status: 'not_run_due_to_dependency',
        summary: 'Not run due to earlier ladder failure',
        reason: `not_run_due_to_dependency:${failedEarlier}`,
        fix_context: ['not_run_due_to_dependency', `fix ${failedEarlier} first`],
      });
      continue;
    }

    const binding = bindings[serviceId];
    if (!binding) {
      writeReport(target, {
        service_id: serviceId,
        scope,
        status: 'coverage_gap',
        summary: 'Missing binding',
        reason: 'No service binding is installed',
        fix_context: ['coverage_gap'],
      });
      const missingBinding = { status: 1, kind: 'coverage_gap', stdout: '', stderr: `${serviceId}: coverage gap: binding is missing\n` };
      failedEarlier = serviceId;
      failure = missingBinding;
      continue;
    }
    if (ci && serviceId === 'development.code-quality.lint-format' && binding.grade !== 'maximal') continue;
    const result = runBinding(serviceId, binding, scope, target);
    for (const diagnostic of result.diagnostics || (result.diagnostic ? [result.diagnostic] : [])) {
      diagnostics += renderDiagnostic(serviceId, diagnostic);
    }
    if (result.error || result.status !== 0) {
      failedEarlier = serviceId;
      const reason = result.reason || result.stderr || result.stdout || String(result.error || 'non-zero exit');
      writeReport(target, {
        service_id: serviceId,
        scope,
        status:
          require('./reports').ALLOWED.has(result.kind) ? result.kind : (result.error && /ENOENT/.test(String(result.error))) ? 'command_not_found' : 'failed',
        summary: `${serviceId} failed`,
        reason,
        evidence: result.changed_paths || result.changes || result.commands ? [{
          ...(result.changed_paths ? { changed_paths: result.changed_paths } : {}),
          ...(result.changes ? { changes: result.changes } : {}),
          ...(result.commands ? { commands: result.commands, executed_count: result.executed_count } : {}),
        }] : [],
        fix_context: result.checkId ? [`check ${result.checkId}`] : ['coverage_gap'],
      });
      failure = {
        status: 1, kind: result.kind || 'failed', checkId: result.checkId,
        stdout: result.stdout || '', stderr: result.stderr || `${reason}\n`,
        ...(result.changed_paths ? { changed_paths: result.changed_paths } : {}),
        ...(result.changes ? { changes: result.changes } : {}),
        ...(result.commands ? { commands: result.commands, executed_count: result.executed_count } : {}),
      };
    }
  }

  const outcome = failure || { status: 0, stdout: 'Rig check passed.\n', stderr: '' };
  return diagnostics ? { ...outcome, stderr: `${diagnostics}${outcome.stderr}` } : outcome;
}

// Publish once after execution: CI receives safe aggregates; local diagnostics
// retain actionable detail after the same scrubber used by persisted reports.
function runChecks(target, options = {}) {
  let result;
  try { result = runChecksLocal(target, options); }
  catch (error) { result = { status: 1, kind: 'runner_error', stdout: '', stderr: redact(error.message) + '\n' }; }
  if (process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true') {
    const findings = result.findings || (result.status === 0 ? [] : [{ rule: result.checkId || result.kind || 'check_failed' }]);
    return { status: result.status, stdout: JSON.stringify(require('./reports').projectCiResult({ status: result.status, findings })) + '\n', stderr: '' };
  }
  return JSON.parse(JSON.stringify({ ...result, stdout: result.stdout || '', stderr: result.stderr || '' }, (_key, value) => typeof value === 'string' ? redact(value) : value));
}

module.exports = {
  runArgv,
  runBinding,
  runChecks,
  checkCopies,
  contextHarnesses,
  semanticDrift,
  validateDisposition,
  resolveRunScope,
};
