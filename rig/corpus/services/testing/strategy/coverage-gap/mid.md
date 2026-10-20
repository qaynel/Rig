# testing.strategy.coverage-gap — mid

Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: coverage-gap-source-code-boundary, coverage-gap-strategy-context.

Trace the verdict to the existing repository's coverage gap convention, then name the source path or command that establishes it. For coverage gap, inspect the repository's actual spec, source, test, or configuration for risk_owners; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring strategy services outside the coverage gap decision for strategy.coverage-gap.

Acceptance target: policy:testing.strategy.coverage-gap:mid:coverage-gap-source-code-boundary+coverage-gap-strategy-context.

Declared predicates: coverage-gap-source-code-boundary: `uncovered_behaviors` is nonempty (a string or array); coverage-gap-strategy-context: `risk_owners` is nonempty (a string or array).
