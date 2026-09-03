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

describe('Task 9 — multi-host projection deduplication', () => {
  const h = require('./helpers/path-b');

  it('two-host install records one projection entry per (skill, host) pair in applied.projections', async () => {
    await h.withRepo(async (target) => {
      // Install for both codex and claude so that installedSkillScopes returns two entries.
      h.installRuntime(target, ['codex', 'claude']);

      // Run the full prepare → propose → apply → check cycle.
      const { checked } = h.applyAndCheck(target);
      assert.deepEqual(checked.hard_failures, [], `expected clean check after two-host apply; got: ${JSON.stringify(checked.hard_failures)}`);

      // applied.projections must record one entry per (skill, host_scope, path) triple.
      // With codex + claude both installed, "qa" must appear twice — once per host.
      const state = h.readJson(path.join(target, '.rig', 'state.json'));
      const projections = state.applied.projections || [];
      const qaRows = projections.filter((r) => r.skill === 'qa');
      assert.equal(
        qaRows.length,
        2,
        `Expected 2 entries in applied.projections for skill "qa" (one per host), got ${qaRows.length}. ` +
        `projections: ${JSON.stringify(projections)}`,
      );
      const hostScopes = new Set(qaRows.map((r) => r.host_scope));
      assert.ok(hostScopes.has('codex'), 'expected a projections entry with host_scope "codex"');
      assert.ok(hostScopes.has('claude'), 'expected a projections entry with host_scope "claude"');
    });
  });

  it('deleting the Codex copy of a projected skill is detected by check via applied.projections', async () => {
    await h.withRepo(async (target) => {
      // Install for both codex and claude.
      h.installRuntime(target, ['codex', 'claude']);

      // Complete the full apply+check cycle.
      const { checked } = h.applyAndCheck(target);
      assert.deepEqual(checked.hard_failures, [], `expected clean check after two-host apply; got: ${JSON.stringify(checked.hard_failures)}`);

      // Find the Codex projection entry for "qa" in applied.projections.
      const state = h.readJson(path.join(target, '.rig', 'state.json'));
      const projections = state.applied.projections || [];
      const codexRow = projections.find((r) => r.skill === 'qa' && r.host_scope === 'codex');
      assert.ok(
        codexRow,
        `expected a Codex entry in applied.projections for skill "qa"; projections: ${JSON.stringify(projections)}`,
      );

      // Delete the Codex copy of the projected skill.
      fs.rmSync(path.join(target, codexRow.path));

      // Re-run check — the missing file must be reported as a failure.
      const result = h.handle({
        schema_version: 1,
        action: 'check',
        target,
        expected_revision: checked.revision,
      });
      assert.ok(
        result.hard_failures.length > 0,
        `expected at least one check failure after deleting Codex copy of "qa"; ` +
        `got clean result: ${JSON.stringify(result.hard_failures)}`,
      );
      assert.ok(
        result.hard_failures.some((f) => f.path === codexRow.path),
        `expected a failure naming "${codexRow.path}"; ` +
        `got: ${JSON.stringify(result.hard_failures)}`,
      );
    });
  });
});

