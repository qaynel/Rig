---
date: 2026-10-23
source: agent
status: current
topics: review-receipts, agent-working-conventions
checked: 2026-10-23
owner: rig-product-design
summary: The running-in-circles mechanism located in code: review rounds shared only a failure count, so every round was an independent draw and recurring findings were rediscovered at full cost.
---

# Why the cycle runs in circles, located in code

The owner reports: "I always run around in circles to close everything even
though I have all my specifications and have cleared all that up with the
agent." This trace locates the mechanism and verifies it against the code on
this branch rather than against the trace record.

A two-part diagnosis was recorded on 2026-08-25 in the authoring-time learnings
store (`rig-review-loop-proxy-ladder`, confidence 8/10). Both parts were
re-checked today. **One is now fixed. One is live and is the cause.**

## Part 1 — the unit seam: FIXED, do not repeat this finding

The August finding said acceptance bound a unit seam: "68/68 cases are
`require(module)[fn]`; 5 of 65 tests reach the shipping path", so passing the
oracle did not mean the product worked.

Checked today against `tests/advanced-oracle.test.js`:

- 70 cases invoke the real entrypoint (`bootstrap.sh` / `execFile` / `spawnSync` / `withRepo`)
- 24 poke a module function directly
- `node scripts/check-advanced-spec.js` → "Oracle verified: 16 files, 95 acceptance cases"

The ratio has inverted. The oracle now mostly binds the shipping path. This part
of the diagnosis is stale and should not be cited again.

## Part 2 — the review has no memory of what it found: LIVE

`scripts/review-receipt.js` is 287 lines. Its entire cross-round state is one
object, written at line 170:

```js
writeFileSync(attemptsPath, `${JSON.stringify({ authorContext, failures: priorFailures + 1 })}\n`);
```

`{ authorContext, failures: N }`. A count. Nothing else survives a round.

The reviewer is asked (line 140) to classify every finding into one of seven
categories:

> `"category": "coverage" | "correctness" | "contradiction" | "testability" | "architecture" | "placeholder" | "overreach"`

Those categories are produced, printed, and then discarded. No round can know
which categories fired in any previous round. **Every review is an independent
adversarial draw against the same seven buckets.** A finding class that has
fired three times is rediscovered a fourth time at full cost, because nothing
records that it ever fired.

That is the circle. It is not a discipline problem and it is not the owner's
specifications being unclear. The specifications are fine; the loop that checks
them is amnesiac by construction.

### The counter is used only to lock the owner out

`MAX_RE_REVIEWS = 1` (line 28). After the second failure the run refuses to
proceed without `--force-rereview`, which requires explicit owner authorization.

So the single fact the loop retains about every review it has ever run — the
failure count — is spent exclusively on denying the owner the next attempt. It
remembers enough to stop them, never enough to stop repeating itself.

### Infrastructure failures are charged to the owner's cap

Lines 165-170 write the failure **optimistically, before the reviewer is
spawned**. The recorded reason (RIG-124.1) is sound in isolation: a spawn killed
by its own timeout would otherwise exit before a post-spawn write and silently
drop the attempt from the cap.

The consequence is that a review which never produced a single finding still
counts as a failure. The record shows this firing three times:

- session limit mid-run — `2026-10-20-trust-root-binding-review-unavailable`
- weekly limit, "resets Oct 23 at 9:30am" — `2026-10-20-post-fix-binding-review-unavailable`, `2026-10-21-binding-rereview-unavailable`
- the wrapper passed its own `--disable code_mode_host` flag and died on a one-argument bug — `2026-10-21-codex-binding-review-environment-failure`

Each consumed one capped attempt and forced the owner to re-authorize by hand.
The same authorization sentence appears verbatim in at least six traces. The
counter ran 3 → 10 over roughly four days.

There is no distinction in the code between "the review ran and found problems"
(real signal, worth a cap) and "the review never ran" (infrastructure noise,
worth nothing). Both increment the same number.

## The unifying fault: three amnesia loops, one disease

Part 2 is not an isolated defect. It is the same structural fault already
recorded for the wiki, at a different scope:

| Scope | What is written | What reads it | Result |
|---|---|---|---|
| Review rounds | finding categories, every round | nothing | same classes rediscovered forever |
| Project record | 371 traces, 3.6 MB | advisory only, ~21k tokens to orient | settled decisions re-litigated |
| Across projects | nothing portable | nothing | "kaput, everything's gone" |

Every one of the owner's nine recorded frustrations
([profile](2026-10-23-owner-frustration-profile.md)) sits in one of those three
rows. The project's fix for all of them so far has been to **write more** — the
North star block, the three-minute cadence, the hub convention. All writes. None
of them made anything read.

## What this means for the expansion

The owner has asked for all three slices of the AI-SDLC expansion
([vision](2026-10-23-ai-sdlc-harness-expansion-owner-vision.md)): close the
loop, carry preferences, and recursive self-improvement. Read against this
diagnosis they are not three features. They are one fix applied at the three
scopes in the table above:

- carrying preferences = memory across projects
- closing the loop (docs, logging) = memory of what the work produced
- recursive self-improvement = memory of what went wrong, fed back as a check

**The recursive self-improvement the owner wants is the repair for the defect
they are already living with**, not a new capability bolted onto a working
system. That is why asking for all three is coherent rather than greedy.

## Design consequence (for the design doc, not implemented here)

Two properties follow directly and are not negotiable if the circle is to close:

1. **Bounded and mandatory beats complete and advisory.** A memory artifact only
   works if it is cheap enough to be read every session. Size cap is the feature,
   not a compromise.
2. **A finding class that fires twice must graduate into an automated check.**
   This is the owner's own rule, already stated: "If I am instructing you on
   something twice, it's a skill. It's a policy." Applying it to review findings
   gives the bounded artifact a forcing function — pressure on the cap converts
   recurring findings into tests instead of growing the document.

One concrete repair is separable and small: distinguish "review ran and failed"
from "review never ran", and charge only the former to the owner's
authorization cap.

## Next

Feeds the builder-mode design doc. Nothing implemented; `/office-hours` is
design-only. `AT-HD-7` in `tests/onboarding-hardening.test.js` is independently
red (7 pass, 1 fail) and predates today's wiki sweep.
