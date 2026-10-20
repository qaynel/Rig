# infrastructure.cost.anomaly-detection — minimal

Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Policy grade, minimal: Declare the cost baseline anomalies are compared against. Without a stable baseline any figure looks normal, so record the reference period or amount. Binding checks: anomaly-detection-source-code-boundary.

Acceptance target: policy:infrastructure.cost.anomaly-detection:minimal:anomaly-detection-source-code-boundary.
Declared predicates: anomaly-detection-source-code-boundary: `cost_baseline` is nonempty (a string or array).
