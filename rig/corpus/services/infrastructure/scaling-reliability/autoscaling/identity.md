# infrastructure.scaling-reliability.autoscaling — identity

Policy grade: autoscaling owns scaling-reliability.autoscaling. Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.

Input: `rig-services/infrastructure.scaling-reliability.autoscaling.json`. Configuration validation only, so it confirms the scaling metric, a replica ceiling and the scale-to-zero flag are declared; it does not show scaling happens.

Disposition: executable.
Acceptance target: policy:infrastructure.scaling-reliability.autoscaling:minimal:autoscaling-source-code-boundary.
Declared predicates: autoscaling-source-code-boundary: `scaling_metric` is nonempty (a string or array).
