---
date: 2026-10-18
source: agent
topics: the-overhaul, catalogue-contract, authored-service-gate
decisions:
status: current
supersedes:
tags: qa-closeout, catalogue, remediation
summary: All 115 service identities now declare the executable configuration checks their catalogue records specify; the authorship gate rejects the reproduced broken-sentence pattern.
---

The review found a declaration mismatch across almost all service packs. The canonical catalogue declares an executable native configuration check for every service, and `checks.json` supplies per-service rules, but 114 identity fragments said convention and lint-format said undefined. The identities now say executable while retaining each stated assurance ceiling: checking declared configuration does not prove live service behavior. An editable invariant walks all 115 identities against their catalogue declarations. The installed-catalogue focused suite passes 13/13.

The mechanical cleanup of the four affected fragment shapes removed the repeated doubled punctuation and orphaned `is false` sentence. The authored-body gate now rejects the exact reproduced broken-sentence pattern; its focused suite passes 10/10. This gate does not prove semantic authorship. Separate group reviews are improving the networking and mutation packs against their native rules and fixtures. The active-corpus digest in the frozen acceptance test will no longer match after these content edits, so the owner must refresh it and re-sign the complete final oracle delta. No frozen file was edited by an agent.

Next: finish the semantic group review, confirm the strongest runnable checks, integrate the owner amendment, and renew final-byte tests and review evidence. The binding-review attempt cap remains exhausted.
