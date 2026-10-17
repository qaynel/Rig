# 07 — AI development standards, enforced here and shipped (D7)

Part of the [master plan](00-master-plan.md). Depends on [03](03-central-corpus.md).

**Owner (round 2):** "If we have clear standards for AI SDLC, we can generalize
that to the rig and ship that with the rig also." **Round 4/5:** they ship
inside the corpus.

## What the standards are

One document, `rig/corpus/standards/ai-sdlc.md`, that states how an agent takes
an item from intent to merged:

1. Grill the intent into acceptance criteria, as externally observable
   examples.
2. Write the technical design.
3. Turn the acceptance into tests that fail first. The human signs and the
   tests are frozen.
4. Build test-first, with the smallest diff.
5. Freeze the final candidate and run the full repository gate against those bytes.
6. Have an independent reviewer assess that exact candidate; any fix requires
   fresh test and review evidence.
7. Update docs and candidate tracker declarations in the same change. Close
   issues only after the release tag is published and the public tagged-download
   smoke test passes.

It also includes the **definition of done**: fix + proving test + docs agree +
trackers in sync + reviewed. Every item uses it, including future ones.

## Enforced here

Each rule maps to a check that already exists or is added in
[08](08-coherence-and-upkeep.md):

- Evidence-reference hygiene: the RIG-131 traceability guard; it currently
  checks only a title substring or a manual reason. Do not claim that this
  proves a runnable green test. An enforced proving-test rule additionally
  resolves the actual executed test and its successful result for the current
  candidate. Negative cases include comment-only, skipped and failing tests.
- Trackers in sync: the 08 sync check.
- Docs agree: the 08 coherence check.
- Frozen tests untouched: `gate1-pin`.

A rule with no check is written as guidance, not as a standard.

## Shipped

The same document ships in the corpus. The onboarding instructions offer it to
the user's repo, grafted into their existing contributing or agent docs inside
managed sections. Only rules whose check also ships are offered as enforced;
the rest are offered as guidance.

## Acceptance

- Every enforced rule names its check, and that check runs in `npm test` or CI.
- An onboarding fixture repo receives the standards inside managed sections,
  and its existing docs survive.
- This repo's own `CLAUDE.md` points at the standards instead of restating
  them.
