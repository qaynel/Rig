'use strict';

// AT-HD-1 through AT-HD-8: adversarial oracle tests for the eight onboarding
// hardening findings. Every test here is expected to FAIL before implementation
// and PASS only when the finding is fixed. Do not change these test bodies to
// make them pass; fix the implementation instead.

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const h = require('./helpers/path-b');
const { signApproval } = require('./helpers/path-b-approval');

const root = path.join(__dirname, '..');

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

// ─── AT-HD-1: body swap after signing (F1) ───────────────────────────────────
// Root cause: apply trusts state.proposal.grafts / .owned_files / .selected_skills
// directly without re-deriving sha256(canonical(proposal_body)) and comparing to
// state.proposal.digest. An attacker who can write state.json replaces a graft's
// content + content_digest, leaves proposal.digest unchanged, and apply proceeds.
//
// Fix: before consuming state.proposal fields, recompute the canonical body hash
// and fail if it doesn't equal state.proposal.digest.

test('AT-HD-1 apply rejects a proposal whose body has been tampered post-signing', async () => {
  await h.withRepo((target) => {
    const { proposed } = h.prepareAndPropose(target);
    const stateFile = path.join(target, '.rig', 'state.json');
    const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    const approvalReceipt = signApproval(target, proposed.proposal_digest);

    // Mutate a graft's content inside the proposal. Update content_digest so per-row
    // validation passes, but leave proposal.digest pointing at the original body.
    if (state.proposal.grafts.length > 0) {
      const tampered = 'TAMPERED: injected malicious graft content';
      state.proposal.grafts[0].content = tampered;
      state.proposal.grafts[0].content_digest = sha256(tampered);
    } else {
      state.proposal.selected_skills.push('__malicious_skill__');
    }
    fs.writeFileSync(stateFile, `${JSON.stringify(state, null, 2)}\n`);

    assert.throws(
      () => h.handle({
        schema_version: 1,
        action: 'apply',
        target,
        expected_revision: proposed.revision,
        approval: approvalReceipt,
      }),
      (err) => /tampered post-signing.*digest mismatch/i.test(err.message),
      'apply must reject a proposal whose body hash does not match proposal.digest, naming the specific digest mismatch',
    );
  }, { install: true });
});

// ─── AT-HD-2: .tmp symlink TOCTOU (F2) ───────────────────────────────────────
// Root cause: atomicWrite validates the destination path but opens the sibling
// .tmp path with fs.writeFileSync, which follows pre-existing symlinks. An attacker
// creates <state.json>.tmp as a symlink pointing outside the repository before the
// write, and writeFileSync writes to that outside location.
//
// Fix: open the temp file with fs.openSync(temporary, 'wx', 0o600) (O_EXCL) which
// refuses if the path already exists — including as a symlink. The outside sentinel
// file must NOT be modified: if it is, the write went through before the error.

test('AT-HD-2 atomicWrite refuses to write through a .tmp symlink before any byte reaches the outside target, and recovers once the operator clears it', async () => {
  await h.withRepo((target) => {
    // Run prepare once to create .rig/
    h.handle({ schema_version: 1, action: 'prepare', target });

    // Place a symlink at the path atomicWrite will use for the next state write.
    const tmpPath = path.join(target, '.rig', 'state.json.tmp');
    const outsideTarget = path.join(require('node:os').tmpdir(), `rig-hd2-sentinel-${process.pid}`);
    const SENTINEL = 'sentinel-unchanged';
    fs.writeFileSync(outsideTarget, SENTINEL);
    try {
      fs.symlinkSync(outsideTarget, tmpPath);

      // propose triggers writeState → atomicWrite. With the symlink in place,
      // an O_EXCL open on the .tmp path must refuse immediately, before any
      // byte reaches outsideTarget, and the failure must be diagnosable: an
      // exception whose message identifies the exclusive-create failure and
      // tells the operator which stale path to remove — not any exception
      // `propose` happens to throw for an unrelated reason.
      const state = JSON.parse(fs.readFileSync(path.join(target, '.rig', 'state.json'), 'utf8'));
      const attemptPropose = () => h.handle({
        schema_version: 1,
        action: 'propose',
        target,
        expected_revision: state.revision,
        proposal: h.proposal(target, state),
        summary_markdown: h.summary(),
      });

      assert.throws(
        attemptPropose,
        (err) => /eexist|already exists/i.test(err.message) && /\.tmp\b|remove/i.test(err.message),
        'atomicWrite must throw an actionable message identifying the stale temp path, not swallow or genericize the exclusive-create failure',
      );

      // The critical assertion: the outside file must be unmodified — the
      // exclusive-create open must fail before any byte reaches the link target.
      assert.equal(
        fs.readFileSync(outsideTarget, 'utf8'),
        SENTINEL,
        'atomicWrite must not write any bytes to the outside symlink target; the write went through before the error',
      );

      // Recovery: an operator who removes the stale temp path must be able to
      // retry successfully. Never unlink-and-retry automatically — only prove
      // that manual remediation unblocks the next attempt.
      fs.unlinkSync(tmpPath);
      assert.doesNotThrow(attemptPropose, 'a retry after the operator removes the stale temp path must succeed');
    } finally {
      try { fs.unlinkSync(outsideTarget); } catch { /* ignore */ }
    }
  }, { install: true });
});

