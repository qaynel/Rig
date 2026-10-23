'use strict';

// Independent probe for the public host contract status API. This is outside
// tests/ and does not authenticate any host enforcement claim.
const assert = require('node:assert/strict');
const { validateRegistryContracts } = require('../../../rig/lib/host-capabilities');

const { hosts, contracts, failures } = validateRegistryContracts();
assert.equal(hosts, 19);
assert.deepEqual(failures, []);
const states = new Set();
for (const contract of contracts) {
  for (const axis of Object.values(contract.axes)) {
    states.add(axis.emission);
    if (axis.emission === 'emitted') {
      assert.ok(axis.output?.path);
      assert.ok(axis.evidence?.byte_landing_test?.target);
    } else if (axis.emission === 'not_integrated') {
      assert.match(axis.gap || '', /does not write/i);
      assert.equal(axis.output, undefined);
      assert.equal(axis.evidence, undefined);
    } else {
      assert.equal(axis.emission, 'unsupported');
      assert.ok(axis.evidence?.official_citation);
    }
  }
}
assert.deepEqual([...states].sort(), ['emitted', 'not_integrated', 'unsupported']);
process.stdout.write('AT-P4 host tri-state probe passed\n');
