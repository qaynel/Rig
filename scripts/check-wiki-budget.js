#!/usr/bin/env node
'use strict';

// Applies wiki/budget.waivers.json to the measurements from wiki-budget.js.
//
// The waiver file is a ratchet, not an escape hatch. It records one key per
// violation that existed when the gate was installed, so the suite is green
// while every item of debt is enumerated and owned. Three things fail: a
// waived value that grew (see the note on `check` below for what "grew"
// means when the measured value isn't a number), a waiver whose file is now
// within budget, and any violation with no waiver at all. Nothing here can
// make the wiki bigger without an explicit, reviewable edit to the ledger,
// and --update-waivers refuses to overwrite an existing ledger without
// --force, so a red suite cannot be cleared by silently re-running the
// install-time tool.
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
    // The allowance's type decides how strict the comparison is, not the
    // measured value's type. A numeric waiver can only be exceeded by a
    // strictly larger number; a measured value that has stopped being a
    // number at all (e.g. a rule flipping from a byte count to a marker
    // string) is ALSO a failure rather than falling through to "suppressed"
    // by the old `typeof actual === 'number'` guard. A non-numeric waiver
    // (the 'missing' trace-summary marker, an entry-path-current-only state
    // like 'historical') is exceeded by any change at all, because there is
    // no numeric growth to measure and a changed string can itself be a
    // materially worse state -- a mandated read's link degrading from
    // 'historical' to 'missing' (the trace was deleted) is not an
    // improvement, and must not be silently covered by a waiver recorded
    // against the old state.
    const exceeded = typeof allowance === 'number'
      ? typeof violation.actual !== 'number' || violation.actual > allowance
      : violation.actual !== allowance;
    if (exceeded) {
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

// Classifies a single key's change between two ledgers. A numeric-to-numeric
// change is "raised" or "lowered" by ordinary comparison. Any other change
// (a value appearing, disappearing, or changing where either side is not a
// number) is reported as "raised": there is no way to prove from the shape
// of the data alone that a non-numeric change is a tightening, and the
// ratchet's job is to make loosening loud, not to assume it away.
function classify(previousValue, nextValue) {
  if (typeof previousValue === 'number' && typeof nextValue === 'number') {
    if (nextValue > previousValue) return 'raised';
    if (nextValue < previousValue) return 'lowered';
    return null;
  }
  return previousValue === nextValue ? null : 'raised';
}

function summarizeDelta(previous, next) {
  const before = new Set(Object.keys(previous));
  const after = new Set(Object.keys(next));
  const added = [...after].filter((identifier) => !before.has(identifier)).sort();
  const removed = [...before].filter((identifier) => !after.has(identifier)).sort();
  const raised = [];
  const lowered = [];
  for (const identifier of [...after].filter((candidate) => before.has(candidate)).sort()) {
    const kind = classify(previous[identifier], next[identifier]);
    if (kind === 'raised') raised.push({ key: identifier, from: previous[identifier], to: next[identifier] });
    if (kind === 'lowered') lowered.push({ key: identifier, from: previous[identifier], to: next[identifier] });
  }
  return { added, removed, raised, lowered };
}

// Rewrites the ledger from the current state. Run this only when installing
// the gate, or when the intent owner has accepted new debt on purpose: it
// refuses to overwrite an existing ledger unless `force` is set, because
// re-running it whenever the suite reds would turn the ratchet into a
// rubber stamp instead of a record of deliberately-accepted debt.
function updateWaivers(root = ROOT, force = false) {
  const file = path.join(root, WAIVERS);
  const previous = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
  if (previous !== null && !force) {
    throw new Error(
      `${WAIVERS} already exists. Re-running --update-waivers would let any red suite be cleared by `
      + 'rewriting the ledger instead of fixing the regression or deliberately accepting it. Pass '
      + '--force if the intent owner has accepted this new state on purpose.',
    );
  }
  const recorded = Object.fromEntries(
    audit(root).sort((left, right) => key(left).localeCompare(key(right)))
      .map((violation) => [key(violation), violation.actual]),
  );
  fs.writeFileSync(file, `${JSON.stringify(recorded, null, 2)}\n`);
  return { count: Object.keys(recorded).length, delta: summarizeDelta(previous || {}, recorded) };
}

if (require.main === module) {
  if (process.argv.includes('--update-waivers')) {
    try {
      const { count, delta } = updateWaivers(ROOT, process.argv.includes('--force'));
      console.log(`wiki budget: recorded ${count} waiver(s) in ${WAIVERS}`);
      console.log(
        `  added: ${delta.added.length}, raised: ${delta.raised.length}, `
        + `lowered: ${delta.lowered.length}, removed: ${delta.removed.length}`,
      );
      for (const item of delta.raised) {
        console.log(`  RAISED ${item.key}: ${item.from} -> ${item.to}`);
      }
      process.exit(0);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
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
