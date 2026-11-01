'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

test('Stage 5 local benchmark artifacts are reproducible and grading tasks pass only their reference', t => {
  const split = JSON.parse(fs.readFileSync(path.join(root, 'benchmarks/harbor/split.json')));
  const tasks = JSON.parse(fs.readFileSync(path.join(root, 'benchmarks/harbor/task-ids.json')));
  assert.equal(tasks.length, 89);
  assert.equal(new Set([...split.practice, ...split.test]).size, 89);
  const output = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'rig-stage5-')), 'tasks.json');
  t.after(() => fs.rmSync(path.dirname(output), { recursive: true, force: true }));
  const checked = spawnSync('python3', ['benchmarks/harbor/run.py', '--verify-tasks',
    'benchmarks/tasks/rig-vague', '--output', output], { cwd: root, encoding: 'utf8' });
  assert.equal(checked.status, 0, checked.stderr || checked.stdout);
  const rows = JSON.parse(fs.readFileSync(output));
  assert.equal(rows.length, 30);
  assert.ok(rows.every(row => !row.agent_can_read_hidden_tests && !row.starter_passed && row.reference_passed));
  assert.deepEqual([...new Set(rows.map(row => row.category))].sort(), ['api', 'cli', 'data', 'full-stack', 'web']);
});

test('Harbor adapter composes all three pinned installed-agent implementations', () => {
  const python = path.join(root, '.venv/bin/python');
  if (!fs.existsSync(python)) return;
  const checked = spawnSync(python, ['-c', [
    'from pathlib import Path',
    'from benchmarks.harbor.rig_agent import RigInstalled',
    'expected = {"claude-code": "RigClaudeCode", "codex": "RigCodex", "cursor-cli": "RigCursorCli"}',
    'for inner, name in expected.items():',
    ' agent = RigInstalled(inner=inner, logs_dir=Path("/tmp"))',
    ' assert type(agent).__name__ == name and agent.inner == inner',
  ].join('\n')], { cwd: root, encoding: 'utf8' });
  assert.equal(checked.status, 0, checked.stderr || checked.stdout);
});

test('Harbor Rig setup generates verified archive paths and host projections', () => {
  const python = path.join(root, '.venv/bin/python');
  if (!fs.existsSync(python)) return;
  const source = [
    'import asyncio',
    'from pathlib import Path',
    'from benchmarks.harbor.rig_agent import RigInstalled, _INNERS',
    'class Env:',
    ' def __init__(self): self.commands=[]; self.uploads=[]',
    ' async def upload_file(self, *args): self.uploads.append(args)',
    ' async def exec(self, command, **kwargs):',
    '  self.commands.append(command)',
    '  return type("Result", (), {"return_code":0,"stdout":"abc  /tests/test.py"})()',
    'async def main():',
    ' for inner, host in (("claude-code","claude"),("codex","codex"),("cursor-cli","cursor")):',
    '  base=_INNERS[inner]; original=base.configure',
    '  async def noop(self, env): pass',
    '  base.configure=noop',
    '  try:',
    '   agent=RigInstalled(inner=inner, logs_dir=Path("/tmp"), rig_ref="v6.0.0", rig_archive="/host/archive.tar", rig_commit="deadbeef", rig_digest="a"*64)',
    '   env=Env(); await agent.configure(env); command=env.commands[-2]',
    '   assert env.uploads and "/rig-benchmark/install.sh" in command',
    '   assert "--candidate-artifact /tmp/rig-benchmark.tar" in command and "--hosts "+host in command and "sha256sum -c -" in command',
    '  finally: base.configure=original',
    'asyncio.run(main())',
  ].join('\n');
  const checked = spawnSync(python, ['-c', source], { cwd: root, encoding: 'utf8' });
  assert.equal(checked.status, 0, checked.stderr || checked.stdout);
});


