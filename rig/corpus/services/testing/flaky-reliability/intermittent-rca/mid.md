# testing.flaky-reliability.intermittent-rca — mid

Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: intermittent-rca-source-code-boundary, intermittent-rca-flaky-reliability-context.

Inspect the existing repository's intermittent rca convention, then name the source path or command that establishes it. For intermittent rca, inspect the repository's actual spec, source, test, or configuration for reproduction_attempts; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring flaky-reliability services outside the intermittent rca decision for flaky-reliability.intermittent-rca.

Acceptance target: policy:testing.flaky-reliability.intermittent-rca:mid:intermittent-rca-source-code-boundary+intermittent-rca-flaky-reliability-context.

Declared predicates: intermittent-rca-source-code-boundary: `observed_conditions` is nonempty (a string or array); intermittent-rca-flaky-reliability-context: `reproduction_attempts` is nonempty (a string or array).
