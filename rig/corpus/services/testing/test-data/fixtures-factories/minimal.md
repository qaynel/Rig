# testing.test-data.fixtures-factories — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for fixtures factories. It checks fixture_defaults (nonempty): fixture defaults must name the concrete repository contract.. Binding checks: fixtures-factories-source-code-boundary.

Start from a repository-owned command or existing native check that can observe test-data.fixtures-factories; bind it to the input named in `rig-services/testing.test-data.fixtures-factories.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside test-data.fixtures-factories is a failure.

Acceptance target: fixture:testing.test-data.fixtures-factories:policy-boundary. Given source-code is present and test-data.fixtures-factories is selected, pass only when the repository binding evaluates test-data.fixtures-factories and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent test data concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.

Owned scope: `test-data.fixtures-factories`.

Offer: Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.

Input: `rig-services/testing.test-data.fixtures-factories.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: fixtures factories configuration validation only; declared policy does not prove running fixtures factories behavior. Select an approved repository-owned command to verify that behavior.

minimal: fixture defaults — ["valid account"].

mid: explicit variants — ["expired account"].

maximal: shared mutable state — false.
