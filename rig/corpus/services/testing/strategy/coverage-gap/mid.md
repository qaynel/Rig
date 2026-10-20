# testing.strategy.coverage-gap — mid

Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Policy grade, mid: Name an owner for each gap's risk. Unowned gaps are never closed, so assign a person or team. Cumulative with minimal. Binding checks: coverage-gap-source-code-boundary, coverage-gap-strategy-context.

Acceptance target: policy:testing.strategy.coverage-gap:mid:coverage-gap-source-code-boundary+coverage-gap-strategy-context.
Declared predicates: coverage-gap-source-code-boundary: `uncovered_behaviors` is nonempty (a string or array); coverage-gap-strategy-context: `risk_owners` is nonempty (a string or array).
