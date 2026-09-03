'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const h = require('./helpers/path-b');
const { listVendoredSkills } = require('../rig/lib/skills');

const MEMBERSHIP = {
  'requirements.intent-discovery': ['office-hours', 'rig-grilling'],
  'requirements.question-calibration': ['plan-tune'],
  'specification-and-planning.executable-specification': ['rig-product-design', 'spec'],
  'specification-and-planning.multi-perspective-plan-review': ['autoplan', 'plan-ceo-review', 'plan-design-review', 'plan-devex-review', 'plan-eng-review'],
  'implementation-and-orchestration.minimal-change': ['rig-implementation'],
  'implementation-and-orchestration.coordinated-execution': ['rig-execution'],
  'implementation-and-orchestration.workflow-routing': ['rig'],
  'implementation-and-orchestration.delegated-coding': ['codex'],
  'implementation-and-orchestration.skill-authoring': ['skillify'],
  'implementation-and-orchestration.adaptive-onboarding': ['rig-onboarding'],
  'testing.test-driven-development': ['rig-tdd'],
  'testing.web-quality-assurance': ['qa', 'qa-only'],
  'testing.performance-regression': ['benchmark'],
  'testing.agent-evaluation': ['benchmark-models'],
  'testing.ios-quality-assurance': ['ios-qa'],
  'review.code-and-pull-request': ['review', 'rig-code-review'],
  'review.code-health': ['health'],
  'review.developer-experience': ['devex-review'],
  'debugging.root-cause-analysis': ['investigate', 'rig-debugging'],
  'debugging.ios-repair': ['ios-fix'],
  'safety-and-security.destructive-action-guard': ['careful'],
  'safety-and-security.edit-scope-control': ['freeze', 'guard', 'unfreeze'],
  'safety-and-security.security-review': ['cso'],
  'design-and-experience.design-consultation': ['design-consultation'],
  'design-and-experience.design-exploration': ['design-shotgun'],
  'design-and-experience.interface-production': ['design-html'],
  'design-and-experience.visual-review': ['design-review'],
  'design-and-experience.ios-visual-review': ['ios-design-review'],
  'knowledge-and-documentation.context-handoff': ['context-restore', 'context-save'],
  'knowledge-and-documentation.project-memory': ['learn', 'setup-brain', 'sync-brain'],
  'knowledge-and-documentation.documentation': ['document-generate', 'document-release'],
  'knowledge-and-documentation.technical-diagrams': ['diagram'],
  'knowledge-and-documentation.document-publishing': ['make-pdf'],
  'knowledge-and-documentation.retrospective': ['retro'],
  'browser-and-research.browser-automation': ['browse'],
  'browser-and-research.browser-session': ['connect-chrome', 'open-rig-browser'],
  'browser-and-research.remote-pairing': ['pair-agent'],
  'browser-and-research.web-extraction': ['scrape'],
  'browser-and-research.authenticated-session': ['setup-browser-cookies'],
  'delivery-and-operations.deploy-configuration': ['setup-deploy'],
  'delivery-and-operations.land-and-deploy': ['land-and-deploy'],
  'delivery-and-operations.post-deploy-canary': ['canary'],
  'delivery-and-operations.release-shipping': ['ship'],
  'delivery-and-operations.release-queue': ['landing-report'],
  'delivery-and-operations.rig-upgrade': ['rig-upgrade'],
  'delivery-and-operations.ios-debug-instrumentation': ['ios-clean', 'ios-sync'],
};

const FAMILY_IDS = [
  'browser-and-research',
  'debugging',
  'delivery-and-operations',
  'design-and-experience',
  'implementation-and-orchestration',
  'knowledge-and-documentation',
  'requirements',
  'review',
  'safety-and-security',
  'specification-and-planning',
  'testing',
];

function sourceCatalog() {
  const file = path.join(h.root, 'rig/catalog/skills/catalog.json');
  assert.ok(fs.existsSync(file), 'generated skill-shelf catalogue is missing');
  return { file, value: h.readJson(file) };
}

