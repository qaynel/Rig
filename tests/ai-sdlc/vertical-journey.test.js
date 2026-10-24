'use strict';

const test = require('node:test');
const { assert, capability, tempRepo, write, read } = require('./_harness');

// F15 — one tiny feature with a known failing behavior: preserve the red
// command output, implement, rerun focused and full gate, then mutate a byte.
// F17 — a shared function called from two surfaces with an injected defect.
function featureRepo() {
  const repo = tempRepo('rig-vertical-');
  write(repo, 'src/slug.js', 'exports.slug = (s) => s.toLowerCase();\n');
  write(repo, 'tests/slug.test.js', "const {slug}=require('../src/slug');\nif (slug('A B') !== 'a-b') { console.error('expected a-b'); process.exit(1); }\n");
  return repo;
}

test('PT-032 red/green evidence is attached to the package', () => {
  const repo = featureRepo();
  const tdd = capability('run-journal');

  const red = tdd.recordRed(repo, { package: 'WP02', command: 'node tests/slug.test.js' });
  assert.equal(red.exit_code === 0, false, 'the loop starts from a genuine failure');
  assert.match(red.output, /expected a-b/, 'the exact red output is preserved, not summarised away');

  write(repo, 'src/slug.js', "exports.slug = (s) => s.toLowerCase().replace(/ /g, '-');\n");
  const green = tdd.recordGreen(repo, { package: 'WP02', command: 'node tests/slug.test.js' });
  assert.equal(green.exit_code, 0);

  const evidence = tdd.evidence(repo, 'WP02');
  assert.equal(evidence.red.command, 'node tests/slug.test.js');
  assert.ok(evidence.red.recorded_at < evidence.green.recorded_at, 'red precedes green in the record');
});

test('PT-033 a changed candidate reruns required checks', () => {
  const repo = featureRepo();
  write(repo, 'src/slug.js', "exports.slug = (s) => s.toLowerCase().replace(/ /g, '-');\n");
  const tdd = capability('run-journal');
  tdd.recordGreen(repo, { package: 'WP02', command: 'node tests/slug.test.js' });
  const before = tdd.evidence(repo, 'WP02');
  assert.ok(before.candidate_digest);

  write(repo, 'src/slug.js', "exports.slug = (s) => s.trim().toLowerCase().replace(/ /g, '-');\n");

  const status = tdd.verify(repo, 'WP02');
  assert.equal(status.current, false, 'evidence does not carry across a code change');
  assert.deepEqual(status.must_rerun.sort(), ['full gate', 'node tests/slug.test.js'].sort());
});

test('PT-037 a caller regression fails until the common seam is corrected', () => {
  const repo = tempRepo('rig-seam-');
  write(repo, 'src/normalise.js', 'exports.normalise = (s) => s.trim();\n');
  write(repo, 'src/api.js', "const {normalise}=require('./normalise');\nexports.handle = (s) => normalise(s).length;\n");
  write(repo, 'src/cli.js', "const {normalise}=require('./normalise');\nexports.main = (s) => normalise(s).toUpperCase();\n");
  const fixer = capability('run-journal');

  const report = fixer.rootCause(repo, { symptom: 'leading whitespace survives', seam: 'src/normalise.js' });

  assert.deepEqual(report.callers.sort(), ['src/api.js', 'src/cli.js'], 'every caller of the seam is checked');
  assert.equal(report.fixed_in.length, 1, 'the fix lands once, in the shared seam');
  assert.equal(report.fixed_in[0], 'src/normalise.js');
  assert.equal(report.symptom_reproduced_before_fix, true, 'the original symptom is proven, not assumed');
  for (const caller of report.callers) {
    assert.equal(report.caller_checks[caller].passed, true, `${caller} must be checked after the seam changes`);
  }
  assert.ok(read(repo, 'src/api.js').includes('normalise'), 'callers keep using the shared seam');
});
