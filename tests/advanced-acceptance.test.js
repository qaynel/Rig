#!/usr/bin/env node
// Gate 1 §7 acceptance tests for Tier 2 Advanced — frozen oracle in
// wiki/gate1/acceptance.md.
// Do NOT edit Gate 1. Traceability: impl-design §12. Expected RED until Phase 3
// ships catalogue subcommands (missing inspect/recommend/plan/apply/check).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  withRepo,
  createRepoFixture,
  createHostFixture,
  seedMaliciousAgents,
  seedCredentialStagedDiff,
  inspect,
  recommend,
  plan,
  apply,
  remediate,
  check,
  writeSelection,
  allowedReview,
  readJson,
  writeJson,
  sha256File,
  FAKE_CREDENTIAL,
} = require('./helpers/advanced');

function assertSubcommandAvailable(result, name) {
  assert.equal(
    result.status,
    0,
    `${name} must succeed once Advanced is wired; got status=${result.status} stderr=${result.stderr}`,
  );
}

function readAgents(target) {
  return fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8');
}

// --- A. Archetype ---

test('AT-SHAPE-1 install grafts, never clobbers existing AGENTS.md', () => {
  withRepo((target) => {
    createRepoFixture('existing-agents-router', target);
    const beforeAgents = readAgents(target);
    const beforeClaude = fs.readFileSync(path.join(target, 'CLAUDE.md'), 'utf8');
    const { reviewPath } = allowedReview(target, { host: 'codex' });
    writeSelection(target, {
      'development.documentation.onboarding-docs': 'minimal',
    });

    const planned = plan(target, { review: reviewPath });
    assertSubcommandAvailable(planned, 'plan');
    const applied = apply(target, {
      review: reviewPath,
      plan: planned.outPath,
    });
    assertSubcommandAvailable(applied, 'apply');

    const afterAgents = readAgents(target);
    assert.ok(
      afterAgents.startsWith(beforeAgents.trim()) || afterAgents.includes(beforeAgents.trim()),
      'existing AGENTS.md body must survive (append/reference, never replace)',
    );
    assert.equal(
      fs.readFileSync(path.join(target, 'CLAUDE.md'), 'utf8'),
      beforeClaude,
      'user-owned CLAUDE.md must be byte-identical',
    );
    assert.ok(
      fs.existsSync(path.join(target, '.rig', 'catalog-routing.md')) ||
        afterAgents.includes('.rig/catalog-routing.md'),
      'install must graft a routing pointer',
    );
  });
});

test('AT-SHAPE-2 scan recommends, never gates; not-recommended E2E still installs', () => {
  withRepo((target) => {
    createRepoFixture('ui-less-library', target);
    const { reviewPath } = allowedReview(target, { host: 'codex', verdict: 'ALLOW' });

    const menu = recommend(target, { review: reviewPath });
    assertSubcommandAvailable(menu, 'recommend');
    const recommendation = readJson(menu.outPath);
    const e2e = (recommendation.services || recommendation.menu || []).find(
      (entry) =>
        entry.service_id === 'testing.e2e.browser-automation' ||
        entry.id === 'testing.e2e.browser-automation',
    );
    assert.ok(e2e, 'complete menu must emit E2E browser-automation leaf');
    assert.equal(
      e2e.recommendation || e2e.status,
      'not_recommended',
      'UI-less library must mark E2E not_recommended',
    );
    assert.notEqual(e2e.recommendation || e2e.status, 'unavailable');

    writeSelection(target, { 'testing.e2e.browser-automation': 'minimal' });
    const planned = plan(target, { review: reviewPath });
    assertSubcommandAvailable(planned, 'plan');
    const applied = apply(target, { review: reviewPath, plan: planned.outPath });
    assertSubcommandAvailable(applied, 'apply');
    assert.ok(
      fs.existsSync(path.join(target, '.rig', 'catalog-receipt.json')),
      'not-recommended service must still install successfully',
    );
  });
});

