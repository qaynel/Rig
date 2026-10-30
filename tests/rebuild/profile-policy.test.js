'use strict';

const test = require('node:test');
const { assert, fs, path, tempDir, write, product } = require('./_harness');

test('RB-PROF-1 profile exports preferences from one repository and imports them into another', () => {
  const profile = product('rig/catalog/baseline/profile.js');
  const home = tempDir('rig-profile-home-');
  const a = tempDir('rig-profile-a-');
  const b = tempDir('rig-profile-b-');
  process.env.RIG_PROFILE_HOME = home;
  write(a, '.rig/preferences.json', JSON.stringify({ concise: true }));
  const exported = profile.export(a);
  const profileFile = path.join(home, 'profile.json');
  assert.ok(fs.existsSync(profileFile));
  profile.import(profileFile, b);
  assert.equal(JSON.parse(fs.readFileSync(path.join(b, '.rig/preferences.json'), 'utf8')).concise, true);
  assert.ok(exported);
});

test('RB-PROF-2 home profile contains no secret values or repository paths', () => {
  const profile = product('rig/catalog/baseline/profile.js');
  const home = tempDir('rig-profile-secret-');
  const repo = tempDir('rig-profile-source-');
  process.env.RIG_PROFILE_HOME = home;
  write(repo, '.rig/preferences.json', JSON.stringify({ style: 'brief', token: 'sk-live-never-include-this' }));
  profile.export(repo);
  const text = fs.readFileSync(path.join(home, 'profile.json'), 'utf8');
  assert.doesNotMatch(text, /sk-live-never-include-this/);
  assert.doesNotMatch(text, new RegExp(repo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('RB-PROF-3 uninstall removes repository tailoring and retains the portable profile', () => {
  const { uninstall } = product('rig/lib/uninstall.js');
  const repo = tempDir('rig-profile-uninstall-');
  const profile = path.join(tempDir('rig-profile-kept-'), 'profile.json');
  write(repo, '.rig/preferences.json', '{"concise":true}');
  write(profile, '', '{"schema_version":1,"preferences":{"concise":true}}');
  uninstall(repo);
  assert.equal(fs.existsSync(path.join(repo, '.rig/preferences.json')), false);
  assert.equal(fs.existsSync(profile), true);
});

test('RB-POL-1 decision prose without a wiki pointer fails with a line number and current CLAUDE passes', () => {
  const { claudeMdPointersOnly } = product('rig/catalog/baseline/policy-checks.js');
  const bad = claudeMdPointersOnly('# Instructions\n\nWe decided that all projects must do this.\n');
  assert.equal(bad.ok, false);
  assert.ok(bad.offending.some((item) => item.line === 3));
  const current = claudeMdPointersOnly(fs.readFileSync(path.join(process.cwd(), 'CLAUDE.md'), 'utf8'));
  assert.equal(current.ok, true, JSON.stringify(current.offending));
});

test('RB-POL-2 wiki specifications changed without a reasoning trace are rejected', () => {
  const { decisionHasTrace } = product('rig/catalog/baseline/policy-checks.js');
  const result = decisionHasTrace(['wiki/specs/rebuild/design.md'], 'a specification changed');
  assert.equal(result.ok, false);
  assert.ok(result.missing.length > 0);
});

test('RB-POL-3 policy flags technical confirmation wording and accepts a plain recommendation', () => {
  const { plainQuestion } = product('rig/catalog/baseline/policy-checks.js');
  const blocked = plainQuestion('Per D5 and §8, can you confirm the AT-PB-3 reading?', {});
  const plain = plainQuestion('Should setup stop downloading packs? I recommend yes.', {});
  assert.equal(blocked.ok, false);
  assert.equal(plain.ok, true);
});