describe('Task 5 (Issue 6) — journaled delete restores absence', () => {
  const h = require('./helpers/path-b');
  const { journalWriter, upsertGraftSection, removeGraftSection } = require(
    path.join(__dirname, '..', 'rig', 'lib', 'payload.js'),
  );
  const { uninstall } = require(path.join(__dirname, '..', 'rig', 'lib', 'lifecycle.js'));
  const CAPABILITY = 'demo.only';
  const MANIFEST_REL = '.rig/install-manifest.jsonl';

  function mutate(target, operation, args) {
    const writer = journalWriter(target);
    const result = operation(target, args, writer);
    writer.finish();
    return result;
  }

  function digestOf(target, rel) {
    const file = path.join(target, rel);
    if (!fs.existsSync(file)) return null;
    const bytes = fs.readFileSync(file);
    return bytes.length ? h.sha256(bytes) : null;
  }

  function journal(target) {
    const manifest = path.join(target, MANIFEST_REL);
    if (!fs.existsSync(manifest)) return [];
    return fs.readFileSync(manifest, 'utf8').split('\n').flatMap((line) => {
      try { return line.trim() ? [JSON.parse(line)] : []; } catch { return []; }
    });
  }

  it('AT-PB-hard delete — removing the last graft section unlinks a Rig-created file', async () => {
    await h.withRepo((target) => {
      // Arrange: the file exists only because of a Rig graft.
      mutate(target, upsertGraftSection, {
        path: '.rig/foo.md', capability: CAPABILITY, version: 1,
        content: 'Rig-created body.', expected_file_digest: null,
      });
      assert.ok(fs.existsSync(path.join(target, '.rig/foo.md')), 'precondition: graft created the file');

      // Act: drop the only graft.
      const removed = mutate(target, removeGraftSection, {
        path: '.rig/foo.md', capability: CAPABILITY,
        expected_file_digest: digestOf(target, '.rig/foo.md'),
      });

      // Assert: the file is gone (absence restored), not a zero-byte husk.
      assert.equal(removed.changed, true);
      assert.equal(removed.file_digest, null, 'a deleted file has no digest');
      assert.equal(
        fs.existsSync(path.join(target, '.rig/foo.md')),
        false,
        'a Rig-created file must be unlinked when its last managed section leaves, not left at zero bytes',
      );

      // ...and the journal records the deletion so uninstall/check can reason about it.
      const records = journal(target).filter((r) => r.path === '.rig/foo.md');
      const deletes = records.filter((r) => r.operation === 'delete_owned');
      assert.ok(deletes.length >= 1, `expected a delete_owned journal record; got: ${JSON.stringify(records)}`);
      const applied = deletes.find((r) => r.state === 'applied');
      assert.ok(applied, `expected an applied delete_owned record; got: ${JSON.stringify(deletes)}`);
      assert.equal(applied.desired_digest, null, 'the desired end state of a delete is absence');
      assert.equal(applied.digest, null);
      assert.ok(deletes.some((r) => r.state === 'pending'), 'the delete must be journalled pending before the unlink');
    });
  });

  it('AT-PB-hard delete — a pre-existing file is preserved even when Rig removes its section', async () => {
    await h.withRepo((target) => {
      fs.mkdirSync(path.join(target, 'docs'), { recursive: true });
      fs.writeFileSync(path.join(target, 'docs/README.md'), 'pre-existing\n');
      mutate(target, upsertGraftSection, {
        path: 'docs/README.md', capability: CAPABILITY, version: 1,
        content: 'Managed body.', expected_file_digest: h.sha256('pre-existing\n'),
      });
      mutate(target, removeGraftSection, {
        path: 'docs/README.md', capability: CAPABILITY,
        expected_file_digest: digestOf(target, 'docs/README.md'),
      });
      const content = fs.readFileSync(path.join(target, 'docs/README.md'), 'utf8');
      assert.equal(content.trim(), 'pre-existing');
    });
  });

  it('AT-PB-hard delete — a pre-existing empty file survives as an honestly-reported empty file', async () => {
    await h.withRepo((target) => {
      // The file was there before Rig touched it, but held nothing. Removing the
      // graft empties it again — absence-first means Rig must not delete it.
      fs.writeFileSync(path.join(target, 'PRE.md'), '');
      mutate(target, upsertGraftSection, {
        path: 'PRE.md', capability: CAPABILITY, version: 1,
        content: 'Managed body.', expected_file_digest: null,
      });
      const removed = mutate(target, removeGraftSection, {
        path: 'PRE.md', capability: CAPABILITY,
        expected_file_digest: digestOf(target, 'PRE.md'),
      });
      assert.ok(
        fs.existsSync(path.join(target, 'PRE.md')),
        'a file Rig did not create must never be unlinked',
      );
      assert.equal(fs.readFileSync(path.join(target, 'PRE.md'), 'utf8'), '');
      assert.equal(
        removed.file_digest,
        h.sha256(''),
        'an empty file that was preserved must be reported as an empty file, not as absence',
      );
      assert.equal(
        journal(target).filter((r) => r.path === 'PRE.md' && r.operation === 'delete_owned').length,
        0,
        'no delete may be journalled for a file Rig did not create',
      );
    });
  });

  it('AT-PB-hard delete — ownership survives several grafts stacked on one Rig-created file', async () => {
    await h.withRepo((target) => {
      // Every graft after the first writes a record with a non-null preimage.
      // Ownership must be read from the record that created the path, or the
      // common uninstall shape (stack grafts, then drop them) loses the delete.
      const rel = '.rig/foo.md';
      mutate(target, upsertGraftSection, {
        path: rel, capability: 'demo.a', version: 1,
        content: 'First body.', expected_file_digest: null,
      });
      mutate(target, upsertGraftSection, {
        path: rel, capability: 'demo.b', version: 1,
        content: 'Second body.', expected_file_digest: digestOf(target, rel),
      });
      mutate(target, removeGraftSection, {
        path: rel, capability: 'demo.a', expected_file_digest: digestOf(target, rel),
      });
      const removed = mutate(target, removeGraftSection, {
        path: rel, capability: 'demo.b', expected_file_digest: digestOf(target, rel),
      });
      assert.equal(removed.file_digest, null, 'a deleted file has no digest');
      assert.equal(
        fs.existsSync(path.join(target, rel)),
        false,
        'a Rig-created file must be unlinked however many grafts were stacked on it',
      );
    });
  });

  it('AT-PB-hard delete — the repository reclaims a path Rig deleted, and Rig stops owning it', async () => {
    await h.withRepo((target) => {
      const rel = '.rig/foo.md';
      mutate(target, upsertGraftSection, {
        path: rel, capability: CAPABILITY, version: 1,
        content: 'Rig body.', expected_file_digest: null,
      });
      mutate(target, removeGraftSection, {
        path: rel, capability: CAPABILITY, expected_file_digest: digestOf(target, rel),
      });
      // The repository writes its own file at the freed path, then asks Rig to
      // graft into it. Rig created the *old* file, not this one.
      fs.writeFileSync(path.join(target, rel), 'repository bytes\n');
      mutate(target, upsertGraftSection, {
        path: rel, capability: CAPABILITY, version: 1,
        content: 'Rig body.', expected_file_digest: h.sha256('repository bytes\n'),
      });
      const removed = mutate(target, removeGraftSection, {
        path: rel, capability: CAPABILITY, expected_file_digest: digestOf(target, rel),
      });
      assert.equal(removed.changed, true);
      assert.equal(
        fs.readFileSync(path.join(target, rel), 'utf8').trim(),
        'repository bytes',
        'a delete before the repository reclaimed the path must not license deleting its bytes',
      );
    });
  });

  it('AT-PB-hard delete — an interrupted delete whose unlink never ran is completed, not wedged', async () => {
    await h.withRepo((target) => {
      const rel = '.rig/foo.md';
      mutate(target, upsertGraftSection, {
        path: rel, capability: CAPABILITY, version: 1,
        content: 'Rig body.', expected_file_digest: null,
      });
      // Crash between the pending record and the unlink.
      const live = digestOf(target, rel);
      fs.appendFileSync(path.join(target, MANIFEST_REL), `${JSON.stringify({
        seq: 900, path: rel, ownership: 'delete_owned', operation: 'delete_owned',
        transaction_kind: 'install', state: 'pending', preimage_digest: live, desired_digest: null,
      })}\n`);

      const writer = journalWriter(target);
      const result = writer.remove(target, rel);
      writer.finish();
      assert.equal(result.removed, true);
      assert.equal(fs.existsSync(path.join(target, rel)), false, 'recovery must finish the unlink');
      assert.ok(
        journal(target).some((r) => r.path === rel && r.operation === 'delete_owned' && r.state === 'applied'),
        'recovery must journal the delete as applied',
      );
    });
  });

  it('AT-PB-hard delete — an interrupted delete does not block a later write to the same path', async () => {
    await h.withRepo((target) => {
      const rel = '.rig/foo.md';
      mutate(target, upsertGraftSection, {
        path: rel, capability: CAPABILITY, version: 1,
        content: 'Rig body.', expected_file_digest: null,
      });
      // Crash after the unlink but before the applied record was journalled.
      const live = digestOf(target, rel);
      fs.appendFileSync(path.join(target, MANIFEST_REL), `${JSON.stringify({
        seq: 900, path: rel, ownership: 'delete_owned', operation: 'delete_owned',
        transaction_kind: 'install', state: 'pending', preimage_digest: live, desired_digest: null,
      })}\n`);
      fs.unlinkSync(path.join(target, rel));

      mutate(target, upsertGraftSection, {
        path: rel, capability: CAPABILITY, version: 1,
        content: 'Rig body again.', expected_file_digest: null,
      });
      assert.ok(fs.existsSync(path.join(target, rel)), 'the path must not be wedged by the lost delete');
      const records = journal(target).filter((r) => r.path === rel);
      assert.ok(
        records.some((r) => r.operation === 'delete_owned' && r.state === 'applied'),
        'the interrupted delete must be resolved before the path is written again',
      );
      assert.equal(records.at(-1).state, 'applied');
      assert.equal(records.at(-1).ownership, 'graft_managed');
    });
  });

  // The production caller. `tests/path-b-graft.test.js` is frozen under the
  // gate-1 signature, so uninstall coverage for the delete lives here.
  it('AT-PB-hard delete — uninstall unlinks a file Rig created under several stacked grafts', async () => {
    await h.withRepo((target) => {
      // CLAUDE.md is absent from the fixture: it exists only because Rig grafts
      // into it. Uninstall strips the capabilities one at a time, so the last
      // removal decides ownership from a journal that already holds a preimage.
      const file = path.join(target, 'CLAUDE.md');
      mutate(target, upsertGraftSection, {
        path: 'CLAUDE.md', capability: 'demo.a', version: 1,
        content: 'First body.', expected_file_digest: null,
      });
      mutate(target, upsertGraftSection, {
        path: 'CLAUDE.md', capability: 'demo.b', version: 1,
        content: 'Second body.', expected_file_digest: digestOf(target, 'CLAUDE.md'),
      });

      const result = uninstall(target);
      assert.deepEqual(result.best_effort, []);
      assert.equal(result.status, 'removed');
      assert.equal(
        fs.existsSync(file),
        false,
        'uninstall must restore absence for a file Rig created, not leave a zero-byte husk',
      );
    });
  });

  it('AT-PB-hard delete — a journalled delete leaves nothing for uninstall to reclaim', async () => {
    await h.withRepo((target) => {
      const file = path.join(target, 'CLAUDE.md');
      mutate(target, upsertGraftSection, {
        path: 'CLAUDE.md', capability: CAPABILITY, version: 1,
        content: 'Rig body.', expected_file_digest: null,
      });
      mutate(target, removeGraftSection, {
        path: 'CLAUDE.md', capability: CAPABILITY,
        expected_file_digest: digestOf(target, 'CLAUDE.md'),
      });
      assert.equal(fs.existsSync(file), false, 'precondition: the journalled delete restored absence');

      // The newest record for the path is a delete: absence is already the end
      // state, so uninstall has nothing to reclaim and must not report the path
      // as unattributable — that would wedge uninstall in best_effort forever.
      const result = uninstall(target);
      assert.deepEqual(result.best_effort, []);
      assert.equal(result.status, 'removed');
      assert.equal(
        fs.existsSync(path.join(target, MANIFEST_REL)),
        false,
        'a fully reclaimed install drops its journal',
      );
    });
  });

  it('AT-PB-hard delete — uninstall reclaims a file left behind by an interrupted delete', async () => {
    await h.withRepo((target) => {
      const rel = '.rig/foo.md';
      const file = path.join(target, rel);
      mutate(target, upsertGraftSection, {
        path: rel, capability: CAPABILITY, version: 1,
        content: 'Rig body.', expected_file_digest: null,
      });
      // Crash between the pending delete record and the unlink: the newest
      // record for the path is a *pending* delete_owned, but the bytes are
      // still on disk. A pending delete looks exactly like an applied one on
      // desired_digest alone, so uninstall must not treat it as already clean.
      fs.appendFileSync(path.join(target, MANIFEST_REL), `${JSON.stringify({
        seq: 900, path: rel, ownership: 'delete_owned', operation: 'delete_owned',
        transaction_kind: 'install', state: 'pending',
        preimage_digest: digestOf(target, rel), desired_digest: null,
      })}\n`);
      assert.ok(fs.existsSync(file), 'precondition: the interrupted delete left the file on disk');

      const result = uninstall(target);
      assert.equal(
        fs.existsSync(file),
        false,
        'uninstall must reclaim a file an interrupted delete left behind, not report a clean removal over live bytes',
      );
      assert.deepEqual(result.best_effort, []);
      assert.equal(result.status, 'removed');
      assert.equal(
        fs.existsSync(path.join(target, MANIFEST_REL)),
        false,
        'a fully reclaimed install drops its journal',
      );
    });
  });
});

