# AI development standards

Take an item from intent to delivery with observable evidence. Completion means
the fix has a passing proving test, docs match behavior, trackers reflect the
actual delivered state, and an independent reviewer checked the candidate.

## Enforced when the check ships

- **A proving test actually runs and passes.** Use the shipped
  `verifyTestEvidence(target, {file, title})` checker in
  `.rig/runtime/rig/lib/ai-sdlc.js`. It launches Node's test runner against the
  current repository bytes and resolves a successful, executed exact test.
  Comments, skipped tests, todo tests, missing titles and failing tests cannot
  pass. The optional repository gate is `node scripts/check-test-evidence.js`.
  An enforced installation needs the runtime checker and a check invocation in
  its existing CI or test command. Otherwise offer this rule as guidance.

The reference guard that finds a title substring is **reference hygiene** only;
it does not prove execution. A manual evidence reason does not satisfy the
proving-test standard. A receipt from an older tree is not current evidence.

## Guidance until the repository's checks enforce it

1. Grill intent into externally observable examples and acceptance criteria.
2. Write the smallest technical design that meets them.
3. Make the acceptance tests fail for the missing behavior. Have the human sign
   the oracle and freeze it; agents never change signed tests.
4. Build test first with the smallest correct diff and reuse existing machinery.
5. Update docs and candidate tracker declarations in the same change, then
   freeze the candidate and run the full repository gate against its final bytes.
6. Have an independent reviewer assess that exact candidate. Any fix requires
   fresh tests and review evidence, per `change-management.md`.
7. Deliver through required checks and promotion, publish and verify the release,
   then close trackers. Mark actual delivery only after it happened; candidate
   readiness is a separate state.

Rig's own frozen-oracle check, coherence gate and tracker checks may enforce
these additional rules here. Offer them elsewhere as enforced only when their
checks and required infrastructure also ship and run. Graft this document into
existing contributing or agent instructions inside a managed section, preserving
all unmanaged repository text.
