'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { withRepo } = require('./helpers/advanced');
const { runAutofix, planAutofix } = require('../rig/lib/lint-format');
const { sign } = require('./helpers/task-approval');

function formatter(target) {
  const file = path.join(target, 'formatter.js');
  fs.writeFileSync(path.join(target, 'rules.odd'), 'format fixture\n');
  fs.writeFileSync(file, [
    "const fs = require('node:fs');",
    "if (process.argv[2] === '--write') fs.writeFileSync('a.js', 'fixed\\n');",
    "else process.exit(fs.readFileSync('a.js', 'utf8') === 'fixed\\n' ? 0 : 1);",
  ].join('\n'));
  fs.writeFileSync(path.join(target, 'a.js'), 'broken\n');
  return { source: 'rules.odd', scoped_files: ['a.js'], argv: [process.execPath, 'formatter.js', '--write', 'a.js'], verify: [process.execPath, 'formatter.js', '--check', 'a.js'] };
}

test('approved autofix passes its changed filename operand to the verifier', () => {
  withRepo((target) => {
    const cmd = formatter(target);
    const plan = planAutofix(target, cmd);
    const approval = sign(target, plan);
    assert.equal(plan.commands[0].definition_snapshot.find(([file]) => file === 'a.js')[1], plan.commands[1].definition_snapshot.find(([file]) => file === 'a.js')[1]);
    assert.deepEqual(runAutofix(target, cmd, approval), { verification: 'pass', status: 'completed', fix_status: 'completed' });
  });
});

test('autofix approval rejects source, configuration, and command changes before dispatch', () => {
  for (const tamper of ['source', 'config', 'command']) {
    withRepo((target) => {
      const cmd = formatter(target);
      fs.writeFileSync(path.join(target, 'package.json'), '{"scripts":{}}\n');
      const plan = planAutofix(target, cmd);
      const approval = sign(target, plan);
      if (tamper === 'source') fs.writeFileSync(path.join(target, 'rules.odd'), 'format tampered\n');
      if (tamper === 'config') fs.writeFileSync(path.join(target, 'package.json'), '{"scripts":{"x":"changed"}}\n');
      if (tamper === 'command') cmd.verify = [process.execPath, 'formatter.js', '--unexpected', 'a.js'];
      assert.throws(() => runAutofix(target, cmd, approval), /approval|digest/);
      assert.equal(fs.readFileSync(path.join(target, 'a.js'), 'utf8'), 'broken\n');
      if (tamper === 'source') assert.equal(fs.readFileSync(path.join(target, 'rules.odd'), 'utf8'), 'format tampered\n');
    });
  }
});

test('autofix reports verification as not_run when it changes verifier configuration', () => {
  withRepo((target) => {
    const cmd = formatter(target);
    fs.writeFileSync(path.join(target, 'package.json'), '{"scripts":{}}\n');
    const script = path.join(target, 'formatter.js');
    fs.writeFileSync(script, [
      "const fs = require('node:fs');",
      "if (process.argv[2] === '--write') { fs.writeFileSync('a.js', 'fixed\\n'); fs.writeFileSync('package.json', '{\\\"scripts\\\":{\\\"changed\\\":true}}\\n'); }",
      "else { fs.writeFileSync('verifier-ran', 'yes'); process.exit(fs.readFileSync('a.js', 'utf8') === 'fixed\\n' ? 0 : 1); }",
    ].join('\n'));
    const result = runAutofix(target, cmd, sign(target, planAutofix(target, cmd)));
    assert.deepEqual(result, { verification: 'not_run', status: 'command_drift', fix_status: 'completed' });
    assert.equal(fs.existsSync(path.join(target, 'verifier-ran')), false);
  });
});

test('autofix preserves the command source definition hash even when it is not a config extension', () => {
  withRepo((target) => {
    const cmd = formatter(target);
    cmd.scoped_files.push('rules.odd');
    cmd.argv.push('rules.odd');
    cmd.verify.push('rules.odd');
    const script = path.join(target, 'formatter.js');
    fs.writeFileSync(script, [
      "const fs = require('node:fs');",
      "if (process.argv[2] === '--write') { fs.writeFileSync('a.js', 'fixed\\n'); fs.writeFileSync('rules.odd', 'tampered\\n'); }",
      "else { fs.writeFileSync('verifier-ran', 'yes'); process.exit(0); }",
    ].join('\n'));
    const result = runAutofix(target, cmd, sign(target, planAutofix(target, cmd)));
    assert.deepEqual(result, { verification: 'not_run', status: 'command_drift', fix_status: 'completed' });
    assert.equal(fs.existsSync(path.join(target, 'verifier-ran')), false);
  });
});

test('autofix cannot rewrite a verifier script hidden behind interpreter flags', () => {
  withRepo((target) => {
    fs.writeFileSync(path.join(target, 'a.js'), 'broken\n');
    fs.writeFileSync(path.join(target, 'rules.odd'), 'format fixture\n');
    fs.writeFileSync(path.join(target, 'formatter.js'), [
      "const fs = require('node:fs');",
      "if (process.argv[2] === '--write') { fs.writeFileSync('a.js', 'fixed\\n'); fs.writeFileSync('formatter.js', 'process.exit(0);\\n'); }",
      "else process.exit(fs.readFileSync('a.js', 'utf8') === 'fixed\\n' ? 0 : 1);",
    ].join('\n'));
    const cmd = {
      source: 'rules.odd',
      scoped_files: ['a.js'],
      argv: [process.execPath, '--enable-source-maps', 'formatter.js', '--write', 'a.js'],
      verify: [process.execPath, '--enable-source-maps', 'formatter.js', '--check', 'a.js'],
    };
    const result = runAutofix(target, cmd, sign(target, planAutofix(target, cmd)));
    assert.equal(result.verification, 'not_run');
    assert.equal(result.status, 'command_drift');
  });
});

test('autofix cannot rewrite a shell verifier script', () => {
  withRepo((target) => {
    fs.writeFileSync(path.join(target, 'a.js'), 'broken\n');
    fs.writeFileSync(path.join(target, 'formatter.sh'), [
      'if [ "$1" = "--write" ]; then',
      "  printf 'fixed\\n' > a.js",
      "  printf 'exit 0\\n' > formatter.sh",
      'else',
      '  [ "$(cat a.js)" = "fixed" ]',
      'fi',
    ].join('\n'));
    fs.writeFileSync(path.join(target, 'rules.odd'), 'format fixture\n');
    const cmd = { source: 'rules.odd', scoped_files: ['a.js'], argv: ['sh', 'formatter.sh', '--write', 'a.js'], verify: ['sh', 'formatter.sh', '--check', 'a.js'] };
    const result = runAutofix(target, cmd, sign(target, planAutofix(target, cmd)));
    assert.equal(result.verification, 'not_run');
    assert.equal(result.status, 'command_drift');
  });
});
