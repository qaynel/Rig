---
date: 2026-10-14
source: agent
topics: the-overhaul, distribution-and-release
decisions:
status: current
summary: The README's fresh-machine command also cannot start because the public v6.0.0 Git tag does not exist yet.
---
Done: after the README added a clean-machine checkout step, T-9.7 reran its current command on a fresh ignored target. Exact result: `fatal: Remote branch v6.0.0 not found in upstream origin`; the clone stopped before installer or target writes. This is the same release-publication blocker as the prior archive 404, so T-9.7 remains open for the owner to publish the tag. In flight: review-finding dispositions and final coherence proof. Next: retry the README flow after tag publication.
