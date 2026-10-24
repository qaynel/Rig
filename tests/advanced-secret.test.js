#!/usr/bin/env node
// Secret floor + first-enable history scan (impl-design §7.4, AT-B3, Slice 7).
require('./helpers/hermetic-git-env');
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync, execFileSync } = require('node:child_process');
const {
  withRepo,
  withTempDir,
  createRepoFixture,
  allowedReview,
  writeSelection,
  plan,
  apply,
  seedCredentialStagedDiff,
  FAKE_CREDENTIAL,
} = require('./helpers/advanced');

test('staged credential-shaped diff is blocked by secret floor', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);

    // The installed baseline now checks the real staged context as well as the
    // secret floor. Supply a current review before making the safe seed commit.
    const docs = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md'].filter(rel => fs.existsSync(path.join(target, rel)));
    fs.writeFileSync(path.join(target, '.rig/context-index.json'), JSON.stringify({
      documents: docs.map(path => ({ path })),
      review: {
        schema_version: 1, reviewer: { kind: 'host-agent', identity: 'secret-floor-fixture' }, status: 'pass',
        inputs: docs.map(rel => ({ path: rel, digest: require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(target, rel))).digest('hex') })),
        relationships: docs.flatMap((from, i) => docs.slice(i + 1).map(to => ({ from, to, status: 'consistent', reason: 'Fixture instructions use the same review authority.' }))),
      },
    }));
    execFileSync('git', ['add', ...docs], { cwd: target, stdio: 'pipe' });
    seedCredentialStagedDiff(target);
    const guard =
      [
        path.join(target, '.rig', 'bin', 'secret-guard.sh'),
        path.join(target, '.rig', 'hooks', 'secret-guard.sh'),
        path.join(target, '.git', 'hooks', 'pre-commit'),
      ].find((p) => fs.existsSync(p));
    assert.ok(guard, 'secret guard must be installed');
    const result = spawnSync(guard, [], { cwd: target, encoding: 'utf8', shell: false });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr + result.stdout, /secret|guard|blocked|credential/i);
  });
});

test('first enable rejects an executable impersonating a vetted history scanner', () => {
  withTempDir('rig-scanner-bin-', (binDir) => {
    const marker = path.join(binDir, 'marker.txt');
    fs.writeFileSync(
      path.join(binDir, 'gitleaks'),
      `#!/bin/sh\necho "$*" > "${marker}"\nexit 0\n`,
      { mode: 0o755 },
    );

    withRepo((target) => {
      createRepoFixture('generic-git', target);
      fs.writeFileSync(
        path.join(target, 'old-leak.js'),
        `module.exports = '${FAKE_CREDENTIAL}';\n`,
      );
      execFileSync('git', ['add', 'old-leak.js'], { cwd: target, stdio: 'pipe' });
      execFileSync('git', ['commit', '-m', 'historic leak'], { cwd: target, stdio: 'pipe' });

      const { reviewPath } = allowedReview(target);
      writeSelection(target, {
        'product-security.secrets.precommit-leak-scanner': 'minimal',
      });
      const planned = plan(target, { review: reviewPath });
      assert.equal(planned.status, 0, planned.stderr);
      const applied = apply(target, { review: reviewPath, plan: planned.outPath }, {
        env: { PATH: `${binDir}:${process.env.PATH}` },
      });
      assert.notEqual(applied.status, 0, 'an arbitrary no-op cannot establish history clean');
      assert.match(fs.readFileSync(marker, 'utf8'), /version/);
      assert.equal(fs.existsSync(path.join(target, '.rig', 'catalog-receipt.json')), false);
      assert.ok(fs.existsSync(path.join(target, '.rig', 'hooks', 'secret-guard.sh')));
    });
  });
});

test('first enable fails closed on history scanner findings but leaves staged floor installed', () => {
  withTempDir('rig-scanner-bin-', (binDir) => {
    fs.writeFileSync(
      path.join(binDir, 'gitleaks'),
      '#!/bin/sh\necho "historic finding" >&2\nexit 1\n',
      { mode: 0o755 },
    );

    withRepo((target) => {
      createRepoFixture('generic-git', target);
      const { reviewPath } = allowedReview(target);
      writeSelection(target, {
        'product-security.secrets.precommit-leak-scanner': 'minimal',
      });
      const planned = plan(target, { review: reviewPath });
      assert.equal(planned.status, 0, planned.stderr);
      const applied = apply(target, { review: reviewPath, plan: planned.outPath }, {
        env: { PATH: `${binDir}:${process.env.PATH}` },
      });
      assert.notEqual(applied.status, 0, 'history scanner findings must fail activation');
      assert.ok(fs.existsSync(path.join(target, '.rig', 'hooks', 'secret-guard.sh')));
      assert.equal(
        fs.existsSync(path.join(target, '.rig', 'catalog-receipt.json')),
        false,
        'failed activation must not mark the service active',
      );
    });
  });
});
