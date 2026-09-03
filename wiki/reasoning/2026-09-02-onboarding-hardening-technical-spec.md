---
date: 2026-09-02
source: agent
topics: path-b-onboarding, gate1-signing, security
decisions:
status: current
summary: rig-product-design output — technical spec for the eight AT-HD-* onboarding hardening findings, filed as wiki/gate2/onboarding-hardening-spec.md
---

# Technical spec for onboarding hardening — 2026-09-02

Companion to the 2026-09-02 grilling trace and the AT-HD-1…AT-HD-8 oracle.
Records the design decisions made by `rig-product-design` before Gate 1 signing.

## Placement decision

`wiki/gate2/technical-spec.md` already holds the v0.17 working design pinned to
the Gate 1 `business-spec.md` / `acceptance.md` digests. Overwriting or
restructuring it would break its pinning and destroy 3047 lines of unrelated
design work. Instead the hardening design is filed as a peer document at
`wiki/gate2/onboarding-hardening-spec.md`. Both live in `wiki/gate2/`; the
Gate 1 presence check is satisfied by any spec addressing the frozen oracle.

## Design decisions worth naming

1. **F1 (AT-HD-1) — one guard, top of `apply()`, not six per-consumer guards.**
   The proposal-body digest is re-derived once via a new
   `proposalBodyDigest(proposal)` helper in `onboarding-state.js` (symmetric
   with the existing `canonicalProposal` writer) and compared to
   `state.proposal.digest` before any consumer reads `state.proposal.*`.
   Rejected: per-consumer re-derivation (noisy) and re-derivation in
   `readState` (wrong scope — a body-tamper is only semantically fatal in
   `apply`).

2. **F2 (AT-HD-2) — `openSync('wx')`, no unlink-retry.** On `EEXIST` the temp
   is not unlinked; the operator manually removes a stale `.tmp` from a prior
   crash. Unlink-and-retry is exactly the attack window the fix closes.

3. **F3 (AT-HD-3) — inventory guard sits alongside the catalog-digest guard,
   not inside per-file preflight loops.** The whole-repo digest is the right
   granularity: a file added under an untouched directory is drift, and
   per-file loops would miss it.

4. **F4 (AT-HD-4) — instruction-only becomes unconditional when the playbook
   exists**, not an "explicit hosts list" refactor. The playbook at
   `.rig/skills/onboarding/SKILL.md` is always installed for a Rig-onboarded
   target; adding it unconditionally is the smallest change that satisfies
   the mixed-host acceptance case. A `hosts` parameter is a refactor without
   a behavioral gain here.

5. **F5 (AT-HD-5) — throw when `releaseTag` is omitted; read from
   `package.json` in the sole production caller.** Rejected: reading
   `package.json` inside `buildSkillCatalog` (creates a library ↔ manifest
   dependency; production callers already have both in hand). Rejected:
   templating README examples (worse UX; the AT-HD-5 test is the drift alarm).

6. **F6 (AT-HD-6) — throw, not push-hard-failure.** Both satisfy the oracle;
   throwing keeps the failure shape uniform with `loadInstalledCatalog`, which
   already throws for the same class of unrecoverable verification state.

7. **F7 (AT-HD-7) — inline the summary in both files; do not extract a shared
   helper.** No shared code module exists between `rig-mcp/` and
   `rig/mcp-runtime/` today; the copy-check policing byte-identical duplicates
   is the enforcement. Extracting a helper for four lines is machinery.

8. **F8 (AT-HD-8) — reword both docs, not just `reasoning/README.md`.** The
   AT-HD-8 regex `/rewrite.*(?:body|content)\b/i` matches the current
   `wiki-maintenance/SKILL.md` phrase "you may never rewrite its content" —
   despite the "never," the pattern hits. Reworded to "the body itself is
   immutable" to avoid the trigger while keeping the intent.

## Cross-cutting invariants extracted from the reviewer's themes

Seven invariants (I-1…I-7) are stated in §1 of the spec. They shape the fix
choices and are the material for prevention-strategy follow-ups. Prevention
strategies that ARE follow-up tickets (not this branch): the two lints, the
adversarial-case CI catalogue seed, the cross-doc-invariant wiki-lint, and
rejected-approach traces per trust boundary. All captured in §5 of the spec.

## Slice ordering

S1–S8 in §4 of the spec. Chosen to warm the branch with low-risk docs and
module-contract work (F8, F5, F7), then isolated single-file changes (F6, F2),
then `installedSkillScopes` (F4) before the two `apply()` top-of-function
guards (F3, F1). Parallel execution is safe per the user handoff; the ordering
matters only for a single-agent implementation.

## Return-to-grilling triggers

Named in §7 of the spec. No trigger fires as of this trace. If one fires
during implementation, the grilling session re-opens rather than the design
adapts around silently.

## Follow-up

- The intent owner reviews this spec and the oracle test file, then runs
  `node scripts/approve-gate1.js` to sign the oracle.
- Implementation begins after signing; each slice's completion signal is its
  named oracle test turning green. Full-gate `npm test` runs once before push.
- The five follow-up items in §5 of the spec are captured as future work; they
  are pattern-level prevention beyond the eight-fix scope.
