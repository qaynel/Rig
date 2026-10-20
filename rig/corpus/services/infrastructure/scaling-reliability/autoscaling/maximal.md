# infrastructure.scaling-reliability.autoscaling — maximal

Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: autoscaling-source-code-boundary, autoscaling-scaling-reliability-context, autoscaling-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:infrastructure.scaling-reliability.autoscaling:maximal:autoscaling-source-code-boundary+autoscaling-scaling-reliability-context+autoscaling-evidence-receipt.

Declared predicates: autoscaling-source-code-boundary: `scaling_metric` is nonempty (a string or array); autoscaling-scaling-reliability-context: `maximum_replicas` is numeric and at least 10; autoscaling-evidence-receipt: `scale_to_zero_without_wakeup` equals false.
