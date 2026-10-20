# testing.unit.test-case-generation — minimal

Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for test case generation. The minimal boundary for test case generation checks behavior_cases (nonempty): behavior cases must name the concrete repository contract. Binding checks: test-case-generation-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe unit.test-case-generation; bind it to the input named in `rig-services/testing.unit.test-case-generation.json` and preserve the check's failure status. When adopting this in an existing repository, connect test case generation to the command that inspects behavior_cases and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside unit.test-case-generation as a failure.

Acceptance target: policy:testing.unit.test-case-generation:minimal:test-case-generation-source-code-boundary.

Declared predicates: test-case-generation-source-code-boundary: `behavior_cases` is nonempty (a string or array).