test('AT-PB-1 capability families index all 63 skills with exact membership', () => {
  const { value } = sourceCatalog();
  assert.equal(value.schema_version, 1);
  assert.equal(value.catalog_kind, 'skill-shelf');
  assert.equal(value.skills.length, 63);
  assert.deepEqual(value.taxonomy.families.map(({ id }) => id), FAMILY_IDS);
  const actual = {};
  for (const row of value.skills) (actual[row.capability] ??= []).push(row.id);
  for (const names of Object.values(actual)) names.sort();
  assert.deepEqual(actual, MEMBERSHIP);
  assert.equal(new Set(value.skills.map(({ id }) => id)).size, 63);
});

test('AT-PB-1 recursive sources carry bounded capability metadata independent of vendor origin', () => {
  const optional = listVendoredSkills();
  assert.equal(optional.length, 55);
  for (const skill of optional) {
    assert.deepEqual(
      Object.keys(skill).sort(),
      ['capability', 'dir', 'family', 'guarantees', 'name', 'overlap_tags', 'source_rel', 'tool'].sort(),
      skill.name,
    );
    assert.match(skill.source_rel, new RegExp(`^rig/catalog/skills/${skill.family}/[^/]+/[^/]+/SKILL\\.md$`));
    assert.equal(fs.existsSync(path.join(h.root, skill.source_rel)), true, skill.source_rel);
    assert.match(skill.capability, new RegExp(`^${skill.family.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.`));
    assert.ok(skill.guarantees.length > 0 && new Set(skill.guarantees).size === skill.guarantees.length);
    assert.ok(skill.guarantees.every((claim) => !claim.includes('\n') && [...claim].length <= 160));
    assert.deepEqual(skill.overlap_tags, [...new Set(skill.overlap_tags)].sort());
  }
  assert.ok(optional.some(({ name, source_rel }) => name === 'rig' && /\/_core\/SKILL\.md$/.test(source_rel)));
  assert.ok(optional.some(({ name }) => name === 'connect-chrome'));
  assert.ok(optional.some(({ name }) => name === 'open-rig-browser'));
});

test('AT-PB-1 malformed metadata and guessed legacy prefixes are refused', async () => {
  await h.withRepo((target) => {
    const catalogPath = path.join(target, '.rig/catalog.json');
    const catalog = h.readJson(catalogPath);
    delete catalog.skills[0].guarantees;
    catalog.skills[1].aliases = ['unknown-vendor:invented'];
    h.writeJson(catalogPath, catalog);
    assert.throws(
      () => h.handle({ schema_version: 1, action: 'prepare', target }),
      /catalog|guarantee|alias|invalid/i,
    );
    assert.equal(fs.existsSync(path.join(target, '.rig/state.json')), false);
  }, { install: true });
});

test('AT-PB-1 the governed 115-service catalogue remains byte-identical', () => {
  const files = [
    path.join(h.root, 'rig/catalog.json'),
    ...h.walk(path.join(h.root, 'rig/catalog/services')),
  ].sort((a, b) => path.relative(h.root, a).localeCompare(path.relative(h.root, b)));
  const bytes = [];
  for (const file of files) {
    bytes.push(path.relative(h.root, file).split(path.sep).join('/'), '\0', fs.readFileSync(file), '\0');
  }
  assert.equal(h.sha256(Buffer.concat(bytes.map((part) => Buffer.isBuffer(part) ? part : Buffer.from(part)))), '9cb13bfddfdc645028b197d39383a3fd654e459d2793bec47649b6123717f7aa');
});

test('AT-PB-3 generated catalogue bytes are deterministic and content-addressed', () => {
  const { file, value } = sourceCatalog();
  assert.equal(fs.readFileSync(file, 'utf8'), `${JSON.stringify(value, null, 2)}\n`);
  assert.deepEqual(value.taxonomy.families, [...value.taxonomy.families].sort((a, b) => a.id.localeCompare(b.id)));
  assert.deepEqual(value.skills, [...value.skills].sort((a, b) =>
    a.family.localeCompare(b.family) || a.capability.localeCompare(b.capability) || a.id.localeCompare(b.id)));
  for (const skill of value.skills) {
    assert.deepEqual(skill.aliases, [...new Set(skill.aliases)].sort());
    assert.deepEqual(skill.overlap_tags, [...new Set(skill.overlap_tags)].sort());
  }
  const rows = value.skills.map(({ id, name, description, family, tool, capability, guarantees, overlap_tags, aliases, source_kind, required, source_rel }) =>
    ({ id, name, description, family, tool, capability, guarantees, overlap_tags, aliases, source_kind, required, source_rel }));
  assert.equal(value.release.skills_digest, h.sha256(h.canonical(rows)));
});

