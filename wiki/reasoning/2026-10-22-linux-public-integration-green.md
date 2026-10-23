---
date: 2026-10-22
source: agent
topics: review-receipts, the-overhaul
decisions:
status: superseded
supersedes: 2026-10-22-linux-supervisor-output-boundary
tags: verification, remediation, linux
summary: Actual public-command integration passes Linux34/34 and macOS55/55 after signal and private-device fixes; two broader Linux refusal-code fixtures remain under verification before final freeze.
---

18:19 UTC — Root independently ran current public-command/inspection/harness/privacy/sandbox integration on real Docker Linux Node22/Bubblewrap:34/34 passed, and the corresponding macOS suites plus legacy acceptance/report cases pass55/55. Oracle still verifies16 files/95 acceptance cases. A reusable local image rig-qa-node22-bwrap:local avoids repeated APT stalls; its Dockerfile/build log are ignored under .context/qa-closure/.

A controlled root probe proved nested spawn EACCES came from opening /dev/null, not executable permission: Node mode100755/X_OK succeeds, ignored stdin fails opening null, inherited stdin succeeds. Generic readDirs had overlaid Bubblewrap's private /dev with a host read-only/nodev bind. commandFor now preserves the already-created private /dev and /proc; a new task opens null read/write and successfully launches a nested child with ignored stdin. No unrelated host device mount or broader filesystem access is granted. Signal envelope, numeric-exit distinction, tiny output capture and fork/pipe cleanup are covered by the worker's current regressions.

Broader Linux guarantee tests are42/44, with two network denial probes failing exit8. Root identified their denied-code allowlist lacks ECONNREFUSED, a legitimate private-loopback refusal; worker must capture the actual code before changing this non-protected fixture. The same granted-listener positive must still connect successfully, and apply-generated deny/grant listener proofs remain required. Do not change frozen tests or loosen network enforcement. Finish this exact check, record final focused evidence and reconcile final docs/ledger before freezing a clean candidate for full npm and binding review. Seven review repairs are already committed at a8f2d544; current Linux follow-up is not yet committed or pushed. No owner action is currently needed.
