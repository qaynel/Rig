'use strict';

const test = require('node:test');
const { assert, fs, path, ROOT, tempDir, write, product } = require('./_harness');

const roles = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'wiki/specs/rebuild/role-map.json'), 'utf8')).roles;
const fit = (active, dormant) => ({ active, dormant });
const triggerLines = (text) => (text.match(/^## Trigger phrases\s*\n((?:[ \t]*-[^\n]*\n?)*)/m)?.[1] || '')
  .split(/\r?\n/).map((line) => line.match(/^\s*-\s+(.+?)\s*$/)?.[1]).filter(Boolean);
const roleFiles = (repo) => {
  const root = path.join(repo, '.agents/skills');
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root).filter((name) => name.startsWith('rig-')).sort().map((name) => {
    const dir = path.join(root, name);
    return [name, ...fs.readdirSync(dir).sort().map((file) => fs.readFileSync(path.join(dir, file)))];
  });
};

test('RB-FIT-1 a fit above the byte budget is rejected with BUDGET', () => {
  const { checkFit } = product('rig/lib/fit-check.js');
  const result = checkFit({ fit: { active: ['ui'], dormant: [] }, roles: [{ id: 'ui', budgetBytes: 11 }], facts: [], budgetBytes: 10 });
  assert.equal(result.ok, false);
  assert.ok(result.failures.some((failure) => failure.code === 'BUDGET'));
});

test('RB-FIT-2 active roles with a user-edited shared trigger fail and name both roles', () => {
  const { checkFit } = product('rig/lib/fit-check.js');
  const onboarding = product('rig/catalog/baseline/onboarding.js');
  const repo = tempDir('rig-user-trigger-edit-');
  const active = ['code-review', 'debugging'];
  const proposal = onboarding.propose(repo, { fit: fit(active, []) });
  onboarding.apply(repo, proposal, { approved_digest: proposal.digest });
  const editedFiles = active.map((id) => write(repo, `.agents/skills/rig-${id}/SKILL.md`, `# ${id}\n\n## Trigger phrases\n- review changed code safely\n`));
  const roleRows = roles().filter((role) => active.includes(role.id)).map((role, index) => ({ ...role, triggers: triggerLines(fs.readFileSync(editedFiles[index], 'utf8')) }));
  const result = checkFit({ fit: { active, dormant: [] }, roles: roleRows, facts: [], budgetBytes: 250000 });
  assert.equal(result.ok, false);
  const overlap = result.failures.find((failure) => failure.code === 'TRIGGER_OVERLAP');
  assert.ok(overlap);
  assert.match(overlap.detail, /first/);
  assert.match(overlap.detail, /second/);
});

test('RB-FIT-3 dormant roles are absent from host targets and their hooks do not run at startup', () => {
  const onboarding = product('rig/catalog/baseline/onboarding.js');
  const coordinator = product('rig/lib/coordinator.js');
  const repo = tempDir('rig-fit-dormant-');
  const plan = fit(['code-review'], ['debugging']);
  const proposal = onboarding.propose(repo, { fit: plan });
  onboarding.apply(repo, proposal, { approved_digest: proposal.digest });
  const active = path.join(repo, '.agents/skills/rig-code-review');
  const dormant = path.join(repo, '.rig/dormant/debugging');
  assert.ok(fs.existsSync(active), 'active role must be in a host discovery path');
  assert.ok(fs.existsSync(dormant), 'dormant role must be retained under .rig/dormant');
  assert.equal(fs.existsSync(path.join(repo, '.agents/skills/rig-debugging')), false);
  assert.equal(fs.existsSync(path.join(repo, '.claude/skills/rig-debugging')), false);
  const startup = coordinator.startup();
  assert.ok(!JSON.stringify(startup).includes('debugging'), 'dormant role must not run or be listed at startup');
});

test('RB-FIT-4 an existing harness skill remains the sole discoverable copy', () => {
  const onboarding = product('rig/catalog/baseline/onboarding.js');
  const repo = tempDir('rig-fit-existing-');
  write(repo, '.agents/skills/superpowers/SKILL.md', '---\nname: code-review\n---\n# Existing Superpowers role\n');
  const proposal = onboarding.propose(repo, { fit: fit(['code-review'], []) });
  onboarding.apply(repo, proposal, { approved_digest: proposal.digest });
  const discovered = fs.readdirSync(path.join(repo, '.agents/skills')).filter((name) => /superpowers/i.test(name));
  assert.deepEqual(discovered, ['superpowers']);
  assert.ok(proposal.overlaps.some((row) => row.existing_source?.includes('superpowers')));
  assert.equal(fs.existsSync(path.join(repo, '.agents/skills/rig-code-review')), false, 'Rig must reuse the existing role');
});

test('RB-FIT-5 repository growth proposes UI and browser roles, then approved fit matches fresh fit', () => {
  const { fingerprint, refitProposal } = product('rig/lib/fingerprint.js');
  const onboarding = product('rig/catalog/baseline/onboarding.js');
  const repo = tempDir('rig-refit-cli-');
  const original = fit(['code-review'], ['ui-design', 'browser-qa']);
  const initial = onboarding.propose(repo, { fit: original });
  onboarding.apply(repo, initial, { approved_digest: initial.digest });
  write(repo, 'package.json', JSON.stringify({ dependencies: { react: '^19.0.0' } }));
  write(repo, 'src/pages/index.jsx', 'export default function Page(){ return null }');
  const next = fingerprint(repo);
  const requested = fit(['code-review', 'ui-design', 'browser-qa'], []);
  const proposal = refitProposal({ fit: original }, next, requested);
  assert.ok(proposal.activate.includes('ui-design'));
  assert.ok(proposal.activate.includes('browser-qa'));
  const before = roleFiles(repo);
  const approved = onboarding.propose(repo, { fit: requested });
  assert.deepEqual(roleFiles(repo), before, 'proposing a re-fit must not install it');
  onboarding.apply(repo, approved, { approved_digest: approved.digest });
  assert.equal(roleFiles(repo).length, requested.active.length);
});

test('RB-FIT-12 approved refit materializes the same active role tree as a fresh fit', () => {
  const onboarding = product('rig/catalog/baseline/onboarding.js');
  const fromGrowth = tempDir('rig-fit-growth-');
  const fresh = tempDir('rig-fit-fresh-');
  const proposedFit = fit(['code-review', 'ui-design', 'browser-qa'], []);
  const proposal = onboarding.propose(fromGrowth, { fit: proposedFit });
  onboarding.apply(fromGrowth, proposal, { approved_digest: proposal.digest });
  const freshProposal = onboarding.propose(fresh, { fit: proposedFit });
  onboarding.apply(fresh, freshProposal, { approved_digest: freshProposal.digest });
  assert.equal(roleFiles(fromGrowth).length, proposedFit.active.length);
  assert.ok(roleFiles(fromGrowth).every(([name, files]) => files.length > 0 && name.startsWith('rig-')));
  assert.equal(roleFiles(fresh).length, proposedFit.active.length);
  assert.deepEqual(roleFiles(fromGrowth), roleFiles(fresh));
});

test('RB-FIT-6 removing dormant files leaves a valid fit', () => {
  const { checkFit } = product('rig/lib/fit-check.js');
  const { readReceipt } = product('rig/lib/receipt.js');
  const { fingerprint } = product('rig/lib/fingerprint.js');
  const onboarding = product('rig/catalog/baseline/onboarding.js');
  const repo = tempDir('rig-fit-delete-dormant-');
  const plan = fit(['code-review'], ['debugging']);
  const proposal = onboarding.propose(repo, { fit: plan });
  onboarding.apply(repo, proposal, { approved_digest: proposal.digest });
  const receipt = readReceipt(repo);
  assert.ok(receipt?.fit, 'installed receipt must record the applied fit');
  assert.deepEqual(receipt.fit.active, plan.active);
  assert.deepEqual(receipt.fit.dormant, plan.dormant);
  fs.rmSync(path.join(repo, '.rig/dormant'), { recursive: true, force: true });
  assert.ok(!fs.existsSync(path.join(repo, '.rig/dormant')));
  assert.ok(fs.existsSync(path.join(repo, '.agents/skills/rig-code-review')), 'active installed role must remain');
  const facts = fingerprint(repo).facts;
  const result = checkFit({ fit: receipt.fit, roles: roles(), facts, budgetBytes: 250000 });
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
  const file = path.join(ROOT, 'wiki/specs/rebuild/benchmark-results/refit-web-ui.jsonl');
  const rows = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/).map((line) => JSON.parse(line));
  const refit = rows.filter((row) => row.fit_mode === 'refit');
  const fresh = rows.filter((row) => row.fit_mode === 'fresh');
  assert.ok(refit.length > 0 && fresh.length > 0);
  const key = (row) => `${row.task}\0${row.run}`;
  assert.deepEqual(refit.map(key).sort(), fresh.map(key).sort(), 'both modes must use identical task/run samples');
  const passRate = (group) => group.filter((row) => row.passed === true).length / group.length;
  assert.ok(passRate(refit) >= passRate(fresh), `refit ${passRate(refit)} < fresh ${passRate(fresh)}`);
});

