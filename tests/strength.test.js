'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const strength = require('../rig/catalog/baseline/strength');
const preflight = require('../rig/catalog/baseline/preflight');

function fixture() {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-strength-'));
  fs.writeFileSync(path.join(repo, 'app.js'), 'module.exports = 1;\n');
  fs.writeFileSync(path.join(repo, 'package.json'), JSON.stringify({ devDependencies: { '@stryker-mutator/core': '1' } }));
  fs.mkdirSync(path.join(repo, 'node_modules/.bin'), { recursive: true });
  fs.mkdirSync(path.join(repo, '.rig/rules'), { recursive: true });
  fs.writeFileSync(path.join(repo, '.rig/rules/rig.md'), 'ok');
  fs.writeFileSync(path.join(repo, 'node_modules/.bin/stryker'), '#!/bin/sh\nprintf \'{"killed":6,"total":10}\\n\'\n', { mode: 0o755 });
  return repo;
}

test('Stryker fixture score below 70 percent refuses phase transition', () => {
  const repo = fixture();
  const result = preflight.enter(repo, 'onboarded', { strength: { changedFiles: ['app.js'], language: 'javascript' } });
  assert.equal(result.strength.score, 0.6);
  assert.equal(result.allowed, false);
});

test('missing mutation tool records its exact accepted gap before normal phase checks', () => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-strength-gap-'));
  fs.mkdirSync(path.join(repo, '.rig/rules'), { recursive: true }); fs.writeFileSync(path.join(repo, '.rig/rules/rig.md'), 'ok');
  fs.writeFileSync(path.join(repo, 'app.rb'), 'puts 1');
  const strengthInfo = { changedFiles: ['app.rb'], language: 'ruby' };
  const refused = preflight.enter(repo, 'onboarded', { strength: strengthInfo });
  assert.equal(refused.allowed, false);
  const accepted = preflight.enter(repo, 'onboarded', { strength: strengthInfo, acceptGap: true });
  assert.equal(accepted.allowed, true);
  assert.match(fs.readFileSync(path.join(repo, '.rig/strength-gaps.json'), 'utf8'), /no mutation tool for ruby/);
});

test('missing-tool gap is reported before validating not-yet-present changed source paths', () => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-strength-no-tool-'));
  const result = strength.measure({ repo, changedFiles: ['Main.java'], language: 'java' });
  assert.match(result.gap, /no mutation tool for java/);
  assert.equal(result.ok, false);
});

test('mutation reports must be fresh and changed-file paths stay inside the repository', () => {
  const repo = fixture();
  fs.mkdirSync(path.join(repo, 'reports/mutation'), { recursive: true });
  fs.writeFileSync(path.join(repo, 'reports/mutation/mutation.json'), JSON.stringify({ files: { 'old.js': { mutants: [{ status: 'Killed' }] } } }));
  fs.writeFileSync(path.join(repo, 'node_modules/.bin/stryker'), '#!/bin/sh\nexit 1\n', { mode: 0o755 });
  assert.equal(strength.measure({ repo, changedFiles: ['app.js'], language: 'javascript' }).ok, false);
  assert.throws(() => strength.measure({ repo, changedFiles: ['../app.js'], language: 'javascript' }), /unsafe path/);
});

test('Stryker scores changed files only and refuses reports that omit a changed file', () => {
  const repo = fixture();
  const report = path.join(repo, 'reports/mutation/mutation.json');
  const runner = path.join(repo, 'node_modules/.bin/stryker');
  fs.writeFileSync(runner, '#!/bin/sh\nmkdir -p reports/mutation\ncat > reports/mutation/mutation.json <<\'JSON\'\n{"files":{"app.js":{"mutants":[{"status":"Killed"},{"status":"Survived"}]},"unrelated.js":{"mutants":[{"status":"Killed"},{"status":"Killed"},{"status":"Killed"}]}}}\nJSON\n', { mode: 0o755 });
  const measured = strength.measure({ repo, changedFiles: ['app.js'], language: 'javascript' });
  assert.equal(measured.score, 0.5);
  fs.writeFileSync(runner, '#!/bin/sh\nmkdir -p reports/mutation\ncat > reports/mutation/mutation.json <<\'JSON\'\n{"files":{"unrelated.js":{"mutants":[{"status":"Killed"}]}}}\nJSON\n', { mode: 0o755 });
  assert.match(strength.measure({ repo, changedFiles: ['app.js'], language: 'javascript' }).gap, /no per-file results/);
  assert.equal(fs.existsSync(report), true);
});

