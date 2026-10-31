'use strict';

const test = require('node:test');
const { assert, fs, path, ROOT, tempDir, write, run, product } = require('./_harness');

const catalogue = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'rig/corpus/catalogue.json'), 'utf8'));

test('RB-CAT-1 each mapped role has one complete plain-language catalogue entry', () => {
  const roles = JSON.parse(fs.readFileSync(path.join(ROOT, 'wiki/specs/rebuild/role-map.json'), 'utf8')).roles;
  const entries = catalogue().roles;
  assert.ok(Array.isArray(entries));
  assert.ok(roles.length > 0, 'the role map must include selected capabilities');
  assert.ok(entries.length > 0, 'the user-facing catalogue must not be empty');
  assert.equal(new Set(entries.map((row) => row.id)).size, entries.length);
  assert.deepEqual(new Set(entries.map((row) => row.id)), new Set(roles.map((row) => row.id)));
  const upstreamNames = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'rig/upstreams/lock.json'), 'utf8')).upstreams.map((row) => row.id));
  for (const row of entries) {
    for (const key of ['whatItIs', 'whenItHelps', 'recommendation']) assert.ok(row[key]?.trim(), `${row.id}.${key}`);
    for (const name of upstreamNames) assert.ok(!row.whenItHelps.toLowerCase().includes(name.toLowerCase()), `${row.id} exposes upstream name`);
  }
});

test('RB-CAT-2 every catalogue piece path exists in the applied overlay output', () => {
  const applyOverlays = product('scripts/apply-overlays.js').applyOverlays;
  const entries = catalogue().roles;
  assert.ok(entries.length > 0, 'the catalogue must include pieces to materialize');
  assert.ok(entries.some((row) => row.pieces?.length > 0), 'at least one role must map to shipped pieces');
  const build = tempDir('rig-catalogue-overlay-output-');
  const result = applyOverlays({ upstreamsDir: path.join(ROOT, 'rig/upstreams'), overlaysDir: path.join(ROOT, 'rig/overlays'), outDir: build });
  assert.deepEqual(result.failed, []);
  for (const row of entries) for (const piece of row.pieces) {
    assert.ok(fs.existsSync(path.join(build, piece.upstream, piece.path)), `${row.id}: ${piece.upstream}/${piece.path}`);
  }
});

test('RB-CAT-3 inspect-repo reports dependency and existing harness facts without decisions', () => {
  const repo = tempDir('rig-inspect-repo-');
  write(repo, 'package.json', JSON.stringify({ dependencies: { react: '^19.0.0' } }));
  write(repo, '.claude/skills/superpowers/SKILL.md', '# local skill\n');
  const result = run(process.execPath, [path.join(ROOT, 'rig/bin/inspect-repo.js'), repo, '--json'], { cwd: ROOT });
  assert.equal(result.status, 0, result.stderr);
  const data = JSON.parse(result.stdout);
  assert.ok(data.facts.some((fact) => fact.kind === 'dependency' && fact.value === 'react'));
  assert.ok(data.existingHarness.some((row) => row.path.includes('superpowers')));
  for (const key of ['recommend', 'should', 'needs']) assert.equal(Object.hasOwn(data, key), false);
});

test('RB-CAT-4 inspect-repo makes no outbound network request', () => {
  const repo = tempDir('rig-inspect-offline-');
  write(repo, 'package.json', '{"name":"offline-fixture"}');
  const deny = write(repo, 'deny-network.cjs', `const net=require('node:net');const http=require('node:http');const https=require('node:https');const fail=()=>{throw Error('network denied')};net.Socket.prototype.connect=fail;http.request=fail;https.request=fail;global.fetch=fail;`);
  const result = run(process.execPath, [path.join(ROOT, 'rig/bin/inspect-repo.js'), repo, '--json'], { cwd: ROOT, env: { ...process.env, NODE_OPTIONS: `--require=${deny}` } });
  assert.equal(result.status, 0, result.stderr);
});

test('RB-CAT-5 first-session report has an outcome and recommendation for every role question', () => {
  const renderer = product('rig/lib/reports.js');
  const template = fs.readFileSync(path.join(ROOT, 'rig/corpus/onboarding/report-template.md'), 'utf8');
  const roles = JSON.parse(fs.readFileSync(path.join(ROOT, 'wiki/specs/rebuild/role-map.json'), 'utf8')).roles;
  assert.ok(roles.length > 0, 'the first-session questionnaire must cover selected roles');
  const rendered = renderer.renderFirstSession({ template, roles: catalogue().roles, facts: [{ kind: 'dependency', value: 'react' }] });
  assert.ok(rendered.text.length > 0);
  assert.equal(rendered.questions.length, roles.length);
  for (const question of rendered.questions) {
    assert.ok(question.outcome?.trim(), `${question.roleId}: missing plain outcome`);
    assert.ok(question.recommendation?.trim(), `${question.roleId}: missing recommendation`);
    assert.match(question.outcome, /adds|helps|protects|improves|checks|keeps|finds|writes|supports/i);
  }
  const upstreamNames = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'rig/upstreams/lock.json'), 'utf8')).upstreams.map((row) => row.id));
  for (const name of upstreamNames) assert.ok(!rendered.text.toLowerCase().includes(name.toLowerCase()), `report exposes upstream id ${name}`);
});

