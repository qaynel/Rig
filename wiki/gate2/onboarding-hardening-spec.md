# Onboarding hardening — working technical spec

**Status: WORKING.** Produced by `rig-product-design` on 2026-09-02 for eight
findings, then extended on 2026-09-03 with four pattern-level prevention cases.
Checked for presence at Gate 1; not itself frozen. The code adapts to this
design and this design adapts to what the code learns, as long as both signed
hardening test files stay green.

**Oracle references (must not drift).**

| Artifact | Path |
|---|---|
| Grilling trace | `wiki/reasoning/2026-09-02-onboarding-hardening-grilling.md` |
| Oracle tests | `tests/onboarding-hardening.test.js` |
| Prevention invariant catalogue | `wiki/gate2/onboarding-hardening-invariants.md` |
| Prevention invariant tests | `tests/onboarding-invariants.test.js` |
| Gate 1 approval script | `scripts/approve-gate1.js` |

The eight fixes are independently observable. The four theme cases are the
cross-cutting completion signal that the shared defect shapes are also removed.

---

## 1. Cross-cutting invariants

The eight findings are three patterns wearing eight faces. Fix the pattern here
so the ninth face never ships.

### I-1 — Never trust a hash stored beside the bytes it covers

Storage is fine as an integrity witness for crash recovery. Reading is not: the
verify step must recompute the digest from the bytes before any consumer sees
the fields. This rule covers F1 directly and shapes F3 by analogy — a snapshot
is a stored witness for inventory; apply must re-derive.

**Application in this spec.** `apply()` re-derives `sha256(canonical(body))`
from `state.proposal.*` fields and compares to `state.proposal.digest` before
consuming any proposal field. If storage cannot be avoided, the read path
recomputes.

### I-2 — Every write to a predictable filename is `O_EXCL` on a non-following open

`fs.writeFileSync` follows pre-existing symlinks; the destination guard runs on
the final path, not the temp file's open target. The primitive that binds the
guard to the byte-write is `fs.openSync(temp, 'wx', 0o600)`, which refuses if
`temp` exists (including as a symlink).

**Application in this spec.** `atomicWrite` in `onboarding-state.js` opens the
temp with `wx`; a `writeSync`/`closeSync` pair completes the write; the temp is
`renameSync`d as before. A pre-existing `<file>.tmp` causes an immediate throw
before any byte is written.

### I-3 — TOFU at approval is re-verified at commit

`propose` snapshots the world; `apply` mutates it. Every value captured at
approval time must be re-derived and compared inside the mutating action.
`catalog_digest` already follows this pattern; F1 (proposal body) and F3
(inventory) close the two gaps that don't.

**Application in this spec.** `apply()` runs three re-derivations in fixed order
at its top: proposal-body digest, catalog digest (already present), inventory
digest. Any mismatch fails closed before mutation.

### I-4 — Verification code fails closed

A `catch { return [] }` around a verify step turns a broken oracle into a green
oracle. Every catch in the verify path must either rethrow or push a
`hard_failure` — never swallow.

**Application in this spec.** `inventoryDriftFailures` drops its `try/catch`;
harness exceptions propagate to `handleOnboarding`, which surfaces them as the
same hard failure any other unrecoverable state produces.

### I-5 — Per-item decisions, not aggregate booleans

`if (!scopes.length)` collapses per-host discovery into a single boolean, and a
non-native host silently loses its scope whenever a native host is also present.
The fix is per-item enumeration, one native or instruction-only decision per
host — no global fallback.

**Application in this spec.** The install marker records selected host IDs.
`installedSkillScopes` walks that list and chooses native or instruction-only
for each host, then deduplicates shared destinations.

### I-6 — One source of truth per constant

Version, allowed-signers path, protocol names — one file authoritative,
everything else derives or asserts. The `releaseTag = 'v5.0.0'` default and the
README's `--version v5.0.0` examples are the same constant declared twice.

