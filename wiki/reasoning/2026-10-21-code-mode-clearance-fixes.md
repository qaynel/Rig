---
date: 2026-10-21
source: agent
topics: review-receipts, the-overhaul
decisions:
status: superseded
supersedes: 2026-10-21-code-mode-finding-remediation-progress-11
tags: review, remediation, verification
summary: Fixed the two full-suite failures caused by sandboxed missing-command detection and an obsolete forged-approval fixture; focused regression run passes, full gate is rerunning.
---

The owner-signed Gate 1 oracle now verifies and the user's full `npm test` run
reached the suite. It reported 1,188 passes and three failures: the absent-tool
test surfaced macOS `sandbox-exec` status 71 instead of a named missing-tool
result; a bootstrap integration test still supplied `verified: true` metadata
instead of an SSHSIG; and the coherence check correctly surfaced that failed
test as non-passed evidence.

The shared check runner now checks command availability after capability
authorization and before wrapping execution in network isolation. This keeps
the actionable missing-tool classification when an OS sandbox wrapper masks
native `ENOENT`. The bootstrap integration fixture now gets a plan approval
from the existing ephemeral SSHSIG test helper.

`node --test tests/catalogue-installed.test.js tests/rig-bootstrap.test.js`
passes 25/25 on this workspace after the changes. This establishes the two
direct regressions; the coherence test and complete repository gate still need
a fresh run against these exact bytes. The eighteen finding rows remain open
pending their full criteria and evidence; this checkpoint does not claim review
clearance.
