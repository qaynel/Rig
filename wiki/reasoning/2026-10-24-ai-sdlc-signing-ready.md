---
date: 2026-10-24
source: agent
topics: gate1-signing, the-two-gates, agent-working-conventions
decisions:
status: current
supersedes: 2026-10-24-pre-signing-remediation-progress.md
tags: gate1, signing, testing
summary: The 84-row AI-SDLC contract is coherent, fully protected, and green outside its expected preimplementation-red acceptance lane.
---

# AI-SDLC Gate 1 signing readiness

The pre-signing remediation is complete. The deterministic graph reports
84 requirements, 84 primary criteria, 84 proving tests, 30 fixtures,
20 journeys and 11 work packages with no orphaned or duplicate references.
The signer derives and verifies the exact 30-file protected set rather than
trusting a hand-maintained manifest. Its manifest digest is
`7b521ba3d4e8d335897bc47dcb8ce4f4f86b34621489d53123b48f3ab452bf06`
and its signed-message digest is
`2b2dc1287194224cfbbfeeb7c432997068fd699e5ed9c4462aaaa610ab03f56c`.

The isolated acceptance lane ran 88 tests: 14 passed and 74 failed. Seventy-one
failures report the deliberately unimplemented product capabilities and three
require external environment evidence. That is the agreed preimplementation
red baseline, not a repository regression.

Focused graph, signing, hardware-absence, timeout, wiki and manifest checks are
green. The complete credential-free local gate passed 1,360 repository tests
with five platform-specific skips, followed by 15 extension tests and six MCP
tests. A token-backed tracker comparison is not part of this candidate's local
gate because the live tracker already represents the later 6.0 release state;
no external issue state was changed.

No product capability was implemented, no existing 6.0 oracle was changed and
no AI-SDLC signature was produced. The package is ready for the intent owner's
review and hardware-backed signature.
