# testing.unit.test-case-generation — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for test case generation. The minimal boundary for test case generation checks behavior_cases (nonempty): behavior cases must name the concrete repository contract.. Binding checks: test-case-generation-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe unit.test-case-generation; bind it to the input named in `rig-services/testing.unit.test-case-generation.json` and preserve the check's failure status. When adopting this in an existing repository, connect test case generation to the command that inspects behavior_cases and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside unit.test-case-generation as a failure.

Acceptance target: fixture:testing.unit.test-case-generation:policy-boundary. Given source-code is present and unit.test-case-generation is selected, pass only when the repository binding evaluates unit.test-case-generation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent unit concern. The ceiling is test case generation configuration validation only; declared policy does not prove running test case generation behavior. Choose a repository-owned check that observes test case generation from rig-services/testing.unit.test-case-generation.json..

Service-specific evidence cues:
Offer: Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.
minimal: behavior cases — ["reject malformed input"].
mid: asserted outcomes — ["throws invalid record"].
maximal: assert implementation details — false.