describe('Task 1 — authenticated approval receipts', () => {
  const h = require('./helpers/path-b');
  const { signApproval } = require('./helpers/path-b-approval');

  const applyWith = (target, proposed, approval) => h.handle({
    schema_version: 1,
    action: 'apply',
    target,
    expected_revision: proposed.revision,
    approval,
  });

  it('AT-PB-hard approval — fabricated verified:true is rejected', async () => {
    await h.withRepo(async (target) => {
      const { proposed } = h.prepareAndPropose(target);
      const fabricated = {
        schema_version: 1,
        kind: 'plan-approval',
        plan_digest: proposed.proposal_digest,
        approval: { method: 'external-sshsig', verified: true, identity: 'alice@example' },
      };
      assert.throws(
        () => applyWith(target, proposed, fabricated),
        /approval|signature|verifier/i,
      );
      assert.equal(h.readJson(path.join(target, '.rig/state.json')).phase, 'proposed');
    }, { install: true });
  });

  it('AT-PB-hard approval — a real signature is accepted and recorded with its fingerprint', async () => {
    await h.withRepo(async (target) => {
      const { proposed } = h.prepareAndPropose(target);
      const receipt = signApproval(target, proposed.proposal_digest);
      const applied = applyWith(target, proposed, receipt);
      assert.equal(applied.phase, 'applied');
      const { approval } = h.readJson(path.join(target, '.rig/state.json'));
      assert.equal(approval.method, 'external-sshsig');
      assert.equal(approval.identity, 'test@rig');
      assert.match(approval.fingerprint, /^SHA256:/);
      assert.equal(approval.proposal_digest, proposed.proposal_digest);
      assert.equal(approval.verified, undefined, 'the trust envelope must not carry a self-asserted boolean');
    }, { install: true });
  });

  it('AT-PB-hard approval — no allowed-signers → apply refuses', async () => {
    await h.withRepo(async (target) => {
      const { proposed } = h.prepareAndPropose(target);
      const receipt = signApproval(target, proposed.proposal_digest);
      fs.rmSync(path.join(target, '.rig/allowed-signers'), { force: true });
      assert.throws(
        () => applyWith(target, proposed, receipt),
        /allowed-signers|verifier/i,
      );
    }, { install: true });
  });

  it('AT-PB-hard approval — signature over wrong digest is rejected', async () => {
    await h.withRepo(async (target) => {
      const { proposed } = h.prepareAndPropose(target);
      // Signed correctly, but over another proposal's digest.
      const receipt = signApproval(target, `sha256:${'0'.repeat(64)}`);
      assert.throws(
        () => applyWith(target, proposed, receipt),
        /digest|signature/i,
      );
      // ...and the same signature relabelled with the live digest still fails,
      // because the verifier re-derives the message from the digest itself.
      const relabelled = { ...receipt, plan_digest: proposed.proposal_digest };
      assert.throws(
        () => applyWith(target, proposed, relabelled),
        /digest|signature|SSHSIG verification failed/i,
      );
    }, { install: true });
  });

  it('AT-PB-hard approval — wrong namespace is rejected', async () => {
    await h.withRepo(async (target) => {
      const { proposed } = h.prepareAndPropose(target);
      const receipt = signApproval(target, proposed.proposal_digest, { namespace: 'rig-policy-activation' });
      assert.throws(
        () => applyWith(target, proposed, receipt),
        /namespace|SSHSIG verification failed/i,
      );
    }, { install: true });
  });

  it('AT-PB-hard approval — an unlisted signer is rejected', async () => {
    await h.withRepo(async (target) => {
      const { proposed } = h.prepareAndPropose(target);
      // Someone must be listed or there is no allowed-signers file at all.
      signApproval(target, proposed.proposal_digest, { identity: 'listed@rig' });
      const receipt = signApproval(target, proposed.proposal_digest, {
        identity: 'stranger@rig',
        trustIdentity: false,
      });
      assert.throws(
        () => applyWith(target, proposed, receipt),
        /not allowed|identity|SSHSIG verification failed/i,
      );
    }, { install: true });
  });

  it('AT-PB-hard approval — host-native without provider is refused', async () => {
    await h.withRepo(async (target) => {
      const { proposed } = h.prepareAndPropose(target);
      const receipt = {
        schema_version: 1,
        kind: 'plan-approval',
        plan_digest: proposed.proposal_digest,
        approval: { method: 'host-native', attestation: 'opaque-blob' },
      };
      assert.throws(
        () => applyWith(target, proposed, receipt),
        /host-native|no verifier|not configured/i,
      );
    }, { install: true });
  });

  it('AT-PB-hard approval — the installer ships an allowed-signers template and never the live file', async () => {
    await h.withRepo(async (target) => {
      h.installRuntime(target, ['codex']);
      assert.ok(
        fs.existsSync(path.join(target, '.rig/allowed-signers.example.md')),
        'installer must ship .rig/allowed-signers.example.md',
      );
      assert.equal(
        fs.existsSync(path.join(target, '.rig/allowed-signers')),
        false,
        'installer must never write the live .rig/allowed-signers',
      );
    });
  });
});

