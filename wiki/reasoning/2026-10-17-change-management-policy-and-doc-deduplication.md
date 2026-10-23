---
date: 2026-10-17
source: intent owner
topics: delivery-plan, distribution-and-release, onboarding-flow
decisions:
status: current
tags: interdependency
summary: Owner ordered a standing deployment policy, applied the package-scripts pin amendment, required gate1-pin on QA, closures after the tag, and old host-count/tier wording removed from live docs.
---

# The owner's answers, and the policy they asked for

The owner answered the questionnaire and added an instruction that outranks the
individual answers:

> The point is that all of these checks need to be inherent and there needs to
> be a change management policy where all of these are done in sequence. It
> needs to be like a change management checklist, which is very important for
> the AI SDLC harness. I don't want to think about this again and again. That's
> what it is, right? If I am instructing you on something twice, it's a skill.
> It's a policy.

Verbatim answers:

- **Q1** — fire the receipt with Opus 5.
- **Q2** — apply the package-scripts pin amendment.
- **Q3** — make `gate1-pin` a required check.
- **Q4** — "Close on most to QA prod. Just close them after QA prod and tag it."
- **Q5** — "Do not leave them." Compact the very old traces into archive
  themes with a subagent; keep the newest.
- **Q6** — remove duplicates; remove the 19-host wording and the old
  documentation warnings; make the docs state plainly how dynamic onboarding by
  the local agent occurs.

## Done

- `rig/corpus/standards/change-management.md` — the deployment policy, shipped
  from the corpus like every other standard. Nine ordered steps: candidate
  freeze, signed oracle, full gate on the final bytes, a receipt bound to those
  bytes, docs/trackers/version, push with required (not reporting) checks,
  exact-SHA QA promotion, tag then close, and re-enter at step 3 after any red.
- `scripts/check-deployment-gate.js` enforces it: runs the steps in order,
  stops at the first unmet one, names it, and refuses a receipt whose
  implementation digest is not the current tree's. Wired into
  `.github/workflows/release-eligibility.yml`, which already refuses to run
  against anything but the exact QA head. `tests/deployment-gate.test.js`
  covers stale receipt, failing verdict, dirty tree, changelog, and the
  no-receipt refusal — 6 pass.
- A trap the policy now records: the receipt cannot live inside the repository.
  `implementationDigest` hashes every publishable file, so a receipt written
  into the tree changes the bytes it claims to bind. Receipts go to an ignored
  path or outside the repo.
- `docs/agent-portability.md` — the "Tier 1 Bootstrap" section is replaced by
  "How onboarding works", which separates install (corpus into `.rig/`,
  deterministic entrypoints for hosts the repository already has) from
  adaptation (the user's own agent reads the shipped onboarding instructions,
  inspects the repository, and proposes the smallest graft for approval). The
  markdown-only paragraph is gone (North star 3), as are the "19-host registry"
  phrasing, the remaining tier labels, and three links to
  `wiki/sources/superseded/deprecated-tier-taxonomy/…` that had been broken
  since that content moved to `wiki/archive/`.
- Host-count wording removed from `README.es.md` and `README.ko.md`; "Legacy
  Basic path" in `docs/advanced/operator.md` renamed to what it actually does.
  No live doc now states a host count.

## In flight

- A subagent is compacting the 120 `wiki/reasoning/2026-08-*.md` traces into
  themed archives under `wiki/archive/2026-08/`, preserving every decision,
  rejection, trap and verbatim ruling, and repointing inbound links.

## Next

- Apply the package-scripts pin amendment (Q2). This pauses the sequence at
  step 2 by design: the owner re-signs once, and only then do the full gate and
  the receipt run, because `wiki/gate1/gate1.sig` is itself part of the
  implementation digest.
- Task list: closures move to after QA promotion and the tag (Q4).
- Fire the receipt with Opus 5 on the settled bytes, then the full gate, then
  push.
