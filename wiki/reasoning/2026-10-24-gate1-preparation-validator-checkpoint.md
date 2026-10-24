---
date: 2026-10-24
source: agent
topics: what-rig-is, the-two-gates, agent-working-conventions
decisions: NS-21, NS-22
status: current
supersedes: 
tags: checkpoint, traceability, gate1
summary: Owner authorisation filed and North star extended; the deterministic traceability validator is implemented, passes the real 79-row contract and is proven against six mutation classes.
---

# Gate 1 preparation — validator landed

## Done

The owner's authorisation is filed verbatim and the three product decisions it
settles are North star 21 (bounded Gate 1 preparation, no signing or general
implementation), 22 (one-to-one traceability as a shipped product feature) and
23 (reuse an existing embedding model and runtime, chosen on smallest complete
installed footprint).

The measured embedding evidence is filed separately: the naive Transformers.js
install is 380 MB and drags a mandatory LGPL native image library, while an
onnxruntime-web WASM path reproduces the same recall at 35 MB with no native
binaries.

`rig/corpus/plumbing/check-traceability.js` implements the invariant. It reads
the authored contract, journey, fixture and work-package tables directly rather
than a generated second copy, so the graph it checks is the bytes the owner
reviews and signs. It expands ID ranges, then rejects duplicate IDs, a missing
or multiple primary criterion, a criterion whose number does not match its
requirement, a shared primary criterion or test, a missing or unknown fixture,
a requirement with no journey, an unknown journey or dependency reference, a
self-dependency, a journey with no mapped requirement or no end-to-end
obligation, a package citing an unknown requirement or test, an orphaned
fixture or journey, and any requirement in no work package. An optional
`--hashes` mode binds protected files by digest so a post-approval requirement
change voids the approval until the owner amends the whole set.

On the real package it reports 79 requirements, 79 primary criteria, 79 proving
tests, 29 fixtures, 20 journeys and 11 packages, graph complete — matching the
earlier hand audit. Six mutation classes were injected into throwaway copies:
a renumbered criterion, a dropped fixture reference, an unknown journey
reference, a duplicated requirement row, a deleted journey row and a deleted
work-package row. Each produced the exact offending IDs and a nonzero exit, so
the check is not tautological.

## In flight

Wiring the validator into `scripts/`, `npm test`, the install manifest, the
corpus standards and routing, so it is a shipped product invariant rather than
a script this project happens to own.

## Next

The traceability test file covering PT-009 to PT-014 including mutation cases;
the Gate 1 signer extension that selects the new programme without touching the
signed 6.0.0 oracle, with signing and verification tests; then the remaining
proving tests in an evaluation lane kept out of the existing CI gate; then the
recorded preimplementation baseline and the signing handoff.

Nothing has been signed, committed, pushed or released, and no product work
package has been implemented.
