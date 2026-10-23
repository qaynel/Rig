# infrastructure.cost.anomaly-detection — identity

Policy grade: anomaly-detection owns cost.anomaly-detection. Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Input: `rig-services/infrastructure.cost.anomaly-detection.json`. Configuration validation only, so it confirms a cost baseline, deviation threshold and the missing-data flag are declared; it does not read real billing data.

Disposition: executable.
Acceptance target: policy:infrastructure.cost.anomaly-detection:minimal:anomaly-detection-source-code-boundary.
Declared predicates: anomaly-detection-source-code-boundary: `cost_baseline` is nonempty (a string or array).
