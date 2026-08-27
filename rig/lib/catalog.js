// Catalogue validation + loaders (impl-design §4, AD-3/AD-4).
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.join(__dirname, '..', '..');
const CATALOG_PATH = path.join(ROOT, 'rig', 'catalog.json');
const GRADES = ['minimal', 'mid', 'maximal'];
const VERDICTS = ['ALLOW', 'ALLOW_WITH_RESTRICTIONS', 'QUARANTINE', 'BLOCK'];
const KNOWN_RESTRICTIONS = new Set([
  'no-network-tools',
  'no-shell-exec',
  'read-only-fs',
  'require-human-approval',
]);

function loadCatalog(catalogPath = CATALOG_PATH) {
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  validateCatalog(catalog);
  return catalog;
}

function servicesOf(catalog) {
  return catalog.services || catalog.entries || [];
}

function validateCatalog(catalog) {
  const services = servicesOf(catalog);
  if (!Array.isArray(services) || services.length === 0) {
    throw new Error('rig catalog: services must be a non-empty array');
  }
  const ids = new Set();
  const owns = new Map();
  for (const service of services) {
    if (!service || typeof service !== 'object') throw new Error('rig catalog: service must be object');
    if (typeof service.id !== 'string' || !/^[a-z0-9-]+(?:\.[a-z0-9-]+){2}$/.test(service.id)) {
      throw new Error(`rig catalog: invalid id ${service && service.id}`);
    }
    if (ids.has(service.id)) throw new Error(`rig catalog: duplicate id ${service.id}`);
    ids.add(service.id);
    if (!service.family || !service.group) throw new Error(`rig catalog: ${service.id} needs family/group`);
    if (!Array.isArray(service.owns) || service.owns.length === 0) {
      throw new Error(`rig catalog: ${service.id} needs owns[]`);
    }
    for (const key of service.owns) {
      if (owns.has(key)) throw new Error(`rig catalog: owned scope "${key}" duplicated`);
      owns.set(key, service.id);
    }
    const checks = service.checks || {};
    for (const grade of GRADES) {
      if (!Array.isArray(checks[grade])) {
        throw new Error(`rig catalog: ${service.id} checks.${grade} must be an array`);
      }
    }
    if (checks.minimal.length === 0) {
      throw new Error(`rig catalog: ${service.id} minimal checks must be non-empty`);
    }
    const mid = new Set([...checks.minimal, ...checks.mid]);
    const maximal = new Set([...checks.minimal, ...checks.mid, ...checks.maximal]);
    if (mid.size <= checks.minimal.length) {
      throw new Error(`rig catalog: ${service.id} mid must strictly grow beyond minimal`);
    }
    if (maximal.size <= mid.size) {
      throw new Error(`rig catalog: ${service.id} maximal must strictly grow beyond mid`);
    }
    for (const id of checks.minimal) {
      if (!mid.has(id)) throw new Error(`rig catalog: ${service.id} mid missing minimal check ${id}`);
    }
    for (const id of mid) {
      if (!maximal.has(id)) throw new Error(`rig catalog: ${service.id} maximal missing mid check ${id}`);
    }
  }
  return { ids, owns };
}

function catalogDigest(catalog = loadCatalog()) {
  const body = JSON.stringify(catalog);
  return crypto.createHash('sha256').update(body).digest('hex');
}

function effectiveChecks(service, grade) {
  const checks = service.checks || {};
  if (grade === 'minimal') return [...(checks.minimal || [])];
  if (grade === 'mid') return [...(checks.minimal || []), ...(checks.mid || [])];
  if (grade === 'maximal') {
    return [...(checks.minimal || []), ...(checks.mid || []), ...(checks.maximal || [])];
  }
  throw new Error(`rig catalog: unknown grade ${grade}`);
}