**Application in this spec.** `buildSkillCatalog` accepts `releaseTag` and
throws if the caller omits it. The lone production caller
(`scripts/build-skill-catalog.js`) reads `package.json` and passes the derived
tag. AT-HD-5 asserts README examples equal that tag; when the version bumps,
that test fails and forces a README edit in the same commit.

### I-7 — Cross-doc invariants cite each other; the MCP text channel carries a summary

If two documents carry the same rule, each links to the other and a lint refuses
a change that touches one without touching the other (F8). If a channel is
labeled "human-readable summary," it must not be a JSON stringify of the
structured channel (F7).

**Application in this spec.** `reasoning/README.md` and
`.claude/skills/wiki-maintenance/SKILL.md` both restate the body-immutable,
frontmatter-mutable rule and cross-cite. The MCP handlers render
`${phase} → ${next_action}` (+ hard-failure count when non-zero) into
`content[0].text`, leaving the full response in `structuredContent`.

---

## 2. Current-state trace

The implementation seams touched by this spec, with their relevant line ranges as of the
`path-b-adaptive-onboarding-oracle` branch tip:

| Seam | File | Currently |
|---|---|---|
| `apply()` top | `rig/lib/onboarding.js:600` | validates approval, catalog digest; does not re-derive proposal body or inventory digest |
| `atomicWrite` | `rig/lib/onboarding-state.js:35` | `fs.writeFileSync(temporary, contents)` — follows symlinks |
| `installedSkillScopes` | `rig/lib/onboarding.js:185` | native-then-fallback: instruction-only only when no native |
| Installed-host authority | `rig/lib/payload.js:674` | release marker records only the tag, so onboarding has no exact selected-host list |
| `buildSkillCatalog` | `rig/lib/skill-catalog.js:271` | `releaseTag = 'v5.0.0'` default |
| `inventoryDriftFailures` | `rig/lib/onboarding-check.js:288` | not exported; `try { … } catch { return []; }` around `inventoryHarness` |
| MCP tool text | `rig-mcp/index.js:79`, `rig/mcp-runtime/index.js:79` (identical) | `JSON.stringify({ next_action, ...result })` — duplicates `structuredContent` |
| Reasoning immutability rule | `wiki/reasoning/README.md:15` | "A trace is written once and never edited." — no body/frontmatter distinction |
| Wiki-maintenance rule | `.claude/skills/wiki-maintenance/SKILL.md:32` | ground rule 1 says "you may never rewrite its content" — phrase itself trips the AT-HD-8 regex |

Downstream reads that consume `state.proposal.*` after F1's guard runs — and
therefore benefit from it — are `preflightGrafts`, `preflightOwnedFiles`,
`planRemovals`, and the graft/owned-file loops inside `apply()`. F1 hardens all
of them by hardening the shared prefix.

---

## 3. Chosen approach per finding

### F1 (AT-HD-1) — proposal body integrity

**Trust boundary:** `state.proposal.digest` is a stored witness, not the truth.

**Seam.** Add a helper `proposalBodyDigest(proposal)` in
`rig/lib/onboarding-state.js` that returns `sha256(canonical(body))` where
`body` is `proposal` with the `digest` key stripped. Export it. Call it at the
top of `apply()` in `rig/lib/onboarding.js`, immediately after
`requireCurrentRevision(request, state, 'apply')`, before `approvalRecord`.
Fail with `"proposal body has been tampered post-signing: digest mismatch"`.

**Reused.** `canonical` and `sha256` from `skill-catalog.js` (already imported
by `onboarding-state.js`). `canonicalProposal` already produces the same
body-then-digest shape at write time, so the helper is symmetric with the
writer.

**Failure boundary.** Throws inside the onboarding lock, before any repository
mutation. State on disk is unchanged; the operator repairs `.rig/state.json`
or re-runs `prepare/propose`.

**Rejected.** (a) *Re-derive at every consumer.* Correct but noisy; six call
sites would each need the same check. Prefer one guard at the top of `apply`.
(b) *Verify at `readState`.* Wrong scope — `readState` is used by
`prepare`/`propose`/`check` too, and a body-tamper is only a semantic failure
in `apply`, where an approval is being spent.

