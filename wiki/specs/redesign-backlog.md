# Redesign backlog

Five items that were **never started** and are deferred to the owner's
redesign, not fixed and not replaced. Owner direction, 2026-10-13: "Just leave
them with the redesigned tag. Make them just close them on GitHub and list them
in the redesigned backlog"
([round 3](../reasoning/2026-10-13-close-everything-owner-answers-round3.md);
ledger: [master plan §4](close-everything/00-master-plan.md);
sync plan: [01 tracker sync](close-everything/01-tracker-sync.md)).

Every item below is labeled `redesign` and closes on GitHub as **not planned**
after the v6.0.0 tag and public-download smoke, with a link to this page. None
is a delivered fix, so none may be closed as completed and none is in PR #157's
closing keywords. The list is exactly these five; adding to it is an owner decision.

Reason for every entry: **never started; owner deferred to the redesign,
2026-10-13.** The entries add what each item is and where its analysis lives.

## RIG-116 — Promote non-lint-format leaves Policy → Context → Evidence

- **What:** lint-format is the only leaf past Policy grade; the other 114 are
  Policy-only. This is a sequenced, family-batched programme to give the
  highest-demand families real Context and Evidence checks.
- **Why deferred:** needs demand evidence on which families users select, and
  the redesign reframes the question from "which family first" to whether
  promote-all survives the prune-to-stack direction.
- **Boundary with this release:** subplan [04](close-everything/04-catalogue-services.md)
  finishes the original catalogue capabilities. That is not RIG-116's
  demand-ranked promotion programme, and it is not delivered under this
  ticket.
- **Links:** ticket [RIG-116](../tickets/RIG-116.md) · GitHub #63.

## RIG-122 — Offer the wiki-knowledge system as a Rig tool family

- **What:** an optional, pure-markdown graft that gives a target repository
  Rig's own wiki conventions (topic hubs, indexes, reasoning traces, board).
- **Why deferred:** approved post-release work, gated on the product vision for
  what Rig installs; the redesign decides that, so building another installable
  family graft now would pre-empt it.
- **Links:** ticket [RIG-122](../tickets/RIG-122.md) · GitHub #62.

## RIG-130 — The review loop has no memory, so convergence is unmeasurable

- **What:** an append-only finding-class ledger, feeding closed classes to the
  next reviewer, so review convergence becomes a measurable stopping rule.
- **Why deferred:** structural change to the review loop; never owner-approved
  for Coding and never started.
- **Links:** ticket [RIG-130](../tickets/RIG-130.md) · GitHub #43. The ticket's
  own analysis citations are known-broken; see
  [reinvestigation](../archive/2026-08/review-receipts-and-test-infrastructure.md).

## RIG-133 — Freeze the properties and a case generator, not 68 samples

- **What:** sign a property set plus case generator instead of an enumerated
  sample list, so adding coverage does not change signed bytes.
- **Why deferred:** changes how the oracle is signed; never owner-approved for
  Coding and never started. This branch instead uses the owner's single batched
  re-sign of the existing oracle.
- **Links:** ticket [RIG-133](../tickets/RIG-133.md) · GitHub #42.

## RIG-156 — Re-baseline the adaptation score against post-fix Rig

- **What:** run the frozen RIG-153 instrument to produce a post-fix per-axis
  profile against the +12/100 baseline.
- **Why deferred:** low information until adaptive integration exists; carved
  out of RIG-153 on close with five readiness blockers (clean target copy,
  decided direction, pinned SHA, judge operator, model pin).
- **Links:** ticket [RIG-156](../tickets/RIG-156.md) · instrument
  [RIG-153](../tickets/RIG-153.md) ·
  [rubric](adaptation-measurement-rubric.md) ·
  [close-out](../archive/2026-08/path-a-and-path-b-onboarding.md) ·
  GitHub: none yet, to be created so every backlog item has one (pending owner
  approval, see
  [github-actions-pending](close-everything/github-actions-pending.md)).
