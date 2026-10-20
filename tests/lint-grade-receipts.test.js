'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { withRepo } = require('./helpers/advanced');
const { createGradeReviewRequest, runGrade } = require('../rig/lib/lint-format');
const { runGrade: evaluateGrade, runInstalledGrade } = require('../rig/lib/lint-grade');

test('installed Context and Evidence use an editable review file and local replay, without CI', () => {
  withRepo((target) => {
    fs.writeFileSync(path.join(target, 'rules.json'), '{"format":"clean"}\n');
    fs.writeFileSync(path.join(target, 'src.js'), 'before\n');
    require('node:child_process').execFileSync('git', ['add', '.'], { cwd: target });
    require('node:child_process').execFileSync('git', ['commit', '-m', 'base'], { cwd: target });
    fs.writeFileSync(path.join(target, 'src.js'), 'after\n');
    const binding = {
      engine: 'component-lint-format-v1', grade: 'maximal',
      components: [{ cwd: '.', manifest: 'rules.json', format_check: {
        argv: [process.execPath, '-e', 'process.stdout.write("clean")'], cwd: '.', source: 'rules.json', network: true,
      }, lint: { argv: [process.execPath, '-e', 'process.stdout.write("clean")'], cwd: '.', source: 'rules.json', network: true } }],
    };
    const execute = (command) => {
      const result = require('node:child_process').spawnSync(command.argv[0], command.argv.slice(1), { cwd: path.join(target, command.cwd || '.'), encoding: 'utf8' });
      return { exit_code: result.status ?? 1, status: result.error ? 'command_not_found' : 'completed', output_digest: require('node:crypto').createHash('sha256').update(`${result.stdout || ''}\n${result.stderr || ''}`).digest('hex') };
    };
    const pending = runInstalledGrade({ target, binding, execute });
    assert.equal(pending.status, 'coverage_gap');
    assert.equal(pending.grade, 'Policy');
    assert.equal(pending.review_request_path, 'reports/rig/lint-format-context-review-request.json');
    const request = JSON.parse(fs.readFileSync(path.join(target, pending.review_request_path), 'utf8'));
    assert.deepEqual(request.reviewed_files.map((file) => file.path), ['src.js']);
    assert.match(pending.reason, /context-review\.json/);

    const review = { ...request, verdict: 'pass', summary: 'The changed source follows the declared rule.', findings: [] };
    fs.mkdirSync(path.join(target, '.rig/lint-format'), { recursive: true });
    fs.writeFileSync(path.join(target, '.rig/lint-format/context-review.json'), `${JSON.stringify(review)}\n`);
    const complete = runInstalledGrade({ target, binding, execute });
    assert.deepEqual(complete.completed_grades, ['Policy', 'Context', 'Evidence'], complete.reason);
    assert.equal(complete.verdict, 'pass');
    assert.equal(fs.existsSync(path.join(target, 'reports/rig/lint-format-evidence.json')), true);
  });
});

test('Context reviews current changed bytes and rule sources; Evidence replays observed commands', () => {
  withRepo((target) => {
    fs.mkdirSync(path.join(target, 'src'), { recursive: true });
    fs.writeFileSync(path.join(target, 'src/a.js'), 'const answer = 42;\n');
    fs.writeFileSync(path.join(target, 'rules.json'), '{"format":"clean"}\n');
    const commands = [{ argv: [process.execPath, '-e', 'process.stdout.write("clean")'], cwd: '.', source: 'rules.json', network: true }];
    const changed = ['src/a.js'];
    const request = createGradeReviewRequest({ target, changed, commands });
    const context = { ...request, verdict: 'pass', summary: 'The changed source follows the declared formatting rule.', findings: [] };

    const mid = runGrade({ target, grade: 'mid', changed, commands, context });
    assert.deepEqual(mid.completed_grades, ['Policy', 'Context']);
    assert.equal(mid.verdict, 'pass');

    const maximal = runGrade({ target, grade: 'maximal', changed, commands, context, ci: { status: 'absent' } });
    assert.deepEqual(maximal.completed_grades, ['Policy', 'Context', 'Evidence']);
    assert.equal(maximal.verdict, 'pass');
    assert.equal(maximal.ci_graft, 'not_installed');
    const receipt = JSON.parse(fs.readFileSync(path.join(target, maximal.evidence.receipt_path), 'utf8'));
    assert.equal(receipt.input_digest, maximal.evidence.input_digest);
    assert.equal(receipt.output_digest, maximal.evidence.output_digest);

    fs.writeFileSync(path.join(target, 'rules.json'), '{"format":"different"}\n');
    const stale = runGrade({ target, grade: 'mid', changed, commands, context });
    assert.equal(stale.status, 'coverage_gap');
    assert.deepEqual(stale.completed_grades, ['Policy']);
  });
});

