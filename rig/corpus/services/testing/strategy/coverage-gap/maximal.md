# testing.strategy.coverage-gap — maximal

Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Policy grade, maximal: Set claiming completeness from line coverage to false. Executed lines are not asserted outcomes, so do not equate them. Cumulative with minimal and mid. Binding checks: coverage-gap-source-code-boundary, coverage-gap-strategy-context, coverage-gap-evidence-receipt.

Acceptance target: policy:testing.strategy.coverage-gap:maximal:coverage-gap-source-code-boundary+coverage-gap-strategy-context+coverage-gap-evidence-receipt.
Declared predicates: coverage-gap-source-code-boundary: `uncovered_behaviors` is nonempty (a string or array); coverage-gap-strategy-context: `risk_owners` is nonempty (a string or array); coverage-gap-evidence-receipt: `claim_complete_from_line_coverage` equals false.
