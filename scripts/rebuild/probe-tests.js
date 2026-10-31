#!/usr/bin/env node
'use strict';

// Samples five real proving bodies in isolated temporary copies, each against
// a deliberately wrong behavior stub. The source checkout and protected tests
// are only read; the fake implementation lives in the disposable copy.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const seed = 20261031;
const probes = [
  { id: 'RB-FIT-1', file: 'tests/rebuild/fit.test.js', testFile: 'fit.test.js', module: 'rig/lib/fit-check.js', stub: "module.exports={checkFit:()=>({ok:true,failures:[]})};\n" },
  { id: 'RB-OVL-2', file: 'tests/rebuild/overlays.test.js', testFile: 'overlays.test.js', module: 'scripts/apply-overlays.js', stub: "module.exports={applyOverlays:()=>({failed:[]})};\n" },
  { id: 'RB-POL-3', file: 'tests/rebuild/profile-policy.test.js', testFile: 'profile-policy.test.js', module: 'rig/catalog/baseline/policy-checks.js', stub: "module.exports={plainQuestion:()=>({ok:false,hits:['always reject']})};\n" },
  { id: 'RB-LOCK-5', file: 'tests/rebuild/lock-strength.test.js', testFile: 'lock-strength.test.js', module: 'rig/catalog/baseline/user-signoff.js', stub: "module.exports={assessPlatform:()=>({mechanisms:[{id:'sudo-or-password-prompt',passwordless:true,counts_as_approval:false}]})};\n" },
  { id: 'RB-FIT-7', file: 'tests/rebuild/fit.test.js', testFile: 'fit.test.js', module: 'rig/lib/uninstall.js', stub: "module.exports={uninstall:()=>({removed:[]})};\n" },
  { id: 'RB-DOOR-1', file: 'tests/rebuild/front-door-release.test.js', testFile: 'front-door-release.test.js', module: 'rig/catalog/baseline/onboarding.js', stub: "const fs=require('node:fs'),path=require('node:path');module.exports={propose(repo){fs.mkdirSync(path.join(repo,'.agents/skills/early'),{recursive:true});return {}},questionRound(){return {questions:[]}}};\n" },
];
// rig: reproducible sampling from this explicit six-case mutation registry;
// broader behavioral coverage requires adding meaningful wrong-stub candidates.
let state = seed;
const sampled = probes.slice();
for (let i = sampled.length - 1; i > 0; i -= 1) {
  state = (Math.imul(1664525, state) + 1013904223) >>> 0;
  const j = state % (i + 1);
  [sampled[i], sampled[j]] = [sampled[j], sampled[i]];
}
const results = [];
for (const probe of sampled.slice(0, 5)) {
  const copy = fs.mkdtempSync(path.join(os.tmpdir(), `rig-wrong-stub-${probe.id.toLowerCase()}-`));
  const testDir = path.join(copy, 'tests/rebuild');
  fs.mkdirSync(testDir, { recursive: true });
  for (const name of ['_harness.js', probe.testFile]) fs.copyFileSync(path.join(root, 'tests/rebuild', name), path.join(testDir, name));
  const moduleFile = path.join(copy, probe.module);
  fs.mkdirSync(path.dirname(moduleFile), { recursive: true });
  fs.writeFileSync(moduleFile, probe.stub);
  if (probe.id === 'RB-DOOR-1') {
    const roles = path.join(copy, 'wiki/specs/rebuild/role-map.json');
    fs.mkdirSync(path.dirname(roles), { recursive: true });
    fs.writeFileSync(roles, '{"roles":[]}');
  }
  // FIT-7 reaches the real fixture assertions with a no-op uninstall stub.
  if (probe.id === 'RB-FIT-7') {
    const copiedTest = fs.readFileSync(path.join(testDir, probe.testFile), 'utf8');
    const start = copiedTest.indexOf("test('RB-FIT-7 ");
    const end = copiedTest.indexOf("\ntest('", start + 1);
    if (start < 0) throw new Error('probe body RB-FIT-7 not found');
    const only = copiedTest.slice(start, end < 0 ? undefined : end);
    fs.writeFileSync(path.join(testDir, probe.testFile), `const test=require('node:test');\nconst {assert,fs,path,tempDir,write,product}=require('./_harness');\n${only}\n`);
  }
  const result = spawnSync(process.execPath, ['--test', `--test-name-pattern=^${probe.id} `, path.join(testDir, probe.testFile)], { cwd: copy, encoding: 'utf8' });
  const output = `${result.stdout || ''}\n${result.stderr || ''}`;
  const rejectedByAssertion = result.status !== 0 && /AssertionError|ERR_ASSERTION/.test(output);
  if (!rejectedByAssertion || /missing rebuild interface|Cannot find module/.test(output)) {
    throw new Error(`${probe.id} was not rejected by a behavioral assertion (status ${result.status}):\n${output}`);
  }
  results.push({ id: probe.id, wrongStubRejected: true, assertionFailure: true });
  fs.rmSync(copy, { recursive: true, force: true });
}
const report = { seed, candidates: probes.map(probe => probe.id), probes: results };
console.log(JSON.stringify(report, null, 2));
