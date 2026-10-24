---
date: 2026-10-24
source: agent
topics: gate1-signing, the-two-gates, agent-working-conventions
decisions:
status: superseded
supersedes: 2026-10-24-pre-gate1-finalisation-audit.md
tags: gate1, signing, testing
summary: Pre-signing remediation now derives the complete protected set and clears the focused repository regressions; final-byte checks remain.
---

# AI-SDLC pre-signing remediation progress

The owner asked for every signing blocker to be fixed and for the repository to
be brought to the point immediately before the human signature.

The received full-suite run exposed four roots: stale 79/29 graph assertions
after the owner-added efficiency obligations, an incomplete hand-maintained
signing manifest that omitted the efficiency proving test, a current reasoning
record without required metadata, and a timeout fixture whose numeric port was
decorated with ANSI colour in an interactive terminal. A separate audit also
found that the hardware-positive case had no contract fixture to pass the
signer's mandatory traceability preflight.

Focused remediation is now green. The signer derives its exact protected set
from the three contract documents, fixed validator/harness files and every test
home named by the test manifest; verification refuses missing, unexpected or
duplicate entries. The signing regression starts with an empty manifest and
proves that the complete set is bound. The graph assertion now expects
84 requirements and 30 fixtures. The timeout fixture emits an undecorated port
even when colour is forced, and the hardware case copies the current contract
before invoking the real hardware path.

In flight: synchronize mutable signing guidance and topic hubs, regenerate the
manifest and its exact digests from final protected bytes, run wiki checks,
re-run the isolated preimplementation lane, and run the full repository gate.
No signature has been produced and no product capability has been implemented.
