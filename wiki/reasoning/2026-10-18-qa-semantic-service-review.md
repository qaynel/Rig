---
date: 2026-10-18
source: agent
topics: the-overhaul, catalogue-contract
decisions:
status: current
supersedes:
tags: qa-closeout, catalogue, evidence
summary: Networking and mutation service fragments were rewritten against their actual rules and fixtures; local lint-format Evidence is now separate from CI but remains an explicit gap until a replay receipt exists.
---

The first semantic catalogue pass now covers all three Infrastructure/Networking services (24 fragment files) and all ten Testing/Mutation services (80 files). Their guidance names actual native predicates and fixture values and states the ceiling of each check. A networking regression verifies declared grade rules against good and bad fixtures; its focused test passed 1/1, the selected three-service grade matrix passed 3/3, and the authored-catalogue suites passed 23/23 when the networking slice completed. A subsequent whole-catalogue run overlapped mutation edits and was transiently red; it is not evidence of completion. Other groups still carry templated material. The catalogue's acceptance metadata also still uses `repository-context` and `evidence-replay` labels for ordinary Policy-grade configuration checks; a separate amendment is in progress.

Lint-format's installed path runs real formatter/linter commands through the shared runner, but its Context review and replayable Evidence receipt are absent. The previous maximal local check incorrectly depended on an approved CI artifact. That dependency has been removed: CI remains on the shared approved adapter path and local maximal now returns a named gap until a verifiable replay receipt exists. Its focused editable suite passed 8/8. This is an honesty correction, not completion of the signed higher-grade acceptance claim. The owner amendment must define a verifiable Context review receipt and Evidence input/output binding, then implementation and independent cases must close them.

The owner-signable oracle candidate is still unsigned and the two-failure binding-review state is preserved. Next: finish service metadata/content review, implement the higher-grade receipt, settle the host emission status, prepare the exact frozen patch, and renew final-byte checks after owner signing.
