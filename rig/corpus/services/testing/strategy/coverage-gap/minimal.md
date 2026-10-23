# testing.strategy.coverage-gap — minimal

Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Policy grade, minimal: List the behaviors that lack tests. Line coverage locates unused code, not unasserted outcomes, so name the behaviors. Binding checks: coverage-gap-source-code-boundary.

Acceptance target: policy:testing.strategy.coverage-gap:minimal:coverage-gap-source-code-boundary.
Declared predicates: coverage-gap-source-code-boundary: `uncovered_behaviors` is nonempty (a string or array).
