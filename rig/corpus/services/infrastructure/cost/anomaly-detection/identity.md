# infrastructure.cost.anomaly-detection — identity

Policy grade: anomaly detection owns cost.anomaly-detection. Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Keep neighboring cost services outside the anomaly detection decision for cost.anomaly-detection. Inspect the configured input at `rig-services/infrastructure.cost.anomaly-detection.json`; malformed input is still attributed to that path.

Disposition: convention. Tie acceptance to the limit: anomaly detection configuration validation only; declared policy does not prove running anomaly detection behavior. Choose a repository-owned check that observes anomaly detection from rig-services/infrastructure.cost.anomaly-detection.json.

Acceptance target: fixture:infrastructure.cost.anomaly-detection:policy-boundary. Given source-code is present and cost.anomaly-detection is selected, pass only when the repository binding evaluates cost.anomaly-detection and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cost concern.

Service-specific evidence cues:
Offer: Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.
minimal: cost baseline — "weekly service spend".
mid: deviation threshold percent — 25.
maximal: ignore missing billing data — false.