### F2 (AT-HD-2) — exclusive temporary file creation

**Trust boundary:** `<file>.tmp` is a predictable filename in a shared parent;
the destination guard is on the final path, not the temp open.

**Seam.** Rewrite `atomicWrite` in `rig/lib/onboarding-state.js`:

```js
function atomicWrite(target, rel, contents) {
  const file = containedPath(target, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.tmp`;
  const fd = fs.openSync(temporary, 'wx', 0o600);
  try {
    fs.writeSync(fd, contents);
  } finally {
    fs.closeSync(fd);
  }
  fs.renameSync(temporary, file);
}
```

`'wx'` is `O_WRONLY | O_CREAT | O_EXCL`; a pre-existing `temporary` (including
a symlink) causes `openSync` to throw `EEXIST` before any byte is written.

**Failure boundary.** On `EEXIST`, `atomicWrite` catches and re-throws with the
exact temp path named and the operator's next move stated —
`"onboarding temp file exists; remove <path>.tmp to recover"` — required, not
optional: AT-HD-2 asserts this message shape and then proves a retry succeeds
once the operator removes the named path. The raw OS `EEXIST` alone is not
actionable enough (it names the path but not the remedy).

**Rejected.** (a) *Unlink stale temp on `EEXIST` and retry.* This is the attack
window — unlinking a symlink and retrying opens exactly the race the fix
prevents. Refuse and require operator intervention. (b) *Use `mkdtempSync` in
`.rig/` for every write.* Overshoots the finding; `wx` is the direct fix. (c)
*Move `.tmp` inside a per-write random directory.* Same overshoot; the whole
point of a sibling `.tmp` + `rename` is filesystem-level atomicity, which
mkdtemp does not improve.

### F3 (AT-HD-3) — commit-time inventory recheck

**Trust boundary:** the inventory digest captured at `propose` is stored in
`state.inventory.digest`; `apply` currently never re-derives it.

**Seam.** In `apply()` in `rig/lib/onboarding.js`, immediately after the F1
proposal-body check and before `loadInstalledCatalog`, run:

```js
const freshInventory = inventoryHarness(request.target);
if (freshInventory.digest !== state.inventory.digest) {
  fail('the repository inventory changed since propose: approval is stale');
}
```

Mirrors the existing catalog-digest check (`rig/lib/onboarding.js:620`).

**Failure boundary.** Throws inside the onboarding lock, before mutation.
Operator re-runs `prepare` + `propose` + approval to bind a fresh inventory
digest.

**Scope.** `inventoryHarness` is a *bounded* scan — `HARNESS_NAMES`,
`.github/copilot-instructions.md`, and the registry-driven `SCAN_ROOTS` — not a
whole-repository walk. "The inventory changed" means a harness-visible path
changed, not that any file anywhere in the repository changed; a file dropped
outside the bounded set is invisible to this guard by design, the same way it
is invisible to `prepare`'s original inventory. AT-HD-3's fixture reflects
this: it adds `CLAUDE.md` (a `HARNESS_NAME`), not an arbitrary root file.

**Rejected.** (a) *Skip the guard when only files inside `.rig/` changed.*
Adds a rule to the trust envelope for a marginal gain — a harness-visible file
added anywhere within the bounded scan is drift; treat it uniformly. (b) *Move
the guard into `apply`'s per-file preflight loops.* Loses the whole-harness
semantics — a file appearing under a scan root none of the proposal's paths
touch would still slip through.

### F4 (AT-HD-4) — per-host scope enumeration

**Trust boundary:** every installed host must receive its discovery
projection; the union of native hosts must not veto instruction-only.

**Seam.** The install marker records the exact selected host IDs beside the
release tag. `planSkillProjections` passes that list to
`installedSkillScopes(target, installedHosts)`, which walks the list and adds
each host's native or instruction-only scope independently. Shared destinations
are deduplicated only after the per-host decisions are complete.

**Naming is scope-specific, not skill-specific.** `projectedSkillName` today
applies one prefixing rule uniformly to every scope. That is wrong: a core
skill's own catalogue name is already `rig-`-prefixed at the source (e.g.
`rig-debugging`), while an optional skill's is not (e.g. `qa`). The fix derives
a canonical unprefixed name once (strip a leading `rig-` if present) and then
applies the router contract per scope: native layouts (Claude, Codex) project
as `rig-<name>`; the instruction-only layout projects as `<name>`, per
`rig/tier-1/routing.md`'s "`rig-<name>` maps to `.rig/skills/<name>/SKILL.md`
on instruction-only hosts." Concretely: `qa` → `.agents/skills/rig-qa/SKILL.md`
and `.rig/skills/qa/SKILL.md`; `rig-debugging` → `.agents/skills/rig-debugging/SKILL.md`
and `.rig/skills/debugging/SKILL.md`. Every mandatory core skill must resolve
under both layouts.

```js
function installedSkillScopes(target, installedHosts) {
  const scopes = new Map();
  for (const host of installedHosts) {
    const scope = nativeScope(host) || instructionOnlyScope(host);
    if (scope) scopes.set(`${scope.host_scope}\0${scope.root}`, scope);
  }
  if (!scopes.size) fail('no installed skill discovery scope is available for an approved projection');
  return [...scopes.values()];
}
```

`nativeScope` uses the existing installed wrapper markers for Codex and Claude;
`instructionOnlyScope` accepts only IDs from the existing
`INSTRUCTION_ONLY_HOSTS` registry and requires the canonical playbook marker.
The mixed-host acceptance fixture explicitly installs Codex and Cursor, so it
now emits both `.agents/skills` and `.rig/skills` scopes. An absent/malformed
host list fails before proposal projection; Path B is not released, so no
legacy marker migration is needed.

**Downstream impact.** `planSkillProjections` iterates `scopes` and produces
one projection per (skill, host, path) triple. `projection.projections` (the
per-host list) already exists — its size grows for pure-native installs that
previously received only the native scope. `state.applied.projections` was
introduced in Task 9 to record every triple; `check`'s reconciliation already
handles multi-scope projections. No schema change.

**Rejected.** (a) *Infer instruction-only need from whether the native scope
union is empty.* Recreates the defect for every mixed install. (b) *Emit
instruction-only whenever the playbook exists, without consulting installed
hosts.* Makes a staged neutral artifact look like an installed host and gives a
pure-native install an extra projection. (c) *Emit instruction-only when the
playbook is absent.* Loses the existence-attested boundary.

### F5 (AT-HD-5) — one source of truth for the release version

**Trust boundary:** the release tag is a constant; two independent copies
drift. `package.json.version` is authoritative.

**Seam.** Three edits, one invariant.

1. `rig/lib/skill-catalog.js:271`: remove the default:
   ```js
   function buildSkillCatalog({ releaseTag, softBudget, shelfRoot = SKILL_ROOT } = {}) {
     if (typeof releaseTag !== 'string' || !/^v\d+\.\d+\.\d+/.test(releaseTag)) {
       fail('buildSkillCatalog requires a releaseTag (e.g. "v5.0.0") — pass it derived from package.json');
     }
     …
   }
   ```
2. `scripts/build-skill-catalog.js`: derive from `package.json`:
   ```js
   const { version } = require('../package.json');
   const desired = render(buildSkillCatalog({ releaseTag: `v${version}` }));
   ```
3. Update the three test callers (`tests/path-b-hardening.test.js:1326`,
   `tests/skill-tree-digest-reproducible.test.js:49`,
   `tests/path-b-catalog.test.js:246`) to pass an explicit `releaseTag` —
   either a fixed test value or `` `v${require('../package.json').version}` ``.
   The tests that pin `releaseTag` for repro purposes use a fixed value; the
   others derive from `package.json`.

The AT-HD-5 test enforces `README.md`, `README.es.md`, and `README.ko.md`'s
`--version` examples all equal `v${package.json.version}` — the drift alarm is
a test failure at CI time. No README templating; a version bump edits
`package.json`, `CHANGELOG`, and the three README examples in one commit and
the test catches an omission. `I-C-2` (the companion invariant) independently
rejects *any* quoted `vX.Y.Z`-shaped literal anywhere in `rig/lib`, not one
built from the current `package.json` version — a check built from the
current version goes blind the instant the version drifts past a stale
literal, which is exactly the failure this pair of tests exists to catch.
`scripts/check-versions.js` remains the cross-manifest tag/version consistency
authority; these tests catch the two classes it does not cover (README prose
examples and rig/lib runtime literals).

**Rejected.** (a) *Read `package.json` inside `buildSkillCatalog`.* Makes a
library depend on `../../package.json`; production callers already have
`package.json` in hand, and the test callers benefit from explicit fixtures.
(b) *Template README examples.* Worse UX — a reader has to substitute; keep the
literal, keep the test.

### F6 (AT-HD-6) — fail-closed inventory verification

**Trust boundary:** `inventoryDriftFailures` is a verify step; it must fail
closed and be directly testable.

**Seam.** In `rig/lib/onboarding-check.js:288`:

1. Remove the `try { … } catch { return []; }` wrapper around
   `inventoryHarness(target)`. Let the exception propagate.
2. Export the function from the module (`module.exports = { checkOnboarding,
   inventoryDriftFailures }` at line 347).
3. Audit the remaining catches in this verification module. Replace catches
   used only for expected absence with non-throwing existence checks; every
   genuine parse/read/stat exception must propagate or add a hard failure.
   Empty, zero, false, and `continue` catch results fail `AT-HD-9`.

Propagating means `checkOnboarding` throws when the harness throws.
`handleOnboarding` inside `check()` (`rig/lib/onboarding.js:791`) is inside
`withOnboardingLock`, which drops the lock in `finally`, so the exception
surfaces cleanly to the caller.

**Failure boundary.** A harness that cannot enumerate the repository is a
verification-broken condition. The onboarding lock releases; state is
untouched; the operator inspects the harness error and rebuilds the target.

**Rejected.** (a) *Return `[hard_failure('inventory-broken', ...)]` instead of
throwing.* The oracle requires exception propagation specifically: AT-HD-6
asserts `assert.throws`, not a returned hard failure, and the acceptance prose
is narrowed to match — the real harness raises `"inventory: target must
exist"` on a missing target, not `ENOENT`, so the fixture and the matcher both
target that literal. Chose throw because `loadInstalledCatalog` already throws
for the same class of unrecoverable state, keeping the failure shape uniform.
Returning an empty result remains forbidden either way.