// ─── AT-HD-3: post-approval repo mutations (F3) ──────────────────────────────
// Root cause: apply only re-checks catalog_digest; it never re-derives a fresh
// inventoryHarness and compares against state.inventory.digest. A file added
// between propose and apply is silently baselined in the post-apply snapshot.
//
// Fix: at the top of apply, run inventoryHarness(target) and fail if
// digest !== state.inventory.digest.

test('AT-HD-3 apply detects a file added to the repository after proposal was signed', async () => {
  await h.withRepo((target) => {
    const { proposed } = h.prepareAndPropose(target);
    const approvalReceipt = signApproval(target, proposed.proposal_digest);

    // Add a new file after signing. It must be harness-visible for
    // inventoryHarness to observe it at all — inventoryHarness is a bounded
    // scan (HARNESS_NAMES + registry-driven SCAN_ROOTS), not a whole-repository
    // walk. CLAUDE.md is in HARNESS_NAMES and this fixture's proposal only
    // touches AGENTS.md, so CLAUDE.md is untouched by the approved plan.
    fs.writeFileSync(path.join(target, 'CLAUDE.md'), '# Injected after approval\n');

    // Snapshot the approved graft target before apply — refusal must precede
    // any mutation, not merely precede a successful return.
    const graftTarget = path.join(target, 'AGENTS.md');
    const beforeBytes = fs.readFileSync(graftTarget);

    assert.throws(
      () => h.handle({
        schema_version: 1,
        action: 'apply',
        target,
        expected_revision: proposed.revision,
        approval: approvalReceipt,
      }),
      (err) => /inventory|digest|stale|changed/i.test(err.message),
      'apply must reject when the repository inventory changed after proposal signing',
    );

    assert.deepEqual(
      fs.readFileSync(graftTarget),
      beforeBytes,
      'apply must refuse before mutating the approved graft target, not merely fail after writing it',
    );
  }, { install: true });
});

// ─── AT-HD-4: mixed-host instruction-only fallback (F4) ──────────────────────
// Root cause: installedSkillScopes collapses the per-host decision into one
// boolean over the entire install. When at least one native scope (Codex) is
// present, instruction-only is never added — even though another installed host
// (e.g. Cursor, Windsurf) has no native discovery path and needs it.
//
// Fix: accept the list of installed hosts; for each host emit either its native
// scope or instruction-only. Never collapse to a global empty-union guard.

