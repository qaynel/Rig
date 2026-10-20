# infrastructure.scaling-reliability.autoscaling — identity

Policy grade: autoscaling owns scaling-reliability.autoscaling. Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.

Keep neighboring scaling-reliability services outside the autoscaling decision for scaling-reliability.autoscaling. Start from the configured input at `rig-services/infrastructure.scaling-reliability.autoscaling.json`; malformed input is still attributed to that path.

Disposition: executable. Trace the verdict to the limit: autoscaling configuration validation only; declared policy does not prove running autoscaling behavior. Choose a repository-owned check that observes autoscaling from rig-services/infrastructure.scaling-reliability.autoscaling.json.

Acceptance target: policy:infrastructure.scaling-reliability.autoscaling:minimal:autoscaling-source-code-boundary.

Declared predicates: autoscaling-source-code-boundary: `scaling_metric` is nonempty (a string or array).
