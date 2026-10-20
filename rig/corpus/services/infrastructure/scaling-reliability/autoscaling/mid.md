# infrastructure.scaling-reliability.autoscaling — mid

Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: autoscaling-source-code-boundary, autoscaling-scaling-reliability-context.

Inspect the existing repository's autoscaling convention, then name the source path or command that establishes it. For autoscaling, inspect the repository's actual spec, source, test, or configuration for maximum_replicas; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring scaling-reliability services outside the autoscaling decision for scaling-reliability.autoscaling.

Acceptance target: policy:infrastructure.scaling-reliability.autoscaling:mid:autoscaling-source-code-boundary+autoscaling-scaling-reliability-context.

Declared predicates: autoscaling-source-code-boundary: `scaling_metric` is nonempty (a string or array); autoscaling-scaling-reliability-context: `maximum_replicas` is numeric and at least 10.
