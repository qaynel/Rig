'use strict';

const test = require('node:test');
const { assert, capability, tempRepo, write } = require('./_harness');

// F10 — three packages with a dependency edge, one overlapping file and an
// orphaned acceptance mapping.
test('PT-023 each package has outcome, ownership, dependency and exit evidence', () => {
  const repo = tempRepo('rig-wp-');
  write(repo, 'packages.json', {
    packages: [
      { id: 'WP01', outcome: 'owner can sign', requirements: ['R001'], depends: [], owns: ['src/sign.js'], exit: ['PT-001'] },
      { id: 'WP02', outcome: 'user resumes', requirements: ['R002'], depends: ['WP01'], owns: ['src/run.js'], exit: ['PT-002'] },
      { id: 'WP03', outcome: 'unclear', requirements: ['R404'], depends: [], owns: ['src/run.js'], exit: [] },
    ],
  });
  const plan = capability('work-packages').audit(repo, { file: 'packages.json', approved: ['R001', 'R002'] });

  assert.ok(plan.order.indexOf('WP01') < plan.order.indexOf('WP02'), 'packages are returned in dependency order');
  assert.ok(plan.problems.some((p) => /WP03.*R404/.test(p)), 'an orphaned acceptance mapping is reported');
  assert.ok(plan.problems.some((p) => /WP02.*WP03.*src\/run\.js|src\/run\.js.*WP02.*WP03/.test(p)), 'overlapping file ownership is reported');
  assert.ok(plan.problems.some((p) => /WP03.*exit|exit.*WP03/.test(p)), 'a package without exit evidence is reported');
  assert.equal(plan.runnable.includes('WP02'), false, 'a package with an unmet dependency is not runnable');
});
