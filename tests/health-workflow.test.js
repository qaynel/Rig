'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { findHealthIssue } = require('../scripts/report-health-issue');

async function runReporter(result, issues = []) {
  const filename = path.join(__dirname, '..', 'scripts', 'report-health-issue.js');
  const writes = [];
  const moduleStub = { exports: {} };
  const requireStub = createRequire(filename);
  requireStub.main = moduleStub;
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
    module: moduleStub, require: requireStub, console,
    process: { env: { GITHUB_TOKEN: 'test-token', GITHUB_REPOSITORY: 'test/repo', HEALTH_SHA: 'a'.repeat(40), HEALTH_RUN_ID: '1', HEALTH_RESULT: result, HEALTH_RUN_URL: 'https://example.invalid/run' }, stdout: { write() {} } },
    fetch: async (url, options = {}) => {
      if ((options.method || 'GET') !== 'GET') writes.push({ url, ...options });
      return { ok: true, status: 200, json: async () => issues };
    },
  }, { filename });
  await new Promise((resolve) => setImmediate(resolve));
  return writes;
}

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

test('the reporter leaves success alone and updates an existing issue through its public entrypoint', async () => {
  assert.equal((await runReporter('success')).length, 0);
  const sha = 'a'.repeat(40);
  const matching = {
    number: 17,
    body: `<!-- rig-health sha=${sha} -->`,
    labels: [{ name: 'health' }],
  };
  const writes = await runReporter('failure', [matching]);
  assert.equal(writes.length, 1);
  assert.equal(writes[0].method, 'PATCH');
  assert.equal(writes[0].url, 'https://api.github.com/repos/test/repo/issues/17');
});
