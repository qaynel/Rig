# testing.test-data.fixtures-factories — behavior-oracle slice

Policy grade slice. This slice bounds fixtures factories to test-data.fixtures-factories. It uses `fixtures-factories-slice-behavior-oracle` and checks fixture_defaults (nonempty): fixture defaults must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.test-data.fixtures-factories.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than fixtures factories configuration validation only; declared policy does not prove running fixtures factories behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.

Owned scope: `test-data.fixtures-factories`.

Offer: Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.

Input: `rig-services/testing.test-data.fixtures-factories.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: fixtures factories configuration validation only; declared policy does not prove running fixtures factories behavior. Select an approved repository-owned command to verify that behavior.

minimal: fixture defaults — ["valid account"].

mid: explicit variants — ["expired account"].

maximal: shared mutable state — false.
