---
date: 2026-10-17
source: agent
topics: the-overhaul
decisions:
status: superseded
summary: Deployment regression checks reject self-validating review evidence and unexecuted full gates; archive audit restores two required source paths.
---

Done: reproduced three deployment-gate failures before implementation: empty or
invented acceptance coverage passed; arbitrary spec/catalogue digests passed;
and a failing npm test passed when a receipt pathname existed. The checker now
runs the full repository gate, detects publishable-file mutation during that
run, and derives review expectations from the current technical design,
catalogue and frozen acceptance cases. Nine regression checks passed before
adding the file-mutation check. The focused deployment/standards group passed
18 tests. Corpus projection/rule-copy verification and current local/live
coherence pass (66 declared tracker transitions).

Correcting the earlier August compaction trace: of the 120 August source files,
115 remain compacted into the ten archive pages, three current decisions remain
in reasoning, and two original source files were restored byte-for-byte from
HEAD. Those two are cited by the frozen oracle and a retained decision trace;
restoration preserves inbound links without changing signed bytes. The North
Star link to the retained product-direction trace was already valid. The prior
trace's claims that all 120 were deleted and that this link was dangling were
incorrect; its immutable body is preserved.

In flight: Luna agents finish active-doc reconciliation, compact the historical
resume transcript while preserving all owner messages verbatim, and prepare
post-tag tracker commands. The five redesign issues are currently open with
the redesign label, consistent with the owner's post-publication closure order.
The signing request is pending with the human; no agent ran the ceremony.

Next: settle the tree, regenerate indexes, run focused documentation and code
checks, and renew test/review evidence when the signed contract verifies.
