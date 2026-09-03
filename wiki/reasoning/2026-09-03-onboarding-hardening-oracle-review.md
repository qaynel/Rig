---
date: 2026-09-03
source: review
topics: testing-strategy, gate1-signing, trust-and-failure-boundaries, onboarding-flow
decisions:
status: current
supersedes:
tags: trap
summary: Report-only review of the unsigned AT-HD-1..12 hardening oracle — three cases cannot pass under their own spec, one spec-vs-test contradiction, and a latent instruction-only core-skill regression F4 would widen; do not sign yet.
---

# Review — onboarding hardening oracle (AT-HD-1..AT-HD-12), pre-signature

Report-only. Nothing in the worktree was modified except a no-op rerun of
`node scripts/build-wiki-index.js` (idempotent, no content change), plus this
trace and its hub updates.

## What the worktree actually contains

The eight review findings from the pasted analysis are **specified and pinned,
not fixed**. No production file changed: `git status` shows only
`scripts/check-advanced-spec.js` (83 → 95), `tests/helpers/path-b.js`
(`withMcpClient` extracted), `tests/path-b-mcp.test.js` (uses the extracted
helper), the two new test files, the two new Gate 2 documents, and wiki hub
updates. `rig/lib/onboarding.js`, `onboarding-state.js`, `onboarding-check.js`,
`skill-catalog.js`, `README.md`, and both MCP entrypoints are untouched.

Verified state:

- `node scripts/check-advanced-spec.js` → `oracle signature does not verify`
  (expected: the oracle bytes moved and the owner has not re-signed).
- With the signature bypassed, coverage is exactly consistent: 95 accepted IDs,
  95 trace rows, 95 manifested test titles, no set difference; every manifest
  digest matches its file; 16 manifest entries.
- `tests/onboarding-hardening.test.js` — 8/8 red.
- `tests/onboarding-invariants.test.js` — 9 red, 4 green (I-C-4, I-D-2, I-D-3,
  I-D-4), matching the "pre-signing state" the invariants document predicts.
- `tests/path-b-mcp.test.js` — 5/5 green after the helper extraction.
- `node scripts/build-wiki-index.js` is idempotent; `wiki-maintenance lint` clean.

## Blockers — cases that cannot go green under their own spec

### B1. AT-HD-3 asserts drift the inventory harness cannot observe

`inventoryHarness` (`rig/lib/inspect.js:219`) is a *bounded* harness scan:
`collectHarnessFiles` walks `HARNESS_NAMES`, `.github/copilot-instructions.md`,
and `SCAN_ROOTS` only. It is not a whole-repository inventory.

The test adds `injected-post-approval.md` at the repository root. Measured
directly: the digest is byte-identical before and after
(`82a6f070…3870a` both times). The spec's seam — re-derive `inventoryHarness`
and compare to `state.inventory.digest` — is therefore correct code that leaves
AT-HD-3 red. Spec §3 F3 also rejects option (a) on the stated ground that "a
file added anywhere is drift", which is not the semantics the harness has.

Either the fixture must mutate a harness-visible path (e.g. `AGENTS.md`, or a
file under a scan root), or F3 must be re-scoped to say so explicitly. This
trips the spec's own §7 return-to-grilling trigger.

### B2. AT-HD-4 asserts the wrong projected paths

`projectedSkillName` (`rig/lib/onboarding.js:200`) prefixes every projection
with `rig-`. A Codex+Cursor install projects to `.agents/skills/rig-qa/SKILL.md`
(confirmed by walking a real fixture). The test asserts
`.agents/skills/qa/SKILL.md` and `.rig/skills/qa/SKILL.md`. Both are wrong, so
AT-HD-4 stays red under any correct F4 implementation.

### B3. AT-HD-6's regex does not match the error the harness raises

`inventoryHarness` on a non-existent target throws
`inventory: target must exist` (`rig/lib/inspect.js:221` — `realpathOrNull`
swallows the ENOENT and returns null before any `readdirSync`). The test asserts
`/ENOENT|inventory.*broken|harness/i`, which does not match that string. Fixing
F6 exactly as specified leaves AT-HD-6 red.

## High

### H1. F4 widens a latent instruction-only regression

Payload install lays down core skills **unprefixed** under `.rig/skills/`
(`code-review`, `debugging`, … , `onboarding`), and `PLAYBOOK_REL` is
`.rig/skills/onboarding/SKILL.md`. But `planSkillProjections`
(`rig/lib/onboarding.js:283`) looks for `${scope.root}/${projectedSkillName(skill)}/SKILL.md`
— `rig-debugging`, not `debugging`. Reproduced on a cursor-only install:

```
rig: required skill "rig-debugging" was not staged for instruction-only
```

Today this only bites instruction-only-*exclusive* installs. F4 adds the
instruction-only scope to every mixed install, so after the fix any proposal
selecting a core skill fails on a Codex+Cursor repository. Spec §3 F4 states
"No schema change… `check`'s reconciliation already handles multi-scope
projections" and does not mention this. AT-HD-4's fixture only selects the
optional `qa` skill, so the oracle would not catch it.

### H2. Spec §3 F6 contradicts the executable case it cites

F6 Rejected (a) says returning `[hard_failure('inventory-broken', …)]` is "also
valid; the test accepts either", and Gate 1's AT-HD-6 text says "the exception
propagates **or** becomes a hard failure". The test uses `assert.throws`, which
only accepts the throwing path. One of the three must move before signing, or
the frozen acceptance prose will not describe the frozen test.

## Medium

