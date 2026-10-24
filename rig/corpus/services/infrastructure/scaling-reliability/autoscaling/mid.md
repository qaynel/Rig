# infrastructure.scaling-reliability.autoscaling — mid

Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.

Policy grade, mid: Set a maximum replica count of at least 10 or the intended ceiling. An unbounded count can exhaust the budget, so cap it. Cumulative with minimal. Binding checks: autoscaling-source-code-boundary, autoscaling-scaling-reliability-context.

Acceptance target: policy:infrastructure.scaling-reliability.autoscaling:mid:autoscaling-source-code-boundary+autoscaling-scaling-reliability-context.
Declared predicates: autoscaling-source-code-boundary: `scaling_metric` is nonempty (a string or array); autoscaling-scaling-reliability-context: `maximum_replicas` is numeric and at least 10.
