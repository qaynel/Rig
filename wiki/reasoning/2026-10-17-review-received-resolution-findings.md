---
date: 2026-10-17
source: agent
topics: the-overhaul, review-receipts, trust-and-failure-boundaries, distribution-and-release
decisions:
status: superseded
supersedes: 2026-10-17-review-received-resolution-progress
tags: review, implementation
summary: All four findings now have red-green implementation regressions; the remaining evidence is exact-candidate real-download/MCP, platform E2E, and release-owner review and delivery.
---

The four findings from the Review Received acceptance policy now have focused
implementation regressions. Finding 1's migration temp-file regressions prove
external, dangling, and in-target symlink referents plus a pre-existing regular
temp file stay unchanged, and an injected symlink substitution is refused by
exclusive creation. `node --test tests/migrate-v5.test.js` passed 25/25,
including ordinary migration, interruption/resume, and the upgrade fixture.

Finding 2's public bootstrap regression verifies dependency failure, recovery,
OpenClaw registration failure, recovery, config preservation and idempotence,
descriptor-based MCP handshake and `rig_instructions`, then journaled
uninstall. Adding the registration failure case exposed a pending-ledger retry
defect: after a failed new `openclaw mcp set`, retry refused the still-pending
entry even though the server was absent. Registration now clears that pending
entry only after confirming absence (or removing the exact attempted value).
The regression passes with a stubbed npm installer. Exact-candidate evidence
using real dependency downloads and no checkout dependencies remains pending.

Finding 3's workflow test failed on the reviewed workflow because it had no E2E
job, then passed after eligibility began requiring the reusable Ubuntu/macOS
matrix on the resolved QA SHA. Actual platform run URLs and artifacts at the
final candidate SHA remain pending.

Finding 4's regressions cover named and component success, mixed success and
failure, output through the interactive and installed callers, one GitHub
annotation, command identities/counts, and declared network denial. A caller
test exposed that the installed runner emitted diagnostics only after checking
failure status and exited first. Rendering now occurs before the failure exit,
so an earlier warning survives a later failed sub-check. The focused diagnostics
and workflow tests pass 5/5.

The working technical design, install guide, and topic hubs now describe these
behaviors. Remaining work is exact-candidate real-download MCP and both-platform
E2E evidence, the advanced-spec check and full `npm test` on final bytes, a fresh
eligible review receipt, and the required owner-controlled PR checks/approval.
No commit, push, review submission, or merge is claimed here.
