---
date: 2026-10-21
source: agent
topics: review-receipts, the-overhaul
decisions:
status: superseded
supersedes: 2026-10-21-code-mode-filesystem-sandbox-progress
tags: review, remediation, verification
summary: The filesystem boundary now reaches the installed shared check runner and preserves resource and replay behavior; focused suites are green, while the frozen external-write fixture and full eighteen-finding closure remain open.
---

The filesystem and network sandbox is now wired through lint plan execution,
grade/read-only/autofix runs, and the shared installed `check-runner`. The
apply transaction also materializes the sandbox module so the installed
`.rig/bin/check.js` path has the same enforcement. macOS tasks receive a
disposable isolated home and temporary directory; the command-line-tools Git
binary is preferred where present so sandboxed lint tasks do not invoke
`xcrun` outside their permitted temporary area. The memory watchdog remains
outside the task sandbox and launches the actual command inside it.

The new `tests/task-filesystem-sandbox.test.js` checks home and temp-root
absolute reads, outside writes, symlink reads, child process inheritance,
ambient environment removal, and successful in-repository execution. A
materialized `check-runner` dispatch also denies an outside read. Focused
resource, default-deny networking, installed bootstrap and service checks were
renewed during this work. One initial integration failure exposed the missing
installed copy of `sandbox.js`; apply materialization and the fixture's
materialized tree now include it.

The full accepted boundary is still not certified: Linux/bubblewrap was not
available for a real run, and broader adversarial paths outside the home/temp
roots remain untested. The preserved AT-LF-22 oracle still writes its network
result to a file outside the repository, which the new sandbox correctly
blocks. The prepared owner unfreeze request records the fixture-only change
needed. No frozen oracle file or signature was modified. All eighteen review
rows therefore remain open; this trace records progress only, not clearance.

Next: rerun the focused acceptance paths on the final sandbox bytes, run the
repository suite to surface remaining fixture conflicts, then continue the
other review rows and prepare the owner signing handoff after the oracle
fixture amendment is reviewable.