describe('Task 3 (Issue 3) — reapplication removes obsolete artifacts', () => {
  const h = require('./helpers/path-b');
  const { signApproval } = require('./helpers/path-b-approval');

  const SCOPES = ['.agents/skills', '.claude/skills', '.rig/skills'];

  // `qa-only` is the smallest optional catalogue skill (SKILL.md and nothing
  // else), so a projection of it is exactly one file per host scope.
  function cycle(target, proposalOverrides) {
    const { proposed } = h.prepareAndPropose(target, { proposal: proposalOverrides });
    return h.handle({
      schema_version: 1,
      action: 'apply',
      target,
      expected_revision: proposed.revision,
      approval: signApproval(target, proposed.proposal_digest),
    });
  }

  function state(target) {
    return h.readJson(path.join(target, '.rig/state.json'));
  }

  it('AT-PB-hard reapply — obsolete skill projection is removed', async () => {
    await h.withRepo(async (target) => {
      cycle(target, { selected_skills: ['qa-only'] });
      const projected = state(target).applied.projections
        .filter((row) => row.skill === 'qa-only');
      assert.ok(projected.length, 'precondition: qa-only was projected');
      for (const row of projected) {
        assert.ok(fs.existsSync(path.join(target, row.path)), `precondition: ${row.path} exists`);
      }

      cycle(target, { selected_skills: [] });

      assert.equal(state(target).applied.projections.length, 0);
      for (const scope of SCOPES) {
        assert.equal(
          fs.existsSync(path.join(target, scope, 'rig-qa-only')),
          false,
          `stale projection remained under ${scope}`,
        );
      }
    }, { install: true });
  });

  it('AT-PB-hard reapply — user-edited Rig-owned artifact is preserved and reported', async () => {
    await h.withRepo(async (target) => {
      cycle(target, { selected_skills: ['qa-only'] });
      const projPath = state(target).applied.projections
        .find((row) => row.skill === 'qa-only').path;
      fs.appendFileSync(path.join(target, projPath), '\n<!-- human edit -->\n');

      const result = cycle(target, { selected_skills: [] });

      assert.ok(
        fs.existsSync(path.join(target, projPath)),
        'edited file must be preserved',
      );
      assert.ok(
        result.warnings?.some((w) => /unreconciled|hand-edited/i.test(w.detail)),
        `expected unreconciled warning, got ${JSON.stringify(result.warnings)}`,
      );
      assert.ok(
        (state(target).applied.unreconciled || []).some((u) => u.path === projPath),
        'the unreconciled artifact must be recorded in state so check keeps flagging it',
      );
    }, { install: true });
  });

  it('AT-PB-hard reapply — obsolete graft section is removed from the host file', async () => {
    await h.withRepo(async (target) => {
      cycle(target, { selected_skills: [] });
      const instructions = path.join(target, 'AGENTS.md');
      assert.match(
        fs.readFileSync(instructions, 'utf8'),
        /rig:graft capability="testing\.web-quality-assurance"/,
        'precondition: the graft landed in AGENTS.md',
      );

      cycle(target, { selected_skills: [], grafts: [], capabilities: [] });

      assert.doesNotMatch(
        fs.readFileSync(instructions, 'utf8'),
        /rig:graft capability="testing\.web-quality-assurance"/,
        'an unproposed graft section must not survive reapplication',
      );
      assert.equal(state(target).applied.grafts.length, 0);
      assert.match(
        fs.readFileSync(instructions, 'utf8'),
        /Keep repository-owned guidance/,
        'repository-owned prose must survive the graft removal',
      );
    }, { install: true });
  });

  it('AT-PB-hard reapply — a core skill projection is never deleted by apply', async () => {
    await h.withRepo(async (target) => {
      cycle(target, { selected_skills: ['rig-debugging'] });
      const row = state(target).applied.projections
        .find((entry) => entry.skill === 'rig-debugging');
      assert.ok(row, 'precondition: the core skill was recorded as a projection');

      cycle(target, { selected_skills: [] });

      assert.ok(
        fs.existsSync(path.join(target, row.path)),
        `installer-owned core skill ${row.path} must survive deselection`,
      );
    }, { install: true });
  });
});

