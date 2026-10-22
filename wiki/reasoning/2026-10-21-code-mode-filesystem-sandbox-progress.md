---
date: 2026-10-21
source: agent
topics: review-receipts, the-overhaul
decisions:
status: superseded
supersedes: 2026-10-21-code-mode-clearance-full-gate
tags: review, remediation, verification
summary: Lint execution now uses the existing OS sandbox for filesystem and network boundaries; focused regressions pass, but one frozen network fixture expects a forbidden external write and all eighteen review rows still require their full proof.
---

The lint-format execution path now launches tasks through the existing OS
sandbox. It restricts task writes to the repository, hides the user home and
temporary root from task reads except for explicit runtime and repository
paths, carries the exact network grant into the sandbox, and leaves memory
watchdog polling outside the task sandbox so resource limits remain enforced.
An unfrozen regression covers external absolute reads and writes, home
credential paths, symlinks, child processes and ambient environment values.

`node --test tests/advanced-apply.test.js tests/advanced-lint-format.test.js
tests/guarantee-coverage.test.js tests/trust-root-review-fixes.test.js
tests/task-filesystem-sandbox.test.js` passed 86/86. The preserved Gate 1
oracle still verifies 16 files and 95 acceptance cases. However, its existing
AT-LF-22 fixture tries to write a result into an external temporary directory;
that now correctly fails at the filesystem boundary. A filled unfreeze
request proposes replacing that fixture-only side channel with exit-status
evidence. No frozen file was edited and no signing action was performed.

This change advances only part of finding 5: execution through installed
`check-runner` routes and broader platform-path adversarial evidence remain
unverified. The supplied closure ledger still has all eighteen findings open.
The prior full `npm test` result does not cover these newly changed bytes.
Next: route every shipping task dispatch through the same boundary, close the
remaining findings against their required public entry points, then prepare
the owner-signed fixture amendment and rerun the full gate on the final bytes.
