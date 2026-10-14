# infrastructure.cost.utilization-analysis — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for utilization analysis. The minimal boundary for utilization analysis checks observed_resources (nonempty): observed resources must name the concrete repository contract.. Binding checks: utilization-analysis-source-code-boundary.

Use a repository-owned command or existing native check that can observe cost.utilization-analysis; bind it to the input named in `rig-services/infrastructure.cost.utilization-analysis.json` and preserve the check's failure status. When adopting this in an existing repository, connect utilization analysis to the command that inspects observed_resources and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside cost.utilization-analysis as a failure.

Acceptance target: fixture:infrastructure.cost.utilization-analysis:policy-boundary. Given source-code is present and cost.utilization-analysis is selected, pass only when the repository binding evaluates cost.utilization-analysis and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cost concern. The ceiling is utilization analysis configuration validation only; declared policy does not prove running utilization analysis behavior. Choose a repository-owned check that observes utilization analysis from rig-services/infrastructure.cost.utilization-analysis.json..

Service-specific evidence cues:
Offer: Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.
minimal: observed resources — ["cpu","memory"].
mid: observation window days — 7.
maximal: decide from single peak — false.
