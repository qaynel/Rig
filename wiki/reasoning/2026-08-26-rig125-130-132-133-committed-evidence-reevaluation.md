---
date: 2026-08-26
source: agent
topics: agent-working-conventions, testing-strategy, review-receipts
decisions:
---

# Re-evaluating RIG-125/130/132/133 from committed evidence only

Follow-up to [[2026-08-26-rig125-130-132-133-reinvestigation]], which found the
eight `[[...]]` citations on these four tickets dangling. The owner asked: given
that the cited analysis is gone, can the tickets' claims still be evaluated from
whatever *is* committed? Yes — this is that pass. Method: for every checkable
factual claim in the four ticket bodies, find independent committed evidence
(code, real test runs, other surviving reasoning docs, real data files) rather
than trusting the ticket's own prose or the dead citations.

## Finding A — the dead-citation surface is bigger than the `[[...]]` links

The prior pass only grepped for `[[...]]` wiki-links. RIG-132 also cites two
files by ordinary markdown link:

```
wiki/tickets/RIG-132.md:206: [`sources/reference/normalized-semantic-architecture.raw.md`](../sources/reference/normalized-semantic-architecture.raw.md)
wiki/tickets/RIG-132.md:256: [`sources/reference/branch-by-abstraction-migration.raw.md`](../sources/reference/branch-by-abstraction-migration.raw.md)
```

Neither exists. `wiki/sources/reference/` holds six other `.raw.md` files, not
these two. These were supposed to be the verbatim source material behind
RIG-132's "outside analysis" (semantic-model architecture, Expand→Migrate→Contract
migration pattern) — the most speculative, least-yet-implemented part of the
ticket. That material is gone the same way the eight `[[...]]` docs are.

Also confirmed (grep, not re-detailed here): the dead-citation set is not scoped
to these four tickets. `RIG-126.md` through `RIG-134.md`, `Tickets.md`, and
`status.md` all carry at least one of the same nine dead names. RIG-126–129/131/134
are already closed, so this is a paper-trail defect on closed work, not an open
risk — noted for completeness, not actioned here.

## Finding B — a surviving committed document independently corroborates three of the four tickets

`wiki/reasoning/2026-08-25-prev5-gate-runbook-and-classification.md` **is
committed** (unlike its own cited sources, which are also dead). It is a
distilled, line-numbered classification of the same findings the four tickets
argue from, written by a different pass on 2026-08-25, and it agrees with them
independently:

- Its §1 table tags 134.2/134.3 (`materializeSelectedHosts` has zero production
  callers; a signed oracle case tests it anyway) as `debt` and names this "the
  strongest single argument for RIG-133" — matching RIG-133's own claim, sourced
  independently.
- Its §2 step 6 describes the raw-field allowlist ratchet exactly as RIG-132's
  "pre-v5 ratchet only" packet was actually built and already confirmed shipped
  (rig/raw-registry-access.json, 5/5 tests green).
- Its §2 step 3 pulls RIG-125's install→uninstall→"tree is clean" roundtrip test
  forward as the gate for the uninstall cluster — matching the now-landed
  `tests/install-uninstall-roundtrip.test.js`.

`wiki/tickets/RIG-134.md` (Status: **DONE**, closed by PR #34) is the second
independent corroborating source. It documents, with file:line traces and a
committed grep transcript, the same 134.1–134.3 findings RIG-133 rests its
central argument on:

```
$ grep -rn "materializeSelectedHosts" rig scripts hooks tests bin
rig/lib/host-capabilities.js:327   (definition)
rig/lib/host-capabilities.js:362   (export)
tests/advanced-hosts.test.js:90
tests/advanced-oracle.test.js:351
```

This is real, re-runnable evidence, committed and shipped — not a citation to
something that must be taken on faith. **RIG-133's central claim (a byte-pinned
oracle case spends coverage budget on dead code while the real shipping path,
`contractFor`, carries no signed case) stands independently of the missing
"escaping the quadratic" analysis.**

## Finding C — RIG-130's evidence table is 6/7 independently verified, 1/7 unrecoverable

RIG-130's core argument rests on a 7-round table of blocker/major/minor counts
showing no downward trend. Checked each row against the actual committed receipt
JSON in `wiki/sources/reviews/`:

| Round | Ticket claims | Actual `.review.json` | Match |
|---|---|---|---|
| gate2-v0.4-round1 | 1/1/0 | `{blocker:1, major:1}` | ✅ |
| gate2-v0.4-round2 | 1/1/2 | `{blocker:1, major:1, minor:2}` | ✅ |
| gate2-v0.5-round3 | 1/2/1 | `{blocker:1, major:2, minor:1}` | ✅ |
| gate2-v0.6-round4 | 1/1/1 | `{blocker:1, major:1, minor:1}` | ✅ |
| gate2-v0.7-round5 | 2/4/2 | `{blocker:2, major:4, minor:2}` | ✅ |
| gate2-v0.9-round6 | 1/1/1 | `{blocker:1, major:1, minor:1}` | ✅ |
| v5.0.0 round-3 | 1/5/2 | **no `.review.json` exists for this round** | ❌ unverifiable |

The seventh row — the worst-looking one, and the one that would most strongly
argue "still not converging" — has no committed source. It traces only to the
dead `2026-08-25-branch-code-review-snapshot` / round-3-receipt / round-3-finding-map
citations. It cannot currently be confirmed or refuted.

This does not break RIG-130's conclusion: the six verified rounds alone show no
monotone improvement (1/1/0 → 1/1/2 → 1/2/1 → 1/1/1 → 2/4/2 → 1/1/1 — round 5 is
worse than four rounds before it, all four of which were "correct fixes" per the
ticket). The structural argument (no ledger, no `class_id`, no convergence
metric) is separately verified directly against the live code:
`scripts/review-receipt.js` contains no `class_id`, `ledger`, or `convergence`
string anywhere — confirmed by direct grep, zero matches. **RIG-130's problem
statement and its non-dependence on the missing 7th data point both hold; cite
the six verified rounds, not seven, until the round-3 receipt is recovered.**

## Finding D — RIG-132 contains an arithmetic error independent of the missing citations

RIG-132 states: *"The specification carries ~124 addressable claim anchors (79
numbered sections, 37 `AD-`, 68 `AT-`, 19 `D`), which is ~7,600 pairs."*

`79 + 37 + 68 + 19 = 203`, not 124. And `C(124,2) = 7,626` — consistent with the
headline "~124" and "~7,600 pairs" — while `C(203,2) = 20,503`, not ~7,600. The
parenthetical breakdown and the headline total disagree with each other by a
factor of ~1.6x; the pair count is only consistent with the headline, not with
the breakdown that's supposed to sum to it. This is a defect in the ticket's own
arithmetic, checkable with no reference to any missing document. It does not
overturn the ticket's qualitative point (that consistency is a pairwise property
and pair count grows faster than anchor count), but the specific numbers quoted
should not be repeated as verified until re-derived from the current spec.

## Net effect on the four tickets, evidence-only

- **RIG-125** — unaffected. Its claims were already independently verified by
  running the named tests directly (26/26 passing) in the prior pass; this pass
  adds a second corroborating source (the runbook + RIG-134) that agrees. High
  confidence.
- **RIG-133** — unaffected, and now better-sourced. Its central argument no
  longer depends on the missing "escaping the quadratic" analysis at all — the
  closed, committed RIG-134 ticket carries the same evidence with line numbers.
  High confidence.
- **RIG-132** — the pre-v5 ratchet slice is unaffected (independently verified
  shipped and green in the prior pass, reconfirmed by the runbook here). The
  v5.1 architectural case is weaker than it read before this pass: two more of
  its sources are confirmed dead (Finding A), and one of its own headline
  numbers doesn't add up (Finding D). The ticket's *shipped* work is solid; its
  *unshipped* architectural framing should not be treated as verified until the
  source material is recovered or the numbers are redone.
- **RIG-130** — unaffected in conclusion, narrowed in evidence. Six of seven
  cited review rounds are real and match committed receipts exactly; the
  structural claim (no ledger, no convergence code) is independently confirmed
  against the live script. The seventh, worst-looking round is currently an
  unverifiable number and should not be cited as fact until recovered.

## Links

[[2026-08-26-rig125-130-132-133-reinvestigation]] · [[RIG-125]] · [[RIG-130]] ·
[[RIG-132]] · [[RIG-133]] · [[RIG-134]] ·
[[2026-08-25-prev5-gate-runbook-and-classification]] · [[review-receipts]] ·
[[testing-strategy]].
