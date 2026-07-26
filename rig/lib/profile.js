// Repo profiling + complete recommendation menu (impl-design §5.4, AD-14).
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { loadCatalog, servicesOf, isReviewAccepted, validateReview } = require('./catalog');

function profileRepo(target) {
  const signals = {
    'source-code': false,
    'test-runner': false,
    'ui-surface': false,
    'package-json': false,
  };
  if (fs.existsSync(path.join(target, 'package.json'))) {
    signals['package-json'] = true;
    signals['source-code'] = true;
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(target, 'package.json'), 'utf8'));
      const blob = JSON.stringify(pkg).toLowerCase();
      if (/react|vue|svelte|angular|browser|next/.test(blob)) signals['ui-surface'] = true;
      if (pkg.scripts && (pkg.scripts.test || pkg.scripts['test:unit'])) signals['test-runner'] = true;
    } catch {
      /* ignore malformed package for profiling */
    }
  }
  for (const name of ['index.js', 'src', 'lib', 'app']) {
    if (fs.existsSync(path.join(target, name))) signals['source-code'] = true;
  }
  for (const name of ['test', 'tests', '__tests__']) {
    if (fs.existsSync(path.join(target, name))) signals['test-runner'] = true;
  }
  for (const name of ['index.html', 'public', 'frontend', 'ui']) {
    if (fs.existsSync(path.join(target, name))) signals['ui-surface'] = true;
  }
  return signals;
}

function recommend(target, review, catalog = loadCatalog()) {
  const validated = validateReview(review);
  if (!isReviewAccepted(validated)) {
    throw new Error(`recommend refuses review verdict ${validated.verdict}`);
  }
  const signals = profileRepo(target);
  const menu = [];
  for (const service of servicesOf(catalog)) {
    const needs = service.applicability?.not_recommended_without || [];
    const missing = needs.filter((n) => !signals[n]);
    let recommendation = 'applicable';
    let recommended_grade = 'minimal';
    let reason = 'Repository signals match this service.';
    let evidence = Object.entries(signals)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (missing.length) {
      recommendation = 'not_recommended';
      recommended_grade = null;
      reason = service.surfaceless_reason || `Missing signals: ${missing.join(', ')}`;
      evidence = missing.map((m) => `no-${m.replace(/_/g, '-')}`);
    }
    menu.push({
      service_id: service.id,
      recommendation,
      recommended_grade,
      evidence,
      reason,
    });
  }
  menu.sort((a, b) => a.service_id.localeCompare(b.service_id));
  return {
    schema_version: 1,
    host: validated.host,
    harness_digest: validated.harness_digest,
    profile: signals,
    services: menu,
    menu,
  };
}

module.exports = { profileRepo, recommend };
