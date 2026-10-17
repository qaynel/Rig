---
date: 2026-10-14
source: agent
topics: the-overhaul
decisions:
status: superseded
summary: The four live catalogue links to the retired skill source were corrected, while the contract suite remains red on T-4.5 duplicate files.
---
Done: T-3.8 source references now point into `rig/corpus/skills/`. `node --test tests/corpus-contract.test.js` — 6 pass, 2 fail. The retired-source assertion passes; both remaining failures are the known corpus/legacy duplicate twins owned by T-4.5. T-3.8 remains open because its exact Prove command is not green. In flight: T-3.9. Next: restore the MCP disposition table assertion.
