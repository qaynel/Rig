---
date: 2026-10-24
source: agent
topics: the-two-gates, what-rig-is
decisions: NS-21, NS-22
status: current
supersedes: 2026-10-24-gate1-preparation-validator-checkpoint.md
tags: checkpoint, gate1, signing
summary: The Gate 1 signer now selects a second programme under the same trust root with a distinct message prefix; its seven signing tests and the six traceability proving tests pass, and the acceptance lane is being authored.
---

# Gate 1 preparation — second programme signs

## Done since the last checkpoint

`scripts/check-traceability.js` delegates to the corpus implementation so the
repository and every installed project run the same bytes.

`scripts/approve-gate1.js` gained a `--programme` path. A second contract signs
with the same key, principal and namespace — one trust root — over its own
message prefix `rig-ai-sdlc-freeze-v1` and its own manifest at
`wiki/gate1/ai-sdlc/contract.manifest`, writing only
`wiki/gate1/ai-sdlc/ai-sdlc.sig`. It never touches `wiki/gate1/gate1.sig`, the
6.0.0 manifest or the signed spec files. `scripts/check-advanced-spec.js` is in
the frozen manifest and was not edited.

Two constraints shaped this. The signed oracle deep-compares `package.json`
scripts against `wiki/gate1/package-scripts.json`, so no npm script could be
added; and `test:code` globs `tests/*.test.js`, which a subdirectory does not
match. The acceptance lane therefore lives in `tests/ai-sdlc/` and runs as
`node --test tests/ai-sdlc/`, with no package.json change and no path by which a
new expected failure can redden the existing gate.

Three refusals are enforced before a signature exists: an incomplete
traceability graph, a signing key that is not the enrolled one, and replaying a
programme signature against the other programme's message.

Fourteen tests pass: six traceability proving tests over mutation fixtures and
seven signing tests, plus the repository graph audit.

## In flight

Authoring the remaining proving tests in the acceptance lane. Each builds real
fixture bytes and then asks for the product capability its criterion needs, so
the preimplementation red names the exact missing module rather than asserting
a placeholder.

## Next

Finish the lane, install the validator through the manifest and corpus
standards, record the baseline, run the full existing gate, seed the protected
manifest and write the signing handoff.

Nothing is signed, committed, pushed or released.
