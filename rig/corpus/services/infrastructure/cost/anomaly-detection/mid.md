# infrastructure.cost.anomaly-detection — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for anomaly detection; it does not widen ownership beyond cost.anomaly-detection. For anomaly detection, inspect these context signals: deviation_threshold_percent. Binding checks: anomaly-detection-cost-context.

Ground the decision in the existing repository's anomaly detection convention, then name the source path or command that establishes it. For anomaly detection, inspect the repository's actual spec, source, test, or configuration for deviation_threshold_percent; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring cost services outside the anomaly detection decision for cost.anomaly-detection.

Acceptance target: fixture:infrastructure.cost.anomaly-detection:repository-context. Given cost.anomaly-detection has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent cost concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.
minimal: cost baseline — "weekly service spend".
mid: deviation threshold percent — 25.
maximal: ignore missing billing data — false.
