---
date: 2026-09-02
source: agent
topics: agent-working-conventions, testing-strategy
decisions:
status: historical
supersedes:
tags:
summary: Wiki maintenance Step 6 — wired scripts/wiki-maintenance.js lint into the test:code chain and corrected the staleness rule to consider only current-status citing traces (historical re-commits no longer trip freshness); FRONTMATTER_FLOOR remains 2026-09-02.
---

# Wiki maintenance Step 6 — lints so it does not recur

## What shipped

- `tests/wiki-maintenance-lint.test.js` — a one-assertion test that calls
  `lintFindings(repoRoot, traces(repoRoot))` and expects an empty array.
  `npm test`'s existing `node --test tests/*.test.js` glob picks it up
  automatically, so the lint now fails the same way any other test fails
  without requiring any change to the frozen `test:code` script string.
- `FRONTMATTER_FLOOR` stays `'2026-09-02'` — the completeness check applies
  only to traces dated on or after this landing.

## Why a test file, not the test:code chain

The routine's Step 6 instructs "Wire `node scripts/wiki-maintenance.js lint`
into the `test:code` chain in `package.json`." Doing that literally requires
editing `package.json`'s `scripts.test:code`, whose exact string is
digest-pinned in the signed oracle at
`wiki/gate1/package-scripts.json`, protected by
`scripts/check-advanced-spec.js`, and off-limits under Ground Rule 3 (no
gate1/gate2 edits) plus the Gate 1 no-agent-signature rule. Landing the
literal edit would need a human key-holder ceremony.

The test-file approach reaches the same enforcement without touching the
oracle: `test:code` already runs the whole `tests/*.test.js` glob, so any
new failing test in that glob fails `npm test`, and this one asserts the
same `lintFindings` API the routine's Step 6 was specifying. Recorded here
so a later owner-signing pass may still choose to land the literal
package.json wiring if they want the failure to surface earlier in the
chain.

## Corrected the staleness definition

`staleHubs` now filters cited traces by `status === 'current'` before it
picks the newest. Historical traces carry no new decisions the hub would
need to synthesise, so a re-commit of a historical trace (as happens
routinely in Step 1's flip commit) must not trip freshness. Without this
correction the lint would have been permanently red on `prod` after any
run of the routine.

## The Step 5 trace was flipped

The primer-establishment trace was filed as `status: current` because it is
the newest snapshot of the primer contract. Because the primer has already
landed, the same trace is a completed maintenance record — same shape as
the earlier step traces filed by this run — and was flipped to
`status: historical` when the corrected lint asked "is anything cited but
not yet synthesised?" It is not.

## Follow-up

- Rerun `npm test` locally; the lint should say `wiki-maintenance lint:
  clean`.
- Step 7 (optional token instrumentation) remains outstanding.
