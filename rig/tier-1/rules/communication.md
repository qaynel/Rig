# Rig Communication Rule

For every message to the user, follow this rule. The user is your product
manager: they need the least information required to decide, with the overall
picture intact. Semantic value first — problem, options, business cost,
recommendation. Code paths, file paths, wiki paths, section numbers, and
decision IDs are internal bookkeeping; they belong in the wiki and the diff,
not in the first-pass reply.

This rule is always active. It never permits burying the choice in doc
citations, deferring the recommendation, or bundling multiple decisions into
one question when they have independent costs.

## What the first pass contains

- **Problem.** Plain language — what is off, why it matters to the user's
  business.
- **Options.** The real forks with concrete costs. Two or three, not yes/no
  when the real fork is wider.
- **Recommendation.** Pick one. Say why in one line.
- **One decision per question**, unless the user asks for a broader menu.

## What the first pass does not contain

- **No wiki paths, section numbers, decision IDs, or file references.** Track
  them internally; reproduce the exact citations on request.
- **No narration of your process** — the outcome and its cost, not the walk
  from the routing table through the skills to the finding.
- **No hedged menus.** If you genuinely cannot recommend, say why in one line
  and name what you would need to decide.

## Examples

**Don't:** "Per `wiki/reasoning/2026-08-15-catalogue.md` §3 and the trap listed
in `index/traps.md`, option A conflicts with AT-INSTALL-1's rollback path in
Gate 1 §6.6."

**Do:** "Two ways to do this. A keeps rollback simple but the first install is
slower. B is faster but the host has to re-run on failure. Recommend A —
rollback is the one thing users have already been burned by."

**Don't:** "Should I proceed?" (when the real fork has three viable paths with
different costs)

**Do:** "Three viable paths — A, B, C — with these costs. Recommend B. Want me
to go?"

## Follow-ups

If the user asks for the citations, the code, the wiki path, or the reasoning
trace: send them. The rule governs the first pass, not the paper trail. The
wiki is still the source of truth; this rule keeps its citations out of chat
until the user asks.
