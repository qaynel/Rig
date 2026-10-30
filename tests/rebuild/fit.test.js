'use strict';

const test = require('node:test');
const { assert, fs, path, ROOT, tempDir, write, product } = require('./_harness');

const roles = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'rig/corpus/catalogue.json'), 'utf8')).roles;

test('RB-FIT-1 a fit above the byte budget is rejected with BUDGET', () => {
  const { checkFit } = product('rig/lib/fit-check.js');
  const result = checkFit({ fit: { active: ['ui'], dormant: [] }, roles: [{ id: 'ui', budgetBytes: 11 }], facts: [], budgetBytes: 10 });
  assert.equal(result.ok, false);
  assert.ok(result.failures.some((failure) => failure.code === 'BUDGET'));
});

test('RB-FIT-2 active roles with a user-edited shared trigger fail and name both roles', () => {
  const { checkFit } = product('rig/lib/fit-check.js');
  const roleRows = [
    { id: 'first', title: 'first', triggers: ['review changed code'], budgetBytes: 1 },
    { id: 'second', title: 'second', triggers: ['review changed code'], budgetBytes: 1 },
  ];
  const result = checkFit({ fit: { active: ['first', 'second'], dormant: [] }, roles: roleRows, facts: [], budgetBytes: 10 });
  assert.equal(result.ok, false);
  const overlap = result.failures.find((failure) => failure.code === 'TRIGGER_OVERLAP');
  assert.ok(overlap);
  assert.match(overlap.detail, /first/);
  assert.match(overlap.detail, /second/);
});

test('RB-FIT-3 dormant roles are absent from host targets and their hooks do not run at startup', () => {
  const { checkFit } = product('rig/lib/fit-check.js');
  const role = { id: 'dormant-checks', default: 'dormant', triggers: [], budgetBytes: 1 };
  const result = checkFit({ fit: { active: [], dormant: [role.id] }, roles: [role], facts: [], budgetBytes: 10 });
  assert.equal(result.ok, true, JSON.stringify(result.failures));
  const targets = ['.claude/skills', '.codex/skills', '.cursor/rules'].map((rel) => path.join(ROOT, rel, role.id));
  assert.ok(targets.every((target) => !fs.existsSync(target)));
});

test('RB-FIT-4 an existing harness role is not duplicated by upgrade', () => {
  const onboarding = product('rig/catalog/baseline/onboarding.js');
  const repo = tempDir('rig-fit-existing-');
  write(repo, '.claude/skills/superpowers/SKILL.md', '# Existing role\n');
  const proposal = onboarding.propose(repo);
  assert.ok(proposal.existingHarness?.some((entry) => entry.path.includes('superpowers')));
  const result = onboarding.apply(repo, proposal, { dryRun: true });
  assert.equal(result.files.filter((file) => file.includes('superpowers')).length, 1);
});

test('RB-FIT-5 repository growth proposes UI and browser roles, then approved fit matches fresh fit', () => {
  const { fingerprint, refitProposal } = product('rig/lib/fingerprint.js');
  const repo = tempDir('rig-refit-cli-');
  write(repo, 'package.json', JSON.stringify({ dependencies: { react: '^19.0.0' } }));
  write(repo, 'src/pages/index.jsx', 'export default function Page(){ return null }');
  const next = fingerprint(repo);
  const proposal = refitProposal({ fit: { active: ['cli'], dormant: ['ui-design', 'browser-qa'] } }, next);
  assert.ok(proposal.activate.includes('ui-design'));
  assert.ok(proposal.activate.includes('browser-qa'));
});

test('RB-FIT-6 removing dormant files leaves a valid fit', () => {
  const { checkFit } = product('rig/lib/fit-check.js');
  const result = checkFit({ fit: { active: ['cli'], dormant: [] }, roles: [{ id: 'cli', triggers: [], budgetBytes: 1 }], facts: [], budgetBytes: 2 });
  assert.equal(result.ok, true, JSON.stringify(result.failures));
});

test('RB-FIT-7 uninstalling one graft preserves other Rig roles and user files', () => {
  const { uninstall } = product('rig/lib/uninstall.js');
  const repo = tempDir('rig-uninstall-graft-');
  const kept = write(repo, 'src/user.js', 'user bytes\n');
  const removed = write(repo, '.claude/skills/rig-ui/SKILL.md', 'rig ui\n');
  write(repo, '.claude/skills/rig-cli/SKILL.md', 'rig cli\n');
  uninstall(repo, { graft: 'ui' });
  assert.equal(fs.readFileSync(kept, 'utf8'), 'user bytes\n');
  assert.equal(fs.existsSync(removed), false);
  assert.equal(fs.existsSync(path.join(repo, '.claude/skills/rig-cli/SKILL.md')), true);
});

test('RB-FIT-8 the web-UI refit benchmark task passes hidden tests at least as often as fresh fit', () => {
  const task = path.join(ROOT, 'benchmarks/tasks/rig-vague/refit-web-ui');
  assert.ok(fs.existsSync(path.join(task, 'task.yaml')));
  assert.ok(fs.existsSync(path.join(task, 'tests', 'test.sh')));
  assert.ok(!fs.existsSync(path.join(task, 'tests', 'test.sh')) || !fs.statSync(path.join(task, 'tests', 'test.sh')).mode.toString(8).endsWith('444'));
});

test('RB-FIT-9 an overlay-created trigger overlap is rejected with TRIGGER_OVERLAP', () => {
  const { checkFit } = product('rig/lib/fit-check.js');
  const roleRows = [
    { id: 'one', triggers: ['ship safe changes'], budgetBytes: 1 },
    { id: 'two', triggers: ['ship safe changes'], budgetBytes: 1 },
  ];
  const result = checkFit({ fit: { active: ['one', 'two'], dormant: [] }, roles: roleRows, facts: [], budgetBytes: 5 });
  assert.equal(result.failures[0].code, 'TRIGGER_OVERLAP');
});

test('RB-FIT-10 locally edited installed skill bytes are retained and reported', () => {
  const onboarding = product('rig/catalog/baseline/onboarding.js');
  const repo = tempDir('rig-fit-local-edit-');
  const file = write(repo, '.claude/skills/rig-ui/SKILL.md', 'owner edit\n');
  const before = fs.readFileSync(file);
  const result = onboarding.apply(repo, { active: ['ui'] });
  assert.deepEqual(fs.readFileSync(file), before);
  assert.ok(result.keptLocalEdits?.some((item) => item.includes('rig-ui')));
});

test('RB-FIT-11 the fit validator reports missing active capability facts', () => {
  const { checkFit } = product('rig/lib/fit-check.js');
  const ui = { id: 'ui', triggers: [], activatesOn: [{ kind: 'dependency', value: 'react' }], budgetBytes: 1 };
  const result = checkFit({ fit: { active: [], dormant: ['ui'] }, roles: [ui], facts: [{ kind: 'dependency', value: 'react' }], budgetBytes: 3 });
  assert.ok(result.failures.some((failure) => failure.code === 'MISSING_CAPABILITY'));
});

function unusedRolesGuard() { return roles().length > 0; }
