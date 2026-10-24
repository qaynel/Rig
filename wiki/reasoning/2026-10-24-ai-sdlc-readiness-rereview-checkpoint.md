---
date: 2026-10-24
source: agent
topics: distribution-and-release, the-two-gates
decisions:
status: current
supersedes:
tags: interdependency
summary: Rereview finds receipt lineage and nested-state gaps; another repair cycle preserves acceptance and adds real scenario coverage.
---

Independent rereviews correctly rejected the first repairs as insufficient.
They reproduced commit labels detached from actual receipt digests, a post-auth
source-snapshot race, TDD package path traversal, planner directory ownership
overlap, shallow child-context filtering, label-only worker acceptance and
caller-named full-gate execution. Current tests passing did not waive them.

Coordinator repairs bind receipts to both recorded and requested digests, reject
conflicting verdicts, serialize the same final snapshot after checking its
authorized digest, validate package paths before executing commands, and require
canonical npm test or an exact owner-signed full-gate command. Source must remain
unchanged during focused/gate execution. Positive review records now bind a
nonempty independent actor and empty findings to the current candidate.
Shared ownership validation and deeper orchestration lineage repairs continue.

Stale lease recovery has another signed-fixture conflict: PT-030 demands a grant
using only caller-supplied owner-exited/no-pending-write booleans. Real recovery
must verify owner liveness and pending effects. A current/live or unknown owner
cannot be declared dead because a caller says so; the signed expectation needs
the same evidence-based owner amendment process, never a simulated death.

New cross-module integration tests are being authored outside the signed set,
at the root path already named in the lifecycle. They distinguish locally proved
flows from the genuinely unexecuted human-presence/published-download branches.
No hosted test, production action or owner signature is claimed.

The archive and installer batch now passes all seventy-four existing focused
checks and seven new archive/projection/installed-runtime checks. Rig's own
MIT licence and upstream notices travel with the archive. Remaining work:
finish rereview repairs, execute scenario coverage and the full gate on frozen
local bytes, then preserve a current tracker and cleanup record for the owner.