test('RB-FIT-9 an overlay-created trigger overlap is rejected with TRIGGER_OVERLAP', () => {
  const { checkFit } = product('rig/lib/fit-check.js');
  const applyOverlays = product('scripts/apply-overlays.js').applyOverlays;
  const root = tempDir('rig-trigger-overlay-');
  const upstreams = path.join(root, 'upstreams');
  const overlays = path.join(root, 'overlays');
  const out = path.join(root, 'out');
  write(upstreams, 'sample/one.md', '# One\n\n## Trigger phrases\n- ship safe changes\n');
  write(upstreams, 'sample/two.md', '# Two\n\n## Trigger phrases\n- inspect risky changes\n');
  write(overlays, 'sample/01-shared-trigger.patch', '# reason: make the overlay trigger overlap visible to the fit check\n# ruling: C1\n--- a/two.md\n+++ b/two.md\n@@ -1,4 +1,4 @@\n # Two\n \n ## Trigger phrases\n-- inspect risky changes\n+- ship safe changes\n');
  const applied = applyOverlays({ upstreamsDir: upstreams, overlaysDir: overlays, outDir: out });
  assert.deepEqual(applied.failed, []);
  const roleRows = [
    { id: 'one', triggers: triggerLines(fs.readFileSync(path.join(out, 'sample/one.md'), 'utf8')) },
    { id: 'two', triggers: triggerLines(fs.readFileSync(path.join(out, 'sample/two.md'), 'utf8')) },
  ];
  const result = checkFit({ fit: { active: ['one', 'two'], dormant: [] }, roles: roleRows, facts: [], budgetBytes: 5 });
  assert.equal(result.ok, false);
  assert.equal(result.failures[0].code, 'TRIGGER_OVERLAP');
});

