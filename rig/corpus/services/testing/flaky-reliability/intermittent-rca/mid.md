# testing.flaky-reliability.intermittent-rca — mid

Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.

Policy grade, mid: List the reproduction attempts and what each varied. Single runs cannot separate causes, so record discriminating tries. Cumulative with minimal. Binding checks: intermittent-rca-source-code-boundary, intermittent-rca-flaky-reliability-context.

Acceptance target: policy:testing.flaky-reliability.intermittent-rca:mid:intermittent-rca-source-code-boundary+intermittent-rca-flaky-reliability-context.
Declared predicates: intermittent-rca-source-code-boundary: `observed_conditions` is nonempty (a string or array); intermittent-rca-flaky-reliability-context: `reproduction_attempts` is nonempty (a string or array).
