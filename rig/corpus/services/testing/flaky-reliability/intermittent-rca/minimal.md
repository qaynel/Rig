# testing.flaky-reliability.intermittent-rca — minimal

Minimal establishes a non-vacuous policy boundary for intermittent rca. It checks observed_conditions (nonempty): observed conditions must name the concrete repository contract..

Anchor the review on a repository-owned command or existing native check that can observe flaky-reliability.intermittent-rca; bind it to the input named in `rig-services/testing.flaky-reliability.intermittent-rca.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside flaky-reliability.intermittent-rca is a failure.

Acceptance target: fixture:testing.flaky-reliability.intermittent-rca:policy-boundary. Given source-code is present and flaky-reliability.intermittent-rca is selected, pass only when the repository binding evaluates flaky-reliability.intermittent-rca and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent flaky reliability concern. A passing policy check does not establish runtime behavior.
