# infrastructure.scaling-reliability.autoscaling — minimal

Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.

Policy grade, minimal: Choose the metric that drives scaling, such as CPU or queue depth. Without one nothing triggers a change, so name it. Binding checks: autoscaling-source-code-boundary.

Acceptance target: policy:infrastructure.scaling-reliability.autoscaling:minimal:autoscaling-source-code-boundary.
Declared predicates: autoscaling-source-code-boundary: `scaling_metric` is nonempty (a string or array).
