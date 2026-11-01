'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-profile-home-'));
process.env.RIG_PROFILE_HOME = path.join(temp, 'home');
const profile = require('../rig/catalog/baseline/profile');

test('profile exports between repositories through the home file without project paths or secrets', () => {
  const a = path.join(temp, 'a'); const b = path.join(temp, 'b');
  fs.mkdirSync(path.join(a, '.rig'), { recursive: true }); fs.mkdirSync(b);
  fs.writeFileSync(path.join(a, '.rig/preferences.json'), JSON.stringify({ tone: 'plain', api_token: 'sk-abcdefghijk', path: a }));
  profile.exportHome(a);
  assert.equal(fs.existsSync(path.join(process.env.RIG_PROFILE_HOME, 'profile.json')), true);
  const report = profile.import(path.join(process.env.RIG_PROFILE_HOME, 'profile.json'), b);
  assert.equal(report.applied.includes('tone'), true);
  const saved = fs.readFileSync(path.join(process.env.RIG_PROFILE_HOME, 'profile.json'), 'utf8');
  assert.equal(saved.includes('sk-abcdefghijk'), false);
  assert.equal(saved.includes(a), false);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(b, '.rig/preferences.json'), 'utf8')).language, {
    everydayWords: true, noShorthand: true, noTechnicalConfirmations: true,
  });
});

test('profile import strips secret fields before persisting its home copy', () => {
  const b = path.join(temp, 'secret-target'); fs.mkdirSync(b);
  const file = path.join(temp, 'unsafe.json');
  fs.writeFileSync(file, JSON.stringify({ schema_version: 1, preferences: { api_key: 'sk-abcdefghijk', style: 'plain' } }));
  profile.import(file, b);
  assert.equal(fs.readFileSync(path.join(process.env.RIG_PROFILE_HOME, 'profile.json'), 'utf8').includes('api_key'), false);
});

test('profile import removes absolute project paths embedded in preference values', () => {
  const b = path.join(temp, 'path-target'); fs.mkdirSync(b);
  const file = path.join(temp, 'pathful.json');
  fs.writeFileSync(file, JSON.stringify({ schema_version: 1, preferences: { style: `Use ${b} as the working directory` } }));
  profile.import(file, b);
  const home = fs.readFileSync(path.join(process.env.RIG_PROFILE_HOME, 'profile.json'), 'utf8');
  assert.equal(home.includes(b), false);
});

test('profile export strips Windows drive and UNC paths embedded in ordinary preferences', () => {
  const repo = path.join(temp, 'windows-path-target'); fs.mkdirSync(path.join(repo, '.rig'), { recursive: true });
  const values = ['C:\\Users\\alice\\project', 'C:/Users/alice/project', '\\\\server\\share\\project'];
  fs.writeFileSync(path.join(repo, '.rig/preferences.json'), JSON.stringify({ workspacePath: values.join(' | ') }));
  profile.exportHome(repo);
  const saved = fs.readFileSync(path.join(process.env.RIG_PROFILE_HOME, 'profile.json'), 'utf8');
  for (const value of values) assert.equal(saved.includes(value), false, `profile leaked ${value}`);
});

test('profile export and uninstall refuse to follow repository preference symlinks', () => {
  const repo = path.join(temp, 'symlink-target'); const outside = path.join(temp, 'outside-rig');
  fs.mkdirSync(repo); fs.mkdirSync(outside);
  fs.writeFileSync(path.join(outside, 'preferences.json'), '{"external":true}');
  fs.symlinkSync(outside, path.join(repo, '.rig'));
  assert.throws(() => profile.export(repo), /outside symlink/);
  require('../rig/lib/uninstall').cleanupReceiptArtifacts(repo);
  assert.equal(fs.readFileSync(path.join(outside, 'preferences.json'), 'utf8'), '{"external":true}');
});
