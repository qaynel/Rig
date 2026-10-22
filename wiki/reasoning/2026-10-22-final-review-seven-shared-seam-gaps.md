---
date: 2026-10-22
source: review
topics: review-receipts, the-overhaul
decisions:
status: superseded
supersedes: 2026-10-22-final-signed-candidate-freeze
tags: verification, review, remediation
summary: Exact signed candidate passes full npm1292+15+6 and coherence66/66, but binding review finds seven major shipping-seam gaps; push is held while three Luna workers reproduce and fix them.
---

17:46 UTC — Final full npm exits0 on clean commit baf53252fef896181489dc43b1a86d8b9d5f7135: main1292 passes/2 skips, Pi15 and MCP6 pass. Implementation digest c056fde25e4271638732bc307f45540b0343f755d891f5f26f7f76ff8c537562 is unchanged after tests, and live coherence agrees for all66 declared transitions. The owner signature verifies16 files/95 cases.

The fresh authorized binding review failed with seven major findings. The exact rejected report is retained at wiki/sources/reviews/v6.0.0-2026-10-22-qa-candidate.failed.review.json; raw wrapper output is .context/qa-closure/final-binding-review.log. No passing receipt or push exists. Failure counter is11, preserving the original author context. These are real gaps between helpers and shipping routes: installed service-catalogue module absent from baseline; unsafe actual detector findings lacking the severity hostReview expects; smaller git/CI harness registry omitting supported paths; Slack tokens missing from shared redaction; source UI/dependency heuristics silently skipping required bindings; permissive inventory journal parsing hiding changed/forged owned files; mutation evidence discarded by public source/installed commands.

Root inspected all seven named seams and verified the reported code mismatch. The previous eighteen-row closure was evidence-specific and insufficient for release, as the binding review correctly caught. Reopen affected ledger rows pending the new public-route proofs. The user explicitly requested Luna parallel repair and acceptance reruns until accepted; continue those authorized fixes without another signing or permission prompt, preserving the review failure history and never manufacturing success.

Ownership is non-overlapping: luna_installed_dispatch_fixes owns baseline-payload.js, checks.js, installed baseline/check.js and new regressions; luna_inspection_integrity_fixes owns inspect.js, catalog.js and new regressions; luna_harness_privacy_fixes owns git-dispatch.js, redaction.js and new regressions. Root owns wiki/recovery integration and any agreed transitive dependency work. Workers must reproduce, fix the shared seam, use actual public/installed commands in tests, avoid all frozen oracle files, and return focused evidence. Then integrate, freeze new bytes and repeat the complete npm gate before any fresh receipt/push. QA/prod deployment remains blocked; no external owner action is currently identified.
