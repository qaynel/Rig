# infrastructure.scaling-reliability.autoscaling — minimal

Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for autoscaling. The minimal boundary for autoscaling checks scaling_metric (nonempty): scaling metric must name the concrete repository contract. Binding checks: autoscaling-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe scaling-reliability.autoscaling; bind it to the input named in `rig-services/infrastructure.scaling-reliability.autoscaling.json` and preserve the check's failure status. When adopting this in an existing repository, connect autoscaling to the command that inspects scaling_metric and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside scaling-reliability.autoscaling as a failure.

Acceptance target: policy:infrastructure.scaling-reliability.autoscaling:minimal:autoscaling-source-code-boundary.

Declared predicates: autoscaling-source-code-boundary: `scaling_metric` is nonempty (a string or array).
