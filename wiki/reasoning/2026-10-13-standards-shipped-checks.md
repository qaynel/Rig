---
date: 2026-10-13
source: agent
topics: onboarding-flow, install-manifest-removal, testing-strategy, agent-working-conventions
decisions:
status: current
supersedes:
tags: interdependency
summary: Standards ship with an executed exact-file checker; historical manuals remain visible and each completed ticket needs a passing runnable behavior test.
---
<!-- needs-human-review: status -->
The owner's existing release ceremonies remain historical manual evidence, counted visibly as guidance; they cannot prove new behavior. Every cited executable acceptance reference must actually pass, and every completed ticket needs at least one passing executable proving test. Exact heading parsing avoids treating mapping/resolution sections as acceptance. Manual-only hook, MCP gate, identity, install-doc and historical-spec claims now point to runnable checks; their prior reasons are preserved in historical sections. Nine new contract checks pass, covering actual hook output and MCP package execution, a discriminating stale-identity fixture, and explicit instruction/document contracts. Installed runtime standards plus their checker pass in a target fixture while existing instructions survive the managed graft. A comment-only reference importing a green test from another file initially passed; its red regression now binds the executed event to the actual referenced file and passes.

The unsigned staged onboarding fixture incorrectly claimed approval with verified:true. It now uses the existing real signing helper; all seven runtime onboarding checks plus both caller graph checks and nine standards contracts pass (18 total). Root fixed the installed corpus catalogue staging gap. Setup tests additionally inject interruptions after a landed apply and after a landed restoration; both resume and retain the original bytes/preimage until success. Setup preferences and rules move to the corpus, with wiki pointers preserving one authoring authority. The strict completed-board rerun is in flight; no frozen artifacts were changed.
