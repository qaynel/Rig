---
date: 2026-09-03
source: agent
topics: onboarding-flow, gate1-signing, trust-and-failure-boundaries, testing-strategy
decisions:
status: superseded
supersedes:
tags: interdependency
summary: Phase 0 oracle corrections in progress — the owner's eight correction items from the 2026-09-03 oracle review are being applied to the unsigned AT-HD-1..12 tests; production code is untouched until re-sign.
---

# Onboarding hardening Phase 0 — oracle corrections in progress

The intent owner (Vaibhav Kodiyan, gate1 owner) supplied a full corrected work
order responding to `2026-09-03-onboarding-hardening-oracle-review.md`'s B1-B3
blockers and H1-H2/M1-M5 findings. The current worktree's `gate1.sig` is
already re-signed over the *pre-correction, defective* 95-case oracle bytes
(confirmed: `node scripts/check-advanced-spec.js` verifies against the
uncommitted working tree right now) — this matches the owner's stated
CURRENT STATE: "That signature was created after the review found defects in
the oracle." This session's job is Phase 0: correct the oracle test bodies and
working Gate 2 docs to fix B1/B2/B3/H1/H2/M1-M5, without touching production
code (`rig/lib/*`, `rig-mcp/*`), then hand back for the owner to re-sign.
Production implementation (Phase 1, A-H in the owner's message) is blocked
until that re-sign lands and `check-advanced-spec.js` reports a verified
16-file/95-case oracle again over the corrected bytes.

**No SSH signing key is available in this sandbox** (`ssh-add -l` → "The agent
has no identities"; no Secretive socket). The re-sign ceremony
(`node scripts/approve-gate1.js`) cannot be run here — it needs the owner's
machine. This session prepares the unfreeze request and the corrected bytes,
then stops for the owner to run the ceremony.

## Key design findings from source inspection (informs the corrected test bodies)

- `AGENTS.md`/`CLAUDE.md` are both in `HARNESS_NAMES` (`rig/lib/inspect.js:12`);
  the Path B fixture (`tests/helpers/path-b.js:50`) only pre-creates `AGENTS.md`
  + `README.md`, so `CLAUDE.md` is a legitimate "newly created, harness-visible,
  untouched-by-the-proposal" file for AT-HD-3's corrected fixture.
- `inventoryHarness` on a non-existent target throws exactly
  `"inventory: target must exist"` (`rig/lib/inspect.js:221`) — AT-HD-6's regex
  must match this literal string, not `ENOENT`.
- Core skill source frontmatter `name:` is **already** `rig-`-prefixed
  (`rig/tier-1/skills/debugging/SKILL.md` declares `name: rig-debugging`), so
  the catalog id/name for that skill is literally `rig-debugging`. Optional
  skills like `qa` are unprefixed at the source
  (`rig/catalog/skills/testing/web-quality-assurance/qa/SKILL.md` declares
  `name: qa`). `projectedSkillName` today applies one prefixing rule
  uniformly for every scope; the Phase-1 F4/D fix must derive a canonical
  unprefixed name (strip a leading `rig-` if present) and then apply
  `rig-<name>` for native scopes and `<name>` for instruction-only — which is
  exactly what reproduces the owner's requested paths: native
  `.agents/skills/rig-qa/SKILL.md` / `.agents/skills/rig-debugging/SKILL.md`,
  instruction-only `.rig/skills/qa/SKILL.md` / `.rig/skills/debugging/SKILL.md`.
  So AT-HD-4's corrected fixture must select `['qa', 'rig-debugging']` (the
  real catalog ids), not `['qa', 'debugging']`.
- `apply()`'s `response()` helper (`rig/lib/onboarding.js:104`) does **not**
  echo `state.applied.projections` into its return value — any AT-HD-4
  assertion on `applied.projections` must read `.rig/state.json` directly,
  the same way AT-HD-1 already does.
- `scripts/check-advanced-spec.js`'s `testTitleIds()` extracts only the
  **leading** `AT-[A-Z]+-\d+` token from each `test(...)` title and
  deduplicates by that token. Two sibling tests sharing one ID prefix (e.g.
  `AT-HD-9 I-A-2 ...` and `AT-HD-9 I-A-3 ...`) count as **one** ID. This means
  the frozen "95-ID set" is untouched by rewriting a sibling test's body or
  even by adding/removing sibling tests under an already-represented prefix —
  only the technical-spec.md trace row's *exact quoted title* for the
  canonical test per ID is order-sensitive, and `wiki/gate2/technical-spec.md`
  is NOT itself digested in the frozen manifest (only checked for shape/
  presence), so its trace-row wording can be edited freely in the same
  change. This is what makes items 3 and 7 of the owner's list tractable
  without exploding the ID count.
- `tests/helpers/path-b.js` and `tests/advanced-oracle.test.js` (AT-DIST-1,
  `packageJson.version === '5.0.0'`) are BOTH in the frozen 16-file manifest —
  the "derive the fixture release tag from package.json" and "generalize the
  frozen distribution assertion" corrections both require unfreezing these
  two files too, in addition to the two AT-HD-* test files.

## Plan for the remaining corrections (not yet all applied at time of writing)

1. AT-HD-3 (`tests/onboarding-hardening.test.js`): swap
   `injected-post-approval.md` at repo root for `CLAUDE.md`; snapshot the
   graft target (`AGENTS.md`) bytes before `apply()`, assert throw, then
   assert the graft target is still byte-identical (proves refusal precedes
   mutation).
2. AT-HD-4: select `['qa', 'rig-debugging']`; assert both scope-correct
   projected paths for each; read `.rig/state.json` and assert
   `applied.projections` host_scope set contains both `codex` and
   `instruction-only`.
3. AT-HD-6: change the `assert.throws` matcher to
   `/inventory:\s*target must exist/i`.
4. AT-HD-8: drop both `doesNotMatch` negative regexes; keep/expand positive
   `assert.match` requirements for body-immutable, frontmatter-mutable, and
   mutual cross-citation.
5. AT-HD-5: extend to loop over `README.md`, `README.es.md`, `README.ko.md`.
6. `tests/helpers/path-b.js`: derive `installRuntime`'s `releaseTag` from
   `package.json` instead of the literal `'v5.0.0'`.
7. `tests/advanced-oracle.test.js` AT-DIST-1: replace
   `assert.equal(packageJson.version, '5.0.0')` with a semver-shape assertion;
   `scripts/check-versions.js` stays the cross-file consistency authority.
8. AT-HD-2: rewrite to require an actionable EEXIST message (not swallow any
   throw), keep the outside-sentinel-unchanged assertion, then remove the
   stale `.tmp` symlink and prove a retry succeeds.
9. AT-HD-1: hoist `signApproval` to a top-level `require`, drop the dead
   `h.signApproval` branch, and tighten the throw matcher to
   `/tampered post-signing.*digest mismatch/i` (the literal F1 message).
10. `tests/onboarding-invariants.test.js`: rewrite I-A-1, I-B-1, I-B-2, I-A-3
    away from source-shape/identifier-name parsing into adversarial
    behavioral checks (no-mutation-on-tamper, no-mutation-on-drift, a second
    mixed-host arrangement, and an end-to-end `check()` propagation proof
    through a symlinked harness file) while keeping every test's leading
    `AT-HD-9`/`AT-HD-10` ID token unchanged so the frozen ID set doesn't move.
    Rewrite I-C-2 to reject *any* quoted version literal in `rig/lib`, not one
    built from the current `package.json` version.
11. Update `wiki/gate2/onboarding-hardening-spec.md` and
    `-invariants.md` (both working docs, not frozen) to describe the
    corrected F4 per-scope naming, F6 throw-only shape, F2 recovery story, and
    the behavior-focused invariant replacements.
12. Fix stale 83-case/14-file mentions in `Home.md`,
    `topics/the-two-gates.md`, `topics/what-rig-is.md`; fix or drop the
    "grep finds N strings" claim in `index/acceptance-cases.md`.
13. File the dated unfreeze request under `wiki/gate1/` citing the review
    trace and this trace, treating the owner's itemized message as the
    authorization record (owner is the git-identity author of the message).
14. Run `node scripts/check-advanced-spec.js` (expect "does not verify" — bytes
    moved, unsigned) as proof the correction is real, then stop and hand back
    to the owner for the re-sign ceremony. Do not touch `rig/lib/*`,
    `rig-mcp/*`, or `rig/mcp-runtime/*` in this phase.
