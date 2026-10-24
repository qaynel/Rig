---
date: 2026-10-24
source: agent
topics: what-rig-is, the-two-gates, agent-working-conventions
decisions: NS-21, NS-22, NS-23
status: current
supersedes: 2026-10-24-gate1-preparation-signer-checkpoint.md
tags: gate1, traceability, signing, handoff
summary: Gate 1 preparation is complete — the traceability validator ships in the install baseline, the 79 proving tests exist in an isolated lane, the signer selects the new programme under the one trust root, and the owner has an exact signing handoff.
---

# Gate 1 preparation complete

## What was authorised and what was built

The owner approved the product direction and authorised bounded contract
preparation: write the proving tests and fixtures, implement the traceability
validator, extend the signer, preserve the 6.0.0 oracle, record the baseline and
hand back a signing procedure. Signing and product implementation stay with the
owner.

**The validator.** `rig/catalog/baseline/check-traceability.js` reads the
authored contract, journey, fixture and work-package tables directly, so the
graph it checks is the same text a human reviews — there is no generated second
copy to drift. It expands ID ranges and rejects duplicate IDs, a missing or
multiple primary criterion, a criterion or test whose number does not match its
requirement, a criterion or test claimed by two requirements, a missing or
unknown fixture, a requirement with no journey, an unknown journey or
dependency reference, a self-dependency, a journey with no mapped requirement
or end-to-end obligation, a package citing an unknown requirement or test, an
orphaned fixture or journey, and any requirement in no work package. The
`--hashes` mode binds protected files by digest so a post-approval requirement
change voids the approval.

It is a product feature, not a project habit. It lives in the mandatory
installed baseline and lands as `.rig/bin/check-traceability.js` on every
default install — not behind `--with-runtime`. `rig/corpus/standards/traceability.md`
states the invariant, `rig/corpus/routing.md` makes it a pre-step 3 gate, and
the signing ceremony runs it and refuses before producing any signature.

**The acceptance lane.** All 79 proving tests exist across 24 files in
`tests/ai-sdlc/`, 83 cases including four extra signing cases. Each builds real
fixture bytes in a temporary repository and then asks for the capability its
criterion needs, so an unbuilt capability fails by name rather than by
placeholder. 14 pass, 3 are environment-bound, 66 are the preimplementation red.

**The second signing programme.** `approve-gate1.js --programme ai-sdlc` signs
under the same key, principal and namespace — one trust root — over its own
message prefix and manifest, writing only `wiki/gate1/ai-sdlc/`. Twenty-nine
files are protected: requirements, criteria, journeys, the validator and every
test file. The design, architecture, work packages and reuse plan stay editable.

## Two constraints that shaped the result

The signed 6.0.0 oracle deep-compares `package.json` scripts against
`wiki/gate1/package-scripts.json`, so no npm script could be added; and
`test:code` globs `tests/*.test.js`, which a subdirectory does not match. The
acceptance lane therefore lives in `tests/ai-sdlc/` and runs as
`node --test tests/ai-sdlc/*.test.js`. There is no path by which a new expected
failure reddens the existing gate, and no package.json change to reconcile.

Three repository fixtures recorded the new shipped entrypoint rather than being
loosened: the v5 parity differences, the containment allow-list and the
bootstrap default-install assertion. The first attempt put the validator under
`.rig/plumbing`, which the bootstrap test correctly refused on a default
install; the mandatory baseline closure is its right home.

## Measured, not assumed

The offline embedding candidate was measured end to end. The full
Transformers.js install is 380 MB and hard-imports a mandatory LGPL-3.0
`libvips` for a product that never touches an image; neither that nor
`onnxruntime-web` can be pruned. The same model through the WASM backend gives
the same recall at 35 MB, MIT and Apache-2.0 only, no native binaries, zero
network calls. That is the recommendation; the model family choice is still
open.

## Baseline and limits

`npm test` is green except `coherence.test.js`, which compares ticket
declarations against live GitHub state and fails identically on a clean `HEAD`
worktree — pre-existing, unrelated, recorded rather than worked around.

Three criteria cannot be proven here and are refusals with exact remedies, not
simulated passes: the real `sk-ssh-ed25519@openssh.com` signature needs the
device (`RIG_GATE1_HARDWARE_KEY`), and the two offline clean-install criteria
need a really downloaded public archive (`RIG_PUBLIC_ARCHIVE`). No product
capability is implemented; a written test is not a built feature. Nothing has
been signed, committed, pushed or released.
