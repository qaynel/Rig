---
date: 2026-10-13
source: review
topics: the-overhaul
decisions:
status: historical
supersedes:
tags: review, complete, plan-amendment
summary: Review handoff is complete: 12 verified findings, proposed amendments to ten subplans, all six owner answers recorded, automated-only QA promotion, and wiki checks green; product implementation remains future work.
---

# Close-everything plan review — completed handoff

The independent review is complete. The [findings record](2026-10-13-close-everything-plan-review.md)
contains twelve evidence-backed findings across spec, correctness, architecture
and test coverage. Its earlier pending-question section is a historical record;
all six handoff questions are now resolved below. No additional product question
was required to correct the verified contradictions in existing promises.

## Proposed amendments delivered

`.context/close-everything-review/proposed-plan-amendments.diff` changes ten
of the eleven plan files, retaining the master/subplan structure. Readable
amended copies live in `.context/close-everything-review/amended-plans/`.
They contain these corrections:

- An isolated advisory candidate runner and a complete owner amendment bundle
  covering signed scripts, verifier coverage, behavior assertions and paths;
  the authoritative gate stays fail-closed and the single final sign is kept.
- Enforced script isolation and journal-only approved writes; real replacement
  restoration with retained preimages; resumable upgrade with fresh approval
  rather than stale v5 applied/checked state.
- Preserved cumulative grades, named dependency slices and old selection IDs;
  service evidence through installed approved bindings, with nonzero checks.
- Tracker lifecycle transitions, exact-commit candidate install transport,
  final digest-bound review evidence, and explicit tag/release verification.
- Accurate claims for test-reference enforcement, visible caller diagnostics,
  historical doctrine/version checks and scoped uninstall evidence cleanup.

Your decisions also change delivery: third-party resources are fetched during
onboarding from pinned metadata, the corpus has one new root, tier wording goes
with the existing flag kept compatible, unavailable external tools are explicit
gaps, documented duplicate merges preserve compatibility, and automated checks
alone gate promotion on the exact QA commit. No manual outside-repository
install is required for promotion.

## Owner messages, verbatim

### Third-party delivery

Rig includes pinned third-party skills. Keep those copies for this release so installation works offline, or fetch them during onboarding, which needs network access and supply-chain checks? I recommend keeping the pinned copies and considering fetching during the redesign.
Fetch during onboarding

### Corpus location

For the single corpus, put all canonical resources under one new root, which makes the source clear but moves files, or designate today’s source folders as the corpus, which reduces moves but spreads it across locations? I recommend one new root.
One new root (recommended)

### Tier wording

The installer still uses the old “tier” wording. Remove that wording now and keep the existing flag working for one release, or leave both until the redesign? I recommend removing the wording now while keeping the flag’s validation and behavior compatible.
Remove wording; keep compatible flag (recommended)

### External tools

Some service checks need scanners or cloud tools. Use tools already available and report missing ones with setup guidance, or let onboarding offer to install missing tools with separate approval, adding network use and changes to the repository? I recommend reporting the gaps for this release.
Report gaps; use available tools (recommended)

### Duplicate services

If two catalogue services prove to cover the same practice, may they merge with a written reason and compatibility for existing selections, reducing the count below 115? I recommend allowing proven duplicates to merge; keeping every identity avoids migration but leaves duplicate offerings.
Allow documented merges with compatibility (recommended)

### Production promotion

Before promoting QA to production, require a green health run on the exact QA commit plus one real install in an outside repository, or use the automated health and clean-install checks alone? I recommend adding the outside-repository install; it takes a manual run but checks real onboarding beyond our fixtures.
Automated checks only

## Validation and remaining work

The proposed diff passes `git apply --check`. The wiki index generator succeeds;
wiki budget tests pass 26/26 without increasing budget waivers. The original
review also ran thirteen existing install/hygiene checks, all green. No full
product-suite result, finished-service coverage, E2E release or migration proof
is claimed for this documentation-only review.

No owner review question remains open. The amendment is proposed, not applied;
the next author must incorporate the corrected plan before implementation,
execute its proving checks and prepare the one owner-signed final bundle.
Code, tests, frozen artifacts and external tracker states were not edited.
Existing workspace edits were preserved; there was no commit, push or release.

The owner answers are filed individually and reflected in the North star,
topic hub and decision index. The initial findings record's body is unchanged.
