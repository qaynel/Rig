'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { findHealthIssue } = require('../scripts/report-health-issue');

test('health reports create once then update the issue for the same SHA', () => {
  assert.deepEqual(findHealthIssue([], 'a'.repeat(40)), { method: 'POST' });
  const matching = {
    number: 17,
    title: 'health: ' + 'a'.repeat(40),
    body: '<!-- rig-health sha=' + 'a'.repeat(40) + ' -->',
    labels: [{ name: 'health' }],
  };
  assert.deepEqual(findHealthIssue([matching], 'a'.repeat(40)), { method: 'PATCH', number: 17 });
});

test('health reports ignore issues for another SHA and pull requests', () => {
  const sha = 'b'.repeat(40);
  const issues = [
    { number: 1, title: 'health: ' + 'a'.repeat(40), body: `<!-- rig-health sha=${'a'.repeat(40)} -->`, labels: [{ name: 'health' }] },
    { number: 2, title: `health: ${sha}`, body: `<!-- rig-health sha=${sha} -->`, labels: [{ name: 'health' }], pull_request: {} },
    { number: 3, title: `health: ${sha}`, body: `<!-- rig-health sha=${sha} -->`, labels: [{ name: 'other' }] },
  ];
  assert.deepEqual(findHealthIssue(issues, sha), { method: 'POST' });
});