test('AT-SHAPE-3 grade dials depth, not identity (maximal ⊃ minimal)', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const { reviewPath } = allowedReview(target);

    writeSelection(target, { 'testing.unit.test-case-generation': 'minimal' });
    const minPlan = plan(target, { review: reviewPath });
    assertSubcommandAvailable(minPlan, 'plan');
    const minChecks = new Set(
      (readJson(minPlan.outPath).effective_checks ||
        readJson(minPlan.outPath).checks ||
        []) ,
    );

    writeSelection(target, { 'testing.unit.test-case-generation': 'maximal' });
    const maxPlan = plan(target, { review: reviewPath });
    assertSubcommandAvailable(maxPlan, 'plan');
    const maxBody = readJson(maxPlan.outPath);
    const maxChecks = new Set(maxBody.effective_checks || maxBody.checks || []);

    assert.ok(maxChecks.size > minChecks.size, 'maximal must add depth checks');
    for (const id of minChecks) {
      assert.ok(maxChecks.has(id), `maximal must be a strict superset; missing ${id}`);
    }
    assert.equal(
      maxBody.service_id || 'testing.unit.test-case-generation',
      'testing.unit.test-case-generation',
      'grade change must not change service identity',
    );
  });
});

test('AT-SHAPE-4 deps auto-pull razor-scoped; selected grade preserved', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const { reviewPath } = allowedReview(target);
    // Select a higher-rung service without selecting its dependency.
    writeSelection(target, {
      'testing.mutation.mutant-generator': 'minimal',
    });
    const planned = plan(target, { review: reviewPath });
    assertSubcommandAvailable(planned, 'plan');
    const body = readJson(planned.outPath);
    const effective = body.effective_services || body.resolved || body.services || [];
    const dep = effective.find(
      (entry) =>
        (entry.service_id || entry.id || '').startsWith('testing.unit.') ||
        entry.install_reason === 'dependency' ||
        (entry.required_slices && entry.required_slices.length),
    );
    assert.ok(dep, 'missing dependency must be auto-pulled as a named slice');
    const selected = effective.find(
      (entry) =>
        (entry.service_id || entry.id) === 'testing.mutation.mutant-generator',
    );
    assert.ok(selected, 'selected service must remain in the effective map');
    assert.equal(
      selected.selected_grade || selected.grade,
      'minimal',
      'resolver must never downgrade or replace the selected grade',
    );
  });
});

test('AT-SHAPE-5 surfaceless run is vacuous green + logged reason', () => {
  withRepo((target) => {
    createRepoFixture('ui-less-library', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, { 'testing.e2e.browser-automation': 'minimal' });
    const planned = plan(target, { review: reviewPath });
    assertSubcommandAvailable(planned, 'plan');
    assertSubcommandAvailable(
      apply(target, { review: reviewPath, plan: planned.outPath }),
      'apply',
    );

    const run = check(target, {
      scope: 'diff',
      service: 'testing.e2e.browser-automation',
    });
    assertSubcommandAvailable(run, 'check');
    const reportsDir = path.join(target, 'reports', 'rig');
    assert.ok(fs.existsSync(reportsDir), 'vacuous run must write reports/rig/');
    const reports = fs.readdirSync(reportsDir).filter((f) => f.endsWith('.json'));
    assert.ok(reports.length >= 1, 'expected a vacuous report file');
    const report = readJson(path.join(reportsDir, reports[0]));
    assert.equal(report.status, 'vacuous');
    assert.match(
      String(report.reason || report.summary || ''),
      /nothing to pin|no (browser|ui)|surfaceless/i,
    );
  });
});

// --- B. Baseline ---

test('AT-BASE-1 sanitation first; malicious AGENTS.md blocks recommend', () => {
  withRepo((target) => {
    seedMaliciousAgents(target);
    const inspected = inspect(target, { host: 'codex' });
    assertSubcommandAvailable(inspected, 'inspect');
    assert.ok(fs.existsSync(inspected.outPath), 'inspect must emit an artifact');
    const inspection = readJson(inspected.outPath);
    assert.ok(inspection.harness_digest, 'inspection must include harness_digest');
    assert.doesNotMatch(
      JSON.stringify(inspection),
      new RegExp(['sk-', 'testABCDEFGHIJKLMNOP'].join(''), 'i'),
      'evidence must redact credential-shaped strings',
    );

    // Recommend without an accepted review must fail closed.
    const blocked = recommend(target, {
      review: path.join(target, 'missing-review.json'),
    });
    assert.notEqual(blocked.status, 0, 'recommend must refuse before accepted review');

    // Even with a fabricated ALLOW, a stale/mismatched digest must not unlock the menu
    // when sanitation has not been accepted against the current harness.
    const { reviewPath } = allowedReview(target, {
      verdict: 'QUARANTINE',
      harness_digest: inspection.harness_digest,
    });
    const quarantined = recommend(target, { review: reviewPath });
    assert.notEqual(
      quarantined.status,
      0,
      'QUARANTINE review must not unlock the catalogue menu',
    );
  });
});

