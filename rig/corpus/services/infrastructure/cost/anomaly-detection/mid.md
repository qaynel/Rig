# infrastructure.cost.anomaly-detection — mid

Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: anomaly-detection-source-code-boundary, anomaly-detection-cost-context.

Ground the decision in the existing repository's anomaly detection convention, then name the source path or command that establishes it. For anomaly detection, inspect the repository's actual spec, source, test, or configuration for deviation_threshold_percent; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring cost services outside the anomaly detection decision for cost.anomaly-detection.

Acceptance target: policy:infrastructure.cost.anomaly-detection:mid:anomaly-detection-source-code-boundary+anomaly-detection-cost-context.

Declared predicates: anomaly-detection-source-code-boundary: `cost_baseline` is nonempty (a string or array); anomaly-detection-cost-context: `deviation_threshold_percent` is numeric and at least 25.
