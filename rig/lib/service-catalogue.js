'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { loadCatalog, servicesOf, effectiveChecks, validateRigJson, GRADES } = require('./catalog');
const { resolve } = require('./resolve');
const { containedPath } = require('./path-safety');
const { canonical, sha256 } = require('./skill-catalog');

const ROOT = path.join(__dirname, '..', '..');

function digestAt(target, rel) {
  const file = containedPath(target, rel);
  return fs.existsSync(file) ? sha256(fs.readFileSync(file)) : null;
}

function serviceText(service, binding) {
  const parts = ['identity', ...(binding.grade ? GRADES.slice(0, GRADES.indexOf(binding.grade) + 1) : [])];
  const fragments = parts.map(part => service.fragments[part]);
  for (const slice of binding.slices) fragments.push(service.slices[slice].fragment);
  return [...new Set(fragments)].map(rel => fs.readFileSync(path.join(ROOT, 'rig', rel), 'utf8').trim()).join('\n\n') + '\n';
}

function definition(service) {
  const rel = `rig/corpus/services/${service.id.replaceAll('.', '/')}/checks.json`;
  const bytes = fs.readFileSync(path.join(ROOT, rel));
  const value = JSON.parse(bytes);
  if (value.schema_version !== 1 || value.service_id !== service.id || !['text', 'json'].includes(value.format)
    || typeof value.ceiling !== 'string' || !value.ceiling || typeof value.offer !== 'string' || !value.offer) {
    throw new Error(`${service.id}: invalid service check definition`);
  }
  containedPath(ROOT, value.input);
  for (const grade of GRADES) {
    if (!Array.isArray(value.checks?.[grade]) || value.checks[grade].length !== service.checks[grade].length) {
      throw new Error(`${service.id}: ${grade} check definition does not match catalogue`);
    }
  }
  return { value, digest: sha256(bytes) };
}

function detectService(target, service) {
  const { value } = definition(service);
  const file = containedPath(target, value.input);
  const present = fs.existsSync(file);
  let invalid = null;
  let repairable = false;
  if (present) {
    try {
      if (!fs.statSync(file).isFile()) throw new Error('input is not a regular file');
      const text = fs.readFileSync(file, 'utf8');
      if (!text.trim()) throw new Error('input is empty');
      if (value.format === 'json') JSON.parse(text);
    } catch (error) { invalid = error.message; }
    repairable = invalid !== null;
  }
  return { evidence_paths: present ? [value.input] : [], present, invalid, repairable, offer: value.offer, ceiling: value.ceiling };
}

