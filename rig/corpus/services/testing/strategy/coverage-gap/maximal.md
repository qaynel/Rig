# testing.strategy.coverage-gap — maximal

Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: coverage-gap-source-code-boundary, coverage-gap-strategy-context, coverage-gap-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:testing.strategy.coverage-gap:maximal:coverage-gap-source-code-boundary+coverage-gap-strategy-context+coverage-gap-evidence-receipt.

Declared predicates: coverage-gap-source-code-boundary: `uncovered_behaviors` is nonempty (a string or array); coverage-gap-strategy-context: `risk_owners` is nonempty (a string or array); coverage-gap-evidence-receipt: `claim_complete_from_line_coverage` equals false.