test('Evidence refuses a command whose output cannot be replayed', () => {
  withRepo((target) => {
    fs.writeFileSync(path.join(target, 'a.js'), 'a\n');
    fs.writeFileSync(path.join(target, 'rules.json'), '{}\n');
    const commands = [{ argv: [process.execPath, '-e', 'process.stdout.write(require("node:crypto").randomUUID())'], source: 'rules.json', network: true }];
    const changed = ['a.js'];
    const context = { ...createGradeReviewRequest({ target, changed, commands }), verdict: 'pass', summary: 'The source follows the repository rule.', findings: [] };
    const result = runGrade({ target, grade: 'maximal', changed, commands, context });
    assert.equal(result.status, 'coverage_gap');
    assert.deepEqual(result.completed_grades, ['Policy', 'Context']);
    assert.equal(fs.existsSync(path.join(target, 'reports/rig/lint-format-evidence.json')), false);
  });
});

test('Context rejects out-of-scope findings and invalid grades before executing commands', () => {
  withRepo((target) => {
    fs.writeFileSync(path.join(target, 'a.js'), 'a\n');
    fs.writeFileSync(path.join(target, 'rules.json'), '{}\n');
    const commands = [{ argv: [process.execPath, '-e', 'process.exit(0)'], source: 'rules.json', network: true }];
    const changed = ['a.js'];
    const request = createGradeReviewRequest({ target, changed, commands });
    let executions = 0;
    const execute = () => { executions += 1; return { exit_code: 0, status: 'completed', output_digest: 'a'.repeat(64) }; };
    const invalid = evaluateGrade({ target, grade: 'unknown', changed, commands, context: request, execute });
    assert.equal(invalid.status, 'coverage_gap');
    assert.equal(executions, 0);
    const forged = { ...request, verdict: 'pass', summary: 'Reviewed.', findings: [{ file: 'outside.js', rule: 'rules.json', meaning: 'looks good' }] };
    const result = evaluateGrade({ target, grade: 'mid', changed, commands, context: forged, execute });
    assert.equal(result.status, 'coverage_gap');
    assert.deepEqual(result.completed_grades, ['Policy']);
    assert.equal(executions, 1, 'only the Policy command ran; invalid review cannot produce Context');
  });
});

test('Context violations fail before Evidence and malformed review outcomes cannot pass', () => {
  withRepo((target) => {
    fs.writeFileSync(path.join(target, 'a.js'), 'a\n');
    fs.writeFileSync(path.join(target, 'rules.json'), '{}\n');
    const changed = ['a.js'];
    const commands = [{ argv: [process.execPath, '-e', 'process.stdout.write("clean")'], source: 'rules.json', network: true }];
    const request = createGradeReviewRequest({ target, changed, commands });
    const violation = { file: 'a.js', rule: 'rules.json', meaning: 'The change violates the repository rule.' };
    let executions = 0;
    const execute = () => { executions += 1; return { exit_code: 0, status: 'completed', output_digest: 'a'.repeat(64) }; };
    const review = { ...request, verdict: 'fail', summary: 'A policy violation remains.', findings: [violation] };
    const failed = evaluateGrade({ target, grade: 'maximal', changed, commands, context: review, execute });
    assert.equal(failed.verdict, 'fail');
    assert.equal(failed.status, 'failed');
    assert.equal(failed.grade, 'Context');
    assert.deepEqual(failed.completed_grades, ['Policy', 'Context']);
    assert.deepEqual(failed.findings, [violation]);
    assert.equal(executions, 1, 'failed Context never enters Evidence replay');
    for (const context of [
      { ...review, verdict: 'pass' },
      { ...review, verdict: undefined },
      { ...review, verdict: 'unknown' },
      { ...review, findings: [] },
    ]) {
      const invalid = evaluateGrade({ target, grade: 'maximal', changed, commands, context, execute });
      assert.equal(invalid.status, 'coverage_gap');
      assert.deepEqual(invalid.completed_grades, ['Policy']);
    }
    assert.equal(fs.existsSync(path.join(target, 'reports/rig/lint-format-evidence.json')), false);
  });
});

