# testing.flaky-reliability.intermittent-rca — maximal

Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.

Policy grade, maximal: Set blaming randomness without evidence to false. Calling it random delays finding the scheduling or resource cause, so show data. Cumulative with minimal and mid. Binding checks: intermittent-rca-source-code-boundary, intermittent-rca-flaky-reliability-context, intermittent-rca-evidence-receipt.

Acceptance target: policy:testing.flaky-reliability.intermittent-rca:maximal:intermittent-rca-source-code-boundary+intermittent-rca-flaky-reliability-context+intermittent-rca-evidence-receipt.
Declared predicates: intermittent-rca-source-code-boundary: `observed_conditions` is nonempty (a string or array); intermittent-rca-flaky-reliability-context: `reproduction_attempts` is nonempty (a string or array); intermittent-rca-evidence-receipt: `blame_randomness_without_evidence` equals false.
