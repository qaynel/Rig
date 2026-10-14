# infrastructure.cost.anomaly-detection — identity

anomaly detection owns cost.anomaly-detection. Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Keep sibling services in cost under their own verdicts. Inspect the configured input at `rig-services/infrastructure.cost.anomaly-detection.json`; malformed input is still attributed to that path.

Disposition: convention. Tie acceptance to the limit: anomaly detection configuration validation only; declared policy does not prove running anomaly detection behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.cost.anomaly-detection:policy-boundary. Given source-code is present and cost.anomaly-detection is selected, pass only when the repository binding evaluates cost.anomaly-detection and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cost concern.
