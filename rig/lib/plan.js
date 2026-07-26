// Typed plan creation (impl-design §5.5, AD-9). Read-only w.r.t. target.
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { loadCatalog, validateRigJson, effectiveChecks, servicesOf, catalogDigest } = require('./catalog');
const { resolve } = require('./resolve');
const { validateReview, isReviewAccepted } = require('./catalog');
const { getCapabilities } = require('./host-capabilities');
const { planCiIntegration } = require('./ci-adapters');

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function createPlan(target, manifest, review, catalog = loadCatalog()) {
  validateRigJson(manifest, catalog);
  const validated = validateReview(review);
  if (!isReviewAccepted(validated)) {
    throw new Error(`plan refuses review verdict ${validated.verdict}`);
  }
  const resolved = resolve(catalog, manifest.services || {});
  const operations = [];
  const preimages = {};
  const collisions = [];

  function notePreimage(rel) {
    const abs = path.join(target, rel);
    if (fs.existsSync(abs)) {
      preimages[rel] = sha256File(abs);
      collisions.push({ path: rel, kind: 'exists', sha256: preimages[rel] });
    } else {
      preimages[rel] = null;
    }
  }

  const baselineFiles = [
    '.rig/baseline/drift-rule.md',
    '.rig/baseline/sanitation-review.json',
    '.rig/context-index.json',
    '.rig/sync-map.json',
    '.rig/bin/check.js',
    '.rig/bin/check-copies.js',
    '.rig/bin/secret-guard.sh',
    '.rig/catalog-routing.md',
    '.rig/service-bindings.json',
    '.rig/hooks/pre-commit.sh',
  ];
  for (const rel of baselineFiles) {
    notePreimage(rel);
    operations.push({
      op: preimages[rel] ? 'replace_owned' : 'create_owned',
      path: rel,
      owner: 'rig-baseline',
    });
  }

  notePreimage('AGENTS.md');
  operations.push({
    op: 'ensure_line',
    path: 'AGENTS.md',
    line: 'Before acting, read `.rig/catalog-routing.md` and route selected Rig catalogue services through it.',
  });

  const byId = Object.fromEntries(servicesOf(catalog).map((s) => [s.id, s]));
  for (const id of resolved.order) {
    const entry = resolved.effective[id];
    const service = byId[id];
    const grade = entry.selected_grade || 'minimal';
    const rel = `.rig/services/${id}.md`;
    notePreimage(rel);
    operations.push({
      op: preimages[rel] ? 'replace_owned' : 'create_owned',
      path: rel,
      owner: 'rig-service',
      service_id: id,
      grade: entry.selected_grade,
      slices: entry.required_slices,
      checks: entry.selected_grade ? effectiveChecks(service, grade) : entry.required_slices,
    });
  }

  const ci = planCiIntegration(target);
  if (ci.artifact) {
    notePreimage(ci.artifact.relativePath);
    operations.push({
      op: preimages[ci.artifact.relativePath] ? 'replace_owned' : 'create_owned',
      path: ci.artifact.relativePath,
      owner: 'rig-ci',
    });
  }

  operations.push({
    op: 'hook',
    path: '.git/hooks/pre-commit',
    owner: 'rig-baseline',
  });
  operations.push({
    op: 'create_owned',
    path: '.rig/catalog-receipt.json',
    owner: 'rig-receipt',
  });

  const host = validated.host || 'generic';
  const caps = getCapabilities(host);
  const plan = {
    schema_version: 1,
    host,
    host_capabilities: caps,
    harness_digest: validated.harness_digest,
    catalog_digest: catalogDigest(catalog),
    ci,
    effective_services: Object.entries(resolved.effective).map(([service_id, entry]) => ({
      service_id,
      ...entry,
    })),
    order: resolved.order,
    operations,
    ops: operations,
    collisions,
    preimages,
    before_hashes: preimages,
    effective_checks: resolved.order.flatMap((id) => {
      const entry = resolved.effective[id];
      if (!entry.selected_grade) return [];
      return effectiveChecks(byId[id], entry.selected_grade);
    }),
    checks: resolved.order.flatMap((id) => {
      const entry = resolved.effective[id];
      if (!entry.selected_grade) return [];
      return effectiveChecks(byId[id], entry.selected_grade);
    }),
    service_id: Object.keys(manifest.services || {})[0] || null,
  };
  plan.digest = crypto.createHash('sha256').update(JSON.stringify(plan)).digest('hex');
  plan.plan_digest = plan.digest;
  plan.summary = `Install baseline + ${Object.keys(manifest.services || {}).length} selected services (${resolved.order.length} effective).`;
  return plan;
}

module.exports = { createPlan };