describe('Task 4 (Issue 4) — journal-aware preflight resume', () => {
  const h = require('./helpers/path-b');
  const { signApproval } = require('./helpers/path-b-approval');
  const { crashAfter } = require('./helpers/path-b-crash');

  function state(target) {
    return h.readJson(path.join(target, '.rig/state.json'));
  }

  // Every interruption point in a journalled write, aimed twice: once at the
  // first skill projection (the owned-file path) and once at AGENTS.md (the
  // graft path), because the two preflights are separate gates.
  const CASES = [
    ['pending journal record but before the disk write', 'pending', {}],
    ['the disk write but before the applied record', 'write', {}],
    ['the applied record but before the state advance', 'applied', {}],
    ['the graft pending record but before the disk write', 'pending', { match: 'AGENTS.md' }],
    ['the graft disk write but before its applied record', 'write', { match: 'AGENTS.md' }],
    ['the graft applied record but before the state advance', 'applied', { match: 'AGENTS.md' }],
  ];

  for (const [label, stage, options] of CASES) {
    it(`AT-PB-hard resume — crash after ${label} replays cleanly`, async () => {
      await h.withRepo(async (target) => {
        const { proposed } = h.prepareAndPropose(target);
        const applyOnce = () => h.handle({
          schema_version: 1,
          action: 'apply',
          target,
          expected_revision: proposed.revision,
          approval: signApproval(target, proposed.proposal_digest),
        });

        crashAfter(target, stage, applyOnce, options);
        assert.strictEqual(
          state(target).phase,
          'proposed',
          'an interrupted apply must not advance onboarding state',
        );

        const applied = applyOnce();
        assert.strictEqual(applied.phase, 'applied');

        const checked = h.handle({
          schema_version: 1, action: 'check', target, expected_revision: applied.revision,
        });
        assert.deepStrictEqual(
          checked.hard_failures || [],
          [],
          'the resumed install must reconcile cleanly',
        );
        assert.strictEqual(state(target).phase, 'checked');

        // A resume that silently left the interrupted record pending would keep
        // the journal claiming an unfinished write that has in fact landed.
        const journal = fs.readFileSync(path.join(target, '.rig/install-manifest.jsonl'), 'utf8')
          .split('\n').filter(Boolean).map((line) => JSON.parse(line));
        const stillPending = new Map();
        for (const record of journal) {
          if (!record.path) continue;
          stillPending.set(record.path, record.state);
        }
        assert.deepStrictEqual(
          [...stillPending].filter(([, value]) => value !== 'applied'),
          [],
          'no journalled path may be left pending once the install completes',
        );
        assert.strictEqual(journal.at(-1).complete, true, 'the journal transaction must be closed');
      }, { install: true });
    });
  }
});

