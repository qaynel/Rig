# infrastructure.scaling-reliability.chaos-engineering — minimal

Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for chaos engineering. The minimal boundary for chaos engineering checks fault_scenarios (nonempty): fault scenarios must name the concrete repository contract. Binding checks: chaos-engineering-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe scaling-reliability.chaos-engineering; bind it to the input named in `rig-services/infrastructure.scaling-reliability.chaos-engineering.json` and preserve the check's failure status. When adopting this in an existing repository, connect chaos engineering to the command that inspects fault_scenarios and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside scaling-reliability.chaos-engineering as a failure.

Acceptance target: policy:infrastructure.scaling-reliability.chaos-engineering:minimal:chaos-engineering-source-code-boundary.

Declared predicates: chaos-engineering-source-code-boundary: `fault_scenarios` is nonempty (a string or array).
