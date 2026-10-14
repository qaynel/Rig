# infrastructure.scaling-reliability.chaos-engineering — minimal

Minimal establishes a non-vacuous policy boundary for chaos engineering. It checks fault_scenarios (nonempty): fault scenarios must name the concrete repository contract..

Anchor the review on a repository-owned command or existing native check that can observe scaling-reliability.chaos-engineering; bind it to the input named in `rig-services/infrastructure.scaling-reliability.chaos-engineering.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside scaling-reliability.chaos-engineering is a failure.

Acceptance target: fixture:infrastructure.scaling-reliability.chaos-engineering:policy-boundary. Given source-code is present and scaling-reliability.chaos-engineering is selected, pass only when the repository binding evaluates scaling-reliability.chaos-engineering and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent scaling reliability concern. A passing policy check does not establish runtime behavior.
