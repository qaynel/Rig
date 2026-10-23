# infrastructure.cost.anomaly-detection — mid

Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Policy grade, mid: Set the deviation threshold percent to at least 25. A tighter threshold alarms on ordinary variance, so choose a documented threshold of 25 or more. Cumulative with minimal. Binding checks: anomaly-detection-source-code-boundary, anomaly-detection-cost-context.

Acceptance target: policy:infrastructure.cost.anomaly-detection:mid:anomaly-detection-source-code-boundary+anomaly-detection-cost-context.
Declared predicates: anomaly-detection-source-code-boundary: `cost_baseline` is nonempty (a string or array); anomaly-detection-cost-context: `deviation_threshold_percent` is numeric and at least 25.
