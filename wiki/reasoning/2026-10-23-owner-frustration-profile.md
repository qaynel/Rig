---
date: 2026-10-23
source: agent
status: current
topics: agent-working-conventions, what-rig-is
checked: 2026-10-23
owner: rig-product-design
summary: Nine recurring owner frustrations read out of the trace record, with citations; all nine reduce to the wiki being mandatory to write and optional to read.
---

# Owner frustration profile, read out of the trace record

Produced 2026-10-23 by a six-way parallel sweep of all 198 `status: current`
reasoning traces, run as the research half of the AI-SDLC expansion session
([vision trace](2026-10-23-ai-sdlc-harness-expansion-owner-vision.md)). The
owner asked for an understanding of where they come from and what frustrates
them, built from the record rather than from conversation.

Every pattern below is cited to the traces it was found in. This is synthesis;
the trace bodies remain the source.

## Why this matters to the product

The owner is the stated target user: token-deficient, highly ambitious, does
not read the code, depends entirely on agents. Their recorded frustrations are
therefore not project noise — they are the requirements list for the harness
being designed. Each pattern below is a thing the harness should make
impossible.

## The nine recurring patterns

### 1. Re-litigating settled decisions

The single loudest signal in the record, and the owner names the cost directly.

> Why are we having this discussion again? Honestly you need to change your
> internal harness… I see myself repeating the same thing again and again and
> again. I forgot it, you forgot it, and then both of us are in deep, deep
> trouble. This is very bad… This is getting frustrating at this point.
> — `2026-10-13-close-everything-owner-answers-round5`

> Didn't we agree on a centralized rig repository… Why are you still obsessed
> with that, obsessed with 19 hosts and all, right? Why are you bringing this
> up again? — `round3`

> I don't know why I have to say this again and again but there was a .rig.
> — `round4`

The owner's own stated rule for the fix:

> I don't want to think about this again and again... If I am instructing you
> on something twice, it's a skill. It's a policy.
> — `2026-10-17-change-management-policy-and-doc-deduplication`

What was actually done about it: the North star block at the top of
`CLAUDE.md`. Note that this was a *documentation* fix for a *memory* problem,
and it only works if every agent reads it first.

### 2. Capped or paid resources consumed for zero result

The binding-review counter went from three to ten over roughly four days. Three
of those attempts produced no verdict at all:

- session limit mid-run — `2026-10-20-trust-root-binding-review-unavailable`
- weekly limit, "resets Oct 23 at 9:30am" — `2026-10-20-post-fix-binding-review-unavailable`, `2026-10-21-binding-rereview-unavailable`
- the wrapper passed its own `--disable code_mode_host` flag and the review
  died on a one-argument tooling bug that said nothing about the code —
  `2026-10-21-codex-binding-review-environment-failure`

Each failure consumed one capped attempt and required the owner to re-authorize
by hand. The same authorization sentence appears verbatim in at least six
traces (`2026-10-20-owner-authorized-*` ×4, `2026-10-21-owner-authorized-*` ×2).

Two further reviews did run and failed with real findings (3 major + 6 minor;
then 4 blockers + 14 major), so the cost was not only in the empty attempts.

### 3. Sessions die mid-work; context is re-derived by hand

> Two earlier executor sessions (Claude and Codex) both hit usage limits partway
> through the catalogue and E2E work.
> — `2026-10-14-closure-task-list-and-sop`

