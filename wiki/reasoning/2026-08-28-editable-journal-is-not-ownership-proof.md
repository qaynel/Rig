---
date: 2026-08-28
source: intent owner
topics: install-manifest-removal, trust-and-failure-boundaries, host-and-ci-coverage
decisions: D11
status: historical
---

Release-stopping: a forged repository-local install record can label an existing user CI pipeline as tool-owned and uninstall will delete it if the recorded digest matches. I reproduced this with a normal user Jenkins pipeline. The cleanup must not treat an editable journal as proof of exclusive ownership.
Also fix: an unsafe journal path can still avoid symlink-containment rejection when a forged OpenClaw ledger marks its prefix as preserved. It is retained rather than rejected, weakening the intended fail-closed behavior.
Recommendation: preserve common root-level CI files until ownership can be independently proven; only remove uniquely attributable artifacts. Resolve containment before any preservation decision.

Validation: the focused safety suites passed (51 tests), and the frozen acceptance suite passed (74 tests) with global Git configuration isolated. The literal full gate still stops at signature verification because the frozen-contract signature does not cover the latest checker bytes.

resolve
