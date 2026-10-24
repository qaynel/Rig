'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { withRepo } = require('./helpers/advanced');
const { createGradeReviewRequest, runGrade } = require('../rig/lib/lint-grade');

for (const ending of ['timeout', 'cancelled', 'missing_dependency', 'command_not_found', 'signalled', 'partial_output', 'failed']) {
  for (const mutates of [false, true]) test(`Evidence replay preserves ${ending}${mutates ? ' together with mutation evidence' : ''}`, () => withRepo(target => {
    fs.writeFileSync(path.join(target, 'a.js'), 'before\n');
    fs.writeFileSync(path.join(target, 'rules.json'), '{}\n');
    const commands = [1, 2].map(n => ({ argv: [process.execPath, '-e', `process.stdout.write('${n}')`], source: 'rules.json' }));
    const changed = ['a.js'];
    const context = { ...createGradeReviewRequest({ target, changed, commands }), verdict: 'pass', findings: [], summary: 'Source follows the reviewed rule.' };
    let calls = 0;
    const result = runGrade({ target, grade: 'maximal', changed, commands, context, execute: () => {
      calls += 1;
      if (calls <= 2) return { status: 'completed', exit_code: 0, output_digest: String(calls).repeat(64) };
      if (mutates) fs.writeFileSync(path.join(target, 'a.js'), 'changed\n');
      return { status: ending === 'failed' ? 'completed' : ending, exit_code: ending === 'failed' ? 2 : null, signal: ending === 'signalled' ? 'SIGTERM' : null, output_digest: 'f'.repeat(64) };
    } });
    assert.equal(result.status, ending);
    assert.equal(result.verdict, 'fail');
    assert.deepEqual(result.completed_grades, ['Policy', 'Context']);
    assert.equal(calls, 3, 'the second replay command never runs');
    assert.equal(result.executed_count, 3);
    assert.equal(result.commands.length, 3, 'both successful Policy commands and the failed replay remain visible');
    assert.equal(result.commands.at(-1).result.status, ending === 'failed' ? 'completed' : ending);
    assert.equal(result.commands.at(-1).result.exit_code, ending === 'failed' ? 2 : null);
    if (ending === 'signalled') assert.equal(result.commands.at(-1).result.signal, 'SIGTERM');
    if (mutates) assert.deepEqual(result.changed_paths, ['a.js']);
    assert.equal(fs.existsSync(path.join(target, 'reports/rig/lint-format-evidence.json')), false);
  }));
}

for (const route of ['source', 'installed']) test(`${route} entrypoint preserves a real timeout during Evidence replay`, { timeout: 20000 }, async () => {
  const { spawn, execFileSync } = require('node:child_process');
  const { once } = require('node:events');
  const lines = require('node:readline');
  const server = spawn(process.execPath, ['-e', `let n=0;require('node:net').createServer(s=>s.end(++n<=Number(process.argv[1])?'ok':'hang')).listen(0,'127.0.0.1',function(){console.log(this.address().port)});`, route === 'source' ? '1' : '2'], { stdio: ['ignore', 'pipe', 'inherit'] });
  try {
    const reader = lines.createInterface({ input: server.stdout });
    const [port] = await once(reader, 'line');
    reader.close();
    withRepo(target => {
      const service = 'development.code-quality.lint-format';
      fs.writeFileSync(path.join(target, 'a.js'), 'before\n');
      fs.writeFileSync(path.join(target, 'rules.json'), '{}\n');
      fs.writeFileSync(path.join(target, 'client.js'), `const s=require('node:net').connect(Number(process.argv[2]),'127.0.0.1');s.on('data',b=>{if(String(b)==='ok')process.stdout.write('clean');else setInterval(()=>{},1000)});`);
      const command = { argv: [process.execPath, 'client.js', port], source: 'rules.json', network: 'required', timeout_ms: 1000 };
      let result;
      if (route === 'source') {
        const context = { ...createGradeReviewRequest({ target, changed: ['a.js'], commands: [command] }), verdict: 'pass', findings: [], summary: 'Source follows the reviewed rule.' };
        result = require('./helpers/approved-lint').runGrade({ target, grade: 'maximal', changed: ['a.js'], commands: [command], context });
        assert.equal(result.status, 'timeout', JSON.stringify(result));
        assert.equal(result.commands.length, 2);
      } else {
        fs.mkdirSync(path.join(target, '.rig/lint-format'), { recursive: true });
        const binding = { engine: 'component-lint-format-v1', grade: 'maximal', scope: 'repo', components: [{ root: '.', include: ['a.js'], manifest: 'rules.json', format_check: command, lint: command }] };
        fs.writeFileSync(path.join(target, '.rig/service-bindings.json'), JSON.stringify({ [service]: binding }));
        fs.writeFileSync(path.join(target, '.rig/execution-policy.json'), JSON.stringify({ schema_version: 1, grants: { [service]: { network: 'required' } } }));
        execFileSync('git', ['add', '.'], { cwd: target });
        execFileSync('git', ['commit', '-qm', 'fixture execution capability'], { cwd: target });
        const inputs = require('../rig/lib/lint-grade').installedGradeInputs({ target, binding, scope: 'repo' });
        assert.equal(inputs.gap, undefined);
        fs.writeFileSync(path.join(target, '.rig/lint-format/context-review.json'), JSON.stringify({ ...createGradeReviewRequest(inputs), verdict: 'pass', findings: [], summary: 'Source follows the reviewed rule.' }));
        const auth = require('./helpers/task-approval').approved(target, inputs.commands, 2);
        for (const [name, value] of Object.entries(auth)) fs.writeFileSync(path.join(target, `.rig/lint-format/execution-${name}.json`), JSON.stringify(value));
        result = require('../rig/lib/checks').runChecks(target, { service, scope: 'repo' });
        assert.equal(result.kind, 'timeout', JSON.stringify(result));
        assert.equal(result.commands.length, 3);
        const reports = fs.readdirSync(path.join(target, 'reports/rig')).filter(name => /^\d+-/.test(name)).map(name => JSON.parse(fs.readFileSync(path.join(target, 'reports/rig', name))));
        const report = reports.find(entry => entry.service_id === service);
        assert.equal(report.status, 'timeout');
        assert.match(JSON.stringify(report.evidence), /Evidence/);
        assert.match(JSON.stringify(report.evidence), /timeout/);
      }
      assert.equal(result.commands.at(-1).result.status, 'timeout');
      assert.equal(fs.existsSync(path.join(target, 'reports/rig/lint-format-evidence.json')), false);
    });
  } finally {
    const closed = once(server, 'exit');
    server.kill();
    await closed;
  }
});
