# infrastructure.scaling-reliability.autoscaling — minimal

Minimal establishes a non-vacuous policy boundary for autoscaling. It checks scaling_metric (nonempty): scaling metric must name the concrete repository contract..

Anchor the review on a repository-owned command or existing native check that can observe scaling-reliability.autoscaling; bind it to the input named in `rig-services/infrastructure.scaling-reliability.autoscaling.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside scaling-reliability.autoscaling is a failure.

Acceptance target: fixture:infrastructure.scaling-reliability.autoscaling:policy-boundary. Given source-code is present and scaling-reliability.autoscaling is selected, pass only when the repository binding evaluates scaling-reliability.autoscaling and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent scaling reliability concern. A passing policy check does not establish runtime behavior.
