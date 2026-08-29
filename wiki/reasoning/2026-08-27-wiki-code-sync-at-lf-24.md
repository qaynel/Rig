---
date: 2026-08-27
source: agent
topics: trust-and-failure-boundaries, gate1-signing, delivery-plan, testing-strategy
decisions: none
---

Asked to bring the wiki up to date with the code where it had drifted or
rotted. Starting point: HEAD is `dd65b97` ("RIG-115: refuse escaping
repository symlinks in planExecution (AT-LF-24)", #90), the fourth of four
merged PRs (#87, #88, #89, #90) landing `AT-LF-20` through `AT-LF-24`
back-to-back on this branch. The wiki had not been touched since before any
of the four landed.

Verified directly rather than trusting prior wiki prose:
- `node --test --test-name-pattern "AT-LF-24" tests/advanced-oracle.test.js`
  passes.
- Full `npm test`: root 490/491 (1 expected Linux-only skip), pi-extension
  15/15, rig-mcp 6/6 — all green.
- `node scripts/check-advanced-spec.js` prints "Gate 1 protected" (signature
  verifies) and its internal `verifyCoverage` asserts `accepted.length === 73`
  — the 73-case oracle is real and enforced, even though the script's own
  final log line hardcodes the string "68 acceptance cases" (a stale literal
  in `scripts/check-advanced-spec.js:166`, not fixed here — it's a code
  cosmetic bug, not a wiki fact, and out of scope for a wiki-only pass;
  flagged to the user).
- `wiki/gate1/acceptance.md` already contains `AT-LF-20`–`AT-LF-24` (77
  distinct `AT-` strings total, 73 defined + 4 deleted, matching
  `verifyCoverage`'s enforced count).
- `wiki/gate2/technical-spec.md` §9.4's trace table (lines ~2510–2514) already
  had correct rows for all five cases — only its prose narrative and header
  metadata (case count, version blurb, Gate-1 hash pins, decision ID) had not
  been updated alongside.
- The Gate-1 hash pins printed in `technical-spec.md`'s "Gate 1 pins" table
  did not match the real current `sha256` of `business-spec.md`/`acceptance.md`
  on disk — recomputed and corrected them.
- `wiki/index/decisions.md`'s D28 entry said "`AT-LF-22`–`AT-LF-24` remain
  frozen ahead of their runtimes" and the `D#` summary row said "D28 awaits
  the combined oracle signature" — both false: the oracle is signed
  (`check-advanced-spec.js` prints `Gate 1 protected`) and all five cases are
  implemented.
- `wiki/gate2/technical-spec.md` cited "the D25 amendment" for this change;
  the actual decision ID recorded in `decisions.md` is D28 (D25 is an
  unrelated business-intent-optional ruling from 2026-08-24). Corrected the
  citation.
- `wiki/index/acceptance-cases.md` §H had never been extended past `AT-LF-19`
  at all — it was missing rows for `AT-LF-20`–`AT-LF-24` outright, not just
  carrying a stale count. Added the five rows, bumped the section header, the
  "how the set has moved" table, and the distinct-string count (72→77,
  68→73).
- `wiki/tickets/RIG-115.md`, `wiki/tickets/RIG-120.md`, and `wiki/Tickets.md`
  all still described `AT-LF-22`/`AT-LF-23`/`AT-LF-24` as pending and RIG-120
  as blocked on RIG-124.1's disposition — both are stale. RIG-124.1 closed
  earlier in the same status.md log (GitHub #73), and this branch's own HEAD
  closes the last of the five shell-trust cases. Updated all three.
- `wiki/Home.md`, `wiki/specs/mvp-roadmap.md`, `wiki/topics/delivery-plan.md`,
  `wiki/topics/testing-strategy.md`, `wiki/topics/trust-and-failure-boundaries.md`
  each still quoted "68" as the live acceptance-case count; updated to 73
  with a D28 citation.

Deliberately left untouched: `wiki/gate1/business-spec.md` and
`wiki/gate1/acceptance.md` (frozen, signed oracle bytes — an implementing
agent must not edit either, and their own internal "68-case set" prose refers
to a fixed historical revision note, not the live count); every closed
ticket's own "68-case oracle" evidence line (RIG-105/107/108/109/111/114/119/133
— accurate as of when each was written, and immutable historical record like
a reasoning trace); `wiki/index/timeline.md` and reasoning traces (dated
history, never rewritten); `wiki/specs/lint-format-roadmap.md` and
`lint-format-grilling-handoff.md` (describe the D21 v0.6 retrace specifically,
not the current live count).

Net effect: RIG-115 is now accurately DONE everywhere it's mentioned, and
RIG-120's only real remaining blockers are the three owner-controlled ceremony
inputs (fresh independent review receipt, signer-class attestation, tag +
publish) — no implementation work is outstanding.
