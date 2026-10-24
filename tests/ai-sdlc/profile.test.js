'use strict';

const test = require('node:test');
const { assert, capability, tempRepo, write, SECRET_FIXTURE } = require('./_harness');

// F23 — export a profile containing preferences alongside oracle, secrets and
// signer metadata, then import it into a conflicting new repository.
function sourceRepo() {
  const repo = tempRepo('rig-profile-');
  write(repo, '.rig/preferences.json', { commit_style: 'imperative', test_runner: 'node --test' });
  write(repo, 'wiki/gate1/acceptance.md', '# project oracle\n');
  write(repo, '.env', `API_TOKEN=${SECRET_FIXTURE}\n`);
  write(repo, 'wiki/gate1/gate1.allowed-signers', 'gate1-owner namespaces="rig-gate1" ssh-ed25519 AAAAC3Nz fixture\n');
  return repo;
}

test('PT-054 export contains only portable scoped fields', () => {
  const repo = sourceRepo();
  const exported = capability('profile').export(repo);
  const text = JSON.stringify(exported);

  assert.equal(exported.preferences.commit_style, 'imperative');
  assert.doesNotMatch(text, new RegExp(SECRET_FIXTURE), 'secrets never export');
  assert.doesNotMatch(text, /allowed-signers|ssh-ed25519/, 'signer rights never export');
  assert.doesNotMatch(text, /project oracle/, 'the project oracle never exports');
  assert.deepEqual(Object.keys(exported).sort(), ['preferences', 'schema_version']);
});

test('PT-055 hostile or conflicting import yields applied/conflicted/rejected report', () => {
  const target = tempRepo('rig-profile-target-');
  write(target, '.rig/preferences.json', { commit_style: 'conventional' });
  const profile = capability('profile');

  const report = profile.import(target, {
    schema_version: 1,
    preferences: { commit_style: 'imperative', test_runner: 'node --test' },
    signer: 'ssh-ed25519 AAAAC3Nz attacker',
    secrets: { API_TOKEN: SECRET_FIXTURE },
  });

  assert.deepEqual(report.applied, ['test_runner']);
  assert.deepEqual(report.conflicted, ['commit_style']);
  assert.deepEqual(report.rejected.sort(), ['secrets', 'signer']);
  assert.equal(JSON.parse(require('node:fs').readFileSync(require('node:path').join(target, '.rig/preferences.json'), 'utf8')).commit_style,
    'conventional', 'a conflict never overwrites the local value silently');
});
