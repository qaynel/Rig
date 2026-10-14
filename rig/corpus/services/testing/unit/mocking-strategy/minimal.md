# testing.unit.mocking-strategy — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for mocking strategy. The minimal boundary for mocking strategy checks mocked_boundaries (nonempty): mocked boundaries must name the concrete repository contract.. Binding checks: mocking-strategy-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe unit.mocking-strategy; bind it to the input named in `rig-services/testing.unit.mocking-strategy.json` and preserve the check's failure status. When adopting this in an existing repository, connect mocking strategy to the command that inspects mocked_boundaries and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside unit.mocking-strategy as a failure.

Acceptance target: fixture:testing.unit.mocking-strategy:policy-boundary. Given source-code is present and unit.mocking-strategy is selected, pass only when the repository binding evaluates unit.mocking-strategy and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent unit concern. The ceiling is mocking strategy configuration validation only; declared policy does not prove running mocking strategy behavior. Choose a repository-owned check that observes mocking strategy from rig-services/testing.unit.mocking-strategy.json..

Service-specific evidence cues:
Offer: Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.
minimal: mocked boundaries — ["payment network"].
mid: real components — ["order service"].
maximal: mock unit under test — false.
