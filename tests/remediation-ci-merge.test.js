'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const h = require('./helpers/advanced');
const ci = require('../rig/lib/ci-adapters');
const fixtures = {
  'github-actions': ['.github/workflows/user.yml', 'name: user\non:\n  push:\njobs:\n  user:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo user\n'],
  gitlab_ci: ['.gitlab-ci.yml', 'stages:\n  - release\nuser:\n  stage: release\n  script:\n    - echo user\n# rig_check migration planned\n'],
  circleci: ['.circleci/config.yml', 'version: 2.1\njobs:\n  user:\n    docker:\n      - image: cimg/node:22.0\n    steps:\n      - run: echo user\nworkflows:\n  user:\n    jobs:\n      - user\n'],
  jenkins: ['Jenkinsfile', "pipeline { agent any; stages { stage('User') { steps { echo 'user' } } } }\n"],
  buildkite: ['.buildkite/pipeline.yml', 'steps:\n  - label: user\n    command: echo user\n'],
  azure_pipelines: ['azure-pipelines.yml', 'jobs:\n  - job: user\n    steps:\n      - script: echo user\n'],
};
function put(target, rel, text) { fs.mkdirSync(path.dirname(path.join(target, rel)), { recursive: true }); fs.writeFileSync(path.join(target, rel), text); }
for (const [provider, [rel, initial]] of Object.entries(fixtures)) test(`${provider}: real merge repeats and removes only attributable bytes`, () => h.withRepo(target => {
  put(target, rel, initial);
  assert.equal(ci.detectProvider(target), provider);
  assert.equal(ci.planCiIntegration(target, { provider }).status, 'approval_required');
  assert.equal(fs.readFileSync(path.join(target, rel), 'utf8'), initial);
  const plan = ci.planCiIntegration(target, { provider, approved: true });
  assert.equal(plan.evidence, 'unverified');
  assert.equal(plan.execution.status, 'first_run_required');
  ci.applyCiPlan(target, plan);
  const artifact = path.join(target, plan.artifact.relativePath);
  const installed = fs.readFileSync(artifact, 'utf8');
  assert.match(installed, /node \.rig\/bin\/check\.js --scope repo/);
  assert.match(fs.readFileSync(path.join(target, rel), 'utf8'), /user/);
  ci.applyCiPlan(target, ci.planCiIntegration(target, { provider, approved: true }));
  assert.equal(fs.readFileSync(artifact, 'utf8'), installed);
  const suffix = provider === 'jenkins' ? '// later user comment\n' : '# later user comment\n';
  fs.appendFileSync(path.join(target, rel), suffix);
  const removed = require('../rig/lib/lifecycle').uninstall(target);
  assert.equal(fs.readFileSync(path.join(target, rel), 'utf8'), initial + suffix, JSON.stringify(removed));
}));

test('classification and explicit providers refuse malformed, colliding and unsupported shapes before writes', () => {
  for (const [provider, [rel]] of Object.entries(fixtures)) h.withRepo(target => {
    const bad = provider === 'jenkins' ? 'pipeline { stages {\n' : 'jobs: [broken\n';
    put(target, rel, bad);
    for (const read of [() => ci.detectProvider(target), () => ci.planCiIntegration(target, { provider }), () => ci.planCiIntegration(target, { provider, approved: true })]) assert.throws(read, /unsupported|malformed|collision/);
    assert.equal(fs.readFileSync(path.join(target, rel), 'utf8'), bad);
    assert.equal(fs.existsSync(path.join(target, '.rig/install-manifest.jsonl')), false);
  });
  h.withRepo(target => {
    put(target, 'azure-pipelines.yml', 'steps:\n  - script: echo user\n');
    assert.throws(() => ci.planCiIntegration(target, { provider: 'azure_pipelines', approved: true }), /unsupported root/);
  });
});
module.exports = { fixtures };