test('AT-BASE-2 baseline cannot be declined; empty selection still installs floors', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assertSubcommandAvailable(planned, 'plan');
    const planBody = readJson(planned.outPath);
    const serialized = JSON.stringify(planBody);
    assert.doesNotMatch(
      serialized,
      /"baseline"\s*:\s*false|disable_baseline|skip_sanitation/i,
      'baseline must not be a selectable/declinable toggle',
    );
    assertSubcommandAvailable(
      apply(target, { review: reviewPath, plan: planned.outPath }),
      'apply',
    );

    const required = [
      path.join(target, '.rig', 'baseline', 'drift-rule.md'),
      path.join(target, '.rig', 'bin', 'check-copies.js'),
      path.join(target, '.rig', 'bin', 'check.js'),
      path.join(target, '.rig', 'bin', 'secret-guard.sh'),
      path.join(target, '.rig', 'catalog-receipt.json'),
    ];
    for (const file of required) {
      assert.ok(fs.existsSync(file), `baseline component missing: ${path.relative(target, file)}`);
    }
  });
});

test('AT-BASE-3 remediation is consent-gated; inspect/recommend write nothing', () => {
  withRepo((target) => {
    seedMaliciousAgents(target);
    const before = new Set(
      fs.readdirSync(target, { withFileTypes: true }).map((e) => e.name),
    );
    const inspected = inspect(target, { host: 'codex' });
    assertSubcommandAvailable(inspected, 'inspect');
    const afterInspect = new Set(
      fs.readdirSync(target, { withFileTypes: true }).map((e) => e.name),
    );
    for (const name of afterInspect) {
      if (name === '.rig-test') continue;
      assert.ok(before.has(name), `inspect must not create target path ${name}`);
    }

    const proposalPath = path.join(target, '.rig-test', 'proposal.json');
    writeJson(proposalPath, {
      schema_version: 1,
      actions: [{ op: 'rewrite', path: 'AGENTS.md', content: '# cleaned\n' }],
    });
    const unapproved = remediate(target, {
      proposal: proposalPath,
      approve: 'deadbeef',
    });
    assert.notEqual(unapproved.status, 0, 'unapproved remediation must fail');
    assert.match(
      fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8'),
      /Malicious harness/,
      'AGENTS.md must remain untouched without digest approval',
    );
  });
});

// --- C. Per-property (AT-P1/P2 re-point) ---

test('AT-P1 no-blowout — alias of AT-SHAPE-1 graft contract', () => {
  // Executable evidence lives in AT-SHAPE-1; keep an explicit pointer case so
  // the Gate 1 ID remains greppable in the suite.
  assert.equal('AT-P1', 'AT-P1');
});

test('AT-P2 safe-by-construction — alias of AT-BASE-1/2', () => {
  assert.equal('AT-P2', 'AT-P2');
});

test('AT-P3 MECE spot-checks on catalogue scope-map', () => {
  const catalogPath = path.join(__dirname, '..', 'rig', 'catalog.json');
  assert.ok(fs.existsSync(catalogPath), 'rig/catalog.json must exist');
  const catalog = readJson(catalogPath);
  const services = catalog.services || catalog.entries || [];
  const owns = new Map();
  for (const service of services) {
    for (const key of service.owns || []) {
      assert.equal(
        owns.has(key),
        false,
        `owned scope "${key}" must be unique; also claimed by ${owns.get(key)}`,
      );
      owns.set(key, service.id);
    }
  }

  const byId = Object.fromEntries(services.map((s) => [s.id, s]));
  const perfOwners = services.filter((s) =>
    (s.owns || []).some((k) => /perf|load-test|load_test/i.test(k)),
  );
  for (const owner of perfOwners) {
    assert.equal(
      owner.family,
      'testing',
      `perf/load-test-authoring must live in Testing; found ${owner.id}`,
    );
  }
  const injectionOwners = services.filter((s) =>
    (s.owns || []).some((k) => /secret-injection|secret_injection|runtime-secret/i.test(k)),
  );
  for (const owner of injectionOwners) {
    assert.equal(
      owner.family,
      'infrastructure',
      `runtime secret injection must live in Infrastructure; found ${owner.id}`,
    );
  }
  assert.ok(
    !((byId['development.quality.correctness-static'] || {}).owns || []).some((k) =>
      /sast|security-vuln/i.test(k),
    ),
    'Dev correctness-static must not own security-SAST scope',
  );
});

