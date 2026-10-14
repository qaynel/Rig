# infrastructure.cost.anomaly-detection — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for anomaly detection. It checks cost_baseline (nonempty): cost baseline must name the concrete repository contract.. Binding checks: anomaly-detection-source-code-boundary.

Read a repository-owned command or existing native check that can observe cost.anomaly-detection; bind it to the input named in `rig-services/infrastructure.cost.anomaly-detection.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside cost.anomaly-detection is a failure.

Acceptance target: fixture:infrastructure.cost.anomaly-detection:policy-boundary. Given source-code is present and cost.anomaly-detection is selected, pass only when the repository binding evaluates cost.anomaly-detection and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cost concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Owned scope: `cost.anomaly-detection`.

Offer: Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Input: `rig-services/infrastructure.cost.anomaly-detection.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: anomaly detection configuration validation only; declared policy does not prove running anomaly detection behavior. Select an approved repository-owned command to verify that behavior.

minimal: cost baseline — "weekly service spend".

mid: deviation threshold percent — 25.

maximal: ignore missing billing data — false.
