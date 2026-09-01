---
date: 2026-08-31
source: agent
topics: testing-strategy, onboarding-flow, what-rig-is
decisions:
status: historical
supersedes:
tags:
summary: Technical spec for the RIG-153 adaptation-measurement instrument — extended lint, rubric doc, clean-checkout procedure; re-baseline (option B) deferred pending target availability.
---

# Technical specification — RIG-153 adaptation-measurement instrument

*Step 2 (rig-product-design) for RIG-153. Grilling oracle is drafted but not
yet frozen. This spec is the artifact the gate checks for presence; implementation
adapts to it. It does not edit the oracle.*

---

## Current-state trace

`tests/installed-router-hygiene.test.js` (4 tests) already covers the first
four defect shapes from the RIG-148→152 inventory:

| Test | Ticket | Defect shape |
|------|--------|--------------|
| 1 | RIG-124.2 | Bare `(RIG-NNN)` citations in installed instruction text |
| 2 | RIG-151 | `wiki/status.md` 3-minute cadence in installed routing.md |
| 3 | RIG-152 | Never-true "In this source checkout" conditional |
| 4 | RIG-150 | Hardcoded `.rig/skills/implementation/SKILL.md` path |

Two defect shapes from the same inventory are **not yet checked**:

| Gap | Ticket | Defect shape |
|-----|--------|--------------|
| G1 | RIG-149 | `rig`→`rig-rig` name collision for native-dispatch hosts |
| G2 | RIG-148 | Payload lands unignored (no `ensure_gitignore_block` in manifest) |

Both fixes exist on the current branch (commits `1730f257`, `38493a9b`).
The gaps are regression-test gaps, not open bugs.

No rubric file, no clean-checkout procedure, no pinned-model record, and no
scored re-run exist anywhere in the repo. Option B (re-baseline) is blocked:
`inspo/claude-task-master-main/` is present in the workspace but the target
does not yet carry all RIG-148→152 fixes in a state suitable for a baseline
run (the eval copy is at the pre-fix commit used for the original +12 eval).

---

## Chosen approach and touched seams

### Mechanical lint (RIG-148, RIG-149 gaps)

**Chosen**: **Extend `tests/installed-router-hygiene.test.js`** with two
additional `test()` blocks.

**Relationship to existing file**: extend, not replace, not sit alongside.

The file's own comment already states it is "the first instance of the
mechanical breakage-count lint RIG-153 specifies." Making it the canonical
home is consistent with that self-description. The `tests/*.test.js` glob
auto-includes it in `npm test` (`package.json` → `test:code`); no wiring
changes are needed to `package.json` or `.github/workflows/test.yml`.

A separate `scripts/check-install-hygiene.js` would need explicit wiring to
`test:code` and creates a second source of truth for what is checked. Rejected
(see §Rejected alternatives).

**Exact new test blocks:**

*Test 5 — RIG-149 (rig→rig-rig collision guard):*

```js
test('RIG-149 — prefix self-collision guard is present for the rig router skill', () => {
  const payloadSrc = read('rig/lib/payload.js');
  // The fix: when skill.name equals the prefix stem (e.g. "rig" === "rig"),
  // effectivePrefix is set to '' so the skill installs as "rig" not "rig-rig".
  assert.match(
    payloadSrc,
    /skill\.name\s*===\s*prefix\.replace/,
    'payload.js must carry the self-collision guard so _core installs as "rig" not "rig-rig"',
  );
});
```

*Test 6 — RIG-148 (gitignore block present in manifest):*

```js
test('RIG-148 — manifest writes a gitignore block for Rig-owned install paths', () => {
  const manifest = JSON.parse(read('rig/manifest.json'));
  const ops = Array.isArray(manifest) ? manifest : manifest.payload ?? [];
  const gitignoreOp = ops.find((e) => e.op === 'ensure_gitignore_block');
  assert.ok(gitignoreOp, 'manifest must have an ensure_gitignore_block entry');
  const lines = gitignoreOp.lines ?? [];
  assert.ok(lines.includes('.rig/'), 'must ignore .rig/');
  assert.ok(lines.some((l) => /\.claude\/skills\/rig-\*/.test(l)),
    'must ignore .claude/skills/rig-*');
  assert.ok(lines.some((l) => /\.agents\/skills\/rig-\*/.test(l)),
    'must ignore .agents/skills/rig-*');
});
```

**What each check asserts against**: Source files that are either (a) installed
byte-identical (byte-identity proven by `tests/rig-bootstrap.test.js`) for
markdown, or (b) directly invoke the installer behavior for code (`payload.js`,
`manifest.json`). The test file reads source directly; no install is run as
part of the lint.

**npm test / CI wiring**: Zero changes needed. The `tests/*.test.js` glob in
`test:code` already picks up the file. `.github/workflows/test.yml` calls
`npm test`, which calls `test:code`. No additional entries.