### F7 (AT-HD-7) — compact MCP text channel

**Trust boundary:** MCP `content[0].text` is a human-visible summary; MCP
`structuredContent` is the machine channel. Duplicating the structured body
into text bloats the transcript by an order of magnitude per call.

**Seam.** In `rig-mcp/index.js:79` and `rig/mcp-runtime/index.js:79`
(byte-identical files), replace:

```js
return { content: [{ type: "text", text: JSON.stringify({ next_action: result.next_action, ...result }) }], structuredContent: result };
```

with:

```js
const failures = result.hard_failures?.length || 0;
const text = failures
  ? `${result.phase} → ${result.next_action} (${failures} hard ${failures === 1 ? 'failure' : 'failures'})`
  : `${result.phase} → ${result.next_action}`;
return { content: [{ type: "text", text }], structuredContent: result };
```

Both files must move in lockstep. `AT-HD-11` asserts their byte equality; edit
both files with the same string.

**Rejected.** (a) *Extract a shared helper `summariseOnboarding(result)`.*
There is no shared code module between `rig-mcp/` and `rig/mcp-runtime/` today;
adding one for four lines is machinery. Copy the inline version; keep the
duplication policed by the copy-check.

### F8 (AT-HD-8) — reasoning trace immutability reconciliation

**Trust boundary:** two documents describe the same policy; the AT-HD-8 test
regex catches any drift.

