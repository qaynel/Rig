---
date: 2026-10-18
source: agent
topics: testing-strategy, the-overhaul
decisions:
status: historical
supersedes:
tags: qa-closeout, lint-format, evidence
summary: A new local lint Context review request binds current files and rules; Evidence reruns observed commands and writes a scoped receipt, with installed-path integration still pending.
---

The local lint-grade API now computes a review request from current changed-file bytes, rule-source bytes, declared argv/cwd, and the repository snapshot. Context accepts only a structured review for that exact request with a nonempty meaning summary. Evidence reruns the observed Policy commands against unchanged inputs, compares their results, and writes a scoped receipt under `reports/rig/`. Two editable tests pass: a real Context/Evidence path with CI absent, and refusal when command output cannot be replayed. The existing 46 lint and guarantee tests also pass. The `runGrade` path still needs explicit installation and operator access for higher grades; the `buildBinding` maximal check continues to declare a gap. These results are an intermediate implementation checkpoint, not a product-level completion claim.

The owner amendment candidate for AT-LF-20 is prepared separately and uses real, nonce-bound SSHSIG approvals. AT-LF-7/8/9 candidate tests will follow the final grade interface. Frozen files remain untouched; no signing or binding review was run.
