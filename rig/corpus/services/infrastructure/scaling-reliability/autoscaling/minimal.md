# infrastructure.scaling-reliability.autoscaling — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for autoscaling. The minimal boundary for autoscaling checks scaling_metric (nonempty): scaling metric must name the concrete repository contract.. Binding checks: autoscaling-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe scaling-reliability.autoscaling; bind it to the input named in `rig-services/infrastructure.scaling-reliability.autoscaling.json` and preserve the check's failure status. When adopting this in an existing repository, connect autoscaling to the command that inspects scaling_metric and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside scaling-reliability.autoscaling as a failure.

Acceptance target: fixture:infrastructure.scaling-reliability.autoscaling:policy-boundary. Given source-code is present and scaling-reliability.autoscaling is selected, pass only when the repository binding evaluates scaling-reliability.autoscaling and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent scaling reliability concern. The ceiling is autoscaling configuration validation only; declared policy does not prove running autoscaling behavior. Choose a repository-owned check that observes autoscaling from rig-services/infrastructure.scaling-reliability.autoscaling.json..

Service-specific evidence cues:
Offer: Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.
minimal: scaling metric — "queue depth".
mid: maximum replicas — 10.
maximal: scale to zero without wakeup — false.