**Seam.** Two edits.

1. `wiki/reasoning/README.md` — rewrite the "The rule" section
   (`wiki/reasoning/README.md:12`) so it distinguishes body (immutable) from
   frontmatter fields (mutable metadata). Suggested text (satisfies the AT-HD-8
   regex and preserves the section's intent):

   > **A trace body is written once and its content is not edited.** It records
   > what was thought at a moment in time. Frontmatter fields (`status:`,
   > `topics:`, `summary:`, `decisions:`, `supersedes:`, `tags:`) are mutable
   > metadata: they are updated as later thinking supersedes earlier state or as
   > an index gains a new hub. Aggregate summaries — `Home.md`, `status.md`,
   > `wiki/index/*` — are syntheses over traces and are freely regenerated.
   >
   > This split is the point. A wiki whose bodies are rewritten loses its
   > history; a wiki whose metadata is frozen accumulates contradictions.
   > Keeping the record body immutable and the metadata mutable gets both. See
   > `.claude/skills/wiki-maintenance/SKILL.md` ground rule 1 for the operator
   > guidance that enforces this policy at authoring time.

2. `.claude/skills/wiki-maintenance/SKILL.md` — rewrite ground rule 1
   (`.claude/skills/wiki-maintenance/SKILL.md:32`) so it no longer contains
   the phrase `rewrite … content` (which trips the AT-HD-8 regex on a positive
   match) and cross-cites `reasoning/README.md`:

   > 1. Never modify the body of `wiki/reasoning/*` or `wiki/sources/*`. You
   >    may `git mv` a file or edit its frontmatter fields (`status:`,
   >    `topics:`, `summary:`, `decisions:`, `supersedes:`, `tags:`); the body
   >    itself is immutable, per `wiki/reasoning/README.md`.

Both documents must be edited in the same commit; the AT-HD-8 test enforces
that either edit alone would leave the pair inconsistent.

**Rejected.** (a) *Inspect only the changed-file set.* That is a version-control
heuristic, not the policy: either document may already be stale before the
current diff. The invariant test reads and compares both live documents on
every run.

---

## 4. Ordered tracer-bullet slices

Every slice is independent. Verify each with the same command, changing the
name pattern. Full-gate verification (`npm test`) runs once before push.

| Slice | Files touched | Verification |
|---|---|---|
| S1 — F8 wiki docs | `wiki/reasoning/README.md`, `.claude/skills/wiki-maintenance/SKILL.md` | `node --test --test-name-pattern "AT-HD-(8\|11)" tests/onboarding-hardening.test.js tests/onboarding-invariants.test.js` |
| S2 — F5 version SoT | `rig/lib/skill-catalog.js`, `scripts/build-skill-catalog.js`, `tests/path-b-hardening.test.js`, `tests/skill-tree-digest-reproducible.test.js`, `tests/path-b-catalog.test.js` | `node --test --test-name-pattern "AT-HD-(5\|11)" tests/onboarding-hardening.test.js tests/onboarding-invariants.test.js` |
| S3 — F7 MCP text | `rig-mcp/index.js`, `rig/mcp-runtime/index.js` | `node --test --test-name-pattern "AT-HD-(7\|11\|12)" tests/onboarding-hardening.test.js tests/onboarding-invariants.test.js` |
| S4 — F6 fail-closed | `rig/lib/onboarding-check.js` | `node --test --test-name-pattern "AT-HD-(6\|9)" tests/onboarding-hardening.test.js tests/onboarding-invariants.test.js` |
| S5 — F2 O_EXCL | `rig/lib/onboarding-state.js` | `node --test --test-name-pattern "AT-HD-(2\|9)" tests/onboarding-hardening.test.js tests/onboarding-invariants.test.js` |
| S6 — F4 per-host scopes | `rig/lib/payload.js`, `rig/lib/onboarding.js` | `node --test --test-name-pattern "AT-HD-(4\|10)" tests/onboarding-hardening.test.js tests/onboarding-invariants.test.js` |
| S7 — F3 inventory guard | `rig/lib/onboarding.js` | `node --test --test-name-pattern "AT-HD-(3\|10)" tests/onboarding-hardening.test.js tests/onboarding-invariants.test.js` |
| S8 — F1 body digest | `rig/lib/onboarding-state.js` (new helper), `rig/lib/onboarding.js` (guard call) | `node --test --test-name-pattern "AT-HD-(1\|9)" tests/onboarding-hardening.test.js tests/onboarding-invariants.test.js` |
| Full gate | — | `npm test` |

Ordering rationale: S1/S2/S3 are the lowest-risk (docs, module contract, MCP
text) and warm the branch; S4/S5 are isolated single-file changes; S6 modifies
`installedSkillScopes` which S7/S8 also touch, so S6 lands first to reduce
merge risk; S7 and S8 both insert guards at the top of `apply()` and are
sequenced together.

Parallel implementation is safe — the checklist in the user handoff explicitly
allows it — provided each slice ends on its own green test and the full gate is
run once before merge.

---

## 5. Pattern prevention materialized before signing

The intent owner asked that the review themes become executable before the
oracle is signed. `tests/onboarding-invariants.test.js` and its companion
catalogue now carry the bounded prevention work:

1. The predictable state-temp writer is pinned to exclusive creation.
2. Every catch in onboarding verification must rethrow or record a hard
   failure; empty, zero, false, and skipped results are not accepted.
3. The adversarial finding IDs and technical-design findings must remain an
   exact set, and the MCP case must drive a real adapter.
4. The paired trace-policy documents must state the body/frontmatter split and
   cross-cite; the two MCP handler sources must remain byte-identical.
5. Rejected shortcuts and their replacement rules are recorded in the
   companion invariant catalogue.

The checks are deliberately bounded to the concrete onboarding seams. A
repository-wide lint remains out of scope until another concrete path proves it
shares the contract.

---

## 6. Risks and explicit limits

- **F4 extends the release marker schema.** It gains a sorted, de-duplicated
  installed-host list. Path B has not shipped, so no legacy migration is
  required; a missing/malformed list fails and asks the operator to reinstall.
- **F1 helper location.** `proposalBodyDigest` lives in `onboarding-state.js`
  next to `canonicalProposal` (its symmetric writer). Callers that import it
  from `onboarding.js` add one import line — accepted cost for the symmetry.
- **F2 error message.** If the operator hits a legitimate stale `.tmp` from a
  prior crash, the error must give them the exact `rm` command. If it does
  not read that way after S5, revise the string.
- **F7 duplicated files.** The two MCP files diverge silently today; the copy
  check catches most drift but not all. If a future edit adds an MCP text
  helper, extract to a shared module — but not in this branch.
- **F8 policy authority.** The rewritten `reasoning/README.md` text is a
  proposal; the intent owner may prefer different wording. The AT-HD-8 regex
  admits any wording that satisfies both negative assertions and both
  positive assertions.

---

## 7. Return-to-grilling triggers

None currently. If any of the following surface during implementation, stop
and re-open grilling rather than designing around silently:

- A test in `tests/onboarding-hardening.test.js` cannot be made green by the
  spec above without changing the test body.
- F4's per-host scope enumeration breaks an existing accepted case in
  `tests/path-b*` that this spec did not anticipate.
- F5's `releaseTag` requirement breaks a caller outside the four found in
  §3 F5.
- The F8 wording proposed here is unacceptable to the intent owner.

## 8. Gate 1 readiness

This spec and its invariant companion are present. The proposed oracle consists
of `tests/onboarding-hardening.test.js` plus
`tests/onboarding-invariants.test.js`; both are listed in the testing manifest,
and the acceptance/traceability sets contain AT-HD-1 through AT-HD-12. The
intent owner may run `node scripts/approve-gate1.js` to sign the oracle.
Implementation begins after signing.