### M1. AT-HD-8 forces prose to be written around a regex

`.claude/skills/wiki-maintenance/SKILL.md` currently states the *correct* rule —
"you may never rewrite its content" — and AT-HD-8's
`doesNotMatch(/rewrite.*(?:body|content)\b/i)` fails on exactly that sentence.
Spec §3 F8 concedes this, instructing the author to reword "so it no longer
contains the phrase `rewrite … content` (which trips the AT-HD-8 regex on a
positive match)".

Related: the README half of AT-HD-8 is vacuous. Its
`/never edited(?!\s*\.)(?![^.]*frontmatter)/i` is satisfied by the present
unqualified text "…written once and never edited." — the trailing period is the
escape hatch, so the assertion passes today without any qualification.

Freezing a string-shaped proxy for a semantic rule means the next person who
writes the rule naturally makes CI red.

### M2. I-C-2's version scan goes blind exactly when drift occurs

The scan builds its pattern from the *current* `package.json` version. A stale
`releaseTag = 'v5.0.0'` in `rig/lib` becomes invisible the moment `package.json`
moves to `5.0.1` — the drift F5 exists to catch. I-C-1's shape check
(`releaseTag = 'vX.Y.Z'`) still holds, so this is redundancy that reads as
coverage rather than a gap, but it should not be signed as evidence.

### M3. Version single-sourcing is defeated by the signed oracle itself

`tests/helpers/path-b.js:63` passes `releaseTag: 'v5.0.0'` and
`tests/advanced-oracle.test.js:613` asserts `packageJson.version === '5.0.0'` —
both frozen in the manifest. After F5, a version bump still requires editing
frozen oracle files, i.e. an owner re-sign. `README.es.md:43` and
`README.ko.md:41` carry the same literal and AT-HD-5 checks only `README.md`.
`scripts/check-versions.js` already exists as the version-consistency authority
over eight manifests; putting a second, partial version check inside a frozen
acceptance test reproduces theme C rather than closing it.

### M4. F2's exclusive-create has no crash-recovery story

`openSync(temp, 'wx')` is the right guard, but a crash between open and
`renameSync` leaves `.rig/state.json.tmp` behind and wedges every later
onboarding write with `EEXIST`. Spec §3 F2 deliberately rejects unlink-and-retry
(correct) and leaves the operator message as a "if it reads that way" item.
This repository already has a hardening trace for interrupted-run recovery
(`2026-09-01-path-b-hardening-issue4-resume`); the same discipline should give
F2 a stated recovery command. I-A-2 also forbids the `mkdtempSync` shape, so
the recovery path has to be the message.

### M5. Frozen invariants pin implementation shape, not behavior

I-B-2 requires `installedSkillScopes` to take exactly two parameters and to
contain a `for … of <param2>` loop; I-A-1 requires a symbol literally named
`proposalBodyDigest(`; I-B-1 requires the literal token `journalWriter(` as the
mutation boundary; I-A-3's catch scanner captures bodies with `[^}]*`, so any
catch containing a nested block or object literal is mis-parsed. These are
deliberate ratchets and the intent owner asked for them — but signed under
Gate 1 they mean every future rename or refactor of these functions needs an
owner re-sign ceremony. That cost should be an explicit decision, not a
side effect.

## Low

- `Home.md:93` and `Home.md:112` still read "all 83 cases" and "The verified
  14-file oracle protects all 83 cases". The manifest is 16 files, the set is
  95, and nothing verifies right now. `topics/the-two-gates.md:96` and
  `topics/what-rig-is.md:82` carry the same stale counts. The primer names
  `Home.md` as the map, so this is the first page a cold session reads.
- `index/acceptance-cases.md` says a grep finds "99 distinct strings"; it finds
  100 (five undefined mentions, not four: `AT-CLAIM-2`, `AT-CLAIM-3`,
  `AT-HOST-3`, `AT-HOST-4`, `AT-P7`). Pre-existing off-by-one at HEAD (88, not
  87) carried forward by the +12 edit.
- AT-HD-1 has a dead branch: `h.signApproval ? … : require('./helpers/path-b-approval').signApproval(…)`.
  `signApproval` is not exported from `tests/helpers/path-b.js`, so the first
  arm never runs.
- AT-HD-1's `assert.throws` predicate `/digest|tamper|integrity|proposal/i` is
  loose enough that unrelated onboarding failures naming "proposal" would
  satisfy it.
- AT-HD-2 asserts the *absence* of a side effect, so any earlier unrelated throw
  in `propose` also makes it green.

## Verified compatible (no action)

- F7's proposed text `"prepared → inspect-repository"` (29 chars) still
  satisfies the frozen `AT-PB-5` assertion `assert.match(content[0].text,
  /inspect-repository/)` in `tests/path-b-mcp.test.js:44`.
- F1 is implementable exactly as specified: stripping `digest` and re-hashing
  `canonical(body)` reproduces `state.proposal.digest` byte-for-byte on a live
  fixture.
- The `withMcpClient` extraction is a clean move with no behavior change;
  `tests/path-b-mcp.test.js` is 5/5 green.
- Manifest digests, ID set equality, generated-index idempotence, and
  `wiki-maintenance lint` all hold.

## Recommendation

Do not run the signing ceremony on these bytes. B1, B2, and B3 each trip the
spec's own §7 trigger ("a test cannot be made green by the spec above without
changing the test body"), and a signed oracle can only be corrected by an
unfreeze request. Fix the three fixtures, resolve H2's three-way contradiction,
and record H1 as either an F4 sub-task or a separate finding before signing.