---

### Rubric document

**Location**: `wiki/specs/adaptation-measurement-rubric.md`

Document covers: 2 hard gates (G1, G2), 3 graded axes (A1–A3), per-axis
profile output format, pinned model + re-pin procedure, low-confidence caveat,
clean-checkout procedure, and prompt template. Full content in that file.

**Relationship to existing eval**: the +12 eval at
`2026-08-30-adaptation-eval-claude-task-master.md` is immutable history; the
rubric formalises its axes into a repeatable instrument. The rubric does not
revise the eval score.

---

### Clean-checkout procedure

**Location**: section within `wiki/specs/adaptation-measurement-rubric.md`
(§Clean-Checkout Procedure). Not a separate file; the rubric and procedure
belong together so a scorer finds both in one place.

**Fresh copy, not a clone**: target is `inspo/claude-task-master-main/` — a
read-only workspace copy. Fresh copy = `cp -r inspo/claude-task-master-main/
/tmp/ctm-eval-<run-id>`. No `git clone` required; the workspace copy is the
oracle.

**Install type**: default only. `--with-runtime` needs a separately labelled
rubric pass; it is out of scope here.

---

## Data, safety, and failure boundaries

- The mechanical lint runs in `npm test` against source files; it makes no
  API calls and has no external dependencies.
- The rubric judge invocation is human-operated (copy-paste into a model
  interface); no API key is wired into any script. Tier-1 markdown-only
  ethos is preserved.
- The procedure uses `cp -r` into `/tmp/`; no writes to the Rig source tree
  or the workspace `inspo/` copy. Disposable.
- Re-pin at model EOL is a documented human step, not automated; the rubric
  document records the re-pin obligation.

---

## Ordered slices and verification

| # | Slice | Verification command |
|---|-------|---------------------|
| 1 | Add tests 5 + 6 to `tests/installed-router-hygiene.test.js` | `node --test tests/installed-router-hygiene.test.js` → 6/6 pass |
| 2 | Write `wiki/specs/adaptation-measurement-rubric.md` | Human review of rubric structure against locked decisions |
| 3 | Update `wiki/tickets/RIG-153.md` acceptance section | Human review |
| 4 | Run full CI gate | `npm test` → green |

Slices 2–3 are parallel (no dependency). Slice 4 depends on slice 1 passing.

---

## Rejected alternatives

**Separate `scripts/check-install-hygiene.js`**: requires explicit wiring to
`test:code`, creates a second entry point for the same defect-shape inventory.
The existing `tests/installed-router-hygiene.test.js` is already wired and
self-describes as the RIG-153 lint seed. Adding a parallel script splits the
canonical home without benefit.

**Model-calling evaluation script**: violates Tier-1 markdown-only ethos for
installed repos and introduces API-key dependency into the test suite. The
rubric + written procedure design is the correct split: deterministic checks
go into the test suite; model-judged axes go into a written procedure the
human operates.

**Scalar aggregate score**: the locked decision mandates a per-axis profile,
not a scalar. Any aggregate must be labelled low-confidence pending
human-vs-judge calibration audit. Scoring to a scalar before that audit
misrepresents precision.

**Floating model alias** (e.g., `claude-sonnet-5`): not reproducible across
runs if the alias is updated between runs. The dated snapshot must be pinned
and recorded verbatim from the actual API response or `claude --version`.

**Running the re-baseline (option B) now**: blocked — the workspace copy of
`inspo/claude-task-master-main/` is at the pre-fix commit used for the
original +12 eval. Running B now produces a non-comparable number (different
defect count) and cannot be cleanly re-baselined against the +12. Deferred
until the target is at the post-fix state.

---

## Risks and open items

**Manifest JSON structure**: The lint test for RIG-148 reads `manifest.json`
and must locate the `ensure_gitignore_block` entry. If the manifest is a flat
array (current shape per grep evidence) rather than `{ payload: [...] }`, the
`ops` resolution line in the test must handle both. The spec above handles
both shapes (`Array.isArray(manifest) ? manifest : manifest.payload ?? []`);
implementation must verify against the actual JSON.

**Target repo SHA for re-baseline**: `inspo/claude-task-master-main/` has a
single commit (`986de06`, per the original eval). Option B should record this
SHA. The procedure step records `git -C <target> rev-parse HEAD`; this returns
`986de06...` for the current workspace copy. If the copy is updated before B
runs, the new SHA must be recorded.

**Human-vs-judge calibration audit**: the rubric's low-confidence caveat
names this audit as out of scope for option A. Until it runs, any aggregate
collapsed from the three axes is labelled low-confidence in the profile output.
This is not a blocker for instrument existence; it is a named follow-up.

---

## Branch SHA at spec time

Rig source branch `qa-prod-v5`, SHA `38493a9bf3087cfd4959b37579d24d721bf40fd3`.
Record this in every eval run's metadata.
