---
date: 2026-10-20
source: agent
topics: the-overhaul, testing-strategy
decisions:
status: current
supersedes:
tags: qa-closeout, verification, defect
summary: Fresh review reproduces four runtime gaps and thin oracle cases; original migration acceptance passes on macOS and Linux, while remediation continues.
---

At 05:14 UTC the original-criteria reviewer reports fresh macOS migration 49/49 and adjacent runtime 87/87. The parent independently ran four interrupted-publication, post-validation replacement, FIFO and hardlink checks inside Linux node:22 Docker with no network; all four pass. The exact retained commands and output are in .context/2026-10-20-linux-migration.log. The independent docs/lifecycle/health batch passed 64 cases and failed the known frozen corpus pin. Wiki budget caught an overgrown release hub; historical narrative was compacted into a pointer to the generated reasoning index.

The binding-delta review reproduced four editable defects: negative Context findings can still receive Evidence passes, grade commands continue after a read-only mutation, a legacy network disable can report protected, and malformed network category actions can report protected. A separate fixing turn now owns these runtime changes and durable red-green checks. Context review will require an explicit pass/fail outcome; violations prevent promotion.

The unsigned owner patch still contains thin graft/discovery/presence/removal cases. A candidate-only worker is replacing them with real disposable public flows, actual host artifacts, signature verification and mutation evidence. That investigation also exposed gaps in public signer registration and removal verification; those are not waived by improving test names. The parent is tracing the existing setup and preimage seams before making the smallest necessary correction. Frozen bytes, owner signature, author context and two-failure attempt record remain unchanged.

Catalogue content still includes repeated cue blocks and speculative instructions to bind commands despite already-installed native predicates. Removing that glue while retaining real service offers, exact rules, fixtures and assurance limits is appropriate, but a mechanical scan alone cannot be reported as semantic signoff. A complete criterion-level evidence disposition remains in flight.
