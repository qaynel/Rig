---
status: proposed
checked: 2026-10-23
owner: rig-product-design
---

# Draft transferable engineering preferences

This is an **agent-inferred draft for owner review**, not an approved profile or
a change to Rig's settled decisions. It tests whether the owner-approved 8 KB active-view
cap can hold the owner's directional preferences without asking the owner
to write an export by hand. The draft is deliberately project-independent;
repository decisions, current work and recurring findings stay local.

## Proposed export text

1. Ask me for direction only when intent is unclear. Investigate, organise,
   implement and verify the rest yourself, and return with a recommendation.
2. Present one decision at a time, with safe options and their real costs. Do
   not ask me to choose a security posture without explaining it.
3. Prefer the smallest working change. Reuse what exists, avoid duplicate tools
   and dependencies, and delete obsolete machinery instead of deferring it.
4. Preserve explicit human control over acceptance criteria, signatures,
   permissions and irreversible actions. Never edit frozen tests to fit code.
5. Keep context cheap enough for a lower-cost model to use. Give each agent the
   task, relevant decisions and acceptance evidence it needs.
6. Make progress survive a session ending. Record the current phase, evidence,
   blocker and next action so another agent can resume without my transcript.
7. Learn from repeated corrections. After a failure recurs, produce a replay-proven safe local check; reserve protected policy changes
   for the owner key.
8. Claim completion only from current, reproducible evidence. Name missing
   checks and unsupported integrations plainly; do not turn a gap into a pass.
9. Treat documentation, decision records, review, cleanup and release checks as
   part of finishing work, with the same attention as code.
10. Use automated checks at delivery boundaries and bind them to the exact
    candidate being shipped. Batch the human steps that genuinely require me.
11. Adapt the workflow to each repository's existing conventions. Carry my
    preferences across projects without copying project-specific decisions.

## Cap check and scope

The proposed export text is under 2 KB in UTF-8. That leaves most of an 8 KB
rendered ledger for project decisions, recurring findings and the resume point.
This checks plausibility, not adequacy: the owner may add important preferences
or reject an inference, and the full ledger needs a representative size test
before the active-view implementation is accepted. If the owner's corrections push
the preference section beyond roughly half the budget, keep the richer source records intact, report the active-view gap, and revisit
the projection order with evidence.

Derived from the [owner vision](../../reasoning/2026-10-23-ai-sdlc-harness-expansion-owner-vision.md),
the [frustration profile](../../reasoning/2026-10-23-owner-frustration-profile.md),
the [current-state North star](../../../CLAUDE.md), and the
[product definition](01-product-definition.md).
