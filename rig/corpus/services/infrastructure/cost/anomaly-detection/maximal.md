# infrastructure.cost.anomaly-detection — maximal

Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: anomaly-detection-source-code-boundary, anomaly-detection-cost-context, anomaly-detection-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:infrastructure.cost.anomaly-detection:maximal:anomaly-detection-source-code-boundary+anomaly-detection-cost-context+anomaly-detection-evidence-receipt.

Declared predicates: anomaly-detection-source-code-boundary: `cost_baseline` is nonempty (a string or array); anomaly-detection-cost-context: `deviation_threshold_percent` is numeric and at least 25; anomaly-detection-evidence-receipt: `ignore_missing_billing_data` equals false.
