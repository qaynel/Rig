'use strict';

const test = require('node:test');
const { assert, fs, path, capability, tempRepo, write } = require('./_harness');

// F11 — one fixture per lifecycle transition with a required artefact missing.
test('PT-024 missing inputs stop the transition with a precise gap', () => {
  const repo = tempRepo('rig-preflight-');
  write(repo, '.rig/run.json', { phase: 'design' });
  const preflight = capability('preflight');

  const result = preflight.enter(repo, 'implementation');

  assert.equal(result.allowed, false);
  assert.ok(result.missing.length > 0, 'the refusal names what is missing');
  for (const gap of result.missing) {
    assert.ok(gap.artefact && gap.remedy, 'each gap names the artefact and the remedy');
  }
  assert.equal(fs.existsSync(path.join(repo, '.rig/implementation')), false, 'no side effect precedes the check');
  assert.equal(JSON.parse(fs.readFileSync(path.join(repo, '.rig/run.json'), 'utf8')).phase, 'design', 'the phase is unchanged');
});