function validateRigJson(manifest, catalog = loadCatalog()) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    throw new Error('rig.json must be an object');
  }
  if (manifest.schema_version !== 1) throw new Error('rig.json schema_version must be 1');
  if (manifest.baseline !== undefined) throw new Error('baseline is not selectable');
  if (manifest.disable_baseline !== undefined) throw new Error('baseline cannot be disabled');
  if (!manifest.services || typeof manifest.services !== 'object' || Array.isArray(manifest.services)) {
    throw new Error('rig.json services must be an object map of leaf ids');
  }
  const byId = Object.fromEntries(servicesOf(catalog).map((s) => [s.id, s]));
  for (const [id, grade] of Object.entries(manifest.services)) {
    if (id === 'baseline.sanitation' || id.startsWith('baseline.')) {
      throw new Error('baseline is not selectable');
    }
    if (!byId[id]) throw new Error(`unknown service "${id}"`);
    if (!GRADES.includes(grade)) throw new Error(`invalid grade "${grade}" for ${id}`);
    const parts = id.split('.');
    if (parts.length !== 3) throw new Error(`service id must be a leaf: ${id}`);
  }
  return true;
}

function validateReview(review, options = {}) {
  if (!review || typeof review !== 'object') throw new Error('review must be an object');
  if (review.schema_version !== 1) throw new Error('review schema_version must be 1');
  if (typeof review.harness_digest !== 'string' || !review.harness_digest) {
    throw new Error('review harness_digest required');
  }
  if (!VERDICTS.includes(review.verdict)) throw new Error('invalid verdict');
  if (!Array.isArray(review.findings)) throw new Error('findings must be array');
  if (!Array.isArray(review.restrictions)) throw new Error('restrictions must be array');
  if (!Array.isArray(review.unverifiable)) throw new Error('unverifiable must be array');

  let verdict = review.verdict;
  const unknown = [];
  for (const restriction of review.restrictions) {
    const id = restriction && restriction.id;
    if (!id || !KNOWN_RESTRICTIONS.has(id)) unknown.push(id || 'missing-id');
  }
  if (unknown.length || (review.unverifiable && review.unverifiable.length)) {
    verdict = 'QUARANTINE';
  }
  if (options.expectedDigest && options.expectedDigest !== review.harness_digest) {
    throw new Error('review harness_digest is stale');
  }
  return { ...review, verdict };
}

function isReviewAccepted(review) {
  const validated = validateReview(review);
  return validated.verdict === 'ALLOW' || validated.verdict === 'ALLOW_WITH_RESTRICTIONS';
}

function selectFromMenu(menu, pairs) {
  if (!menu || typeof menu !== 'object' || Array.isArray(menu)) {
    throw new Error('select: menu must be an object');
  }
  const rows = Array.isArray(menu.services) ? menu.services : menu.menu;
  if (!Array.isArray(rows)) throw new Error('select: menu services must be an array');
  const allowed = new Set(rows.map((row) => row && row.service_id).filter(Boolean));
  if (!Array.isArray(pairs) || pairs.length === 0) {
    throw new Error('select: at least one --service id=grade is required');
  }
  const services = {};
  for (const pair of pairs) {
    const idx = String(pair).lastIndexOf('=');
    if (idx <= 0) throw new Error(`select: invalid service selection "${pair}"`);
    const id = pair.slice(0, idx);
    const grade = pair.slice(idx + 1);
    if (!allowed.has(id)) throw new Error(`select: unknown service "${id}"`);
    if (!GRADES.includes(grade)) throw new Error(`select: invalid grade "${grade}" for ${id}`);
    services[id] = grade;
  }
  return { schema_version: 1, services };
}

const POLICY_GRADE = /Policy(?:-| )grade/i;
const PLACEHOLDER = /TODO|TBD|Concrete convention|describes the .* service\. This authoring|enforces the Policy-grade checks declared in the catalogue|carries the shared invariant the parent service depends on/i;
const GENERIC_CHECK = /-(?:core|extended|thorough)$/;
const LINT_FORMAT_ID = 'development.code-quality.lint-format';

