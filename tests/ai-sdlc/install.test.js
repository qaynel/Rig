'use strict';

const test = require('node:test');
const { assert, fs, path, capability, tempRepo } = require('./_harness');

// F01 — empty Git repository; install the public archive; inspect projected
// bytes and the absence of any adaptation state.
test('PT-001 fresh install exposes one canonical corpus and leaves project choices pending', () => {
  const repo = tempRepo();
  const install = capability('public-install');

  const result = install.install(repo, { archive: 'public' });

  assert.ok(fs.existsSync(path.join(repo, '.rig', 'routing.md')), 'the canonical router must be projected');
  const corpora = fs.readdirSync(path.join(repo, '.rig')).filter((name) => /corpus|catalogue/.test(name));
  assert.equal(new Set(corpora.map((n) => n.replace(/\..*$/, ''))).size, corpora.length, 'exactly one corpus may be projected');
  assert.equal(result.selected_capabilities, undefined, 'a clean install must not pre-select repository capabilities');
  assert.equal(fs.existsSync(path.join(repo, '.rig', 'adaptation.json')), false, 'adaptation state belongs to onboarding, not install');
});
