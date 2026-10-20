# testing.flaky-reliability.intermittent-rca — minimal

Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for intermittent rca. The minimal boundary for intermittent rca checks observed_conditions (nonempty): observed conditions must name the concrete repository contract. Binding checks: intermittent-rca-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe flaky-reliability.intermittent-rca; bind it to the input named in `rig-services/testing.flaky-reliability.intermittent-rca.json` and preserve the check's failure status. When adopting this in an existing repository, connect intermittent rca to the command that inspects observed_conditions and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside flaky-reliability.intermittent-rca as a failure.

Acceptance target: policy:testing.flaky-reliability.intermittent-rca:minimal:intermittent-rca-source-code-boundary.

Declared predicates: intermittent-rca-source-code-boundary: `observed_conditions` is nonempty (a string or array).
