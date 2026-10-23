# testing.flaky-reliability.intermittent-rca — minimal

Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.

Policy grade, minimal: Record the conditions seen when the failure occurs, such as load or ordering. Without them the cause stays a guess, so list the correlations. Binding checks: intermittent-rca-source-code-boundary.

Acceptance target: policy:testing.flaky-reliability.intermittent-rca:minimal:intermittent-rca-source-code-boundary.
Declared predicates: intermittent-rca-source-code-boundary: `observed_conditions` is nonempty (a string or array).
