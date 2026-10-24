---
date: 2026-10-18
source: agent
topics: host-and-ci-coverage, gate1-signing
decisions:
status: historical
supersedes:
tags: qa-closeout, host-contract
summary: Hook axes with a vendor surface but no Rig adapter now report not_integrated; remaining non-hook claims and the frozen oracle still need review.
---

The owner chose “available but not integrated” for host hooks that the vendor exposes but Rig does not install. The editable registry and contract now use `not_integrated` on supported hook axes, retain `unsupported` for absent vendor surfaces, omit fabricated runtime proof fields, and keep only a gap declaration under `.rig/host-contracts`. The focused host and MCP parity tests passed 12/12. Instruction, native skill, and MCP configuration emission claims are being checked against their actual writer paths before the host implementation can be called complete.

Gate 2 still describes only `emitted` and `unsupported`; its companion design and the frozen Gate 1 acceptance need the owner-selected third state. Gate 2 can be updated now, while the Gate 1 change remains an unsigned candidate for owner review and signing. The binding reviewer has already failed twice in the same author context; no further binding run is authorized yet. Next: align Gate 2, finish writer parity, implement the higher-grade lint receipts and fresh approval, prepare exact frozen candidate bytes, and run final checks after signing.
