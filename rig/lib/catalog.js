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
};
