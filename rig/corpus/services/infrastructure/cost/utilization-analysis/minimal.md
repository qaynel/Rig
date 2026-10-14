# infrastructure.cost.utilization-analysis — minimal

Minimal establishes a non-vacuous policy boundary for utilization analysis. It checks observed_resources (nonempty): observed resources must name the concrete repository contract..

Use a repository-owned command or existing native check that can observe cost.utilization-analysis; bind it to the input named in `rig-services/infrastructure.cost.utilization-analysis.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside cost.utilization-analysis is a failure.

Acceptance target: fixture:infrastructure.cost.utilization-analysis:policy-boundary. Given source-code is present and cost.utilization-analysis is selected, pass only when the repository binding evaluates cost.utilization-analysis and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cost concern. A passing policy check does not establish runtime behavior.
