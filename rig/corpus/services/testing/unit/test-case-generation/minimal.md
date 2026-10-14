# testing.unit.test-case-generation — minimal

Minimal establishes a non-vacuous policy boundary for test case generation. It checks behavior_cases (nonempty): behavior cases must name the concrete repository contract..

Inspect a repository-owned command or existing native check that can observe unit.test-case-generation; bind it to the input named in `rig-services/testing.unit.test-case-generation.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside unit.test-case-generation is a failure.

Acceptance target: fixture:testing.unit.test-case-generation:policy-boundary. Given source-code is present and unit.test-case-generation is selected, pass only when the repository binding evaluates unit.test-case-generation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent unit concern. A passing policy check does not establish runtime behavior.