test('AT-P4 host-coverage degrades; never vanishes where a floor can run', () => {
  withRepo((target) => {
    createHostFixture('non-hook-advisory', target);
    const { reviewPath } = allowedReview(target, { host: 'generic' });
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assertSubcommandAvailable(planned, 'plan');
    assertSubcommandAvailable(
      apply(target, { review: reviewPath, plan: planned.outPath }),
      'apply',
    );
    assert.ok(
      fs.existsSync(path.join(target, '.rig', 'bin', 'check.js')),
      'non-hook host still gets CI/git check floor',
    );
    assert.ok(
      fs.existsSync(path.join(target, '.rig', 'bin', 'secret-guard.sh')) ||
        fs.existsSync(path.join(target, '.rig', 'hooks', 'secret-guard.sh')),
      'non-hook host still gets pre-commit/CI secret guard',
    );
  });
});

test('AT-P5 user override wins over recommendation', () => {
  withRepo((target) => {
    createRepoFixture('ui-less-library', target);
    const { reviewPath } = allowedReview(target);
    const menu = recommend(target, { review: reviewPath });
    assertSubcommandAvailable(menu, 'recommend');
    writeSelection(target, {
      'testing.e2e.browser-automation': 'maximal',
      'testing.unit.test-case-generation': 'minimal',
    });
    const planned = plan(target, { review: reviewPath });
    assertSubcommandAvailable(planned, 'plan');
    assertSubcommandAvailable(
      apply(target, { review: reviewPath, plan: planned.outPath }),
      'apply',
    );
    const receipt = readJson(path.join(target, '.rig', 'catalog-receipt.json'));
    const installed = receipt.services || receipt.installed || {};
    const e2eGrade =
      installed['testing.e2e.browser-automation']?.grade ||
      installed['testing.e2e.browser-automation'];
    assert.equal(e2eGrade, 'maximal', 'final install must match user choices');
  });
});

// --- D. Bespoke ---

test('AT-B1 context-sync exact-copy floor fails on drifted duplicate', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assertSubcommandAvailable(planned, 'plan');
    assertSubcommandAvailable(
      apply(target, { review: reviewPath, plan: planned.outPath }),
      'apply',
    );

    const canonical = path.join(target, '.rig', 'baseline', 'drift-rule.md');
    const copy = path.join(target, 'AGENTS.drift-copy.md');
    fs.copyFileSync(canonical, copy);
    writeJson(path.join(target, '.rig', 'sync-map.json'), {
      groups: [
        {
          id: 'drift-rule',
          canonical: '.rig/baseline/drift-rule.md',
          copies: ['AGENTS.drift-copy.md'],
        },
      ],
    });
    fs.writeFileSync(copy, `${fs.readFileSync(copy, 'utf8')}\n# drifted\n`);

    const result = check(target, { scope: 'repo' });
    assert.notEqual(result.status, 0, 'byte-exact drift must fail the sync check');
  });
});

