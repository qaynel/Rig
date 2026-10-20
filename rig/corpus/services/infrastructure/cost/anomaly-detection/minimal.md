# infrastructure.cost.anomaly-detection — minimal

Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for anomaly detection. The minimal boundary for anomaly detection checks cost_baseline (nonempty): cost baseline must name the concrete repository contract. Binding checks: anomaly-detection-source-code-boundary.

Read a repository-owned command or existing native check that can observe cost.anomaly-detection; bind it to the input named in `rig-services/infrastructure.cost.anomaly-detection.json` and preserve the check's failure status. When adopting this in an existing repository, connect anomaly detection to the command that inspects cost_baseline and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside cost.anomaly-detection as a failure.

Acceptance target: policy:infrastructure.cost.anomaly-detection:minimal:anomaly-detection-source-code-boundary.

Declared predicates: anomaly-detection-source-code-boundary: `cost_baseline` is nonempty (a string or array).
