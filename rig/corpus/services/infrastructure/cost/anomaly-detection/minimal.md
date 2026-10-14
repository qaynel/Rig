# infrastructure.cost.anomaly-detection — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for anomaly detection. The minimal boundary for anomaly detection checks cost_baseline (nonempty): cost baseline must name the concrete repository contract.. Binding checks: anomaly-detection-source-code-boundary.

Read a repository-owned command or existing native check that can observe cost.anomaly-detection; bind it to the input named in `rig-services/infrastructure.cost.anomaly-detection.json` and preserve the check's failure status. When adopting this in an existing repository, connect anomaly detection to the command that inspects cost_baseline and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside cost.anomaly-detection as a failure.

Acceptance target: fixture:infrastructure.cost.anomaly-detection:policy-boundary. Given source-code is present and cost.anomaly-detection is selected, pass only when the repository binding evaluates cost.anomaly-detection and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cost concern. The ceiling is anomaly detection configuration validation only; declared policy does not prove running anomaly detection behavior. Choose a repository-owned check that observes anomaly detection from rig-services/infrastructure.cost.anomaly-detection.json..

Service-specific evidence cues:
Offer: Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.
minimal: cost baseline — "weekly service spend".
mid: deviation threshold percent — 25.
maximal: ignore missing billing data — false.