test('mutmut runs for changed Python modules and scores its documented CICD stats', () => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-mutmut-'));
  fs.mkdirSync(path.join(repo, '.venv/bin'), { recursive: true });
  fs.mkdirSync(path.join(repo, 'pkg'), { recursive: true });
  fs.writeFileSync(path.join(repo, 'pkg/app.py'), 'def value(): return 1\n');
  fs.writeFileSync(path.join(repo, 'pyproject.toml'), '[tool.mutmut]\nsource_paths = "pkg"\n');
  fs.mkdirSync(path.join(repo, 'mutants'), { recursive: true });
  fs.writeFileSync(path.join(repo, 'mutants/unrelated.py.meta'), JSON.stringify({ exit_code_by_key: { unrelated: 0 } }));
  fs.writeFileSync(path.join(repo, '.mutmut-cache'), 'prior-cache-bytes');
  fs.writeFileSync(path.join(repo, '.venv/bin/mutmut'), '#!/bin/sh\nif [ "$1" = run ]; then [ ! -e mutants/unrelated.py.meta ] || exit 9; [ ! -f .fail ] || exit 1; [ ! -f .nochange ] || exit 0; mkdir -p mutants/pkg; cp pkg/app.py mutants/pkg/app.py; printf \'%s\\n\' \'{"exit_code_by_key":{"mutant1":1,"mutant2":1,"mutant3":1,"mutant4":1,"mutant5":1,"mutant6":1,"mutant7":1,"mutant8":1,"mutant9":0,"mutant10":0}}\' > mutants/pkg/app.py.meta; exit 0; fi\nexit 2\n', { mode: 0o755 });
  const result = strength.measure({ repo, changedFiles: ['pkg/app.py'], language: 'python' });
  assert.equal(result.score, 0.8, result.gap);
  assert.equal(result.ok, true);
  assert.equal(fs.existsSync(path.join(repo, 'mutants/unrelated.py.meta')), true, 'the prior unrelated cache is restored after an isolated run');
  assert.equal(fs.readFileSync(path.join(repo, '.mutmut-cache'), 'utf8'), 'prior-cache-bytes');
  fs.writeFileSync(path.join(repo, '.nochange'), '1');
  const future = new Date(Date.now() + 10_000);
  fs.utimesSync(path.join(repo, 'pkg/app.py'), future, future);
  assert.match(strength.measure({ repo, changedFiles: ['pkg/app.py'], language: 'python' }).gap, /no fresh per-file report/);
  assert.equal(fs.existsSync(path.join(repo, 'mutants/unrelated.py.meta')), true);
  assert.equal(fs.readFileSync(path.join(repo, '.mutmut-cache'), 'utf8'), 'prior-cache-bytes');
  fs.unlinkSync(path.join(repo, '.nochange')); fs.writeFileSync(path.join(repo, '.fail'), '1');
  assert.match(strength.measure({ repo, changedFiles: ['pkg/app.py'], language: 'python' }).gap, /mutmut could not measure/);
  assert.equal(fs.existsSync(path.join(repo, 'mutants/unrelated.py.meta')), true);
  assert.equal(fs.readFileSync(path.join(repo, '.mutmut-cache'), 'utf8'), 'prior-cache-bytes');
});

test('PIT reads only fresh XML for changed Java classes and refuses a failed run', () => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-pit-'));
  fs.mkdirSync(path.join(repo, 'src/main/java/com/acme'), { recursive: true });
  fs.writeFileSync(path.join(repo, 'src/main/java/com/acme/App.java'), 'package com.acme; class App {}\n');
  fs.writeFileSync(path.join(repo, 'src/main/java/com/acme/AppBar.java'), 'package com.acme; class AppBar {}\n');
  fs.writeFileSync(path.join(repo, 'pom.xml'), '<plugin>pitest-maven</plugin>');
  fs.writeFileSync(path.join(repo, 'mvnw'), '#!/bin/sh\nif [ -f .pit-fail ]; then exit 1; fi\ntouch .pit-fail\nfor arg in "$@"; do case "$arg" in -DreportsDirectory=*) out=${arg#*=};; -DtargetClasses=*) printf \'%s\\n\' "${arg#*=}" > .targets;; esac; done\nmkdir -p "$out"\nprintf \'<mutations><mutation status="KILLED" detected="true"/><mutation status="SURVIVED" detected="false"/></mutations>\' > "$out/mutations.xml"\nexit 0\n', { mode: 0o755 });
  const result = strength.measure({ repo, changedFiles: ['src/main/java/com/acme/App.java'], language: 'java' });
  assert.equal(result.score, 0.5);
  assert.equal(fs.readFileSync(path.join(repo, '.targets'), 'utf8').trim(), 'com.acme.App,com.acme.App$*');
  const failed = strength.measure({ repo, changedFiles: ['src/main/java/com/acme/App.java'], language: 'java' });
  assert.equal(failed.ok, false);
  assert.match(failed.gap, /PIT could not measure/);
});

test('PIT targets the Kotlin file facade for top-level functions', () => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-pit-kotlin-'));
  fs.mkdirSync(path.join(repo, 'src/main/kotlin/com/acme'), { recursive: true });
  fs.writeFileSync(path.join(repo, 'src/main/kotlin/com/acme/Helpers.kt'), 'package com.acme\nfun value() = 1\n');
  fs.writeFileSync(path.join(repo, 'pom.xml'), '<plugin>pitest-maven</plugin>');
  fs.writeFileSync(path.join(repo, 'mvnw'), '#!/bin/sh\nfor arg in "$@"; do case "$arg" in -DreportsDirectory=*) out=${arg#*=};; -DtargetClasses=*) printf \'%s\\n\' "${arg#*=}" > .targets;; esac; done\nmkdir -p "$out"\nprintf \'<mutations><mutation status="KILLED" detected="true"/></mutations>\' > "$out/mutations.xml"\n', { mode: 0o755 });
  const result = strength.measure({ repo, changedFiles: ['src/main/kotlin/com/acme/Helpers.kt'], language: 'kotlin' });
  assert.equal(result.score, 1);
  assert.equal(fs.readFileSync(path.join(repo, '.targets'), 'utf8').trim(), 'com.acme.HelpersKt,com.acme.HelpersKt$*');
});