test('RB-FIT-10 locally edited installed skill bytes are retained and reported', () => {
  const onboarding = product('rig/catalog/baseline/onboarding.js');
  const repo = tempDir('rig-fit-local-edit-');
  const file = write(repo, '.agents/skills/rig-code-review/SKILL.md', 'owner edit\n');
  const before = fs.readFileSync(file);
  const proposal = onboarding.propose(repo, { fit: fit(['code-review'], []) });
  const result = onboarding.apply(repo, proposal, { approved_digest: proposal.digest });
  assert.deepEqual(fs.readFileSync(file), before);
  assert.ok(result.keptLocalEdits?.some((item) => item.includes('rig-code-review')));
});

test('RB-FIT-13 changed proposal digest refuses before altering installed files', () => {
  const onboarding = product('rig/catalog/baseline/onboarding.js');
  const repo = tempDir('rig-fit-digest-');
  const proposal = onboarding.propose(repo, { fit: fit(['code-review'], ['debugging']) });
  const forged = { ...proposal, fit: fit(['debugging'], ['code-review']) };
  assert.throws(() => onboarding.apply(repo, forged, { approved_digest: proposal.digest }), /digest|changed/i);
  assert.equal(fs.existsSync(path.join(repo, '.rig')), false);
  assert.equal(fs.existsSync(path.join(repo, '.agents/skills')), false);
});

test('RB-FIT-14 existing harness reuse keeps a hand-edited installed role byte-for-byte', () => {
  const onboarding = product('rig/catalog/baseline/onboarding.js');
  const repo = tempDir('rig-fit-existing-local-edit-');
  write(repo, '.agents/skills/superpowers/SKILL.md', '---\nname: code-review\n---\n# Existing role\n');
  const editedPath = '.agents/skills/rig-debugging/SKILL.md';
  const edited = write(repo, editedPath, 'owner-edited bytes\n');
  const before = fs.readFileSync(edited);
  const proposal = onboarding.propose(repo, { fit: fit(['code-review', 'debugging'], []) });
  const result = onboarding.apply(repo, proposal, { approved_digest: proposal.digest });
  assert.deepEqual(fs.readFileSync(edited), before);
  assert.ok(result.keptLocalEdits?.some((item) => item.includes('rig-debugging')));
  assert.equal(fs.existsSync(path.join(repo, '.agents/skills/rig-code-review')), false);
});

test('RB-FIT-11 the fit validator reports missing active capability facts', () => {
  const { checkFit } = product('rig/lib/fit-check.js');
  const ui = { id: 'ui', triggers: [], activatesOn: [{ kind: 'dependency', value: 'react' }], budgetBytes: 1 };
  const result = checkFit({ fit: { active: [], dormant: ['ui'] }, roles: [ui], facts: [{ kind: 'dependency', value: 'react' }], budgetBytes: 3 });
  assert.ok(result.failures.some((failure) => failure.code === 'MISSING_CAPABILITY'));
});