test('read-only grade halts on the first byte, mode, creation, or deletion mutation and preserves evidence', () => {
  const mutations = [
    ['bytes', 'require("fs").writeFileSync("a.js","changed\\n")', 'a.js'],
    ['mode', 'require("fs").chmodSync("a.js",0o755)', 'a.js'],
    ['creation', 'require("fs").writeFileSync("created.js","new\\n")', 'created.js'],
    ['deletion', 'require("fs").unlinkSync("a.js")', 'a.js'],
  ];
  for (const [kind, code, expected] of mutations) withRepo((target) => {
    fs.writeFileSync(path.join(target, 'a.js'), 'before\n', { mode: 0o644 });
    fs.writeFileSync(path.join(target, 'rules.json'), '{}\n');
    const commands = [code, 'require("fs").writeFileSync("must-not-run","bad")'].map(program => ({ argv: [process.execPath, '-e', program], source: 'rules.json', network: true }));
    const result = runGrade({ target, grade: 'maximal', changed: ['a.js'], commands });
    assert.equal(result.status, 'mutated', kind);
    assert.equal(result.verdict, 'fail', kind);
    assert.deepEqual(result.changed_paths, [expected], kind);
    assert.equal(result.changes[0].path, expected, kind);
    assert.notDeepEqual(result.changes[0].before, result.changes[0].after, kind);
    assert.equal(result.commands.length, 1, kind);
    assert.equal(fs.existsSync(path.join(target, 'must-not-run')), false, kind);
    if (kind === 'bytes') assert.equal(fs.readFileSync(path.join(target, 'a.js'), 'utf8'), 'changed\n');
    if (kind === 'mode') assert.equal(fs.statSync(path.join(target, 'a.js')).mode & 0o777, 0o755);
    if (kind === 'creation') assert.equal(fs.readFileSync(path.join(target, expected), 'utf8'), 'new\n');
    if (kind === 'deletion') assert.equal(fs.existsSync(path.join(target, 'a.js')), false);
  });
});

test('a failed Policy command halts before a later command executes', () => {
  withRepo((target) => {
    fs.writeFileSync(path.join(target, 'a.js'), 'before\n');
    const commands = ['process.exit(2)', 'require("fs").writeFileSync("must-not-run","bad")'].map(code => ({ argv: [process.execPath, '-e', code], network: true }));
    const result = runGrade({ target, grade: 'maximal', changed: ['a.js'], commands });
    assert.equal(result.verdict, 'fail');
    assert.equal(result.commands.length, 1);
    assert.equal(fs.existsSync(path.join(target, 'must-not-run')), false);
  });
});

test('installed check runner preserves mutation paths and never launches the later lint command', () => {
  withRepo((target) => {
    const { execFileSync } = require('node:child_process');
    fs.writeFileSync(path.join(target, 'a.js'), 'before\n');
    fs.writeFileSync(path.join(target, 'rules.json'), '{}\n');
    execFileSync('git', ['add', '.'], { cwd: target });
    execFileSync('git', ['commit', '-m', 'base'], { cwd: target });
    const command = code => ({ argv: [process.execPath, '-e', code], cwd: '.' });
    const binding = { engine: 'component-lint-format-v1', grade: 'mid', components: [{ cwd: '.', manifest: 'rules.json',
      format_check: command('require("fs").writeFileSync("a.js","changed\\n")'),
      lint: command('require("fs").writeFileSync("must-not-run","bad")'),
    }] };
    const result = require('../rig/lib/check-runner').runBinding('development.code-quality.lint-format', binding, 'repo', target);
    assert.equal(result.status, 1);
    assert.equal(result.kind, 'mutated');
    assert.deepEqual(result.changed_paths, ['a.js']);
    assert.equal(result.changes[0].path, 'a.js');
    assert.equal(fs.existsSync(path.join(target, 'must-not-run')), false);
  });
});

test('installed check runner reports Context violations without writing Evidence', () => {
  withRepo((target) => {
    const { execFileSync } = require('node:child_process');
    fs.writeFileSync(path.join(target, 'a.js'), 'before\n');
    fs.writeFileSync(path.join(target, 'rules.json'), '{}\n');
    execFileSync('git', ['add', '.'], { cwd: target });
    execFileSync('git', ['commit', '-m', 'base'], { cwd: target });
    fs.writeFileSync(path.join(target, 'a.js'), 'after\n');
    const command = { argv: [process.execPath, '-e', 'process.stdout.write("clean")'], cwd: '.' };
    const binding = { engine: 'component-lint-format-v1', grade: 'maximal', components: [{ cwd: '.', manifest: 'rules.json', format_check: command, lint: command }] };
    const { runBinding } = require('../rig/lib/check-runner');
    assert.equal(runBinding('development.code-quality.lint-format', binding, 'repo', target).kind, 'coverage_gap');
    const request = JSON.parse(fs.readFileSync(path.join(target, 'reports/rig/lint-format-context-review-request.json')));
    const findings = [{ file: 'a.js', rule: 'rules.json', meaning: 'The change violates the repository rule.' }];
    fs.mkdirSync(path.join(target, '.rig/lint-format'), { recursive: true });
    fs.writeFileSync(path.join(target, '.rig/lint-format/context-review.json'), JSON.stringify({ ...request, verdict: 'fail', summary: 'A policy violation remains.', findings }));
    const result = runBinding('development.code-quality.lint-format', binding, 'repo', target);
    assert.equal(result.status, 1);
    assert.equal(result.kind, 'lint_grade_failed');
    assert.deepEqual(result.findings, findings);
    assert.equal(fs.existsSync(path.join(target, 'reports/rig/lint-format-evidence.json')), false);
  });
});
