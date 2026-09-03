---
date: 2026-09-02
source: review
topics: catalogue-contract, trust-and-failure-boundaries
decisions:
status: current
supersedes:
tags: review, hardening
summary: Path B hardening’s final integrated review found no unresolved implementation defects; the completed duplicate-name oracle amendment is verified and ready to commit.
---

# Path B hardening final review

The signed 14-file oracle verifies at 83 acceptance cases. The focused
catalogue and hardening suites pass all 71 checks, the source shelf reproduces
the generated 63-skill catalogue exactly, and the complete `npm test` gate
passes.

The initial integrated review found two issues in the prepared diff: the
duplicate-name unfreeze request described an absent test as a replacement and
did not record the already-completed human authorization, and an installer
comment still described the removed duplicate-name tie-break. The request now
accurately records an added assertion, the verified signature authority, and
the re-sign result. The installer comment now states only the still-true
frontmatter/directory invariant.

The duplicate-source regressions cover two optional shelf entries and show both
source locations in the refusal. The same shared check also rejects an
optional/core collision, but does not have a dedicated fixture; this remains a
low residual risk because the code uses one collision loop and no alternate
fallback remains.

The historical full branch diff still reports trailing whitespace in immutable
prior reasoning traces. It predates this prepared change and is parked rather
than edited, because those records must remain verbatim. The untracked
execution-plan draft is likewise parked and excluded from the delivery commit.