test('AT-HD-4 apply projects selected skills into both native and instruction-only scopes with scope-correct names', async () => {
  await h.withRepo((target) => {
    // The target has Codex installed (native scope: .agents/skills/rig-<name>/)
    // alongside Cursor, which has no native discovery path and must receive
    // the instruction-only projection at .rig/skills/<name>/ — unprefixed,
    // per the router contract (rig-<name> maps to .rig/skills/<name>/SKILL.md
    // on instruction-only hosts; see rig/tier-1/routing.md). Select the
    // optional `qa` skill and the mandatory core skill (catalog id
    // `rig-debugging`) so both source kinds are exercised.
    const { checked } = h.applyAndCheck(target, {
      proposal: { selected_skills: ['qa', 'rig-debugging'] },
    });
    assert.deepEqual(checked.hard_failures, [], 'apply and check must both succeed for a valid mixed-host selection');

    const codexQa = path.join(target, '.agents', 'skills', 'rig-qa', 'SKILL.md');
    const instructionQa = path.join(target, '.rig', 'skills', 'qa', 'SKILL.md');
    const codexDebugging = path.join(target, '.agents', 'skills', 'rig-debugging', 'SKILL.md');
    const instructionDebugging = path.join(target, '.rig', 'skills', 'debugging', 'SKILL.md');

    assert.ok(fs.existsSync(codexQa), 'optional skill must be projected for the native Codex scope as rig-qa');
    assert.ok(fs.existsSync(instructionQa), 'optional skill must also be projected unprefixed into the instruction-only scope');
    assert.ok(fs.existsSync(codexDebugging), 'mandatory core skill must be projected for the native Codex scope as rig-debugging');
    assert.ok(fs.existsSync(instructionDebugging), 'mandatory core skill must be projected unprefixed into the instruction-only scope');

    const state = JSON.parse(fs.readFileSync(path.join(target, '.rig', 'state.json'), 'utf8'));
    const hostScopes = new Set(state.applied.projections.map((row) => row.host_scope));
    assert.ok(hostScopes.has('codex'), 'applied.projections must record the codex host scope');
    assert.ok(hostScopes.has('instruction-only'), 'applied.projections must record the instruction-only host scope');
  }, { install: true, hosts: ['codex', 'cursor'] });
});

// ─── AT-HD-5: version single source of truth (F5) ────────────────────────────
// Root cause: the release version appears independently in README.md (examples)
// and as the releaseTag default in skill-catalog.js. Neither references the
// other; drift is a matter of when, not if.
//
// Fix: derive version from one file (package.json or rig/manifest.json). Remove
// the hardcoded releaseTag default in buildSkillCatalog. Add a test (this one)
// that asserts README examples use the canonical version.

test('AT-HD-5 README version examples match package.json in every language edition; skill-catalog has no independent hardcoded default', () => {
  const { version } = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const tag = `v${version}`;

  for (const readmeName of ['README.md', 'README.es.md', 'README.ko.md']) {
    const readme = fs.readFileSync(path.join(root, readmeName), 'utf8');
    const versionMatches = [...readme.matchAll(/--version\s+(v[\d.]+)/g)].map((m) => m[1]);
    assert.ok(versionMatches.length > 0, `${readmeName} must include at least one --version example`);
    for (const found of versionMatches) {
      assert.equal(found, tag, `${readmeName} --version example "${found}" does not match package.json version "${tag}"`);
    }
  }

  const catalogSrc = fs.readFileSync(path.join(root, 'rig', 'lib', 'skill-catalog.js'), 'utf8');
  assert.doesNotMatch(
    catalogSrc,
    /releaseTag\s*=\s*'v\d+\.\d+\.\d+'/,
    'buildSkillCatalog must not hardcode a releaseTag default; callers must pass the version from one source of truth',
  );
});

// ─── AT-HD-6: inventory check fails open (F6) ────────────────────────────────
// Root cause: inventoryDriftFailures wraps inventoryHarness in try { } catch { return []; }.
// An exception from the harness is silently treated as "no drift" instead of
// "verification broken."
//
// Fix: let the exception propagate (the outer check function wraps the catalogue
// load the same way; apply the same pattern here) OR push a hard_failure entry.
// Verification code must fail closed.

test('AT-HD-6 inventory drift check propagates harness errors rather than returning empty', async () => {
  // This test requires inventoryDriftFailures to be exported from onboarding-check.js.
  // After the fix, it must be exported so this assertion can call it directly.
  const checkModule = require('../rig/lib/onboarding-check.js');
  assert.equal(
    typeof checkModule.inventoryDriftFailures,
    'function',
    'inventoryDriftFailures must be exported from onboarding-check.js to allow direct testing',
  );

  // Construct a minimal applied state with an inventory snapshot.
  const state = {
    applied: {
      inventory_snapshot: { 'AGENTS.md': { kind: 'instruction', host: 'codex', bytes: 100, digest: 'a'.repeat(64) } },
    },
  };

  // Pass a target path designed to make inventoryHarness throw: it starts
  // with realpathOrNull(target), which returns null for a non-existent path,
  // and inventoryHarness raises exactly "inventory: target must exist" —
  // not an ENOENT from a lower-level fs call.
  const badTarget = path.join(require('node:os').tmpdir(), 'rig-hd6-nonexistent-repo');

  assert.throws(
    () => checkModule.inventoryDriftFailures(badTarget, state),
    /inventory:\s*target must exist/i,
    'inventoryDriftFailures must propagate the harness error when it throws, not return []',
  );
});