describe('Task 2 (Issue 2) — approved skill bytes are bound end-to-end', () => {
  const h = require('./helpers/path-b');
  const { signApproval } = require('./helpers/path-b-approval');

  // The shelf copy the projection reads from: the installed runtime mirrors the
  // repository shelf under `.rig/runtime/rig/...`, so the catalogue row's
  // `source_rel` locates it without a second hard-coded path table.
  function stagedSkillPath(target, id) {
    const catalog = h.readJson(path.join(target, '.rig/catalog.json'));
    const row = catalog.skills.find((skill) => skill.id === id || skill.name === id);
    assert.ok(row, `unknown catalogue skill "${id}"`);
    return path.dirname(path.join(target, '.rig/runtime/rig', row.source_rel.slice('rig/'.length)));
  }

  function state(target) {
    return h.readJson(path.join(target, '.rig/state.json'));
  }

  it('AT-PB-hard binding — the proposal freezes a tree and projected digest per selected skill', async () => {
    await h.withRepo(async (target) => {
      h.prepareAndPropose(target);
      const catalog = h.readJson(path.join(target, '.rig/catalog.json'));
      const bindings = state(target).proposal.skill_bindings;
      assert.deepEqual(bindings.map(({ id }) => id), ['qa']);
      for (const binding of bindings) {
        const row = catalog.skills.find((skill) => skill.id === binding.id);
        assert.match(row.tree_digest, /^[0-9a-f]{64}$/, 'catalogue rows must carry a tree digest');
        assert.equal(binding.tree_digest, row.tree_digest);
        assert.match(binding.projected_digest, /^[0-9a-f]{64}$/);
      }
    }, { install: true });
  });

  it('AT-PB-hard binding — post-approval edit to staged skill source is rejected at apply', async () => {
    await h.withRepo(async (target) => {
      const { proposed } = h.prepareAndPropose(target);
      const receipt = signApproval(target, proposed.proposal_digest);
      fs.appendFileSync(path.join(stagedSkillPath(target, 'qa'), 'SKILL.md'), '\n<!-- tampered -->\n');
      assert.throws(
        () => h.handle({
          schema_version: 1,
          action: 'apply',
          target,
          expected_revision: proposed.revision,
          approval: receipt,
        }),
        /projected_digest|tree_digest|stale proposal/i,
      );
    }, { install: true });
  });

  it('AT-PB-hard binding — post-apply edit to projected bytes fails check', async () => {
    await h.withRepo(async (target) => {
      const { proposed } = h.prepareAndPropose(target);
      const applied = h.handle({
        schema_version: 1,
        action: 'apply',
        target,
        expected_revision: proposed.revision,
        approval: signApproval(target, proposed.proposal_digest),
      });
      const row = state(target).applied.projections.find((entry) => entry.skill === 'qa');
      assert.ok(row, 'precondition: qa was projected');
      fs.appendFileSync(path.join(target, row.path), '\n<!-- external edit -->\n');

      const result = h.handle({
        schema_version: 1,
        action: 'check',
        target,
        expected_revision: applied.revision,
      });
      assert.ok(
        result.hard_failures?.some((failure) => /projected bytes/i.test(failure.detail)),
        `expected a projected-digest failure, got ${JSON.stringify(result.hard_failures)}`,
      );
    }, { install: true });
  });

  it('AT-PB-hard binding — a sibling file added to a projected skill fails check', async () => {
    await h.withRepo(async (target) => {
      const { proposed } = h.prepareAndPropose(target);
      const applied = h.handle({
        schema_version: 1,
        action: 'apply',
        target,
        expected_revision: proposed.revision,
        approval: signApproval(target, proposed.proposal_digest),
      });
      const row = state(target).applied.projections.find((entry) => entry.skill === 'qa');
      fs.writeFileSync(path.join(target, path.dirname(row.path), 'SMUGGLED.md'), '# not approved\n');

      const result = h.handle({
        schema_version: 1,
        action: 'check',
        target,
        expected_revision: applied.revision,
      });
      assert.ok(
        result.hard_failures?.some((failure) => /projected bytes/i.test(failure.detail)),
        `expected a projected-digest failure, got ${JSON.stringify(result.hard_failures)}`,
      );
    }, { install: true });
  });

  it('AT-PB-hard binding — duplicate approved binding rows are rejected', async () => {
    await h.withRepo(async (target) => {
      const { proposed } = h.prepareAndPropose(target);
      const statePath = path.join(target, '.rig/state.json');
      const persisted = h.readJson(statePath);
      persisted.proposal.skill_bindings.push({ ...persisted.proposal.skill_bindings[0] });
      // F1 (AT-HD-1) now rejects any proposal body that no longer hashes to
      // its stored digest, closing the post-signing-tamper path this test
      // used to take. Model the duplicate as part of what got signed instead
      // — a malicious or buggy propose could still produce a self-consistent
      // digest with a duplicate binding row baked in — so verifySkillBindings'
      // own duplicate-row rejection is what's actually under test here, not F1.
      const { proposalBodyDigest } = require('../rig/lib/onboarding-state');
      persisted.proposal.digest = proposalBodyDigest(persisted.proposal);
      h.writeJson(statePath, persisted);

      assert.throws(
        () => h.handle({
          schema_version: 1,
          action: 'apply',
          target,
          expected_revision: proposed.revision,
          approval: signApproval(target, persisted.proposal.digest),
        }),
        /duplicate.*binding|binding.*duplicate/i,
      );
    }, { install: true });
  });
});