test('post-session token cutoff accepts the exact boundary and rejects one token over without clipping usage', () => {
  const python = path.join(root, '.venv/bin/python');
  if (!fs.existsSync(python)) return;
  const source = [
    'from benchmarks.harbor.run import enforce_token_cap',
    "at = enforce_token_cap({'tokens_in': 6, 'tokens_out': 4, 'passed': True}, 10)",
    "over = enforce_token_cap({'tokens_in': 6, 'tokens_out': 5, 'passed': True}, 10)",
    "assert at['cap_exceeded'] is False and at['passed'] is True",
    "assert over['cap_exceeded'] is True and over['passed'] is False",
    "assert (over['tokens_in'], over['tokens_out']) == (6, 5)",
  ].join('\n');
  const checked = spawnSync(python, ['-c', source], { cwd: root, encoding: 'utf8' });
  assert.equal(checked.status, 0, checked.stderr || checked.stdout);
});

test('live Harbor result conversion measures metadata, guards test tampering, and applies the token cutoff', () => {
  const python = path.join(root, '.venv/bin/python');
  if (!fs.existsSync(python)) return;
  const source = [
    'from types import SimpleNamespace as NS',
    'from benchmarks.harbor.run import trial_to_row',
    "arm={'id':'plain','model':'claude-sonnet-4-6','rig_ref':'none'}",
    "metadata={'rig_hidden_tests_before':{'/tests/test.py':'abc'},'rig_hidden_tests_after':{'/tests/test.py':'abc'},'rig_task_diff':{'lines_added':2,'lines_removed':1,'sloc':4}}",
    "trial=NS(compute_token_cost_totals=lambda:(11,3,7,.01),reward_valid=True,verifier_result=NS(rewards={'reward':1}),agent_info=NS(model_info=NS(name='claude-sonnet-4-6')),agent_result=NS(metadata=metadata))",
    'row=trial_to_row(arm,"task",1,18,0,trial)',
    "assert row['passed'] and row['tampered'] is False and row['cap_exceeded'] is False",
    "assert (row['tokens_in'],row['cache_tokens'],row['tokens_out'],row['fit_tokens'])==(11,3,7,None)",
    "assert (row['lines_added'],row['lines_removed'],row['sloc'])==(2,1,4)",
    "trial.verifier_result.rewards={'reward':0,'auxiliary':1}",
    "assert not trial_to_row(arm,'task',1,18,0,trial)['passed']",
    "trial.verifier_result.rewards={'reward':0.5,'auxiliary':1}",
    'try: trial_to_row(arm,"task",1,18,0,trial)',
    'except RuntimeError as exc: assert "binary" in str(exc)',
    'else: raise AssertionError("non-binary primary reward must be rejected")',
    "trial.verifier_result.rewards={'reward':1}",
    "metadata['rig_hidden_tests_after']={'/tests/test.py':'changed'}",
    'tampered=trial_to_row(arm,"task",1,18,0,trial)',
    "assert tampered['tampered'] and not tampered['passed']",
    "over=trial_to_row(arm,'task',1,17,0,trial)",
    "assert over['cap_exceeded'] and not over['passed'] and (over['tokens_in'],over['tokens_out'])==(11,7)",
    "trial.agent_result.metadata={'rig_hidden_tests_before':{'/tests/test.py':'abc'}}",
    'try: trial_to_row(arm,"task",1,18,0,trial)',
    'except RuntimeError as exc: assert "metadata" in str(exc)',
    'else: raise AssertionError("missing live measurements must fail closed")',
  ].join('\n');
  const checked = spawnSync(python, ['-c', source], { cwd: root, encoding: 'utf8' });
  assert.equal(checked.status, 0, checked.stderr || checked.stdout);
});

