# infrastructure.cost.anomaly-detection — maximal

Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Policy grade, maximal: Set ignoring missing billing data to false. Absent billing input is a gap, never evidence that spending is normal, so surface it. Cumulative with minimal and mid. Binding checks: anomaly-detection-source-code-boundary, anomaly-detection-cost-context, anomaly-detection-evidence-receipt.

Acceptance target: policy:infrastructure.cost.anomaly-detection:maximal:anomaly-detection-source-code-boundary+anomaly-detection-cost-context+anomaly-detection-evidence-receipt.
Declared predicates: anomaly-detection-source-code-boundary: `cost_baseline` is nonempty (a string or array); anomaly-detection-cost-context: `deviation_threshold_percent` is numeric and at least 25; anomaly-detection-evidence-receipt: `ignore_missing_billing_data` equals false.
