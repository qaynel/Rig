---
date: 2026-10-23
source: agent
topics: review-receipts, the-overhaul, user-presence-approvals
decisions:
status: superseded
supersedes: 2026-10-23-binding-review-repair-crosscheck
tags: review, remediation, verification
summary: All five review repairs pass integrated macOS187/187 and Linux187/187 with independent autofix/replay cross-review; final Path B disabled/quarantine/no-write checks and candidate freeze are next.
---

07:03 UTC — Integrated tests for Path B approval/onboarding/MCP/hardening, autofix, policy baseline, replay, receipts, guarantees, CI privacy and installed lint-format pass187/187 on both macOS and actual Linux Node22/Bubblewrap. Pinned official mirror inputs avoid repeated upstream timeouts without weakening fetch integrity. Raw logs are review12-integrated-host.log and review12-integrated-linux.log under.context/qa-closure. The shared replay matrix plus actual source/installed TCP timeout tests pass16/16, and an independent Luna exercised installed CI timeout and credential redaction: local reports keep all observations and timeout, while CI emits only safe failure aggregates.

The initial autofix interpreter heuristic is removed. Existing signed scoped_files now identifies mutable file operands, must match both commands and their cwd, and must resolve to actual file operands in both argv lists. Only those observed digests may advance after a successful approved fix. Explicit source definitions (even unusual extensions and even mistakenly scoped), executable identity, configuration and modes stay pinned. Node-options and shell-script self-replacement cases reject, scoped a.js succeeds, and source/config/command drift rejects. Independent final cross-review found no remaining bypass in those requested paths. Unscoped changed filename operands intentionally withhold verification as command_drift rather than guessing roles; operator and technical documents now state the required existing discovery metadata for direct callers. Inline existing signed acceptance fixtures still pass; no protected tests changed.

Partial-install per-control and nested-run protection is false in status and fresh baseline results while raw pass/fail remains inspectable. The regression preserves unchanged input/implementation digests and prior evidence and proves completion restores protection. Path B challenges include SHA256(realpath(target)), matching the existing clone-bound authority convention. The existing prepare path runs enabled bounded sanitation before returning inventory. Final proof additions are in flight for unchanged B bytes/modes after signature rejection, QUARANTINE, and a genuinely signed disabled-sanitation positive with explicit disabled/not_run context and no ALLOW inheritance. Reuse the existing response context record rather than widening MCP or frozen state schemas.

Technical design, operator guide, changelog and live signing hub reflect the repaired boundaries; the bounded five-gap criteria remain separate from the immutable eighteen-finding checklist and signed95-case oracle. Finish the final focused additions, run hygiene/inventory checks, review the whole diff, commit/freeze, then run the complete gate and necessary fresh binding review preserving original author context and counter12. No current passing receipt/push/readiness or owner input is claimed. Recover from HANDOFF.md and handoff.sh under.context/qa-closure; during frozen verification save transient progress there rather than changing publishable bytes.
