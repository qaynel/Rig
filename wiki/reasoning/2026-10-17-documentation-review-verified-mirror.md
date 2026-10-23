---
date: 2026-10-17
source: agent
topics: the-overhaul
decisions:
status: historical
supersedes:
tags: documentation, verification
summary: All documentation findings and focused checks are resolved; the full suite is rerunning with a digest-verified pinned upstream mirror after the direct-download run stalled.
---

## Network verification checkpoint

The first documentation-corrections npm test invocation passed all 115 service
matrix cases but remained in upstream-fetch subprocesses in onboarding tests.
The existing network-reproduction trace records this exact transport delay and
the supported file-mirror remedy. The original run was explicitly stopped
(exit 143), not counted as a pass; its output is retained in
.context/documentation-corrections-npm-test-network.log.

The cached real upstream archive at .context/qa-downloads/gstack.tar.gz was
rehashed and matches the pinned SHA-256
5dab9119ac9a5909b4faf173d4bc8817052f1726e79ae85d4259bf70219a3120.
A fresh full npm test invocation sets RIG_UPSTREAM_MIRROR_GSTACK and
RIG_UPSTREAM_MIRROR_GSTACK_SHELF to its file URL. The fetcher still verifies
the same pinned upstream bytes; no tests, code, timeouts or oracle pins change.
The active log is .context/documentation-corrections-npm-test.log.

Next: await its actual exit status, record that outcome, and recheck generated
wiki metadata and whitespace. Candidate commit, exact-SHA install evidence,
the reserved binding final review and required pushed-head checks remain
outside this documentation-fix verification.
