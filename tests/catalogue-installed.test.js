'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const h = require('./helpers/path-b');
const { CATALOG_PATH, authorshipReport, loadCatalog } = require('../rig/lib/catalog');
const { definition, detectService, runNativeService } = require('../rig/lib/service-catalogue');
const { runBinding } = require('../rig/lib/check-runner');
const { runChecks } = require('../rig/lib/checks');
const { signApproval } = require('./helpers/path-b-approval');

test('installed onboarding README and catalogue authorities describe the signed corpus', async () => {
  await h.withRepo(target => {
    const skillReadme = fs.readFileSync(path.join(target, '.rig/skills/README.md'), 'utf8');
    assert.equal(skillReadme, fs.readFileSync(path.join(h.root, 'rig/catalog/skills/README.md'), 'utf8'));
    assert.match(skillReadme, /source tree is the pinned reference for optional skills/i);
    assert.match(skillReadme, /normal install\s+stages no optional skill tree/i);
    assert.match(skillReadme, /person approves a selected skill[\s\S]*?fetches the pinned archive, verifies its digests and patches/i);
    assert.match(skillReadme, /preserves pinned\s+executable modes/i);
    assert.doesNotMatch(skillReadme, /Rig is markdown-only|skills are not yet wired|no runtime engines/i);
    const sourceReadme = fs.readFileSync(path.join(h.root, 'rig/corpus/onboarding/README.md'), 'utf8');
    const installedReadme = fs.readFileSync(path.join(target, '.rig/onboarding/README.md'), 'utf8');
    assert.equal(installedReadme, sourceReadme);
    assert.match(installedReadme, /human approves one exact\s+proposal before any repository-owned byte changes/i);
    assert.match(installedReadme, /identity\.md.*Offer.*guidance fits the repository's\s+actual gap/i);
    assert.match(installedReadme, /coverage ceiling/i);
    assert.match(installedReadme, /They approve the exact proposal digest/i);

    const catalog = loadCatalog();
    assert.equal(path.relative(h.root, CATALOG_PATH), 'rig/corpus/catalogue.json');
    assert.ok(catalog.services.length > 0);
    assert.deepEqual(authorshipReport().failures, []);

    const authoredGate = fs.readFileSync(path.join(h.root, 'wiki/topics/authored-service-gate.md'), 'utf8');
    const catalogueContract = fs.readFileSync(path.join(h.root, 'wiki/topics/catalogue-contract.md'), 'utf8');
    assert.match(authoredGate, /signed oracle checks the current service-specific corpus: AT-SHAPE-6 rejects\s+generic-baseline wording/i);
    assert.match(authoredGate, /AT-PB-1 pins `rig\/corpus\/catalogue\.json` plus\s+its service definitions/i);
    assert.match(catalogueContract, new RegExp(`signed AT-PB-1 oracle pins the active ${catalog.services.length}-service corpus at\\s+\`rig/corpus/catalogue\\.json\``, 'i'));
    assert.match(catalogueContract, /signed AT-SHAPE-6 oracle rejects generic-baseline wording/i);
    for (const [name, text] of [['authored-service gate', authoredGate], ['catalogue contract', catalogueContract]]) {
      assert.match(text, /AT-SHAPE-6/i, `${name} names the authorship check`);
      assert.match(text, /generic-baseline/i, `${name} records what the authorship check rejects`);
      assert.match(text, /AT-PB-1/i, `${name} names the active-corpus pin`);
      assert.match(text, /signed/i, `${name} identifies these as signed authorities`);
      assert.match(text, /rig\/corpus\/catalogue\.json/i, `${name} names the active catalogue`);
      assert.doesNotMatch(text, /unsigned owner (?:amendment|cases).*?(?:await|pass their advisory)/is,
        `${name} does not describe current signed checks as unsigned or advisory`);
    }
  }, { install: true });
});

test('present malformed JSON service input stays discovered and repairable', async () => {
  const service = loadCatalog().services.find(row => row.id === 'development.documentation.api-reference');
  await h.withRepo(target => {
    const input = 'rig-services/development.documentation.api-reference.json';
    fs.mkdirSync(path.dirname(path.join(target, input)), { recursive: true });
    fs.writeFileSync(path.join(target, input), '{ malformed');
    const found = detectService(target, service);
    assert.equal(found.present, true);
    assert.match(found.invalid, /JSON|position|property/i);
    assert.equal(found.repairable, true);
    assert.deepEqual(found.evidence_paths, [input]);
  });
});

test('present empty text service input stays discovered and repairable', async () => {
  const service = loadCatalog().services.find(row => row.id === 'development.documentation.onboarding-docs');
  await h.withRepo(target => {
    fs.writeFileSync(path.join(target, 'README.md'), ' \n\t');
    const found = detectService(target, service);
    assert.equal(found.present, true);
    assert.match(found.invalid, /empty/i);
    assert.equal(found.repairable, true);
    assert.deepEqual(found.evidence_paths, ['README.md']);
  });
});

test('missing external service tool returns a named non-pass with setup guidance', async () => {
  await h.withRepo(target => {
    const result = runBinding('development.documentation.onboarding-docs', {
      checks: { 'onboarding-docs-source-code-boundary': { repo: ['rig-missing-tool-t48'] } },
    }, 'repo', target);
    assert.equal(result.status, 1);
    assert.equal(result.kind, 'missing_tool');
    assert.match(result.reason, /rig-missing-tool-t48|not found/i);
    assert.match(result.setup_guidance, /install|repository-owned adapter/i);
  });
});

test('unsupported native input returns a named non-pass with setup guidance', async () => {
  await h.withRepo(target => {
    fs.writeFileSync(path.join(target, 'value.txt'), 'not a number');
    const result = runNativeService({
      input: 'value.txt', format: 'text',
      rule: { op: 'minimum', value: 1, reason: 'numeric value must meet the minimum' },
    }, target);
    assert.equal(result.status, 1);
    assert.equal(result.kind, 'unsupported_input');
    assert.match(result.reason, /numeric|input type/i);
    assert.match(result.setup_guidance, /JSON|repository-owned adapter/i);
  });
});

test('runner failure returns a named non-pass with setup guidance', async () => {
  await h.withRepo(target => {
    const result = runBinding('development.documentation.onboarding-docs', {
      checks: { 'onboarding-docs-source-code-boundary': { repo: [process.execPath, '-e', 'process.exit(17)'] } },
    }, 'repo', target);
    assert.equal(result.status, 17);
    assert.equal(result.kind, 'runner_error');
    assert.match(result.reason, /status 17/i);
    assert.match(result.setup_guidance, /inspect|correct|replace/i);
  });
});

test('configuration-only infrastructure service keeps an honest assurance ceiling', () => {
  for (const service of loadCatalog().services) {
    const { value } = definition(service);
    assert.doesNotMatch(value.ceiling, /live infrastructure (?:behavior|assurance)/i, service.id);
  }
  const kubernetes = loadCatalog().services.find(row => row.id === 'infrastructure.container.k8s-helm');
  assert.match(definition(kubernetes).value.ceiling, /configuration validation only|does not prove running/i);
});

test('DNS discovery identity matches its executable native policy checks', () => {
  const service = loadCatalog().services.find(row => row.id === 'infrastructure.networking.dns-discovery');
  const { value } = definition(service);
  const identity = fs.readFileSync(path.join(h.root, 'rig', service.fragments.identity), 'utf8');
  assert.match(identity, new RegExp(`^# ${service.id} — identity[\\s\\S]*?Disposition: ${service.disposition.kind}\\b`));
  assert.equal(service.disposition.kind, 'executable');
  assert.deepEqual(service.disposition.argv.slice(-2), ['--service', service.id]);
  assert.deepEqual(value.checks.minimal.map(check => check.field), ['service_records']);
  assert.deepEqual(value.checks.mid.map(check => check.field), ['ttl_seconds']);
  assert.deepEqual(value.checks.maximal.map(check => check.field), ['hardcode_ephemeral_addresses']);
  assert.match(value.ceiling, /configuration validation only; declared policy does not prove running dns discovery behavior/i);
});

test('every service identity declares the catalogue disposition', () => {
  const services = loadCatalog().services;
  assert.ok(services.length > 0);
  for (const service of services) {
    const identity = fs.readFileSync(path.join(h.root, 'rig', service.fragments.identity), 'utf8');
    const declared = identity.match(/^Disposition: ([a-z-]+)\b/m)?.[1];
    assert.ok(declared, `${service.id}: identity disposition missing`);
    assert.equal(declared, service.disposition.kind, `${service.id}: identity/catalogue disposition mismatch`);
  }
});

test('signed onboarding binds and executes a selected documentation service', async () => {
  await h.withRepo(target => {
    fs.writeFileSync(path.join(target, 'README.md'), '# Project\n\n## Setup\nRun npm install.\n\n## Run\nRun npm start.\n\n## Check\nRun npm test.\n');
    const result = h.applyAndCheck(target, { proposal: {
      selected_skills: [], capabilities: [], grafts: [],
      selected_services: { 'development.documentation.onboarding-docs': 'minimal' },
    }});
    assert.equal(result.checked.phase, 'checked');
    const state = h.readJson(path.join(target, '.rig/state.json'));
    assert.ok(state.proposal.service_bindings['development.documentation.onboarding-docs']);
    assert.ok(state.checks.service_checks.executed_count > 0);
    fs.writeFileSync(path.join(target, 'README.md'), '# Project\n');
    const bad = h.handle({ schema_version: 1, action: 'check', target, expected_revision: result.checked.revision });
    assert.equal(bad.phase, 'failed');
  }, { install: true });
});

test('approved service reselection removes inactive bindings and unedited guidance', async () => {
  await h.withRepo(target => {
    const id = 'development.documentation.onboarding-docs';
    fs.writeFileSync(path.join(target, 'README.md'), '# Project\n\n## Setup\nRun npm install.\n\n## Run\nRun npm start.\n\n## Check\nRun npm test.\n');
    h.applyAndCheck(target, { proposal: { selected_skills: [], capabilities: [], grafts: [], selected_services: { [id]: 'minimal' } } });
    fs.appendFileSync(path.join(target, 'AGENTS.md'), '\nRepository context changed before reselection.\n');
    const result = h.applyAndCheck(target, { proposal: { selected_skills: [], capabilities: [], grafts: [], selected_services: {} } });
    assert.equal(result.checked.phase, 'checked');
    assert.deepEqual(h.readJson(path.join(target, '.rig/service-bindings.json')), {});
    assert.equal(fs.existsSync(path.join(target, `.rig/services/${id}.md`)), false);
    assert.equal(runChecks(target).status, 0);
  }, { install: true });
});

test('empty service reselection refuses a post-approval binding-file edit', async () => {
  await h.withRepo(target => {
    const id = 'development.documentation.onboarding-docs';
    fs.writeFileSync(path.join(target, 'README.md'), '# Project\n\n## Setup\nRun npm install.\n\n## Run\nRun npm start.\n\n## Check\nRun npm test.\n');
    h.applyAndCheck(target, { proposal: { selected_skills: [], capabilities: [], grafts: [], selected_services: { [id]: 'minimal' } } });
    fs.appendFileSync(path.join(target, 'AGENTS.md'), '\nRepository context changed before reselection.\n');

    const { proposed } = h.prepareAndPropose(target, { proposal: { selected_skills: [], capabilities: [], grafts: [], selected_services: {} } });
    const approval = signApproval(target, proposed.proposal_digest);
    const bindingsFile = path.join(target, '.rig/service-bindings.json');
    const edited = Buffer.from('{"user":"keep this"}\n');
    fs.writeFileSync(bindingsFile, edited, { mode: 0o600 });
    fs.chmodSync(bindingsFile, 0o600);

    assert.throws(() => h.handle({
      schema_version: 1,
      action: 'apply',
      target,
      expected_revision: proposed.revision,
      approval,
    }), /service-bindings\.json.*(?:preimage|ownership|stale)/i);
    assert.deepEqual(fs.readFileSync(bindingsFile), edited);
    assert.equal(fs.statSync(bindingsFile).mode & 0o777, 0o600);
  }, { install: true });
});

test('repository-owned service commands are approved and actually discriminate behavior', async () => {
  await h.withRepo(target => {
    fs.writeFileSync(path.join(target, 'README.md'), '# Project\n## Setup\nnpm install\n');
    fs.writeFileSync(path.join(target, 'behavior.cjs'), 'module.exports = x => { if (!Number.isInteger(x) || x < 0) throw new Error("invalid"); return x * 2; };\n');
    fs.writeFileSync(path.join(target, 'verify.cjs'), 'const assert = require("node:assert/strict"); const double = require("./behavior.cjs"); assert.equal(double(3), 6); assert.throws(() => double(-1), /invalid/);\n');
    h.writeJson(path.join(target, 'rig-service-adapters.json'), {
      schema_version: 1,
      services: { 'development.documentation.onboarding-docs': {
        ceiling: 'Runs the repository numeric boundary regression; approval maps this command to the selected service.',
        checks: { 'onboarding-docs-source-code-boundary': {
          repo: [process.execPath, 'verify.cjs'], network: 'none', required_paths: ['verify.cjs', 'behavior.cjs'],
        }},
      }},
    });
    const result = h.applyAndCheck(target, { proposal: { selected_skills: [], capabilities: [], grafts: [], selected_services: { 'development.documentation.onboarding-docs': 'minimal' } } });
    assert.equal(result.checked.phase, 'checked');
    const state = h.readJson(path.join(target, '.rig/state.json'));
    assert.deepEqual(state.proposal.service_bindings['development.documentation.onboarding-docs'].checks['onboarding-docs-source-code-boundary'].repo, [process.execPath, 'verify.cjs']);
    assert.ok(state.checks.service_checks.executed_count > 0);
    fs.writeFileSync(path.join(target, 'behavior.cjs'), 'module.exports = x => x * 2;\n');
    const bad = h.handle({ schema_version: 1, action: 'check', target, expected_revision: result.checked.revision });
    assert.equal(bad.phase, 'failed');
  }, { install: true });
});
