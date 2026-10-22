---
date: 2026-10-21
source: agent
topics: review-receipts, the-overhaul
decisions:
status: current
supersedes: 2026-10-21-acceptance-adversarial-audit-progress
tags: remediation, verification
summary: Independent audit reproductions now pass, clone-local signed dispatch has macOS/Linux evidence, migration and legacy compatibility are repaired, and the full main suite is running on the integrated candidate.
---

Independent recheck passed all original reproduced dispatch, mutation, macOS filesystem and CI bypasses: bare read-only commands, timeout mutation evidence, source under build/vendor, executable byte drift, widened resource limits, out-of-repo reads, invalid Azure root shapes, incidental CI command comments and unsigned generic network grants. A final reported signer/launcher executable-resolution mismatch now uses one shared task PATH. macOS needs a read of the literal root directory for dyld; this grants no descendant file reads.

The dispatch focused suite passes25 cases on macOS. Actual Docker/Linux bubblewrap passes14 dispatch/task acceptance cases, including single real launch under competing processes, restart replay and deletion of .rig. Consumption now exists only in clone-local Git storage; non-Git execution fails with git-init guidance. The legacy empty-PATH memory-ceiling proof retains native Git resolution. Setup and real history/journal suites pass20 cases after accepting the existing legitimate lint_format_config producer enum in the strict journal parser.

Real staged optional scanners and the original additions-only deterministic floor are restored behind the enabled secrets control. Current semantic fixture evidence is explicitly journaled and staged rather than weakening the mandatory missing-review refusal. Migration now includes the same mandatory baseline closure in its existing staged CAS transaction; exact fresh-tree and real-v5 round-trip comparisons pass. Migration/corpus108 cases, runtime/bootstrap/diagnostics25, sync/catalogue17 and a discriminating runtime7-case rerun are green.

Prepared frozen fixture amendments are recorded before editing: real signatures and coverage, current semantic review and valid Jenkins fixture, plus the exact corrected lint corpus content pin. No business acceptance case is removed. The final full main suite is running; its signature-integrity case will correctly remain blocked until the key holder performs one batched final re-sign. Companion technical design/operator documentation and the evidence ledger are being synchronized. No push, merge, human signing or final binding receipt is claimed.
