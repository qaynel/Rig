# infrastructure.cost.anomaly-detection — identity

Policy grade: anomaly detection owns cost.anomaly-detection. Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Keep neighboring cost services outside the anomaly detection decision for cost.anomaly-detection. Inspect the configured input at `rig-services/infrastructure.cost.anomaly-detection.json`; malformed input is still attributed to that path.

Disposition: executable. Tie acceptance to the limit: anomaly detection configuration validation only; declared policy does not prove running anomaly detection behavior. Choose a repository-owned check that observes anomaly detection from rig-services/infrastructure.cost.anomaly-detection.json.

Acceptance target: policy:infrastructure.cost.anomaly-detection:minimal:anomaly-detection-source-code-boundary.

Declared predicates: anomaly-detection-source-code-boundary: `cost_baseline` is nonempty (a string or array).
