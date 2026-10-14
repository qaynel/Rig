# testing.unit.mocking-strategy — minimal

Minimal establishes a non-vacuous policy boundary for mocking strategy. It checks mocked_boundaries (nonempty): mocked boundaries must name the concrete repository contract..

Trace the verdict to a repository-owned command or existing native check that can observe unit.mocking-strategy; bind it to the input named in `rig-services/testing.unit.mocking-strategy.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside unit.mocking-strategy is a failure.

Acceptance target: fixture:testing.unit.mocking-strategy:policy-boundary. Given source-code is present and unit.mocking-strategy is selected, pass only when the repository binding evaluates unit.mocking-strategy and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent unit concern. A passing policy check does not establish runtime behavior.
