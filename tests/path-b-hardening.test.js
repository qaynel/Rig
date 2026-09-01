const { describe, it } = require('node:test');
const assert = require('node:assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('Path B oracle documentation consistency', () => {
  it('wiki files should not contain "awaiting signature" text when oracle is verified green', () => {
    // Verify that check-advanced-spec.js exits 0 (oracle is signed)
    let oracleVerified = false;
    let oracleOutput = '';
    try {
      oracleOutput = execSync('node scripts/check-advanced-spec.js 2>&1', {
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      // Check that output contains "Oracle verified" and doesn't error
      oracleVerified = oracleOutput.includes('Oracle verified');
    } catch (e) {
      // If the script errors, the oracle is not verified
      oracleVerified = false;
      oracleOutput = e.stdout || e.message;
    }

    assert(oracleVerified, `Oracle verification check should pass (node scripts/check-advanced-spec.js should exit 0). Output: ${oracleOutput}`);

    // Check wiki/gate2/technical-spec.md for divergent status text.
    // Note: wiki/gate1/acceptance.md is part of the oracle signature and cannot be modified
    // without re-signing, so it is excluded from this check. Only update technical-spec.md
    // which is not part of the oracle message digest.
    const wikiFileToCheck = 'wiki/gate2/technical-spec.md';

    const divergentPattern = /(awaiting.*signature|amendment.*red|not yet signed|pending.{0,20}(?:signature|sign|human))/i;

    const fullPath = path.join(process.cwd(), wikiFileToCheck);
    const content = fs.readFileSync(fullPath, 'utf-8');

    const matches = content.match(divergentPattern);
    assert(
      !matches,
      `File ${wikiFileToCheck} should not contain "${matches ? matches[0] : ''}" when oracle is verified. ` +
      `Found match: ${matches ? matches[0] : 'none'}. ` +
      `This indicates the wiki has not been updated to reflect the signed oracle state.`
    );
  });
});

describe('Task 2 — single playbook write per install mode', () => {
  const h = require('./helpers/path-b');
  const PLAYBOOK_DEST = '.rig/skills/onboarding/SKILL.md';
  const MANIFEST_REL = '.rig/install-manifest.jsonl';

  function readJournal(target) {
    const manifest = path.join(target, MANIFEST_REL);
    if (!fs.existsSync(manifest)) return [];
    return fs.readFileSync(manifest, 'utf-8')
      .split('\n')
      .flatMap((line) => {
        try { return line.trim() ? [JSON.parse(line)] : []; } catch { return []; }
      });
  }

  it('adaptive install writes exactly one applied journal record for PLAYBOOK_DEST', async () => {
    await h.withRepo(async (target) => {
      h.installRuntime(target, ['codex']);
      const records = readJournal(target);
      const applied = records.filter((r) => r.path === PLAYBOOK_DEST && r.state === 'applied');
      assert.equal(
        applied.length,
        1,
        `Expected exactly 1 applied journal record for ${PLAYBOOK_DEST}, got ${applied.length}. ` +
        `Double-write defect: installation must not write the wrapper then overwrite with the full playbook.`,
      );
    });
  });

  it('legacy install writes the wrapper and does not write the full playbook', async () => {
    await h.withRepo(async (target) => {
      const { runPayload } = require(path.join(h.root, 'rig', 'lib', 'payload.js'));
      runPayload(target, ['codex'], { activeDelivery: false });
      const wrapperContent = fs.readFileSync(
        path.join(h.root, 'rig/tier-1/skills/onboarding/SKILL.md'), 'utf-8',
      );
      const playbookContent = fs.readFileSync(
        path.join(h.root, 'rig/tier-1/skills/onboarding/playbook.md'), 'utf-8',
      );
      const written = fs.readFileSync(path.join(target, PLAYBOOK_DEST), 'utf-8');
      assert.notEqual(wrapperContent, playbookContent, 'Test precondition: wrapper and playbook must have different content');
      assert.equal(written, wrapperContent, 'Legacy install must write the wrapper SKILL.md, not the full playbook');
    });
  });
});

describe('Task 3 — instruction-only hosts see only 8 mandatory skills after adaptive install', () => {
  const h = require('./helpers/path-b');
  const path = require('path');

  // The 8 mandatory skills installed to .rig/skills/ for instruction-only hosts.
  // 7 are tier-1 phase skills gated by instruction_only_selected; 1 is the
  // adaptive-mode onboarding playbook gated by active_delivery.
  const MANDATORY_SKILLS = [
    'grilling', 'product-design', 'implementation', 'execution',
    'tdd', 'debugging', 'code-review', 'onboarding',
  ];

  // Instruction-only hosts: rely on .rig/skills/ as their Rig-managed discovery
  // path. opencode and devin have native skill surfaces but Rig does not write
  // to those paths, so they fall back to .rig/skills/ too.
  const INSTRUCTION_ONLY_HOSTS = ['cursor', 'copilot', 'opencode', 'devin'];

  function skillDirs(target) {
    const skillsRoot = path.join(target, '.rig', 'skills');
    if (!fs.existsSync(skillsRoot)) return [];
    return fs.readdirSync(skillsRoot, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
  }

  for (const host of INSTRUCTION_ONLY_HOSTS) {
    it(`${host}: adaptive install exposes exactly 8 mandatory skills (not 63)`, async () => {
      await h.withRepo(async (target) => {
        const { runPayload } = require(path.join(h.root, 'rig', 'lib', 'payload.js'));
        runPayload(target, [host], { activeDelivery: true });
        const discoverable = skillDirs(target);
        assert.equal(
          discoverable.length,
          8,
          `Expected exactly 8 discoverable skills for ${host}, got ${discoverable.length}: ${discoverable.sort().join(', ')}`,
        );
        for (const skill of MANDATORY_SKILLS) {
          assert.ok(
            discoverable.includes(skill),
            `${host}: mandatory skill "${skill}" must be in .rig/skills/`,
          );
        }
      });
    });
  }

  it('55-skill staged shelf is NOT inside .rig/skills/ after adaptive install', async () => {
    await h.withRepo(async (target) => {
      const { runPayload } = require(path.join(h.root, 'rig', 'lib', 'payload.js'));
      const { listVendoredSkills } = require(path.join(h.root, 'rig', 'lib', 'skills'));
      runPayload(target, ['cursor'], { activeDelivery: true });
      const discoverable = skillDirs(target);
      const vendored = listVendoredSkills();
      for (const skill of vendored) {
        assert.ok(
          !discoverable.includes(skill.name),
          `Optional vendored skill "${skill.name}" must not appear in .rig/skills/ before approval`,
        );
      }
      // The 55-skill shelf is staged under .rig/runtime for post-approval projection.
      const staged = path.join(target, '.rig', 'runtime', 'rig', 'catalog', 'skills');
      assert.ok(
        fs.existsSync(staged),
        'Staged shelf must be present at .rig/runtime/rig/catalog/skills/ for post-approval use',
      );
    });
  });
});

describe('Task 4 — strict state decoder', () => {
  const h = require('./helpers/path-b');

  function tamperState(target, transform) {
    const statePath = path.join(target, '.rig/state.json');
    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    transform(state);
    fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
  }

  it('unknown top-level key in state causes any onboarding action to throw a validation error', async () => {
    await h.withRepo(async (target) => {
      h.handle({ schema_version: 1, action: 'prepare', target });
      tamperState(target, (state) => { state.injected = 'evil'; });
      assert.throws(
        () => h.handle({ schema_version: 1, action: 'prepare', target }),
        /unknown key|invalid/i,
        'expected validation error for unknown top-level key',
      );
    }, { install: true });
  });

  it('invalid phase enum in state causes any onboarding action to throw a validation error', async () => {
    await h.withRepo(async (target) => {
      h.handle({ schema_version: 1, action: 'prepare', target });
      tamperState(target, (state) => { state.phase = 'hacked'; });
      assert.throws(
        () => h.handle({ schema_version: 1, action: 'prepare', target }),
        /phase|invalid/i,
        'expected validation error for invalid phase enum',
      );
    }, { install: true });
  });

  it('proposal present in prepared phase causes any onboarding action to throw a validation error', async () => {
    await h.withRepo(async (target) => {
      h.handle({ schema_version: 1, action: 'prepare', target });
      tamperState(target, (state) => {
        // Inject a non-null proposal into the prepared phase state
        state.proposal = { digest: 'a'.repeat(64), injected: true };
      });
      assert.throws(
        () => h.handle({ schema_version: 1, action: 'prepare', target }),
        /proposal|prepared|invalid/i,
        'expected validation error for proposal present in prepared phase',
      );
    }, { install: true });
  });

  it('applied proposal_digest present in initial state (revision 1, prepared) causes any action to throw', async () => {
    await h.withRepo(async (target) => {
      h.handle({ schema_version: 1, action: 'prepare', target });
      // Tamper: set applied.proposal_digest to a valid-format hex on the initial prepare (revision=1)
      tamperState(target, (state) => { state.applied.proposal_digest = 'a'.repeat(64); });
      assert.throws(
        () => h.handle({ schema_version: 1, action: 'prepare', target }),
        /applied|proposal_digest|initial|prepared|invalid/i,
        'expected validation error for applied.proposal_digest set in initial prepared state',
      );
    }, { install: true });
  });

  it('invalid digest format (uppercase hex) in applied proposal_digest causes any action to throw', async () => {
    await h.withRepo(async (target) => {
      // Need a post-apply state so proposal_digest can be non-null but with wrong format
      h.applyAndCheck(target);
      tamperState(target, (state) => {
        // Replace with uppercase hex — valid length but wrong character class
        state.applied.proposal_digest = 'A'.repeat(64);
      });
      assert.throws(
        () => h.handle({ schema_version: 1, action: 'prepare', target }),
        /digest|format|invalid|hex/i,
        'expected validation error for invalid digest format (uppercase hex)',
      );
    }, { install: true });
  });
});

describe('Task 5 — host registry scan roots', () => {
  const h5 = require('./helpers/path-b');
  const inventoryHarness = h5.api('inspect.js', 'inventoryHarness');

  function write(target, rel, body) {
    const file = path.join(target, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, typeof body === 'string' ? body : body);
    return file;
  }

  function skill(name) {
    return `---\nname: ${name}\ntitle: ${name} title\n---\n# ${name} heading\n\nExisting behavior.\n`;
  }

  // Matrix: each supported host with a scan root not covered by the legacy HARNESS_DIRS.
  // Files placed at these roots must appear in inventoryHarness output once the registry
  // drives the scan-root list (Task 5 fix). They FAIL until the fix is in place.
  const MATRIX = [
    { host: 'cursor',      root: '.cursor/skills',    file: 'cursor-skill/SKILL.md' },
    { host: 'copilot-cli', root: '.github/agents',    file: 'agent.md' },
    { host: 'opencode',    root: '.opencode/agents',  file: 'opencode-skill/SKILL.md' },
    { host: 'devin',       root: '.devin/skills',     file: 'devin-skill/SKILL.md' },
    { host: 'windsurf',    root: '.windsurf/skills',  file: 'windsurf-skill/SKILL.md' },
    { host: 'gemini',      root: '.gemini/extensions', file: 'gemini-skill/SKILL.md' },
    { host: 'swival',      root: '.swival/skills',    file: 'swival-skill/SKILL.md' },
  ];

  for (const { host, root: root5, file } of MATRIX) {
    const rel = `${root5}/${file}`;
    it(`${host}: file at ${rel} appears in inventory with correct host`, async () => {
      await h5.withRepo((target) => {
        write(target, rel, skill(host));
        const result = inventoryHarness(target);
        const found = result.entries.find((e) => e.path === rel);
        assert.ok(found, `Expected ${rel} to appear in inventory for host ${host}. Got entries: ${JSON.stringify(result.entries.map((e) => e.path))}`);
        assert.equal(found.host, host, `Expected host to be '${host}', got '${found.host}'`);
      });
    });
  }
});

describe('Task 6 — unapproved graft enumeration in check', () => {
  const h = require('./helpers/path-b');

  it('a structurally valid graft injected after apply is detected by check as unapproved-graft', async () => {
    await h.withRepo(async (target) => {
      // Complete the full apply+check cycle.
      const { checked } = h.applyAndCheck(target);
      assert.deepEqual(checked.hard_failures, [], 'expected clean check after apply');

      // Inject a structurally valid Rig graft into a file that was NOT part of
      // the approved proposal (CLAUDE.md does not exist in the fixture repo).
      const capability = 'testing.rogue-injection';
      const marker = [
        `<!-- rig:graft capability="${capability}" version="1" begin -->`,
        'This graft was injected after approval and is not in the applied state.',
        `<!-- rig:graft capability="${capability}" end -->`,
      ].join('\n') + '\n';
      fs.writeFileSync(path.join(target, 'CLAUDE.md'), marker);

      // Re-run check — it must detect the unapproved graft.
      const result = h.handle({
        schema_version: 1,
        action: 'check',
        target,
        expected_revision: checked.revision,
      });
      assert.ok(
        result.hard_failures.some((f) => /unapproved.*graft/i.test(f.code)),
        `expected a failure with code matching /unapproved.*graft/i; got: ${JSON.stringify(result.hard_failures)}`,
      );
    }, { install: true });
  });
});

describe('Task 7 — registry-driven dangling-reference scan', () => {
  const h = require('./helpers/path-b');

  // Each entry describes which host adapter file holds the pointer and which
  // installed file it points at. The old code had a hand-written list that
  // omitted .claude/skills/rig-onboarding/SKILL.md and .cursor/rules/rig.mdc.
  // The fix derives the scan set from SCAN_ROOTS + INSTRUCTION_FILE_HOSTS so
  // all installed host adapters are covered without a hand-maintained list.
  const MATRIX = [
    {
      host: 'cursor',
      // .cursor/rules/rig.mdc (SCAN_ROOTS 'rule' kind) references .rig/routing.md
      removeTarget: '.rig/routing.md',
      adapterFile: '.cursor/rules/rig.mdc',
    },
    {
      host: 'claude',
      // .claude/skills/rig-onboarding/SKILL.md (SCAN_ROOTS 'skill-dir' kind)
      // references .rig/skills/onboarding/SKILL.md. This adapter was MISSING from
      // the old hard-coded list — the key regression this task fixes.
      removeTarget: '.rig/skills/onboarding/SKILL.md',
      adapterFile: '.claude/skills/rig-onboarding/SKILL.md',
    },
    {
      host: 'codex',
      // .agents/skills/rig-onboarding/SKILL.md references .rig/skills/onboarding/SKILL.md.
      // This was in the old list but the new code derives it from the registry.
      removeTarget: '.rig/skills/onboarding/SKILL.md',
      adapterFile: '.agents/skills/rig-onboarding/SKILL.md',
    },
  ];

  for (const { host, removeTarget, adapterFile } of MATRIX) {
    it(`${host}: removing ${removeTarget} is reported as dangling-reference by check`, async () => {
      await h.withRepo(async (target) => {
        // Install for the specific host and complete the full apply+check cycle.
        h.installRuntime(target, [host]);
        const { checked } = h.applyAndCheck(target);
        assert.deepEqual(
          checked.hard_failures,
          [],
          `expected clean check after apply for ${host}; got: ${JSON.stringify(checked.hard_failures)}`,
        );

        // Verify the adapter file is present before deletion (precondition).
        assert.ok(
          fs.existsSync(path.join(target, adapterFile)),
          `precondition: adapter file ${adapterFile} must exist after ${host} install`,
        );

        // Remove the canonical pointer target. This leaves the adapter file with
        // a reference that no longer resolves — the check must catch it.
        fs.rmSync(path.join(target, removeTarget));

        // Re-run check — it must report a dangling-reference failure.
        const result = h.handle({
          schema_version: 1,
          action: 'check',
          target,
          expected_revision: checked.revision,
        });
        assert.ok(
          result.hard_failures.some((f) => f.code === 'dangling-reference'),
          `expected a dangling-reference failure after removing ${removeTarget} for host ${host}; ` +
          `got: ${JSON.stringify(result.hard_failures)}`,
        );
        // The failure path must name the removed target.
        assert.ok(
          result.hard_failures.some(
            (f) => f.code === 'dangling-reference' && f.path === removeTarget,
          ),
          `expected dangling-reference failure to name path "${removeTarget}"; ` +
          `got paths: ${JSON.stringify(result.hard_failures.filter((f) => f.code === 'dangling-reference').map((f) => f.path))}`,
        );
      });
    });
  }
});

describe('Task 8 — check re-inventories on every run', () => {
  const h = require('./helpers/path-b');

  it('post-approval edit to a tracked file triggers inventory-drift failure', async () => {
    await h.withRepo(async (target) => {
      // Complete the full apply+check cycle.
      const { checked } = h.applyAndCheck(target);
      assert.deepEqual(checked.hard_failures, [], `expected clean check after apply; got: ${JSON.stringify(checked.hard_failures)}`);

      // Append repository-owned content to AGENTS.md (a HARNESS_NAMES file tracked
      // in the inventory but not Rig-owned), simulating a post-approval external edit.
      const agentsPath = path.join(target, 'AGENTS.md');
      fs.appendFileSync(agentsPath, '\n## Post-approval edit\n\nThis section was added after approval.\n');

      // Re-run check — it must detect inventory drift.
      const result = h.handle({
        schema_version: 1,
        action: 'check',
        target,
        expected_revision: checked.revision,
      });
      assert.ok(
        result.hard_failures.some((f) => /inventory.?drift/i.test(f.code)),
        `expected a failure with code matching /inventory.?drift/i after external edit; got: ${JSON.stringify(result.hard_failures)}`,
      );
    }, { install: true });
  });

  it("Rig's own approved graft does not create false inventory-drift", async () => {
    await h.withRepo(async (target) => {
      // Complete the full apply+check cycle.  The graft written during apply
      // modifies AGENTS.md; the snapshot is taken post-apply so the graft is
      // already baked in and must not appear as drift on re-check.
      const { checked } = h.applyAndCheck(target);

      // The first check must be clean — no drift from the Rig graft.
      assert.ok(
        !checked.hard_failures.some((f) => /inventory.?drift/i.test(f.code)),
        `Rig's approved graft must not cause inventory-drift on first check; got: ${JSON.stringify(checked.hard_failures)}`,
      );

      // Re-run check without any external modifications — still no drift.
      const result = h.handle({
        schema_version: 1,
        action: 'check',
        target,
        expected_revision: checked.revision,
      });
      assert.ok(
        !result.hard_failures.some((f) => /inventory.?drift/i.test(f.code)),
        `second check after clean apply must have no inventory-drift; got: ${JSON.stringify(result.hard_failures)}`,
      );
    }, { install: true });
  });
});
