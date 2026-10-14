# infrastructure.scaling-reliability.chaos-engineering — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for chaos engineering. The minimal boundary for chaos engineering checks fault_scenarios (nonempty): fault scenarios must name the concrete repository contract.. Binding checks: chaos-engineering-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe scaling-reliability.chaos-engineering; bind it to the input named in `rig-services/infrastructure.scaling-reliability.chaos-engineering.json` and preserve the check's failure status. When adopting this in an existing repository, connect chaos engineering to the command that inspects fault_scenarios and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside scaling-reliability.chaos-engineering as a failure.

Acceptance target: fixture:infrastructure.scaling-reliability.chaos-engineering:policy-boundary. Given source-code is present and scaling-reliability.chaos-engineering is selected, pass only when the repository binding evaluates scaling-reliability.chaos-engineering and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent scaling reliability concern. The ceiling is chaos engineering configuration validation only; declared policy does not prove running chaos engineering behavior. Choose a repository-owned check that observes chaos engineering from rig-services/infrastructure.scaling-reliability.chaos-engineering.json..

Service-specific evidence cues:
Offer: Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.
minimal: fault scenarios — ["worker unavailable"].
mid: stop conditions — ["error budget exhausted"].
maximal: production experiment without approval — false.