// ─── AT-HD-7: MCP text duplicates full response (F7) ─────────────────────────
// Root cause: both MCP handlers emit JSON.stringify({next_action, ...result}) in
// content[0].text, duplicating the full structuredContent. The text channel must
// carry a short human summary, not the full structured payload.
//
// Fix: render a one-line human summary (phase, next_action, hard-failure count)
// into content[0].text; keep the full response in structuredContent only.

test('AT-HD-7 MCP text output is a concise human summary, not a JSON copy of structuredContent', async () => {
  await h.withRepo(async (target) => {
    const installedServer = path.join(target, '.rig', 'runtime', 'rig-mcp', 'index.js');
    fs.symlinkSync(
      path.join(root, 'rig-mcp', 'node_modules'),
      path.join(target, '.rig', 'runtime', 'rig-mcp', 'node_modules'),
      'dir',
    );

    for (const server of [path.join(root, 'rig-mcp', 'index.js'), installedServer]) {
      const response = await h.withMcpClient(server, (client) => client.callTool({
        name: 'rig_onboarding',
        arguments: { schema_version: 1, action: 'prepare', target },
      }));
      const text = response.content[0].text;
      const result = response.structuredContent;

      assert.notEqual(text, JSON.stringify(result), 'MCP text must not duplicate structuredContent');
      assert.ok(text.length < 300, `MCP text is ${text.length} chars — expected a concise summary`);
      assert.ok(text.includes(result.phase), 'MCP text must name the current phase');
      assert.ok(text.includes(result.next_action), 'MCP text must name the next action');
    }
  }, { install: true });
});

// ─── AT-HD-8: wiki immutability policy reconciliation (F8) ───────────────────
// Root cause: reasoning/README.md declares traces "never edited," while
// wiki-maintenance/SKILL.md permits editing frontmatter fields. The user's ruling:
// trace bodies are immutable; frontmatter (status, topics, summary) is mutable
// metadata on an aggregate summary.
//
// Fix: update reasoning/README.md to state this distinction explicitly. The SKILL
// must not authorise body edits.

test('AT-HD-8 reasoning/README.md and wiki-maintenance/SKILL.md consistently define body-immutable, frontmatter-mutable traces', () => {
  const readmeText = fs.readFileSync(path.join(root, 'wiki', 'reasoning', 'README.md'), 'utf8');
  const skillText = fs.readFileSync(
    path.join(root, '.claude', 'skills', 'wiki-maintenance', 'SKILL.md'),
    'utf8',
  );

  // Test semantics, not forbidden English phrasing: assert what both documents
  // must positively say, not which substrings they must avoid. A negative
  // regex on a phrase (e.g. "rewrite ... content") can be tripped by prose
  // that states the *correct* rule, and can be satisfied by an unrelated
  // sentence that merely avoids the phrase without stating the rule.

  // Both documents must positively state that the trace body is immutable.
  assert.match(
    readmeText,
    /body[\s\S]{0,80}(?:immutable|not\s+edited|written\s+once|unchanged)/i,
    'wiki/reasoning/README.md must positively state that a trace body is immutable',
  );
  assert.match(
    skillText,
    /body[\s\S]{0,80}(?:immutable|not\s+(?:edit|modif)|unchanged)/i,
    '.claude/skills/wiki-maintenance/SKILL.md must positively state that a trace body is immutable',
  );

  // Both documents must positively state that frontmatter metadata is mutable.
  assert.match(
    readmeText,
    /frontmatter[\s\S]{0,120}mutable|mutable[\s\S]{0,120}frontmatter/i,
    'wiki/reasoning/README.md must positively state that frontmatter metadata is mutable',
  );
  assert.match(
    skillText,
    /frontmatter[\s\S]{0,120}mutable|mutable[\s\S]{0,120}frontmatter/i,
    '.claude/skills/wiki-maintenance/SKILL.md must positively state that frontmatter metadata is mutable',
  );

  // Each document must cross-cite the other by path so an editor of one is
  // nudged to check the other.
  assert.match(
    readmeText,
    /wiki-maintenance\/SKILL\.md/i,
    'wiki/reasoning/README.md must cross-cite .claude/skills/wiki-maintenance/SKILL.md',
  );
  assert.match(
    skillText,
    /(?:wiki\/)?reasoning\/README\.md/i,
    '.claude/skills/wiki-maintenance/SKILL.md must cross-cite wiki/reasoning/README.md',
  );
});
