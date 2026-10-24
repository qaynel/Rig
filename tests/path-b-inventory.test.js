'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const h = require('./helpers/path-b');

function write(target, rel, body) {
  const file = path.join(target, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body);
  return file;
}

function skill(name, metadata = '', body = 'Existing behavior.\n') {
  return `---\nname: ${name}\ntitle: ${name} title\n${metadata}---\n# ${name} heading\n\n${body}`;
}

test('AT-PB-7 inventory covers every known harness root with stable structural rows', async () => {
  const inventoryHarness = h.api('inspect.js', 'inventoryHarness');
  await h.withRepo((target) => {
    const fixtures = {
      'CLAUDE.md': '# Claude instructions\n',
      '.github/copilot-instructions.md': '# Copilot instructions\n',
      '.cursor/rules/project.mdc': '# Cursor rule\n',
      '.windsurf/rules/project.md': '# Windsurf rule\n',
      '.clinerules/project.md': '# Cline rule\n',
      '.agents/rules/project.md': '# Codex rule\n',
      '.agents/skills/example/SKILL.md': skill('example'),
      '.agents/skills/example/reference.md': '# Asset\n',
      '.claude/skills/claude-example/SKILL.md': skill('claude-example'),
      '.kiro/steering/project.md': '# Kiro steering\n',
      'hooks/pre-tool.json': '{}\n',
    };
    for (const [rel, body] of Object.entries(fixtures)) write(target, rel, body);
    const first = inventoryHarness(target);
    const second = inventoryHarness(target);
    assert.deepEqual(second, first);
    assert.deepEqual(first.entries.map(({ path: rel }) => rel), [...first.entries.map(({ path: rel }) => rel)].sort());
    assert.equal(first.digest, h.sha256(h.canonical({ entries: first.entries, warnings: first.warnings })));
    const byPath = new Map(first.entries.map((entry) => [entry.path, entry]));
    assert.equal(byPath.get('AGENTS.md').kind, 'instruction');
    assert.equal(byPath.get('.agents/rules/project.md').kind, 'rule');
    assert.equal(byPath.get('.agents/skills/example/SKILL.md').kind, 'skill');
    assert.equal(byPath.get('.agents/skills/example/reference.md').kind, 'skill-asset');
    assert.equal(byPath.get('.kiro/steering/project.md').kind, 'steering');
    assert.equal(byPath.get('hooks/pre-tool.json').kind, 'hook');
    assert.equal(byPath.get('.agents/skills/example/SKILL.md').host, 'codex');
    assert.equal(byPath.get('.claude/skills/claude-example/SKILL.md').host, 'claude');
  });
});

test('AT-PB-7 inventory emits declared metadata but never prose or secret content', async () => {
  const inventoryHarness = h.api('inspect.js', 'inventoryHarness');
  await h.withRepo((target) => {
    const secret = ['sk-', 'inventorySecretABCDEFGHIJKLMNOP'].join('');
    write(target, '.agents/skills/reviewer/SKILL.md', skill(
      'reviewer',
      'capability: review.code-and-pull-request\noverlap_tags:\n  - code-review\n  - pull-request\n',
      `UNIQUE_PROSE_MUST_NOT_LEAK ${secret}\n## Detailed behavior\n`,
    ));
    const inventory = inventoryHarness(target);
    const row = inventory.entries.find(({ path: rel }) => rel.endsWith('/reviewer/SKILL.md'));
    assert.deepEqual(row.capability_tags, ['code-review', 'pull-request', 'review.code-and-pull-request']);
    assert.deepEqual(row.headings, ['reviewer heading', 'Detailed behavior']);
    assert.equal(row.name, 'reviewer');
    assert.equal(row.title, 'reviewer title');
    assert.doesNotMatch(JSON.stringify(inventory), /UNIQUE_PROSE_MUST_NOT_LEAK|inventorySecret/);
  });
});

test('AT-PB-7 inventory bounds and classifies malformed unreadable bytes without guessing', async () => {
  const inventoryHarness = h.api('inspect.js', 'inventoryHarness');
  await h.withRepo((target) => {
    write(target, '.agents/skills/oversized/SKILL.md', Buffer.alloc(256 * 1024 + 1, 0x61));
    write(target, '.agents/skills/non-utf8/SKILL.md', Buffer.from([0xc3, 0x28]));
    write(target, '.agents/skills/malformed/SKILL.md', '---\nname: malformed\n# missing close\n');
    const inventory = inventoryHarness(target);
    assert.deepEqual(
      inventory.warnings.map(({ code }) => code).sort(),
      ['malformed-frontmatter', 'non-utf8', 'oversized'],
    );
    assert.ok(inventory.warnings.every(({ detail }) => !/aaaaa|missing close/.test(detail)));
  });
});

