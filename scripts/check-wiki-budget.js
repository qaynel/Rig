#!/usr/bin/env node
'use strict';

// Applies wiki/budget.waivers.json to the measurements from wiki-budget.js.
//
// The waiver file is a ratchet, not an escape hatch. It records one key per
// violation that existed when the gate was installed, so the suite is green
// while every item of debt is enumerated and owned. Three things fail:
// a waived value that grew, a waiver whose file is now within budget, and any
// violation with no waiver at all. Nothing here can make the wiki bigger
// without an explicit, reviewable edit to the ledger.
const fs = require('node:fs');
const path = require('node:path');
const { WAIVERS, audit } = require('./wiki-budget');

const ROOT = path.join(__dirname, '..');

function key(violation) {
  return `${violation.rule}:${violation.subject}`;
}

function readWaivers(root) {
  const file = path.join(root, WAIVERS);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
}

function check(root = ROOT) {
  const waivers = readWaivers(root);
  const unused = new Set(Object.keys(waivers));
  const failures = [];
  for (const violation of audit(root)) {
    const identifier = key(violation);
    unused.delete(identifier);
    if (!(identifier in waivers)) {
      failures.push({ ...violation, kind: 'over-budget' });
      continue;
    }
    const allowance = waivers[identifier];
    if (typeof violation.actual === 'number' && violation.actual > allowance) {
      failures.push({ ...violation, kind: 'waiver-exceeded', limit: allowance });
    }
  }
  for (const identifier of unused) {
    failures.push({
      rule: 'stale-waiver',
      subject: identifier,
      actual: 'now within budget',
      limit: 'delete this waiver',
      kind: 'stale-waiver',
    });
  }
  return failures;
}

// Rewrites the ledger from the current state. Run this only when installing
// the gate, or when the intent owner has accepted new debt on purpose.
function updateWaivers(root = ROOT) {
  const recorded = Object.fromEntries(
    audit(root).sort((left, right) => key(left).localeCompare(key(right)))
      .map((violation) => [key(violation), violation.actual]),
  );
  fs.writeFileSync(path.join(root, WAIVERS), `${JSON.stringify(recorded, null, 2)}\n`);
  return Object.keys(recorded).length;
}

if (require.main === module) {
  if (process.argv.includes('--update-waivers')) {
    console.log(`wiki budget: recorded ${updateWaivers()} waiver(s) in ${WAIVERS}`);
    process.exit(0);
  }
  const failures = check();
  if (!failures.length) {
    console.log('wiki budget: within caps and waivers');
    process.exit(0);
  }
  for (const failure of failures) {
    console.error(`  ${failure.kind} ${failure.rule} ${failure.subject}: ${failure.actual} (limit ${failure.limit})`);
  }
  console.error(`\n${failures.length} wiki budget failure(s). See wiki/budget.json for the caps.`);
  process.exit(1);
}

module.exports = { check, key, readWaivers, updateWaivers };