describe('Task 6 (Issue 5) — duplicate declared skill names fail closed', () => {
  const h = require('./helpers/path-b');

  it('AT-PB-hard dupname — catalogue generation rejects duplicate declared names', () => {
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
});

describe('Issue N (interrupt window) — crash after writer.finish() but before writeState()', () => {
  const h = require('./helpers/path-b');
  const { signApproval } = require('./helpers/path-b-approval');

  it('AT-PB-hard interrupt-window — re-apply after journal-closed crash must succeed without stale-preimage failure', async () => {
    await h.withRepo(async (target) => {
      const { proposed } = h.prepareAndPropose(target);

      // Simulate a crash AFTER writer.finish() (journal complete: true) but BEFORE
      // writeState() commits. atomicWrite opens <file>.tmp exclusively, writes the
      // new bytes, then renameSync's it onto the target — the rename is the
      // commit point, so we intercept the rename onto state.json specifically to
      // leave state at phase:"proposed" while all payload bytes and the closed
      // journal are already on disk (the .tmp file is left behind, matching a
      // real crash between the write and the rename).
      const realRenameSync = fs.renameSync;
      let crashed = false;
      fs.renameSync = (oldPath, newPath) => {
        if (!crashed && typeof newPath === 'string' && path.basename(newPath) === 'state.json') {
          crashed = true;
          throw new Error('simulated interrupt-window crash');
        }
        return realRenameSync(oldPath, newPath);
      };

      try {
        h.handle({
          schema_version: 1,
          action: 'apply',
          target,
          expected_revision: proposed.revision,
          approval: signApproval(target, proposed.proposal_digest),
        });
      } catch (e) {
        if (!e.message.includes('simulated interrupt-window crash')) throw e;
      } finally {
        fs.renameSync = realRenameSync;
      }

      assert.ok(crashed, 'test precondition: crash must have fired');
      const stateAfterCrash = h.readJson(path.join(target, '.rig/state.json'));
      assert.equal(stateAfterCrash.phase, 'proposed',
        'an interrupted apply must not have advanced state');

      // The crash left state.json.tmp fully written but not yet renamed onto
      // state.json. F2 (AT-HD-2) makes atomicWrite's temp open exclusive
      // (O_EXCL), so an immediate re-apply must refuse rather than silently
      // reuse or overwrite the stale temp — see the spec's F2 risk note: "If
      // the operator hits a legitimate stale .tmp from a prior crash, the
      // error must give them the exact rm command." Confirm that refusal,
      // then simulate the operator's remediation before asserting recovery.
      assert.throws(
        () => h.handle({
          schema_version: 1,
          action: 'apply',
          target,
          expected_revision: proposed.revision,
          approval: signApproval(target, proposed.proposal_digest),
        }),
        /already exists.*EEXIST.*remove|remove.*state\.json\.tmp/is,
        'immediate re-apply must refuse via the F2 stale-temp guard, not silently resume',
      );
      fs.unlinkSync(path.join(target, '.rig', 'state.json.tmp'));

      // Re-apply with the same approval receipt now that the operator has
      // cleared the stale temp. Before the interrupt-window fix this threw
      // with "stale preimage" because the closed journal prevented
      // journalResumeDigest from recognising Rig's own previous writes.
      let reapplyError = null;
      let applied = null;
      try {
        applied = h.handle({
          schema_version: 1,
          action: 'apply',
          target,
          expected_revision: proposed.revision,
          approval: signApproval(target, proposed.proposal_digest),
        });
      } catch (e) {
        reapplyError = e;
      }

      assert.equal(
        reapplyError,
        null,
        `re-apply after clearing the stale temp must not throw; got: ${reapplyError?.message}`,
      );
      assert.equal(applied?.phase, 'applied', 're-apply must advance to applied');

      const checked = h.handle({
        schema_version: 1,
        action: 'check',
        target,
        expected_revision: applied.revision,
      });
      assert.deepEqual(
        checked.hard_failures,
        [],
        `check after recovered interrupt-window crash must pass cleanly; got: ${JSON.stringify(checked.hard_failures)}`,
      );
    }, { install: true });
  });
});

describe('Issue N (sibling-file reconcile) — skill stays selected but loses a sibling across catalog versions', () => {
  const h = require('./helpers/path-b');
  const { signApproval } = require('./helpers/path-b-approval');

  function applyWith(target, proposed) {
    return h.handle({
      schema_version: 1,
      action: 'apply',
      target,
      expected_revision: proposed.revision,
      approval: signApproval(target, proposed.proposal_digest),
    });
  }

  it('AT-PB-hard sibling-reconcile — orphan sibling from previous catalog version is removed when skill stays selected', async () => {
    await h.withRepo(async (target) => {
      // Find the staged qa skill directory from the installed catalog.
      const catalog = h.readJson(path.join(target, '.rig/catalog.json'));
      const qaEntry = catalog.skills.find((s) => s.name === 'qa' || s.id === 'qa');
      assert.ok(qaEntry, 'precondition: qa skill must be in the installed catalog');
      const stagedSkillDir = path.dirname(
        path.join(target, '.rig/runtime/rig', qaEntry.source_rel.slice('rig/'.length)),
      );
      assert.ok(fs.existsSync(stagedSkillDir), `precondition: staged qa dir must exist at ${stagedSkillDir}`);

      // Cycle 1: add EXTRA.md to the staged shelf so it gets projected alongside SKILL.md.
      const extraStaged = path.join(stagedSkillDir, 'EXTRA.md');
      fs.writeFileSync(extraStaged, '# Extra file from older catalog version\n');

      const { proposed: proposed1 } = h.prepareAndPropose(target);
      applyWith(target, proposed1);

      // Verify EXTRA.md was projected to at least one host directory.
      const state1 = h.readJson(path.join(target, '.rig/state.json'));
      const qaSkillMd = state1.applied.projections.find((r) => r.skill === 'qa' || r.skill === qaEntry.id);
      assert.ok(qaSkillMd, 'precondition: qa projection must be recorded');
      const qaProjectedDir = path.dirname(path.join(target, qaSkillMd.path));
      const extraProjected = path.join(qaProjectedDir, 'EXTRA.md');
      assert.ok(fs.existsSync(extraProjected),
        `precondition: EXTRA.md must have been projected to ${extraProjected}`);

      // EXTRA.md is on disk and in the journal, but NOT in applied.projections
      // (planSkillProjections only records SKILL.md paths — the sibling is invisible
      // to the removal ledger).
      assert.ok(
        !state1.applied.projections.some((r) => r.path.endsWith('/EXTRA.md')),
        'precondition: EXTRA.md must not be in applied.projections (this is the gap the bug exposes)',
      );

      // Cycle 2: remove EXTRA.md from the staged shelf (simulating a catalog version
      // that no longer ships the sibling). The skill itself stays selected.
      fs.rmSync(extraStaged);

      const { proposed: proposed2 } = h.prepareAndPropose(target);
      applyWith(target, proposed2);

      // After the fix: planRemovals runs the sibling sweep even when SKILL.md is
      // still desired, finds EXTRA.md via liveFilesUnder, matches the journal record
      // from cycle 1, and removes it.
      assert.equal(
        fs.existsSync(extraProjected),
        false,
        `stale sibling ${extraProjected} must be removed during reapply when skill stays selected`,
      );

      // check must pass cleanly — no state-incomplete from projected_digest mismatch.
      const state2 = h.readJson(path.join(target, '.rig/state.json'));
      const checked = h.handle({
        schema_version: 1,
        action: 'check',
        target,
        expected_revision: state2.revision,
      });
      assert.deepEqual(
        checked.hard_failures,
        [],
        `check must pass after sibling removal; got: ${JSON.stringify(checked.hard_failures)}`,
      );
    }, { install: true });
  });
});