test('AT-PB-7 inventory rejects escaping and duplicate-real-path aliases', async () => {
  const inventoryHarness = h.api('inspect.js', 'inventoryHarness');
  await h.withRepo((target) => {
    const outside = fs.mkdtempSync(path.join(path.dirname(target), 'rig-path-b-outside-'));
    try {
      write(outside, 'SKILL.md', skill('outside'));
      fs.mkdirSync(path.join(target, '.agents/skills'), { recursive: true });
      fs.symlinkSync(outside, path.join(target, '.agents/skills/escape'));
      assert.throws(() => inventoryHarness(target), /outside|escape|symlink/i);
      fs.rmSync(path.join(target, '.agents/skills/escape'));

      const real = path.join(target, '.agents/skills/real');
      write(target, '.agents/skills/real/SKILL.md', skill('real'));
      fs.symlinkSync(real, path.join(target, '.agents/skills/alias'));
      assert.throws(() => inventoryHarness(target), /duplicate|alias|real path/i);
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });
});

test('AT-PB-7 inventory follows one contained symlink without inventing a second path', async () => {
  const inventoryHarness = h.api('inspect.js', 'inventoryHarness');
  await h.withRepo((target) => {
    const source = path.join(target, 'repo-owned-harness', 'linked-skill');
    write(target, 'repo-owned-harness/linked-skill/SKILL.md', skill('linked-skill'));
    fs.mkdirSync(path.join(target, '.agents/skills'), { recursive: true });
    fs.symlinkSync(source, path.join(target, '.agents/skills/linked-skill'));
    const inventory = inventoryHarness(target);
    const linked = inventory.entries.filter(({ path: rel }) => rel === '.agents/skills/linked-skill/SKILL.md');
    assert.equal(linked.length, 1);
    assert.equal(linked[0].name, 'linked-skill');
    assert.equal(inventory.entries.some(({ path: rel }) => rel.startsWith('repo-owned-harness/')), false);
  });
});

test('AT-PB-7 prepare writes deterministic adopted-config Markdown from inventory', async () => {
  await h.withRepo((target) => {
    write(target, '.agents/skills/existing/SKILL.md', skill(
      'existing',
      'capability: testing.web-quality-assurance\noverlap_tags:\n  - web-qa\n',
    ));
    const first = h.handle({ schema_version: 1, action: 'prepare', target });
    const report = fs.readFileSync(path.join(target, '.rig/adopted-config.md'), 'utf8');
    const second = h.handle({ schema_version: 1, action: 'prepare', target });
    assert.equal(second.revision, first.revision);
    assert.equal(fs.readFileSync(path.join(target, '.rig/adopted-config.md'), 'utf8'), report);
    assert.match(report, /structural inventory, not an endorsement/i);
    assert.match(report, /Path \| Host \| Kind \| Name \| Capability tags \| Bytes \| SHA-256/);
  }, { install: true });
});

test('AT-PB-8 overlap uses only exact declared tags and explicit aliases', async () => {
  await h.withRepo((target) => {
    const catalogPath = path.join(target, '.rig/catalog.json');
    const catalog = h.readJson(catalogPath);
    const qa = catalog.skills.find(({ id }) => id === 'qa');
    qa.aliases = ['legacy-qa'];
    const rows = catalog.skills.map(({ id, name, description, family, tool, capability, guarantees, overlap_tags, aliases, source_kind, required, source_rel }) =>
      ({ id, name, description, family, tool, capability, guarantees, overlap_tags, aliases, source_kind, required, source_rel }));
    catalog.release.skills_digest = h.sha256(h.canonical(rows));
    h.writeJson(catalogPath, catalog);
    const digest = h.sha256(fs.readFileSync(catalogPath));
    const journal = path.join(target, '.rig/install-manifest.jsonl');
    const records = fs.readFileSync(journal, 'utf8').trim().split('\n').map(JSON.parse);
    fs.appendFileSync(journal, `${JSON.stringify({
      seq: Math.max(...records.map(({ seq = 0 }) => seq)) + 1,
      path: '.rig/catalog.json', ownership: 'create_owned', operation: 'create_owned',
      transaction_kind: 'install', state: 'applied', digest, desired_digest: digest,
    })}\n`);

    write(target, '.agents/skills/tagged/SKILL.md', skill('tagged',
      'capability: testing.web-quality-assurance\noverlap_tags:\n  - web-qa\n'));
    write(target, '.agents/skills/legacy/SKILL.md', skill('legacy-qa'));
    write(target, '.agents/skills/unknown/SKILL.md', skill('vendor:tdd', '', 'TDD TDD TDD in prose only.\n'));
    fs.appendFileSync(path.join(target, 'AGENTS.md'), '# TDD workflow\nTDD in prose only.\n');
    h.handle({ schema_version: 1, action: 'prepare', target });
    const overlaps = fs.readFileSync(path.join(target, '.rig/overlaps.md'), 'utf8');
    assert.match(overlaps, /\.agents\/skills\/legacy\/SKILL\.md[^\n]*testing\.web-quality-assurance[^\n]*qa[^\n]*qa-only/);
    assert.match(overlaps, /\.agents\/skills\/tagged\/SKILL\.md[^\n]*testing\.web-quality-assurance[^\n]*qa[^\n]*qa-only/);
    assert.match(overlaps, /Unmapped existing entries[\s\S]*\.agents\/skills\/unknown\/SKILL\.md/);
    assert.match(overlaps, /Unmapped existing entries[\s\S]*AGENTS\.md/);
    assert.match(overlaps, /Rig capabilities without a declared match[\s\S]*testing\.test-driven-development/);
  }, { install: true });
});

test('AT-PB-8 overlap output is deterministic advice with zero selection or mutation side effects', async () => {
  await h.withRepo((target) => {
    write(target, '.agents/skills/existing/SKILL.md', skill(
      'existing',
      'capability: testing.web-quality-assurance\noverlap_tags:\n  - web-quality-assurance\n',
    ));
    const before = fs.readFileSync(path.join(target, 'AGENTS.md'));
    const response = h.handle({ schema_version: 1, action: 'prepare', target });
    const overlaps = fs.readFileSync(path.join(target, '.rig/overlaps.md'), 'utf8');
    const state = h.readJson(path.join(target, '.rig/state.json'));
    assert.match(overlaps, /matches are hints/i);
    assert.deepEqual(state.applied.skills, []);
    assert.deepEqual(state.applied.grafts, []);
    assert.equal(state.proposal, null);
    assert.deepEqual(fs.readFileSync(path.join(target, 'AGENTS.md')), before);
    assert.equal(response.next_action, 'inspect-repository');
  }, { install: true });
});
