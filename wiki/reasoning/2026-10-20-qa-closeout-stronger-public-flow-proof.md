---
date: 2026-10-20
source: agent
topics: the-overhaul, testing-strategy, policy-signer-recovery
decisions:
status: current
supersedes:
tags: qa-closeout, verification, recovery
summary: Real host, grade, CI and removal candidate cases pass; signed recovery registration and historical signer verification are being integrated without hardware-proof claims.
---

The shared adapter ownership correction passed 75 projection, host and bootstrap checks. The candidate-only oracle worker reports 15/16 focused cases passing after using actual onboarding, 19 marker-driven installs, six executed CI commands, 19 host artifact writer passes with collision refusals/repeats, exact preimage uninstall differences, negative Context and replay mismatches, nonce approvals, denied/granted networking, namespace verification and a real npm short-circuit sentinel. The remaining recovery case correctly failed the prior software-key/fabricated-registration acceptance rather than hiding it.

The signer worker has implemented signed setup and recovery registration with a reverified public chain. A test-only synthetic security-key protocol fixture is checked by the real OpenSSH verifier; it demonstrates signature, namespace, fingerprint, chain, side-effect and exhaustion behavior, not a hardware touch. Production generation requests OpenSSH sk enrollment with user verification required outside the repository and refuses unavailable verification or software fallback. Setup offers three recovery identities initially and more on subsequent authorized setup. Integration now ensures the current chain signer authorizes activation and historical valid signer keys can still verify a pre-rotation active policy receipt.

Public removal verification has real preimage-backed outside-edit and mode-preservation regressions. Current legacy apply is being corrected to save the original bytes instead of emitting only preimage digests. Teardown also needs to remove unchanged snapshots created while removing a graft; reporting clean with those owned files left behind is not acceptable. Missing or corrupt evidence remains an explicitly named gap and never causes snapshot restoration.

The parent renewed the real-npm interrupted-upgrade retry successfully (1/1), started a fresh whole migration run after the shared payload change, and started the complete installed 115-service good/bad/grade matrix after catalogue cleanup. Those are engineering checks; the live full release gate remains red on eight frozen old-contract cases. No current unsigned result is release authorization. The complete candidate still needs final documentation, an exact corpus pin, the owner amendment/signature, a green final-byte full gate and the separately authorized capped binding review.
