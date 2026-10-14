# fixtures factories

Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.

Owned scope: `test-data.fixtures-factories`.

Offer: Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.

Input: `rig-services/testing.test-data.fixtures-factories.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: fixtures factories configuration validation only; declared policy does not prove running fixtures factories behavior. Select an approved repository-owned command to verify that behavior.

minimal: fixture defaults — ["valid account"].

mid: explicit variants — ["expired account"].

maximal: shared mutable state — false.