// Owner rulings 2026-10-31 (design 5.4, register C7, C9, C14, C18).
const BRANDS = /\b(gstack|superpowers|ponytail|openspec|spec-?kit|speckit|ruflo|claude-flow|hermes|caveman|mempalace|claude-mem|oh-my-claudecode|omc|wshobson|mattpocock|archify|deepagents|forgecode|ui-ux-pro-max|skillsbench|everything-claude-code|ecc)\b/i;
const LOCALE_DIR = /(^|\/)(docs|i18n|locales?)\/(ar|bn|cs|da|de|el|es|fi|fr|he|hi|hu|id|it|ja|ja-JP|ko|ko-KR|nl|no|pl|pt|pt-BR|ro|ru|sv|th|tl|tr|uk|ur|vi|zh|zh-CN|zh-TW|zh-Hans|zh-Hant)\//;
const git = (repo, ...args) => run('git', args, { cwd: repo, env: { ...process.env, GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid', GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' } });

test('RB-CAT-6 inspect-repo reports repository size facts for sizing memory without a decision', () => {
  const repo = tempDir('rig-inspect-size-');
  write(repo, 'src/a.js', 'const a = 1;\nconst b = 2;\n');
  write(repo, 'src/b.js', 'module.exports = 3;\n');
  write(repo, 'README.md', '# fixture\n');
  git(repo, 'init', '-q'); git(repo, 'add', '.'); git(repo, 'commit', '-qm', 'one');
  write(repo, 'src/c.js', 'module.exports = 4;\n');
  git(repo, 'add', '.'); git(repo, 'commit', '-qm', 'two');
  const result = run(process.execPath, [path.join(ROOT, 'rig/bin/inspect-repo.js'), repo, '--json'], { cwd: ROOT });
  assert.equal(result.status, 0, result.stderr);
  const data = JSON.parse(result.stdout);
  assert.equal(data.size?.commits, 2);
  assert.equal(data.size?.files, 4);
  assert.equal(data.size?.sourceLines, 4);
  for (const key of ['recommend', 'should', 'needs', 'memoryChoice']) assert.equal(Object.hasOwn(data.size, key), false);
});

test('RB-CAT-7 every catalogue capability has a default route that needs no paid account', () => {
  const entries = catalogue().roles;
  assert.ok(entries.length > 0);
  for (const row of entries) {
    const defaults = (row.services || []).filter((service) => service.default);
    assert.ok(defaults.length <= 1, `${row.id} has several default services`);
    for (const service of defaults) assert.notEqual(service.paid, true, `${row.id} defaults to paid service ${service.id}`);
  }
  const search = entries.find((row) => row.id === 'llm-application-engineering');
  assert.ok(search?.services?.some((service) => service.default && service.paid === false), 'search guidance must ship a free default route');
  assert.ok(search.services.some((service) => service.paid === true && !service.default), 'paid services must be listed as optional');
});

test('RB-CAT-8 a service the user registers replaces only the default route of that capability', () => {
  const services = product('rig/lib/services.js');
  const entries = catalogue().roles;
  const search = entries.find((row) => row.id === 'llm-application-engineering');
  const paid = search.services.find((service) => service.paid === true);
  const other = entries.find((row) => row.id !== search.id && row.services?.some((service) => service.default));
  const profile = { services: { [search.id]: paid.id } };
  assert.equal(services.routeFor(search, profile).id, paid.id);
  assert.equal(services.routeFor(search, {}).id, search.services.find((service) => service.default).id);
  if (other) assert.equal(services.routeFor(other, profile).id, other.services.find((service) => service.default).id);
});

test('RB-CAT-9 no catalogue role names an upstream brand in its id, title or triggers', () => {
  const entries = catalogue().roles;
  assert.ok(entries.length > 0);
  for (const row of entries) {
    const text = [row.id, row.title, ...(row.triggers || [])].join(' | ');
    assert.equal(BRANDS.test(text), false, `${row.id} shows upstream brand ${text.match(BRANDS)?.[0]}`);
  }
});

test('RB-CAT-10 the catalogue ships one English copy of each piece and no translated duplicates', () => {
  const entries = catalogue().roles;
  assert.ok(entries.some((row) => row.pieces?.length));
  const distinctChinese = /skills\/(chinese-code-review|chinese-commit-conventions|chinese-documentation|chinese-git-workflow|workflow-runner)\/SKILL\.md$/;
  for (const row of entries) for (const piece of row.pieces || []) {
    assert.equal(LOCALE_DIR.test(piece.path), false, `${row.id} ships translated copy ${piece.upstream}/${piece.path}`);
    if (piece.upstream === 'jnMetaCode__superpowers-zh' && /SKILL\.md$/.test(piece.path)) assert.ok(distinctChinese.test(piece.path), `${row.id} ships translated copy ${piece.path}`);
  }
});

test('RB-CAT-11 plan review offers the business, design and engineering lenses under one trigger', () => {
  const review = catalogue().roles.find((row) => row.id === 'plan-review');
  assert.ok(review, 'plan-review role missing from the catalogue');
  assert.deepEqual([...(review.lenses || [])].sort(), ['business', 'design', 'engineering']);
  assert.equal(review.triggers.length, 1);
});

test('RB-CAT-12 inspect-repo reports the Conductor app as a host fact and no catalogue role is named after it', () => {
  const repo = tempDir('rig-inspect-conductor-');
  write(repo, 'conductor.json', JSON.stringify({ scripts: { setup: 'npm install' } }));
  const result = run(process.execPath, [path.join(ROOT, 'rig/bin/inspect-repo.js'), repo, '--json'], { cwd: ROOT });
  assert.equal(result.status, 0, result.stderr);
  const data = JSON.parse(result.stdout);
  assert.ok(data.facts.some((fact) => fact.kind === 'host' && fact.value === 'conductor-app'), JSON.stringify(data.facts));
  for (const row of catalogue().roles) assert.equal(/conductor/i.test(`${row.id} ${row.title}`), false, `${row.id} is named after the Conductor app`);
});