Recovery was manual: `2026-10-20-qa-closeout-resume-fixes` resumed "from the
pasted prior-session transcript"; `2026-10-22-qa-closure-scope-and-recovery`
records the owner re-attaching the same failed-review JSON ("I'll attach that
JSON again") and re-pasting the signing command. One handed-over follow-up
described an older candidate (`082d8467`) than the live one (`f8140b72`), so the
state had to be re-derived anyway.

The owner's ask, in their words: work should "be recoverable at any given point
in time… continued with a different model."

### 4. Agents over-build; the owner deletes

Against the owner's one-trust-root decision, agents had built a separate
policy-signer setup, recovery registration, trust-on-first-use, a `trust.json`
and an independent allowed-signers list. All were deleted.
— `2026-10-20-one-trust-root-owner-decision`

> Nothing is deferred: there is one root, and it is the Gate 1 key.

The same taste shows up as a release target:

> We're adding 67,000 lines of code so I'd want at least 25% deletion... around
> 45% deletion needs to be there if it's a major release... We want to make it
> lean. — `2026-10-17-qa-readiness-owner-request`

### 5. Premature green, and claims that do not survive checking

- a comment-only reference importing a green test from another file initially
  passed — `2026-10-13-standards-shipped-checks`
- an onboarding fixture "incorrectly claimed approval with verified:true" — same
- a commit submitted with a completion claim had six failing size hints —
  `2026-10-18-review-received-candidate-verdict`
- a fake npm fixture hid real npm 11 bugs —
  `2026-10-13-clean-install-e2e-boundaries`
- trackers were wrong in both directions: five items done in code but open on
  the board, three browse-runtime bugs closed "Not Planned" as low priority, a
  stale comment reporting 11/12 when tests were green —
  `2026-10-13-close-everything-reality-audit`, `2026-10-13-close-everything-tracker-sync-local`

The owner's standing instruction:

> Do not go around cheating the system and I'll just verifiably approve
> everything. — `2026-10-20-qa-closeout-owner-request`

### 6. Blocking on the owner, vaguely — or not at all when unblocked

The owner asks for the exact command repeatedly across
`2026-10-20-qa-closeout-owner-request`,
`2026-10-21-owner-close-acceptance-without-repeat-permission` and
`2026-10-22-qa-closure-scope-and-recovery`. Agents keep leaving the blocking
step described rather than executable.

The inverse failure also happened — an agent stalled on a permission it already
had:

> why is it denying to resolve the open issues, just resolve them by clearing
> the acceptance Criteria… Just get it done right. I don't even care at this
> point. Just get it done. Get it over with.
> — `2026-10-21-owner-close-acceptance-without-repeat-permission`

### 7. Checkpoint-trace sprawl

Seven progress traces on 2026-10-21 alone (`progress-3` through `-10`) each
restate "all eighteen findings remain open" with a slightly different test
count, filed under the every-three-minutes cadence while the blocking step (one
owner signature) had not moved. Roughly thirty near-duplicate traces exist for
a single day of the 10-14 closure run. 120 August traces had to be compacted
into ten themes (`2026-10-17-august-reasoning-archive-compaction`).

The cadence exists to survive pattern 3. Its cost lands on pattern 9 and on the
owner's token budget. This sweep flipped 148 traces to `historical`, taking the live
`current` set from 198 down to 58, to cut the standing read cost.

### 8. Concurrent agents colliding in one workspace

`2026-10-17-qa-readiness-concurrent-docs` records an agent finding a document it
did not write and having to ask the owner whether another agent was working
there. `2026-10-17-qa-readiness-checks-await-docs` downgrades a full gate run to
"advisory rather than final exact-byte evidence" because documentation moved
during it. `2026-10-13-catalogue-04-signed-lane` and
`2026-10-13-clean-install-e2e-in-flight` record the same collision class.

### 9. Any byte change invalidates all evidence

Because acceptance binds exact bytes, every edit — including editing a trace —
changes the implementation digest and forces the exact-commit E2E, the full
gate and the review to re-run. `2026-10-17-change-management-policy-and-doc-deduplication`
records the sharpest version: a receipt stored inside the tree changes the bytes
it claims to bind. `2026-10-15-closure-full-gate-green` took four complete runs,
fixing one defect per run.

## What the owner means by done

Assembled from `2026-10-13-close-everything-owner-answers-round2` and
`2026-10-17-qa-readiness-owner-request`:

1. a fix with a proving test
2. a real-download clean-install end-to-end test
3. user documentation that matches the product
4. a security and code-review pass
5. a horizontal coherence sweep — one part of the codebase not out of sync with another

> a complete finalized product: polished, with production-level code and all,
> and no nonsense over here and there. Everything needs to be ironed out,
> clip-clap, and everything needs to be cleared.

And the reason for the hurry:

> We are finishing everything so that I can start working on the product
> development cycle later on.

## Standing taste, for the preference file

- One of each, never two. "You might have two skills for PR review. Why would you want that?"
- Delete rather than defer. Code is cheap; difficulty and priority are never reasons.
- Honest named gaps over a quiet pass.
- Human-signed oracle outranks agent convenience; agents never edit frozen tests.
- Batch owner signatures into one session.
- Reality beats trackers — verify against code, not against a board.
- Cheap and automated over manual gates.
- Treat the owner as a product manager: one decision per question, options with costs, one recommendation.
- Delegate widely to subagents, preferring lower-order models where they suffice.
- Minor editorial items do not justify a signing or review cycle.

## Caveat on method

All six sweep agents reported. One reported finding did not reproduce: a claim that `CLAUDE.md` North
star 2 cites a since-deleted trace. Both
`wiki/reasoning/2026-08-31-path-b-product-direction.md` and
`wiki/reasoning/2026-09-08-dynamic-offboarding-architecture-brainstorm.md`
exist on this branch, so the open item recorded in
`2026-10-17-august-reasoning-archive-compaction` appears already resolved.
Subagent findings in this trace are otherwise quoted from trace bodies rather
than re-verified against code.

## Next

Feeds the builder-mode design doc for the AI-SDLC expansion. The nine patterns
above are the candidate requirements list; the owner has an open decision on
which slice is built first.