test('AT-PB-3 install pins one non-discoverable shelf and projects only mandatory skills', async () => {
  await h.withRepo((target) => {
    const source = path.join(h.root, 'rig/catalog/skills/catalog.json');
    assert.deepEqual(fs.readFileSync(path.join(target, '.rig/catalog.json')), fs.readFileSync(source));
    const staged = h.walk(path.join(target, '.rig/runtime/rig/catalog/skills'))
      .filter((file) => path.basename(file) === 'SKILL.md');
    assert.equal(staged.length, 55);
    const discovered = fs.readdirSync(path.join(target, '.agents/skills'), { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(target, '.agents/skills', entry.name, 'SKILL.md')))
      .map(({ name }) => name)
      .sort();
    assert.deepEqual(discovered, [
      'rig-code-review', 'rig-debugging', 'rig-execution', 'rig-grilling',
      'rig-implementation', 'rig-onboarding', 'rig-product-design', 'rig-tdd',
    ]);
  }, { install: true });
});

test('AT-PB-3 catalogue drift invalidates a proposal and prepare works offline', async () => {
  await h.withRepo((target) => {
    const oldPath = process.env.PATH;
    const emptyBin = path.join(target, 'empty-bin');
    fs.mkdirSync(emptyBin);
    process.env.PATH = emptyBin;
    let prepared;
    try {
      prepared = h.handle({ schema_version: 1, action: 'prepare', target });
    } finally {
      process.env.PATH = oldPath;
    }
    const state = h.readJson(path.join(target, '.rig/state.json'));
    const candidate = h.proposal(target, state);
    const catalogPath = path.join(target, '.rig/catalog.json');
    const catalog = h.readJson(catalogPath);
    catalog.release.skills_digest = 'f'.repeat(64);
    h.writeJson(catalogPath, catalog);
    assert.throws(() => h.handle({
      schema_version: 1,
      action: 'propose',
      target,
      expected_revision: prepared.revision,
      proposal: candidate,
      summary_markdown: h.summary(),
    }), /catalog|stale|digest/i);
  }, { install: true });
});

test('AT-PB-3 a user-edited installed catalogue conflicts instead of being overwritten', async () => {
  await h.withRepo((target) => {
    const catalogPath = path.join(target, '.rig/catalog.json');
    const edited = `${fs.readFileSync(catalogPath, 'utf8').trimEnd()}\n \n`;
    fs.writeFileSync(catalogPath, edited);
    assert.throws(() => h.installRuntime(target), /catalog|conflict|edited|receipt/i);
    assert.equal(fs.readFileSync(catalogPath, 'utf8'), edited);
  }, { install: true });
});

test('AT-PB-1 duplicate declared names fail catalogue generation', () => {
  const { buildSkillCatalog } = require('../rig/lib/skill-catalog');
  const shelfRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-duplicate-shelf-'));
  try {
    fs.copyFileSync(
      path.join(h.root, 'rig/catalog/skills/families.json'),
      path.join(shelfRoot, 'families.json'),
    );
    fs.copyFileSync(
      path.join(h.root, 'rig/catalog/skills/migrations.json'),
      path.join(shelfRoot, 'migrations.json'),
    );
    for (const dir of ['qa-a', 'qa-b']) {
      const skillDir = path.join(shelfRoot, 'testing', 'functional', dir);
      fs.mkdirSync(skillDir, { recursive: true });
      fs.writeFileSync(path.join(skillDir, 'SKILL.md'), `---
name: qa
description: Duplicate fixture skill.
family: testing
tool: host-agent
capability: testing.functional
guarantees:
  - Runs the fixture check.
overlap_tags:
  - test
---

# Fixture
`);
    }

    assert.throws(
      () => buildSkillCatalog({ shelfRoot }),
      /duplicate skill name "qa".*qa-a.*qa-b/is,
    );
  } finally {
    fs.rmSync(shelfRoot, { recursive: true, force: true });
  }
});
