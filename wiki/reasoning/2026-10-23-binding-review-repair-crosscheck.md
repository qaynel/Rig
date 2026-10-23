---
date: 2026-10-23
source: agent
topics: review-receipts, the-overhaul
decisions:
status: superseded
supersedes: 2026-10-23-binding-review-five-gap-repair
tags: review, remediation, verification
summary: Path B and partial-install fixes have focused proof; cross-review catches a verifier-script bypass in the first autofix repair, which is being corrected before integrated verification; replay abnormal-state matrix passes24 checks.
---

06:55 UTC — Path B now binds real approval signatures to SHA256(realpath(target)) and rejects the identical-proposal cross-repository replay while preserving valid same-target apply. Enabled adopt sanitation calls the existing detector/verdict before inventory publication; blocking harness input stops before state/adoption writes. Two new regressions pass; existing CLI/MCP/state/catalog coverage reported27 passes before a direct upstream fetch stalled a broader fixture run. Reuse the supported pinned official mirrors for final verification. No protected fixtures changed; only the nonprotected approval signing helper adapts to the corrected challenge.

Partial-install policy status and fresh baseline results now withhold all per-control/nested protection flags when the shared install-state parser reports incomplete. The regression preserves identical inputs/implementation digests and earlier evidence, reproduces an interrupted reinstall, then verifies protection returns after completion. Focused suite11/11 passes.

The first autofix repair accepted changed verifier operands after an approved fix. Independent Luna cross-review and parent boundary inspection found a real bypass: Node flags hid the verifier script from an argv[1] heuristic, allowing a fixer to replace the verifier and then report success. Do not accept that version. The autofix owner is adding failing Node-flags/shell-script cases and tightening immutable executable/configuration definition identities; command.source is a definition, not a mutable operand. The naive heuristic cannot claim full safety. This is ordinary repair within the same bounded finding, not a new approval condition.

The shared replay evaluator now retains both Policy/replay observations and primary abnormal status alongside mutation evidence, stopping before the next replay and never creating Evidence after failure. The14-case regression matrix reproduced the prior loss and passes with existing receipt checks24/24. Public source/installed timeout integration is in progress; the installed fixture must explicitly use network=required rather than the malformed boolean accepted only by the source API. Parent will inspect results and privacy-preserving report projection before freeze. Oracle still verifies16/95. No owner input, passing current receipt or push is claimed.
