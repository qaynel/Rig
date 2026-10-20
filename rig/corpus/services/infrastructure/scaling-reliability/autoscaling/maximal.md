# infrastructure.scaling-reliability.autoscaling — maximal

Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.

Policy grade, maximal: Set scale to zero without a wakeup route to false. A service scaled to zero with no wakeup is down, so provide the wakeup path first. Cumulative with minimal and mid. Binding checks: autoscaling-source-code-boundary, autoscaling-scaling-reliability-context, autoscaling-evidence-receipt.

Acceptance target: policy:infrastructure.scaling-reliability.autoscaling:maximal:autoscaling-source-code-boundary+autoscaling-scaling-reliability-context+autoscaling-evidence-receipt.
Declared predicates: autoscaling-source-code-boundary: `scaling_metric` is nonempty (a string or array); autoscaling-scaling-reliability-context: `maximum_replicas` is numeric and at least 10; autoscaling-evidence-receipt: `scale_to_zero_without_wakeup` equals false.
