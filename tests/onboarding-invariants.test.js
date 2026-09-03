'use strict';

// Pattern-level invariant guards derived from the AT-HD-* grilling.
//
// Themes (see wiki/gate2/onboarding-hardening-invariants.md):
//   A — trust boundary at the wrong object, on the fail-open path
//   B — snapshot taken once, at the wrong moment
//   C — parallel sources of truth with no cross-link
//   D — green tests as happy-path change-detectors
//
// These are distinct from tests/onboarding-hardening.test.js: that file freezes
// eight behavioural adversarial cases (AT-HD-1..AT-HD-8) against known sites.
// This file lints the shape of the code and the wiki so a NEW instance of any
// theme fails the build, not only the eight known ones. Both files must be
// green before push; the fixes needed to turn the AT-HD-* oracle green also
// turn the relevant invariants here green.

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const h = require('./helpers/path-b');
const { signApproval } = require('./helpers/path-b-approval');

const ROOT = path.join(__dirname, '..');

function readSource(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

// ─── Theme A ─ trust boundary at wrong object, fail-open path ────────────────

test('AT-HD-9 I-A-2 onboarding-state.atomicWrite opens the temp with O_EXCL, never bare writeFileSync', () => {
  // Prevention strategy 2: every write to a predictable filename is O_EXCL on
  // a non-following open. atomicWrite writes to a sibling <file>.tmp whose name
  // is guessable; writeFileSync follows a symlink placed at that name and
  // writes to the target instead. openSync(temp, 'wx', ...) refuses.
  const src = readSource('rig/lib/onboarding-state.js');
  const atomicMatch = src.match(/function\s+atomicWrite\s*\([^)]*\)\s*\{([\s\S]*?)\n\}/);
  assert.ok(atomicMatch, 'atomicWrite function not found in rig/lib/onboarding-state.js');
  const body = atomicMatch[1];

  // The body must open the temp with the wx flag — either via openSync(temp, 'wx', ...)
  // or writeFileSync(temp, ..., { flag: 'wx' }). Bare writeFileSync(temp, contents) fails.
  const usesExclusiveOpen =
    /fs\.openSync\s*\([^,]+,\s*(['"])wx\1/.test(body) ||
    /fs\.writeFileSync\s*\([^)]*\{\s*[^}]*flag\s*:\s*(['"])wx\1/.test(body);
  assert.equal(
    usesExclusiveOpen,
    true,
    "atomicWrite must open the temp with O_EXCL (openSync 'wx' or writeFileSync {flag:'wx'}) to refuse pre-existing symlinks",
  );

  // And it must NOT contain the bare writeFileSync(temporary, ...) pattern the
  // fix replaces.
  assert.doesNotMatch(
    body,
    /fs\.writeFileSync\s*\(\s*temporary\s*,[^{]*\)\s*;/,
    'atomicWrite must not call fs.writeFileSync(temporary, contents) — that follows symlinks',
  );
});

test('AT-HD-9 I-A-1 apply() performs no repository mutation when the proposal body digest mismatches', async () => {
  // Prevention strategy 1, proven behaviorally instead of by parsing apply()'s
  // source for a literal `proposalBodyDigest(` call ordered before the first
  // `state.proposal.` read (a ratchet on a local identifier's spelling, not on
  // observable behavior). A stored digest is worthless as a trust boundary if
  // apply can be caught having started mutating before it fails: tamper the
  // proposal body the same way AT-HD-1 does, and require that neither the
  // install journal nor the approved graft target changed.
  await h.withRepo((target) => {
    const { proposed } = h.prepareAndPropose(target);
    const stateFile = path.join(target, '.rig', 'state.json');
    const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    const approvalReceipt = signApproval(target, proposed.proposal_digest);

    const tampered = 'TAMPERED: injected malicious graft content';
    state.proposal.grafts[0].content = tampered;
    state.proposal.grafts[0].content_digest = crypto.createHash('sha256').update(tampered).digest('hex');
    fs.writeFileSync(stateFile, `${JSON.stringify(state, null, 2)}\n`);

    const journalPath = path.join(target, '.rig', 'install-manifest.jsonl');
    const journalBefore = fs.existsSync(journalPath) ? fs.readFileSync(journalPath, 'utf8') : null;
    const graftTarget = path.join(target, 'AGENTS.md');
    const graftBefore = fs.readFileSync(graftTarget);

    assert.throws(() => h.handle({
      schema_version: 1,
      action: 'apply',
      target,
      expected_revision: proposed.revision,
      approval: approvalReceipt,
    }));

    const journalAfter = fs.existsSync(journalPath) ? fs.readFileSync(journalPath, 'utf8') : null;
    assert.equal(journalAfter, journalBefore, 'apply must not append any journal entry before the digest check fails');
    assert.deepEqual(fs.readFileSync(graftTarget), graftBefore, 'apply must not mutate the graft target before the digest check fails');
  }, { install: true });
});

test('AT-HD-9 I-A-3 the public check action propagates a broken inventory harness rather than reporting a pass', async () => {
  // Prevention strategy 6, proven end-to-end instead of by regex-parsing catch
  // bodies (a naive `[^}]*` catch scanner mis-parses any catch containing a
  // nested block or object literal, and it cannot see the difference between
  // a genuinely fail-open catch and one that legitimately treats an expected
  // absence as non-fatal). Place an escaping symlink under a scan root
  // (`.agents/rules`, a registry-driven HARNESS_DIR) at a path no *other*
  // check function reaches: `walkFiles` (shared by projectionFailures and
  // danglingReferences' Source A) classifies entries by `Dirent.isFile()` /
  // `isDirectory()`, which are both false for a symlink dirent, so a plain
  // symlink there is invisible to those two functions. inventoryHarness's own
  // directory walker explicitly special-cases `isSymbolicLink()` precisely to
  // detect this, so it is the only function that can observe and throw on it.
  // Nothing between that throw and the caller of handle({action:'check'}) may
  // convert it into a clean "checked" response.
  await h.withRepo((target) => {
    const { checked } = h.applyAndCheck(target);

    const rulesDir = path.join(target, '.agents', 'rules');
    fs.mkdirSync(rulesDir, { recursive: true });
    const escape = path.join(rulesDir, 'escape.md');
    fs.symlinkSync(require('node:os').tmpdir(), escape, 'dir');

    try {
      assert.throws(
        () => h.handle({
          schema_version: 1,
          action: 'check',
          target,
          expected_revision: checked.revision,
        }),
        /inventory/i,
        'the public check action must propagate a broken inventory harness rather than silently reporting a passing check',
      );
    } finally {
      fs.rmSync(escape, { force: true });
    }
  }, { install: true });
});

test('AT-HD-12 I-D-1 MCP handlers do not JSON-stringify structuredContent into the text channel', () => {
  // Prevention strategy behind F7: MCP content[0].text is a human-visible
  // summary; structuredContent is the machine channel. Emitting
  // JSON.stringify(result) into text duplicates the payload and blows the
  // transcript budget on every call. Both handler files are byte-identical
  // (see I-C-4), so this check runs against each.
  for (const rel of ['rig-mcp/index.js', 'rig/mcp-runtime/index.js']) {
    const src = readSource(rel);
    assert.doesNotMatch(
      src,
      /content\s*:\s*\[\s*\{\s*type\s*:\s*(['"])text\1\s*,\s*text\s*:\s*JSON\.stringify/,
      `${rel} must not JSON.stringify into content[0].text — structured data belongs in structuredContent only`,
    );
  }
});

// ─── Theme B ─ snapshot taken once, at the wrong moment ──────────────────────

test('AT-HD-10 I-B-1 apply() performs no repository mutation when the inventory drifted after approval', async () => {
  // Prevention strategy 3, proven behaviorally instead of by locating a
  // literal `journalWriter(` token and inspecting what precedes it in source.
  // TOFU at approval is only meaningful if the re-derived inventory check
  // runs, and is enforced, strictly before the first mutating write. Add a
  // harness-visible file after signing (the same fixture AT-HD-3 uses) and
  // require that apply left no journal-tracked mutation behind.
  await h.withRepo((target) => {
    const { proposed } = h.prepareAndPropose(target);
    const approvalReceipt = signApproval(target, proposed.proposal_digest);
    fs.writeFileSync(path.join(target, 'CLAUDE.md'), '# Injected after approval\n');

    const journalPath = path.join(target, '.rig', 'install-manifest.jsonl');
    const journalBefore = fs.existsSync(journalPath) ? fs.readFileSync(journalPath, 'utf8') : null;

    assert.throws(() => h.handle({
      schema_version: 1,
      action: 'apply',
      target,
      expected_revision: proposed.revision,
      approval: approvalReceipt,
    }));

    const journalAfter = fs.existsSync(journalPath) ? fs.readFileSync(journalPath, 'utf8') : null;
    assert.equal(journalAfter, journalBefore, 'apply must not append any journal entry before the inventory drift check fails');
  }, { install: true });
});

test("AT-HD-10 I-B-2 a native host does not suppress another installed host's own discovery scope", async () => {
  // Prevention strategy 4, proven behaviorally instead of by requiring an
  // exact `for (... of hosts)` loop shape and a fixed two-parameter arity —
  // shape ratchets that break on any refactor without changing behavior. Use
  // a different native+instruction-only host pair than AT-HD-4 (Claude
  // instead of Codex) so the per-host decision is proven independent of which
  // native scope happens to be present, not only Codex's.
  await h.withRepo((target) => {
    h.applyAndCheck(target, { proposal: { selected_skills: ['qa'] } });

    const claudeQa = path.join(target, '.claude', 'skills', 'rig-qa', 'SKILL.md');
    const instructionQa = path.join(target, '.rig', 'skills', 'qa', 'SKILL.md');
    assert.ok(fs.existsSync(claudeQa), 'skill must be projected for the native Claude scope as rig-qa');
    assert.ok(
      fs.existsSync(instructionQa),
      "skill must also be projected unprefixed for the instruction-only Cursor scope, even though Claude's native scope is also installed",
    );

    const state = JSON.parse(fs.readFileSync(path.join(target, '.rig', 'state.json'), 'utf8'));
    const hostScopes = new Set(state.applied.projections.map((row) => row.host_scope));
    assert.deepEqual(
      [...hostScopes].sort(),
      ['claude', 'instruction-only'],
      'both installed hosts must receive exactly their own scope — none dropped, none spuriously added',
    );
  }, { install: true, hosts: ['claude', 'cursor'] });
});

// ─── Theme C ─ parallel sources of truth with no cross-link ──────────────────

test('AT-HD-11 I-C-1 buildSkillCatalog has no hardcoded releaseTag default', () => {
  // Prevention strategy 5: one source of truth per constant. A default of
  // `releaseTag = 'v5.0.0'` in the library IS the second source, silently
  // divergent from package.json. Callers must pass a value derived from
  // package.json.
  const src = readSource('rig/lib/skill-catalog.js');
  assert.doesNotMatch(
    src,
    /releaseTag\s*=\s*(['"])v?\d+\.\d+\.\d+\1/,
    "rig/lib/skill-catalog.js must not default releaseTag — throw or require the caller to pass version derived from package.json",
  );
});

test('AT-HD-11 I-C-2 rig/lib does not embed any quoted release-version literal', () => {
  // Prevention strategy 5, extended: a regex built from the *current*
  // package.json version goes blind the moment the version drifts — exactly
  // the failure this invariant exists to catch (a stale rig/lib literal
  // becomes invisible the instant package.json moves past it). Reject any
  // quoted vX.Y.Z-shaped literal in rig/lib regardless of what package.json
  // currently says; every reference must derive from package.json at read
  // time. If this test fires, read from package.json at that call site or
  // annotate it as an explicit escape hatch.
  const literal = /(['"`])v?\d+\.\d+\.\d+\1/;
  const libDir = path.join(ROOT, 'rig', 'lib');
  const offenders = [];
  for (const entry of fs.readdirSync(libDir)) {
    if (!entry.endsWith('.js')) continue;
    const rel = path.join('rig/lib', entry);
    const src = readSource(rel);
    // Skip any line annotated with an explicit escape hatch.
    const lines = src.split('\n');
    lines.forEach((line, i) => {
      if (!literal.test(line)) return;
      if (/\/\*\s*allow-hardcoded-version\s*\*\//.test(line)) return;
      offenders.push(`${rel}:${i + 1} → ${line.trim()}`);
    });
  }
  assert.deepEqual(
    offenders,
    [],
    'rig/lib files must not embed any quoted release-version literal — read from package.json.\n' + offenders.join('\n'),
  );
});

test('AT-HD-11 I-C-3 wiki immutability rule is stated in both docs and each cross-cites the other', () => {
  // Prevention strategy 9: cross-doc invariants cite each other. The
  // body-immutable / frontmatter-mutable policy is asserted in
  // wiki/reasoning/README.md and .claude/skills/wiki-maintenance/SKILL.md; a
  // change to one without the other silently drifts. Each doc must reference
  // the other by relative path so the human editor sees the pair.
  const readme = readSource('wiki/reasoning/README.md');
  const skill = readSource('.claude/skills/wiki-maintenance/SKILL.md');

  // Both must positively assert body immutability in some form.
  assert.match(
    readme,
    /body[\s\S]{0,80}(?:immutable|not\s+edited|is\s+written\s+once|unchanged)/i,
    'wiki/reasoning/README.md must state trace bodies are immutable (frontmatter mutable)',
  );
  assert.match(
    skill,
    /body[\s\S]{0,80}(?:immutable|not\s+(?:edit|modif)|unchanged)/i,
    '.claude/skills/wiki-maintenance/SKILL.md must state trace bodies are immutable',
  );

  // Each doc must reference the other by path so an editor of one is nudged to the other.
  assert.match(
    readme,
    /wiki-maintenance\/SKILL\.md|wiki-maintenance\b/i,
    'wiki/reasoning/README.md must cross-cite .claude/skills/wiki-maintenance/SKILL.md so cross-doc invariants stay linked',
  );
  assert.match(
    skill,
    /(?:wiki\/)?reasoning\/README\.md/i,
    '.claude/skills/wiki-maintenance/SKILL.md must cross-cite wiki/reasoning/README.md so cross-doc invariants stay linked',
  );
});

test('AT-HD-11 I-C-4 rig-mcp/index.js and rig/mcp-runtime/index.js are byte-identical', () => {
  // The spec's F7 approach keeps the two MCP entrypoints byte-identical rather
  // than extracting a shared helper. That is only safe if a test enforces
  // byte-parity — otherwise the second source of truth silently drifts. The
  // check-rule-copies script does not currently cover this pair; this test does.
  const a = readSource('rig-mcp/index.js');
  const b = readSource('rig/mcp-runtime/index.js');
  const digestA = crypto.createHash('sha256').update(a).digest('hex');
  const digestB = crypto.createHash('sha256').update(b).digest('hex');
  assert.equal(
    digestA,
    digestB,
    'rig-mcp/index.js and rig/mcp-runtime/index.js must be byte-identical; if you edit one, edit both in the same commit',
  );
});

// ─── Theme D ─ green tests as happy-path change-detectors ────────────────────

test('AT-HD-12 I-D-2 adversarial oracle exists and contains substantive test titles', () => {
  // Prevention strategy 8: an adversarial-case CI catalogue. Deletion or
  // truncation of tests/onboarding-hardening.test.js must fail the build —
  // otherwise a stray `rm` silently strips the guard. Also assert that the
  // oracle covers at least one AT-HD-* case per finding declared in the spec.
  const oraclePath = path.join(ROOT, 'tests', 'onboarding-hardening.test.js');
  assert.equal(
    fs.existsSync(oraclePath),
    true,
    'tests/onboarding-hardening.test.js must exist — deleting it strips the AT-HD-* adversarial oracle',
  );
  const oracleSrc = fs.readFileSync(oraclePath, 'utf8');
  const atHdIds = new Set([...oracleSrc.matchAll(/\btest\(\s*['"`]AT-HD-(\d+)\b/g)].map((m) => m[1]));
  assert.ok(
    atHdIds.size >= 8,
    'tests/onboarding-hardening.test.js must contain a substantive test title for each known finding',
  );
  const manifested = new Set(readSource('wiki/gate1/testing-infrastructure.manifest')
    .trim().split('\n').map((line) => line.split(/\s{2}/)[1]));
  for (const required of ['tests/onboarding-hardening.test.js', 'tests/onboarding-invariants.test.js']) {
    assert.ok(manifested.has(required), `${required} must be frozen in the testing-infrastructure manifest`);
  }
});

test('AT-HD-12 I-D-3 every hardening finding in the spec has exactly one matching oracle ID', () => {
  // Prevention strategy 7: every spec sentence gets one test. If the spec
  // declares eight findings F1..F8, the oracle must pin eight adversarial
  // cases AT-HD-1..AT-HD-8. A new finding without a test would slip through.
  const spec = readSource('wiki/gate2/onboarding-hardening-spec.md');
  const oracle = readSource('tests/onboarding-hardening.test.js');

  const findingIds = new Set([...spec.matchAll(/^###\s+F(\d+)\b/gm)].map((m) => m[1]));
  const oracleIds = new Set([...oracle.matchAll(/\btest\(\s*['"`]AT-HD-(\d+)\b/g)].map((m) => m[1]));

  const missing = [...findingIds].filter((id) => !oracleIds.has(id));
  const extra = [...oracleIds].filter((id) => Number(id) <= 8 && !findingIds.has(id));
  assert.deepEqual(
    missing,
    [],
    `spec findings without an AT-HD-* oracle test: F${missing.join(', F')} — add a test in tests/onboarding-hardening.test.js or drop the finding from the spec`,
  );
  assert.deepEqual(
    extra,
    [],
    `AT-HD-* finding tests without a matching spec finding: AT-HD-${extra.join(', AT-HD-')}`,
  );
});

test('AT-HD-12 I-D-4 MCP compact-text acceptance drives the real adapter', () => {
  const oracle = readSource('tests/onboarding-hardening.test.js');
  assert.match(
    oracle,
    /AT-HD-7[\s\S]*?withMcpClient\s*\(/,
    'AT-HD-7 must call the MCP adapter rather than simulate its response locally',
  );
  assert.doesNotMatch(
    oracle,
    /const\s+currentText\s*=\s*JSON\.stringify/,
    'AT-HD-7 must not recreate the buggy response inside the test',
  );
});