test('AT-B2 semantic drift guard flags stale/deprecated context', () => {
  withRepo((target) => {
    createRepoFixture('existing-agents-router', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assertSubcommandAvailable(planned, 'plan');
    assertSubcommandAvailable(
      apply(target, { review: reviewPath, plan: planned.outPath }),
      'apply',
    );

    writeJson(path.join(target, '.rig', 'context-index.json'), {
      documents: [
        { path: 'AGENTS.md', status: 'canonical' },
        { path: 'docs/old-agents.md', status: 'deprecated', replaces: 'AGENTS.md' },
      ],
    });
    fs.mkdirSync(path.join(target, 'docs'), { recursive: true });
    fs.writeFileSync(
      path.join(target, 'docs', 'old-agents.md'),
      'Deprecated: use AGENTS.md. This copy is stale.\n',
    );

    const result = check(target, { scope: 'repo' });
    // Semantic guard may report via check output or a drift report file.
    const reportsDir = path.join(target, 'reports', 'rig');
    const hasReport =
      fs.existsSync(reportsDir) &&
      fs.readdirSync(reportsDir).some((f) => f.endsWith('.json'));
    assert.ok(
      result.status !== 0 || hasReport || /stale|deprecated|semantic/i.test(result.stdout + result.stderr),
      'stale/deprecated context must be flagged by the semantic guard',
    );
  });
});

test('AT-B3 pre-commit secret scanner blocks credential-shaped staged diff', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assertSubcommandAvailable(planned, 'plan');
    assertSubcommandAvailable(
      apply(target, { review: reviewPath, plan: planned.outPath }),
      'apply',
    );

    seedCredentialStagedDiff(target);
    const hook =
      [
        path.join(target, '.git', 'hooks', 'pre-commit'),
        path.join(target, '.rig', 'bin', 'secret-guard.sh'),
        path.join(target, '.rig', 'hooks', 'secret-guard.sh'),
      ].find((p) => fs.existsSync(p));
    assert.ok(hook, 'secret guard hook/script must be installed');

    const { spawnSync } = require('node:child_process');
    const result = spawnSync(hook, [], {
      cwd: target,
      encoding: 'utf8',
      shell: false,
    });
    assert.notEqual(result.status, 0, 'credential-shaped staged diff must be blocked');
    assert.match(result.stderr + result.stdout, /secret|credential|blocked|guard/i);
    assert.ok(
      !(result.stderr + result.stdout).includes(FAKE_CREDENTIAL) ||
        /redacted|\[REDACTED\]/i.test(result.stderr + result.stdout),
      'diagnostics should avoid echoing raw secrets when possible',
    );
  });
});

test('AT-B4 adopt-time security verdict enum + fail-closed QUARANTINE', () => {
  withRepo((target) => {
    seedMaliciousAgents(target);
    const inspected = inspect(target, { host: 'codex' });
    assertSubcommandAvailable(inspected, 'inspect');
    const inspection = readJson(inspected.outPath);

    for (const verdict of [
      'ALLOW',
      'ALLOW_WITH_RESTRICTIONS',
      'QUARANTINE',
      'BLOCK',
    ]) {
      const { review, reviewPath } = allowedReview(target, {
        verdict,
        harness_digest: inspection.harness_digest,
        path: path.join(target, '.rig-test', `review-${verdict}.json`),
        restrictions:
          verdict === 'ALLOW_WITH_RESTRICTIONS'
            ? [{ id: 'no-network-tools' }]
            : [],
      });
      assert.equal(review.verdict, verdict);
      assert.ok(fs.existsSync(reviewPath));
    }

    const uncertain = allowedReview(target, {
      verdict: 'ALLOW',
      harness_digest: inspection.harness_digest,
      unverifiable: ['free-form-restriction'],
      restrictions: [{ id: 'not-a-known-typed-id', note: 'free form' }],
      path: path.join(target, '.rig-test', 'review-uncertain.json'),
    });
    const menu = recommend(target, { review: uncertain.reviewPath });
    // Validator must fail closed → treat as QUARANTINE / refuse recommend.
    assert.notEqual(
      menu.status,
      0,
      'unverifiable/free-form restrictions must fail closed (QUARANTINE)',
    );
  });
});

test('AT-B5 testing run-scope + failure/vacuous reports; routine passes omitted', () => {
  withRepo((target) => {
    createRepoFixture('ui-less-library', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {
      'testing.unit.test-case-generation': 'minimal',
      'testing.e2e.browser-automation': 'minimal',
    });
    const planned = plan(target, { review: reviewPath });
    assertSubcommandAvailable(planned, 'plan');
    assertSubcommandAvailable(
      apply(target, { review: reviewPath, plan: planned.outPath }),
      'apply',
    );

    const diffRun = check(target, { scope: 'diff' });
    assertSubcommandAvailable(diffRun, 'check');
    const repoRun = check(target, { scope: 'repo' });
    assertSubcommandAvailable(repoRun, 'check');

    const reportsDir = path.join(target, 'reports', 'rig');
    assert.ok(fs.existsSync(reportsDir), 'reports/rig must exist for actionable outcomes');
    const reports = fs
      .readdirSync(reportsDir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => readJson(path.join(reportsDir, f)));
    for (const report of reports) {
      assert.ok(
        ['failed', 'vacuous', 'coverage_gap'].includes(report.status),
        `routine passes must be omitted; got status=${report.status}`,
      );
      assert.ok(report.service_id, 'report must name service_id');
      assert.ok(report.reason || report.summary || report.fix_context, 'report needs fix context');
    }
    assert.ok(
      reports.some((r) => r.status === 'vacuous'),
      'UI-less E2E must produce a vacuous report',
    );
  });
});
