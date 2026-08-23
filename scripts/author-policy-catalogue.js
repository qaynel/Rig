#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'rig', 'catalog.json');
const LINT_FORMAT = 'development.code-quality.lint-format';

function list(values, fallback = 'none') {
  return values && values.length ? values.map((value) => `\`${value}\``).join(', ') : fallback;
}

function human(value) {
  return String(value).replace(/[._-]+/g, ' ');
}

function write(rel, body) {
  fs.writeFileSync(path.join(ROOT, 'rig', rel), `${body.trim()}\n`);
}

function checkIds(service) {
  const slug = service.id.split('.').at(-1);
  const checkSlug = slug === 'risk-prioritization' ? 'test-priority-ranking' : slug;
  const signal = (service.applicability?.any?.[0] || service.family).replace(/[^a-z0-9]+/gi, '-');
  return {
    minimal: [`${checkSlug}-${signal}-boundary`],
    mid: [`${checkSlug}-${service.group}-context`],
    maximal: [`${checkSlug}-evidence-receipt`],
  };
}

function evidence(service) {
  const signal = service.applicability?.any?.[0] || `${service.family}-surface`;
  const owned = service.owns[0];
  const excluded = service.excludes?.[0] || `an adjacent ${human(service.group)} concern`;
  return {
    minimal: {
      target: `fixture:${service.id}:policy-boundary`,
      given: `${signal} is present and ${owned} is selected`,
      pass: `the repository binding evaluates ${owned} and returns zero`,
      fail: `the binding is missing, unreadable, exits nonzero, or claims ${excluded}`,
    },
    mid: {
      target: `fixture:${service.id}:repository-context`,
      given: `${owned} has a repository-specific convention and evidence source`,
      pass: `the result names the consulted path or command and excludes ${excluded}`,
      fail: 'the result infers local convention without an inspectable source',
    },
    maximal: {
      target: `fixture:${service.id}:evidence-replay`,
      given: `the ${owned} binding and its inputs are unchanged`,
      pass: 'a second run reproduces the verdict and input/output digests',
      fail: 'the receipt is stale, incomplete, or cannot be rerun',
    },
  };
}

function identity(service) {
  const disposition = service.disposition?.kind || service.delivery || 'convention';
  const dependencies = [...new Set(Object.values(service.requires || {}).flatMap((items) => items || []))];
  const contract = service.acceptance_evidence.minimal;
  return `# ${service.id} - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

${service.label} is the sole catalogue owner of ${list(service.owns)}. It must not absorb ${list(service.excludes, `other ${human(service.group)} concerns`)}. Profile evidence is ${list(service.applicability?.any)}${service.applicability?.not_recommended_without?.length ? `; without ${list(service.applicability.not_recommended_without)} it remains selectable but is not recommended` : ''}.

Disposition: ${disposition}. Dependencies: ${list(dependencies)}. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes ${list(service.owns)}, the result is a named nonzero coverage gap.

Acceptance target: ${contract.target}. Given ${contract.given}, pass only when ${contract.pass}; fail when ${contract.fail}.`;
}

function grade(service, part) {
  const check = service.checks[part][0];
  const scopes = list(service.owns);
  if (part === 'minimal') {
    const contract = service.acceptance_evidence.minimal;
    return `# ${service.id} - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

\`${check}\` owns ${scopes}. Given ${contract.given}, it passes only when ${contract.pass}. It fails when ${contract.fail}. Evidence is recorded against \`${contract.target}\`; absence never becomes a pass.`;
  }
  if (part === 'mid') {
    const contract = service.acceptance_evidence.mid;
    return `# ${service.id} - mid

Grade: mid (Context target). Until the named local evidence is wired, assurance remains Policy-grade generic baseline practice rather than repository-tailored coverage.

After the minimal boundary passes, \`${check}\` evaluates ${scopes}. Given ${contract.given}, it passes only when ${contract.pass}; it fails when ${contract.fail}. The target is \`${contract.target}\`, and ${list(service.excludes, `adjacent ${human(service.group)} ownership`)} stays outside the verdict.`;
  }
  const contract = service.acceptance_evidence.maximal;
  return `# ${service.id} - maximal

Grade: maximal (Evidence target). Until a rerunnable receipt exists, assurance remains Policy-grade generic baseline practice rather than repository-tailored coverage.

After the minimal and mid checks pass, \`${check}\` covers ${scopes}. Given ${contract.given}, it passes only when ${contract.pass}; it fails when ${contract.fail}. The receipt at \`${contract.target}\` names the binding, inputs, outcome, and current digest.`;
}

function slice(service, names) {
  const checks = names.includes('behavior-oracle')
    ? [...service.checks.minimal, ...service.checks.mid]
    : names.includes('property-floor')
      ? [...service.checks.minimal, ...service.checks.maximal]
      : service.checks.minimal;
  const purpose = names.includes('behavior-oracle')
    ? `requires an example that distinguishes a conforming ${human(service.label)} result from a real policy violation`
    : names.includes('property-floor')
      ? `holds ownership at ${list(service.owns)} and prevents ${list(service.excludes)} from being silently absorbed`
      : `establishes the lowest non-vacuous ${human(service.label)} verdict for ${list(service.applicability?.any)}`;
  return `# ${service.id} - slice ${names.join(' + ')}

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The ${names.map((name) => `\`${name}\``).join(' and ')} slice ${purpose}. It activates ${list(checks)} and reports a named coverage gap when its repository binding or required dependency is unavailable.`;
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
for (const service of catalog.services) {
  if (service.id === LINT_FORMAT) continue;
  service.checks = checkIds(service);
  service.acceptance_evidence = evidence(service);
  service.disposition = {
    kind: service.delivery || 'convention',
    reason: `${service.label} owns ${service.owns.join(', ')} and must be observed through a repository-selected binding when ${service.applicability?.any?.join(' or ') || 'its owned surface'} is present; missing evidence is nonzero.`,
    binding: {
      discovery: service.applicability?.any || [],
      expected_observable_result: `${service.checks.minimal[0]} returns zero only for ${service.acceptance_evidence.minimal.pass}; ${service.acceptance_evidence.minimal.fail} returns nonzero.`,
    },
  };
  write(service.fragments.identity, identity(service));
  for (const part of ['minimal', 'mid', 'maximal']) write(service.fragments[part], grade(service, part));

  const byFragment = new Map();
  for (const [name, entry] of Object.entries(service.slices || {})) {
    if (!entry?.fragment) continue;
    const names = byFragment.get(entry.fragment) || [];
    names.push(name);
    byFragment.set(entry.fragment, names);
  }
  for (const [fragment, names] of byFragment) write(fragment, slice(service, names));
}
fs.writeFileSync(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`);
