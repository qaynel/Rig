---
date: 2026-10-18
source: agent
topics: the-overhaul, gate1-signing
decisions:
status: historical
supersedes:
tags: qa-closeout, binding-review, remediation
summary: Policy-status checks were tightened; an unsigned batched oracle amendment now covers release, catalogue, host emission, approval identity, and verifier conflicts.
---

The 2026-10-18 binding-review remediation has a draft, unsigned unfreeze request at `wiki/specs/close-everything/candidate-amendments/2026-10-18-binding-review-unfreeze-request.md`. It names the frozen prose and manifested cases whose current requirements contradict the owner-locked v6 delivery model or give false pass evidence. It also proposes `not_integrated` for host surfaces that exist but Rig does not write, and a unique signed approval identity for lint-format execution. The owner has not reviewed, applied, or signed it. The two-failure review counter remains untouched.

The policy-status correction now evaluates both the shipped legacy baseline and current dotted leaves, requires their missing/invalid controls to be reported as disabled, and applies global and section switches. Focused policy and host tests pass. The unknown-host fallback and editable expectation now report unsupported instead of claiming an emitted instruction. A separate editable probe demonstrates that the frozen Gate 1 verifier currently accepts an allowed signer without a namespace restriction; its checker change is prepared as an owner candidate, not applied.

Review of lint-format found that digesting the existing signature bytes cannot establish a fresh approval for an unchanged plan: the signed challenge contains only the plan digest and deterministic signatures can repeat. The present code-only change is provisional; completing the claim requires a newly signed nonce or receipt ID and a verified receipt at the execution boundary. Its `planCi` classifier has no production caller, while the provider-aware CI planner already exists; the frozen test still pins the classifier. Catalogue authorship and disposition reconciliation remain in flight. Next, complete editable runtime remediation and the exact owner patch, then renew all final-byte checks after signing; no binding review is authorized under the exhausted cap yet.