function inspectFragment(service, part, rel) {
  const serviceId = service.id;
  if (typeof rel !== 'string' || !rel) {
    return { id: serviceId, part, rel, reason: 'missing fragment path' };
  }
  if (!rel.endsWith('.md')) {
    return { id: serviceId, part, rel, reason: 'not markdown' };
  }
  const file = path.join(ROOT, 'rig', rel);
  if (!fs.existsSync(file)) {
    return { id: serviceId, part, rel, reason: 'missing fragment file' };
  }
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (err) {
    return { id: serviceId, part, rel, reason: `unreadable: ${err.message}` };
  }
  if (!String(text).trim()) {
    return { id: serviceId, part, rel, reason: 'empty fragment' };
  }
  if (!text.trimStart().startsWith('#')) {
    return { id: serviceId, part, rel, reason: 'malformed markdown: missing heading' };
  }
  if (PLACEHOLDER.test(text)) {
    return { id: serviceId, part, rel, reason: 'malformed fragment: placeholder text' };
  }
  if (serviceId !== LINT_FORMAT_ID && !POLICY_GRADE.test(text)) {
    return { id: serviceId, part, rel, reason: 'missing declared grade' };
  }
  if (part === 'minimal' || part === 'mid' || part === 'maximal') {
    if (!new RegExp(`\\b${part}\\b`, 'i').test(text)) {
      return { id: serviceId, part, rel, reason: `missing declared grade ${part}` };
    }
    for (const checkId of service.checks?.[part] || []) {
      if (GENERIC_CHECK.test(checkId)) {
        return { id: serviceId, part, rel, reason: `generic check id ${checkId}` };
      }
      if (!text.includes(checkId)) {
        return { id: serviceId, part, rel, reason: `fragment omits check ${checkId}` };
      }
    }
  }
  if (part === 'identity') {
    for (const value of [...(service.owns || []), ...(service.applicability?.any || [])]) {
      if (!text.includes(value)) return { id: serviceId, part, rel, reason: `identity omits ${value}` };
    }
    if (!/Disposition:/i.test(text)) {
      return { id: serviceId, part, rel, reason: 'identity omits disposition' };
    }
  }
  return null;
}

function authorshipReport() {
  const catalog = loadCatalog();
  const services = servicesOf(catalog);
  const counts = {};
  const rows = [];
  const failures = [];
  const bodies = new Map();
  for (const service of services) {
    counts[service.family] = (counts[service.family] || 0) + 1;
    const disposition = service.disposition || null;
    if (!disposition || !['executable', 'convention', 'surfaceless'].includes(disposition.kind) || !disposition.reason) {
      failures.push({ id: service.id, reason: 'missing honest disposition contract' });
    }
    const evidenceTargets = [];
    const seen = new Set();
    const addTarget = (part, rel) => {
      if (!rel) return;
      evidenceTargets.push(rel);
      if (seen.has(rel)) return;
      seen.add(rel);
      const failure = inspectFragment(service, part, rel);
      if (failure) failures.push(failure);
      else {
        const normalized = fs.readFileSync(path.join(ROOT, 'rig', rel), 'utf8').replace(/\s+/g, ' ').trim();
        const prior = bodies.get(`${part}:${normalized}`);
        if (prior && prior !== service.id) failures.push({ id: service.id, part, rel, reason: `repeats fragment from ${prior}` });
        else bodies.set(`${part}:${normalized}`, service.id);
      }
    };
    for (const [part, rel] of Object.entries(service.fragments || {})) addTarget(part, rel);
    for (const [name, slice] of Object.entries(service.slices || {})) {
      if (slice && slice.fragment) addTarget(`slice:${name}`, slice.fragment);
    }
    if (evidenceTargets.length === 0) {
      failures.push({ id: service.id, reason: 'no evidence targets' });
    }
    rows.push({
      id: service.id,
      family: service.family,
      disposition,
      evidence_targets: evidenceTargets,
    });
  }
  return { counts, services: rows, failures };
}

module.exports = {
  ROOT,
  CATALOG_PATH,
  GRADES,
  VERDICTS,
  KNOWN_RESTRICTIONS,
  loadCatalog,
  servicesOf,
  validateCatalog,
  catalogDigest,
  effectiveChecks,
  validateRigJson,
  validateReview,
  isReviewAccepted,
  selectFromMenu,
  authorshipReport,
};
