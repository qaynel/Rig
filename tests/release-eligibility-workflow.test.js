'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

function jobBlock(workflow, name) {
  const start = workflow.indexOf(`  ${name}:\n`);
  assert.notEqual(start, -1, `missing ${name} job`);
  const tail = workflow.slice(start + 1);
  const next = tail.search(/^  [\w-]+:\n/m);
  return tail.slice(0, next === -1 ? undefined : next);
}

test('release eligibility requires exact-SHA Linux/macOS clean-install E2E before artifact', () => {
  const eligibility = read('.github/workflows/release-eligibility.yml');
  const e2eWorkflow = read('.github/workflows/e2e.yml');
  const e2eScript = read('scripts/clean-install-e2e.js');
  const installer = read('install.sh');
  const healthJob = jobBlock(eligibility, 'health');
  const e2eJob = jobBlock(eligibility, 'e2e');
  const finalJob = jobBlock(eligibility, 'eligibility');
  const installJob = jobBlock(e2eWorkflow, 'install');

  assert.match(e2eJob, /uses:\s*\.\/\.github\/workflows\/e2e\.yml/);
  assert.match(e2eJob, /ref:\s*\$\{\{\s*needs\.resolve\.outputs\.sha\s*\}\}/);
  assert.match(healthJob, /ref:\s*\$\{\{\s*needs\.resolve\.outputs\.sha\s*\}\}/,
    'health and E2E use the same resolved QA SHA');
  assert.match(finalJob, /needs:\s*\[resolve,\s*health,\s*e2e\]/);
  assert.doesNotMatch(finalJob, /^    if:/m, 'default success() semantics must gate the artifact');
  assert.match(installJob, /os:\s*\[ubuntu-latest,\s*macos-latest\]/);
  assert.match(installJob, /ref:\s*\$\{\{\s*needs\.resolve\.outputs\.sha\s*\}\}/);
  assert.match(installJob, /node scripts\/clean-install-e2e\.js --sha/);
  assert.match(e2eScript, /https:\/\/github\.com\/\$\{repo\}\/archive\/\$\{evidence\.sha\}\.tar\.gz/,
    'exact-SHA E2E fetches its candidate from GitHub');
  assert.match(e2eScript, /run\('curl', \['-fsSL', candidateUrl/);
  assert.match(e2eScript, /archive_source_url:|archive_source_url = candidateUrl/);
  assert.match(e2eScript, /downloaded source tree must match the exact checked-out commit/);
  assert.match(e2eScript, /archive_tree_digest = treeDigest\(archiveRoot\(localTree\)\)/);
  assert.match(e2eScript, /'--candidate-url', candidateUrl/,
    'the installer exercises the fetched archive rather than a local substitute');
  assert.match(e2eScript, /'--candidate-tree-digest', evidence\.archive_tree_digest/);
  assert.match(installer, /candidate URL must be the exact-SHA GitHub archive/);
  assert.match(installer, /curl -fsSL "\$CANDIDATE_URL"/);
  assert.match(installer, /candidate extracted-tree digest mismatch/);
  assert.doesNotMatch(installJob, /continue-on-error:\s*true/);
  assert.doesNotMatch(installJob, /^    if:\s*always\(\)/m,
    'the matrix job cannot use an always() success fallback');
  assert.match(installJob, /uses:\s*actions\/upload-artifact@v4[\s\S]*if:\s*always\(\)/,
    'failed-platform evidence remains uploadable');

  // GitHub's default success() condition blocks the dependent artifact job
  // when any required job is failed, cancelled, or skipped.
  const canIssueEligibility = (needs) => needs.every((result) => result === 'success');
  const matrixResult = (linux, macos) =>
    linux === 'success' && macos === 'success' ? 'success' : 'failure';
  for (const [linux, macos, expected] of [
    ['success', 'failure', 'failure'],
    ['failure', 'success', 'failure'],
    ['success', 'success', 'success'],
  ]) {
    assert.equal(matrixResult(linux, macos), expected,
      `matrix result for ubuntu=${linux}, macos=${macos}`);
  }
  for (const e2eOutcome of ['failure', 'cancelled', 'skipped']) {
    assert.equal(canIssueEligibility(['success', 'success', e2eOutcome]), false,
      `${e2eOutcome} E2E result must block eligibility when health passes`);
  }
  assert.equal(canIssueEligibility(['success', 'success', matrixResult('success', 'success')]), true,
    'both passing platforms and health permit progression');

  assert.match(eligibility, /test "\$REQUESTED_SHA" = "\$\(git rev-parse HEAD\)"/,
    'the exact requested SHA must still be current QA before checks run');
  assert.match(eligibility, /test "\$PROVED_SHA" = "\$\(git rev-parse HEAD\)"/,
    'the post-job stale-QA check remains');
  assert.match(e2eWorkflow, /public-tag:[\s\S]*if: github\.event_name == 'release'/,
    'the separate post-publication tag smoke test remains');
});
