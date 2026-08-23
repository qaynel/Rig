#!/usr/bin/env node
// Secret floor + first-enable history scan (impl-design §7.4, AT-B3, Slice 7).
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

test('first enable of selectable pre-commit secret service invokes a vetted history scanner', () => {
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
      assert.equal(applied.status, 0, applied.stderr);
      assert.match(fs.readFileSync(marker, 'utf8'), /detect .*--source \./);
      const receipt = JSON.parse(
        fs.readFileSync(path.join(target, '.rig', 'catalog-receipt.json'), 'utf8'),
      );
      assert.equal(receipt.history_scan.status, 'verified');
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
