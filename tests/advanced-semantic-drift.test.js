#!/usr/bin/env node
// Semantic drift guard contract (impl-design §7.6, AT-B2, Slice 8).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  withRepo,
  createRepoFixture,
  allowedReview,
  writeSelection,
  plan,
  apply,
  writeJson,
  check,
  readJson,
} = require('./helpers/advanced');

test('stale/deprecated context yields a semantic drift report', () => {
  withRepo((target) => {
    createRepoFixture('existing-agents-router', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);

    writeJson(path.join(target, '.rig', 'context-index.json'), {
      documents: [
        { path: 'AGENTS.md', status: 'canonical' },
        {
          path: 'docs/deprecated-agents.md',
          status: 'deprecated',
          replaces: 'AGENTS.md',
        },
      ],
    });
    fs.mkdirSync(path.join(target, 'docs'), { recursive: true });
    fs.writeFileSync(
      path.join(target, 'docs', 'deprecated-agents.md'),
      'Deprecated context that contradicts AGENTS.md.\n',
    );

    const result = check(target, { scope: 'repo' });
    const reportsDir = path.join(target, 'reports', 'rig');
    const reports = fs.existsSync(reportsDir)
      ? fs.readdirSync(reportsDir).filter((f) => f.endsWith('.json'))
      : [];
    assert.ok(
      result.status !== 0 ||
        reports.length > 0 ||
        /stale|deprecated|semantic.?drift/i.test(result.stdout + result.stderr),
      'semantic drift must be reported',
    );
    if (reports.length) {
      const report = readJson(path.join(reportsDir, reports[0]));
      assert.match(
        JSON.stringify(report),
        /stale|deprecated|semantic/i,
      );
    }
  });
});