function bindServices(target, selection) {
  const catalog = loadCatalog();
  validateRigJson({ schema_version: 1, services: selection }, catalog);
  const resolved = resolve(catalog, selection);
  const byId = Object.fromEntries(servicesOf(catalog).map(s => [s.id, s]));
  const bindings = {};
  const adaptersFile = containedPath(target, 'rig-service-adapters.json');
  let adapters = null;
  if (fs.existsSync(adaptersFile)) {
    adapters = JSON.parse(fs.readFileSync(adaptersFile));
    if (adapters.schema_version !== 1 || !adapters.services || typeof adapters.services !== 'object' || Array.isArray(adapters.services)) {
      throw new Error('rig-service-adapters.json: unsupported adapter schema');
    }
    for (const id of Object.keys(adapters.services)) if (!byId[id]) throw new Error(`unknown service adapter ${id}`);
  }
  for (const id of resolved.order) {
    const service = byId[id];
    const entry = resolved.effective[id];
    const { value, digest } = definition(service);
    const grades = entry.selected_grade ? GRADES.slice(0, GRADES.indexOf(entry.selected_grade) + 1) : [];
    const checkIds = entry.selected_grade ? effectiveChecks(service, entry.selected_grade) : entry.required_slices.map(slice => {
      if (!value.slices?.[slice]) throw new Error(`${id}: missing check for dependency slice ${slice}`);
      return value.slices[slice].check_id;
    });
    const rules = entry.selected_grade ? grades.flatMap(grade => value.checks[grade]) : entry.required_slices.map(slice => value.slices[slice].rule);
    bindings[id] = {
      grade: entry.selected_grade, slices: entry.required_slices, definition_digest: digest,
      ceiling: value.ceiling, discovery: detectService(target, service),
      checks: Object.fromEntries(checkIds.map((checkId, index) => [checkId, {
        native_service: { input: value.input, format: value.format, rule: rules[index] },
      }])),
    };
    const adapter = adapters?.services[id];
    if (adapter) {
      if (typeof adapter.ceiling !== 'string' || !adapter.ceiling.trim() || !adapter.checks || typeof adapter.checks !== 'object' || Array.isArray(adapter.checks)) {
        throw new Error(`${id}: adapter needs checks and an explicit assurance ceiling`);
      }
      const allowed = new Set(GRADES.flatMap(grade => service.checks[grade]));
      for (const [checkId, check] of Object.entries(adapter.checks)) {
        if (!allowed.has(checkId)) throw new Error(`${id}: adapter names unknown check ${checkId}`);
        if (!check || Object.keys(check).some(key => !['repo', 'diff', 'network', 'required_paths', 'timeout_ms', 'memory_limit_mb'].includes(key))
          || !Array.isArray(check.repo) || !check.repo.length || check.repo.some(arg => typeof arg !== 'string' || !arg || arg.includes('\0'))
          || !['none', 'required'].includes(check.network)) throw new Error(`${id}: adapter needs valid argv and declared network capability`);
        if (check.required_paths !== undefined && (!Array.isArray(check.required_paths) || check.required_paths.some(rel => typeof rel !== 'string'))) throw new Error(`${id}: malformed adapter paths`);
        for (const rel of check.required_paths || []) containedPath(target, rel);
        if (bindings[id].checks[checkId]) bindings[id].checks[checkId] = { ...check, read_only: true };
      }
      bindings[id].adapter_digest = digestAt(target, 'rig-service-adapters.json');
      bindings[id].ceiling = adapter.ceiling;
      bindings[id].discovery.evidence_paths.push('rig-service-adapters.json');
    }
    bindings[id].guidance_digest = sha256(serviceText(service, bindings[id]));
    bindings[id].output_preimages = {
      [`.rig/services/${id}.md`]: digestAt(target, `.rig/services/${id}.md`),
      '.rig/service-bindings.json': digestAt(target, '.rig/service-bindings.json'),
    };
  }
  return bindings;
}

function preflightServices(target, proposal, writer) {
  if (proposal.selected_services === undefined) return [];
  const recomputed = bindServices(target, proposal.selected_services);
  // Discovery may change as source files change. Approval freezes executable
  // rule bytes and grade ceilings, rather than the contents checks evaluate.
  const executable = bindings => Object.fromEntries(Object.entries(bindings).map(([id, { discovery, output_preimages, ...binding }]) => [id, binding]));
  if (canonical(executable(recomputed)) !== canonical(executable(proposal.service_bindings))) {
    throw new Error('approved service bindings are stale');
  }
  for (const binding of Object.values(proposal.service_bindings)) for (const [rel, expected] of Object.entries(binding.output_preimages)) {
    const actual = digestAt(target, rel);
    const resumed = require('./payload').journalResumeDigest(writer, rel);
    if (actual !== expected && actual !== resumed) throw new Error(`${rel}: approved service output preimage is stale`);
    if (actual !== null && writer?.latest?.(rel)?.digest !== actual && actual !== resumed) {
      throw new Error(`${rel}: service output is not journal-proven Rig ownership`);
    }
  }
}

function applyServices(target, proposal, writer, currentDigest) {
  if (proposal.selected_services === undefined || !Object.keys(proposal.selected_services).length) return [];
  preflightServices(target, proposal, writer);
  const catalog = loadCatalog();
  const files = [];
  const write = (rel, text) => {
    writer(target, rel, text, 0o644, currentDigest(target, rel) === null ? 'create_owned' : 'replace_owned');
    files.push({ path: rel, sha256: sha256(text) });
  };
  for (const [id, binding] of Object.entries(proposal.service_bindings)) {
    const service = servicesOf(catalog).find(s => s.id === id);
    const text = serviceText(service, binding);
    write(`.rig/services/${id}.md`, text);
  }
  write('.rig/service-bindings.json', JSON.stringify(proposal.service_bindings, null, 2) + '\n');
  return files;
}

