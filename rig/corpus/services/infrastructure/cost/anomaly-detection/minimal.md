# infrastructure.cost.anomaly-detection — minimal

Minimal establishes a non-vacuous policy boundary for anomaly detection. It checks cost_baseline (nonempty): cost baseline must name the concrete repository contract..

Read a repository-owned command or existing native check that can observe cost.anomaly-detection; bind it to the input named in `rig-services/infrastructure.cost.anomaly-detection.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside cost.anomaly-detection is a failure.

Acceptance target: fixture:infrastructure.cost.anomaly-detection:policy-boundary. Given source-code is present and cost.anomaly-detection is selected, pass only when the repository binding evaluates cost.anomaly-detection and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cost concern. A passing policy check does not establish runtime behavior.
