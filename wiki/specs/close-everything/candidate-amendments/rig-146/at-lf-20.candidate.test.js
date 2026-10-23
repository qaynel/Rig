'use strict';

// UNSIGNED CANDIDATE for RIG-146. Never part of `npm test`, never signed, never
// a replacement for tests/advanced-oracle.test.js (frozen). It is the proposed
// body of AT-LF-20 for the owner to apply during the single batched re-sign.
// Run: node --test wiki/specs/close-everything/candidate-amendments/rig-146/at-lf-20.candidate.test.js
// RIG_CANDIDATE_ROOT points the module lookup at a mutated copy of the repo
// (used only for the mutation check recorded in ../rig-146.md).

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..', '..', '..', '..', '..');
const h = require(path.join(repoRoot, 'tests', 'helpers', 'advanced'));

function api(file, name) {
  const root = process.env.RIG_CANDIDATE_ROOT || repoRoot;
  const absolute = path.join(root, 'rig', 'lib', file);
  assert.ok(fs.existsSync(absolute), `missing public module rig/lib/${file}`);
  const fn = require(absolute)[name];
  assert.equal(typeof fn, 'function', `missing public function ${file}:${name}`);
  return fn;
}

test('AT-LF-20 a plan approval authorizes exactly one execution', () => {
  const planExecution = api('lint-format.js', 'planExecution');
  const executePlan = api('lint-format.js', 'executePlan');
  h.withRepo((target) => {
    const planned = planExecution({ target, commands: [{ role: 'lint', argv: [process.execPath, '-e', 'process.exit(0)'] }] });
    // Two independent approval objects derived from the same signed approval:
    // the in-memory `used` flag set on the first cannot reach the second, so
    // only the durable on-disk one-use record can reject the second execution.
    const signed = { plan_digest: planned.plan_digest };
    const firstApproval = { ...signed };
    const secondApproval = { ...signed };
    assert.notEqual(firstApproval, secondApproval);
    const first = executePlan(planned, firstApproval);
    assert.equal(first.status, 'executed');
    assert.equal(secondApproval.used, undefined, 'the second approval must not share the first one\'s in-memory flag');
    const second = executePlan(planned, secondApproval);
    assert.notEqual(second.status, 'executed');
  });
});
