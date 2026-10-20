# testing.flaky-reliability.intermittent-rca — maximal

Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: intermittent-rca-source-code-boundary, intermittent-rca-flaky-reliability-context, intermittent-rca-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:testing.flaky-reliability.intermittent-rca:maximal:intermittent-rca-source-code-boundary+intermittent-rca-flaky-reliability-context+intermittent-rca-evidence-receipt.

Declared predicates: intermittent-rca-source-code-boundary: `observed_conditions` is nonempty (a string or array); intermittent-rca-flaky-reliability-context: `reproduction_attempts` is nonempty (a string or array); intermittent-rca-evidence-receipt: `blame_randomness_without_evidence` equals false.
