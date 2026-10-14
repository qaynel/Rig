# testing.flaky-reliability.intermittent-rca — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for intermittent rca. The minimal boundary for intermittent rca checks observed_conditions (nonempty): observed conditions must name the concrete repository contract.. Binding checks: intermittent-rca-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe flaky-reliability.intermittent-rca; bind it to the input named in `rig-services/testing.flaky-reliability.intermittent-rca.json` and preserve the check's failure status. When adopting this in an existing repository, connect intermittent rca to the command that inspects observed_conditions and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside flaky-reliability.intermittent-rca as a failure.

Acceptance target: fixture:testing.flaky-reliability.intermittent-rca:policy-boundary. Given source-code is present and flaky-reliability.intermittent-rca is selected, pass only when the repository binding evaluates flaky-reliability.intermittent-rca and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent flaky reliability concern. The ceiling is intermittent rca configuration validation only; declared policy does not prove running intermittent rca behavior. Choose a repository-owned check that observes intermittent rca from rig-services/testing.flaky-reliability.intermittent-rca.json..

Service-specific evidence cues:
Offer: Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.
minimal: observed conditions — ["parallel runs"].
mid: reproduction attempts — ["repeat with scheduler seed"].
maximal: blame randomness without evidence — false.
