---
date: 2026-08-25
source: agent
topics: review-receipts, agent-working-conventions
decisions: RIG-124
status: historical
---

RIG-124 landed straight from its own draft acceptance without a further
grilling round: the ticket's problem statement, proposed resolution, and
draft acceptance were already derived from a prior investigation
([[2026-08-25-token-burn-investigation]]) against three real transcripts, and
the user explicitly delegated ("not much context from my side... just try to
resolve it on your own"). Declaring the inferences made along the way, since
no separate sign-off conversation happened:

## Inference: AT-GATE-3 does not require re-signing for Change 1

The ticket's design note flagged this as open: "confirm this does not require
re-signing the frozen oracle." Checked `wiki/gate1/testing-infrastructure.manifest`
— the byte-pinned set is exactly `scripts/check-advanced-spec.js`,
`tests/advanced-oracle.test.js`, `tests/advanced-spec-gate.test.js`,
`tests/helpers/advanced.js`, `wiki/gate1/package-scripts.json`. Neither
`scripts/review-receipt.js` nor `rig/lib/release-evidence.js` is in it. The one
frozen test that touches the wrapper (`tests/advanced-spec-gate.test.js`
"AT-GATE-3 review is fresh report-only release evidence") only exercises
`validateReviewReceipt`'s fresh-session/report-only/digest-binding contract on
a receipt object directly — it says nothing about the wrapper's CLI, retry
count, or model tiering. So the re-review cap, `--interim`, and
`--force-rereview` are wrapper-level policy outside the frozen oracle; no
re-sign needed. Verified the frozen test still passes unmodified after the
change (`node --test tests/advanced-spec-gate.test.js` via the full gate).

## Design: how the cap and interim mode work

`scripts/review-receipt.js` now tracks failures per `--author-context` in a
sibling `<out>.attempts.json` file. A `fail` verdict increments it; a `pass`
clears it (a later, unrelated review need starts fresh). Before spawning the
reviewer, a prior-failure count above `MAX_RE_REVIEWS` (1) refuses to run —
"at most one re-review after a fix" becomes two allowed attempts, a third
blocked — with `--force-rereview` as an explicit, visible override rather than
a silent bypass. `--interim` runs the same review but never writes the
binding receipt (prints verdict + findings, exits non-zero on fail); only a
non-interim run produces AT-GATE-3 evidence, so a cheap interim pass can never
be mistaken for the release receipt. Default (no new flags) behavior is
byte-identical to before, so the frozen `tests/advanced-spec-gate.test.js`
invocation is untouched. New coverage in `tests/release-blockers.test.js`
(not frozen) exercises the cap, the per-author-context scoping, the pass
reset, `--force-rereview`, and `--interim`.

## Inference: task-weight carve-out definition

The ticket asked for "a lightweight path for single-step tasks" without
specifying the exact boundary. Defined it in `rig/tier-1/routing.md` as: a
one-line fix, a factual question, or a single-file edit with no cross-file
coordination and no wiki-truth change (no new decision/spec/status/rejected
approach). That carve-out relaxes the routing re-read, full skill read, wiki
pre-read, and 3-minute `status.md` cadence; anything crossing into multiple
files/turns or moving what's true in the wiki uses the existing full cadence.
This mirrors the existing wiki-discipline text closely enough to stay
consistent with `agent-working-conventions`'s existing description of that
cadence.

## What changed

- `scripts/review-receipt.js` — re-review cap, `--interim`, `--force-rereview`
  (`WRAPPER_VERSION` bumped 3→4).
- `tests/release-blockers.test.js` — new coverage for the above.
- `rig/tier-1/skills/tdd/SKILL.md` (+ synced `.claude/skills/rig-tdd/SKILL.md`,
  `.agents/skills/rig-tdd/SKILL.md`) — red/green inner loop is
  `npm run test:rig` or the single test file, never the full gate.
- `rig/tier-1/routing.md` — new "Task weight" section (lightweight path).
- `CLAUDE.md` — cross-references the lightweight path and the inner-loop rule.
- `docs/advanced/operator.md` — documents the new flags and release-only
  policy for `review-receipt.js`.

Full gate green before finishing: 434 root / 15 pi-extension / 6 rig-mcp.
