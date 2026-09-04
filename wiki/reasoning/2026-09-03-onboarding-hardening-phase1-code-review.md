---
date: 2026-09-03
source: review
topics: onboarding-flow, trust-and-failure-boundaries, testing-strategy
decisions:
status: historical
supersedes:
tags: review
summary: Multi-agent code review of the Phase 1 onboarding-hardening diff (49afffd6..HEAD) found four real defects beyond the oracle's own coverage — an unscoped resume signal, a lost host-scope fallback, an over-broad name-tolerance, and a false-negative on legitimate empty host lists. All four fixed; three simplification/reuse findings deferred as non-blocking.
---

# Phase 1 code review — four real findings, four fixes — 2026-09-03

## Scope

Five parallel review agents examined `git diff 49afffd6..HEAD` (the six
Phase 1 implementation commits) along independent axes: CLAUDE.md
conventions, simplification/reuse, removed-behavior audit, cross-file
caller tracing, and a line-by-line scan. CLAUDE.md conventions came back
clean. The other four surfaced real, independently-corroborated defects
(two agents independently found the same `interrupted()` scoping gap) plus
several simplification findings deferred as non-blocking.

## Fixed: F3's `writer.interrupted()` carve-out was unscoped

The [F1/F3 resume trace](../reasoning/2026-09-03-onboarding-hardening-phase1-f1-f3-resume.md)
skipped F3's inventory-freshness check whenever `writer.interrupted()` was
true, reasoning that an open journal transaction means "my own crashed run."
Wrong: `.rig/install-manifest.jsonl` is shared across the installer
(`runPayload`), every past `apply()` call, and every proposal. A stale,
unrelated interrupted transaction — the installer crashing, or an abandoned
`apply()` for a since-superseded proposal — would silently disable the
freshness check for a *different*, genuinely fresh apply, reopening exactly
the stale-approval bypass F3 exists to close.

Fix: tag the transaction with the proposal's own digest. `journalWriter`
now accepts `{ transactionOwner }`; `start()` records it on the `install_state`
record that opens the transaction; a new `interruptedOwner()` accessor
exposes it. `apply()` passes `state.proposal.digest` as the owner and only
treats the interruption as its own resume when
`writer.interruptedOwner() === state.proposal.digest`. An unrelated
interruption (no owner tag, or a different proposal's digest) no longer
short-circuits the check.

## Fixed: `instructionOnlyScope` lost the old catch-all fallback for uncommon hosts

Per the technical spec, `instructionOnlyScope` only returns a scope for
hosts in the `INSTRUCTION_ONLY_HOSTS` registry set. The pre-F4 aggregate
code had no such gate — any host with no native marker fell back to the
one instruction-only scope whenever the playbook existed. Verified
empirically: `.rig/skills/onboarding/SKILL.md` (the playbook) is staged
unconditionally (`host: "neutral"`, gated only on delivery mode, not on
`instruction_only_selected`), so it exists even for a host like
`copilot-cli` that is in neither `INSTRUCTION_ONLY_HOSTS` nor the native
pair. An optional-skill-only proposal (no core skills — confirmed a
proposal can validly select zero core skills) for a `copilot-cli`-only
install used to succeed and, with the spec's literal registry gate, now
threw `"no installed skill discovery scope is available"` — a real
regression, reproduced and then fixed by an empirical apply() run before
and after.

Fix: dropped the `INSTRUCTION_ONLY_HOSTS.has(host)` gate from
`instructionOnlyScope`. Any host without a native scope falls back to
instruction-only when the playbook marker exists, matching the pre-F4
fallback exactly — just now correctly per-host (via the same `scopes` Map
dedup) instead of aggregate-suppressing. This is a deliberate, verified
deviation from the technical spec's literal §3 F4 text; recorded here per
the spec's own §7 trigger for "breaks an existing accepted case," even
though no existing *test* covered this combination — only the review's
code reading and this session's empirical repro did.

## Fixed: `projectionFailures`' canonicalize was too permissive for native scopes

The [F4 scopes trace](../reasoning/2026-09-03-onboarding-hardening-phase1-f4-scopes.md)
made the skill-name-mismatch check canonicalize both sides (strip leading
`rig-`) to accommodate the legitimate core-skill/instruction-only case. That
also weakened native-scope checking: a tampered `.claude/skills/rig-debugging/SKILL.md`
declaring `name: debugging` (missing its mandatory prefix) would now pass,
where the pre-diff literal-equality check caught it.

Fix: made the tolerance scope-conditional — canonical comparison only for
`row.host_scope === 'instruction-only'`; every other scope keeps exact
literal equality, since native directories are always `rig-<name>` and
`rewriteProjectedName` always makes optional-skill bytes match exactly.

## Fixed: `installedHostIds` treated a legitimate empty list as malformed

`runPayload` legitimately writes `hosts: []` for a bare/no-adapter install
(confirmed by `tests/release-blockers.test.js`'s own assertion). The new
`installedHostIds` required `hosts.length` truthy, so any subsequent skill
selection against such a target failed with a misleading "no valid hosts
list; re-run the installer" instead of the correct, clearer
"no installed skill discovery scope is available" `installedSkillScopes`
already produces for a genuinely empty host set. Fix: only fail on a
missing file, non-array, or non-string-element `hosts` — an empty array is
valid and passed through.

## Deferred as non-blocking (simplification/reuse, not correctness)

- `rig-mcp/index.js`/`rig/mcp-runtime/index.js` duplication has no
  byte-identity test outside `AT-HD-11 I-C-4`'s own coverage of exactly
  this file pair — already covered, not a gap.
- `nativeScope`'s two hardcoded host branches could read
  `host-capabilities.js`'s `REGISTRY.surfaces.skills` instead of literal
  paths. Real simplification opportunity, not a correctness issue — left
  for a future pass since the registry's `surfaces.skills` values aren't
  currently normalized to the exact relative paths this function needs.
- `canonicalSkillName`/`scopedSkillName` aren't exported from
  `onboarding.js`, so `onboarding-check.js` reimplemented an equivalent
  `canonicalize` inline. Now intentionally *not* identical (see the
  scope-conditional fix above), so sharing one function would need a
  parameter for the tolerance policy — deferred as a real but small future
  cleanup, not urgent.
- `atomicWrite`'s exclusive-create-plus-EEXIST idiom duplicates a pattern
  already inline in `rig/lib/apply.js`, `onboarding.js`'s lock file,
  `lint-format.js`, and `policy.js`. Pre-existing duplication pattern in
  this codebase, not introduced by this diff — a shared helper is a
  reasonable future extraction, out of scope here.

## Verification

`node --test tests/onboarding-hardening.test.js tests/onboarding-invariants.test.js`
— 21/21 pass. `node --test tests/path-b-*.test.js tests/context-aware-onboarding.test.js
tests/release-blockers.test.js tests/rig-bootstrap.test.js
tests/install-uninstall-roundtrip.test.js tests/installed-router-hygiene.test.js`
— 206/206 pass. Full `npm test` — exit 0, all suites green (main, pi-extension,
rig-mcp, Hermes, pandas-backed benchmark).
