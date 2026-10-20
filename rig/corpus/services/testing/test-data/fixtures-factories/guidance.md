# fixtures-factories

Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.

Owned scope: `test-data.fixtures-factories`. Input: `rig-services/testing.test-data.fixtures-factories.json`.

Coverage ceiling: Configuration validation only, so it confirms fixture defaults, explicit variants and the shared-mutable-state flag are declared; it does not build fixtures.

minimal: fixture defaults — ["valid account"]. Keep fixture defaults valid and list them. Invalid defaults hide the scenario, so declare the baseline record.

mid: explicit variants — ["expired account"]. List the explicit variants for each behavior. Implicit variants obscure what is tested, so name them.

maximal: shared mutable state — false. Set shared mutable state to false. Tests changing shared fixtures affect each other, so build fresh data per test.