function checkServices(target, proposal) {
  const { runBinding } = require('./check-runner');
  let executedCount = 0;
  const results = [];
  if (proposal?.selected_services === undefined) return { executed_count: 0, results };
  if (sha256(canonical((({ digest, ...body }) => body)(proposal))) !== proposal.digest) {
    return { executed_count: 0, results: [{ service_id: 'catalogue', status: 1, kind: 'coverage_gap', reason: 'approved proposal body digest is stale' }] };
  }
  for (const [id, binding] of Object.entries(proposal.service_bindings || {})) {
    const result = runBinding(id, binding, 'repo', target);
    executedCount += result.executed_count || 0;
    results.push({ service_id: id, ...result, ceiling: binding.ceiling });
    if (result.kind === 'mutated') break;
  }
  return { executed_count: executedCount, results };
}

function runNativeService(check, target) {
  const input = check?.input;
  let file, bytes, data;
  try {
    file = containedPath(target, input);
    if (!fs.statSync(file).isFile()) throw new Error('input is not a regular file');
    if (fs.statSync(file).size > 1024 * 1024) throw new Error('input exceeds 1 MiB');
    bytes = fs.readFileSync(file);
    data = check.format === 'json' ? JSON.parse(bytes) : bytes.toString('utf8');
  } catch (error) {
    const missing = error.code === 'ENOENT';
    return {
      status: 1,
      kind: 'coverage_gap',
      reason: `${input}: ${missing ? 'missing input' : error.message}`,
      setup_guidance: missing
        ? `Provide ${input} or select a repository-owned adapter for this service.`
        : `Provide a valid ${check.format} input at ${input}, or select a repository-owned adapter.`,
      executed_count: 0,
    };
  }
  const rule = check.rule;
  let value = data;
  if (rule?.field) for (const part of rule.field.split('.')) value = value?.[part];
  let ok = false;
  if (rule?.op === 'matches' && typeof value === 'string' && typeof rule.value === 'string') ok = new RegExp(rule.value, 'im').test(value);
  else if (rule?.op === 'equals') ok = value === rule.value;
  else if (rule?.op === 'nonempty') {
    if (typeof value !== 'string' && !Array.isArray(value)) return unsupportedNativeInput(input, 'nonempty requires text or an array');
    ok = typeof value === 'string' ? Boolean(value.trim()) : value.length > 0;
  } else if (rule?.op === 'minimum' || rule?.op === 'maximum') {
    if (!Number.isFinite(value)) return unsupportedNativeInput(input, `${rule.op} requires a numeric value`);
    ok = rule.op === 'minimum' ? value >= rule.value : value <= rule.value;
  } else if (rule?.op === 'includes') {
    if (!Array.isArray(value)) return unsupportedNativeInput(input, 'includes requires an array value');
    ok = value.includes(rule.value);
  } else if (rule?.op === 'matches') return unsupportedNativeInput(input, 'matches requires a text value and pattern');
  else return unsupportedNativeInput(input, 'the declared service rule or input type is unsupported');
  return { status: ok ? 0 : 1, kind: ok ? 'conforming' : 'failed', reason: ok ? undefined : rule.reason, executed_count: 1, input_digest: sha256(bytes), evidence_paths: [input] };
}

function unsupportedNativeInput(input, reason) {
  return {
    status: 1,
    kind: 'unsupported_input',
    reason: `${input}: ${reason}`,
    setup_guidance: `Use the input type required by the service rule at ${input}, or select an approved repository-owned adapter.`,
    executed_count: 1,
  };
}

module.exports = { definition, detectService, bindServices, preflightServices, applyServices, checkServices, runNativeService };