test('benchmark report rejects duplicate sessions and missing, multiple, or mismatched windows', () => {
  const python = path.join(root, '.venv/bin/python');
  if (!fs.existsSync(python)) return;
  const source = [
    'import importlib.util, pathlib',
    "spec=importlib.util.spec_from_file_location('report', 'benchmarks/harbor/report.py')",
    'report=importlib.util.module_from_spec(spec); spec.loader.exec_module(report)',
    "pair=[{'step':'rig-v-plain','rig_arm':'rig','plain_arm':'plain'}]",
    "window={'start':'2026-10-31T00:00:00Z','end':'2026-10-31T01:00:00Z'}",
    "other_window={'start':'2026-10-31T01:00:00Z','end':'2026-10-31T02:00:00Z'}",
    "def rows(): return [{'arm':a,'task':'task','run':1,'model':a,'passed':True,'cost_usd':1,'tokens_in':1,'tokens_out':1,'tampered':False,'comparison_window':window,'interventions':None,'intervention_gap':'not recorded'} for a in ('rig','plain')]",
    'good=report.report(rows(),pair)',
    "assert good['arms'][0]['interventions'] is None and good['arms'][0]['intervention_gaps']==['not recorded']",
    "duplicate=rows()+[dict(rows()[0])]; expect=lambda data: None",
    'for data in (duplicate,):',
    ' try: report.report(data,pair)',
    ' except ValueError as exc: assert "duplicate" in str(exc)',
    ' else: raise AssertionError("duplicate task/run rows must fail")',
    "bad=rows(); del bad[0]['comparison_window']",
    'try: report.report(bad,pair)',
    'except ValueError as exc: assert "window" in str(exc)',
    'else: raise AssertionError("missing comparison window must fail")',
    "bad=rows(); bad[0]['comparison_window']={'start':'pending','end':'pending'}",
    'try: report.report(bad,pair)',
    'except ValueError as exc: assert "timestamp" in str(exc)',
    'else: raise AssertionError("placeholder comparison windows must fail")',
    "bad=rows(); bad[0]['comparison_window']=window; bad[1]['comparison_window']=other_window",
    'try: report.report(bad,pair)',
    'except ValueError as exc: assert "differ" in str(exc)',
    'else: raise AssertionError("mismatched comparison windows must fail")',
    "bad=rows()+[dict(rows()[0],run=2,comparison_window=other_window),dict(rows()[1],run=2,comparison_window=other_window)]",
    'try: report.report(bad,pair)',
    'except ValueError as exc: assert "multiple" in str(exc)',
    'else: raise AssertionError("multiple windows within one arm must fail")',
  ].join('\n');
  const checked = spawnSync(python, ['-c', source], { cwd: root, encoding: 'utf8' });
  assert.equal(checked.status, 0, checked.stderr || checked.stdout);
});

test('pinned ECC and hand-stacked sources stage only hash-verified Claude skill files', () => {
  const python = path.join(root, '.venv/bin/python');
  if (!fs.existsSync(python)) return;
  const source = [
    'import asyncio, tempfile',
    'from pathlib import Path',
    'from benchmarks.harbor.run import build_pack_archive',
    'from benchmarks.harbor.rig_agent import RigInstalled, _INNERS',
    'class Env:',
    ' def __init__(self): self.commands=[]; self.uploads=[]',
    ' async def upload_file(self, *args): self.uploads.append(args)',
    ' async def exec(self, command, **kwargs):',
    '  self.commands.append(command)',
    '  return type("Result", (), {"return_code":0,"stdout":"abc  /tests/test.py"})()',
    'async def main():',
    ' for pack in ("ecc","hand-stacked"):',
    '  with tempfile.TemporaryDirectory() as directory:',
    '   archive,digest,manifest=build_pack_archive(pack,directory)',
    '   assert manifest["files"] and all(item["target"].startswith(".claude/") for item in manifest["files"])',
    '   base=_INNERS["claude-code"]; original=base.configure',
    '   async def noop(self, env): pass',
    '   base.configure=noop',
    '   try:',
    '    agent=RigInstalled(inner="claude-code",logs_dir=Path("/tmp"),pack=pack,pack_archive=str(archive),pack_digest=digest)',
    '    env=Env(); await agent.configure(env)',
    '    command=env.commands[-2]',
    '    assert env.uploads and "sha256sum -c -" in command and "cp -R /tmp/rig-benchmark-pack/." in command',
    '   finally: base.configure=original',
    'asyncio.run(main())',
  ].join('\n');
  const checked = spawnSync(python, ['-c', source], { cwd: root, encoding: 'utf8' });
  assert.equal(checked.status, 0, checked.stderr || checked.stdout);
});
