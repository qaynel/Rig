# readability-dry

Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Owned scope: `maintenance.readability-dry`. Input: `rig-services/testing.maintenance.readability-dry.json`.

Coverage ceiling: Configuration validation only, so it confirms scenario names, shared helpers and the hidden-assertion flag are declared; it does not read the tests.

minimal: scenario names — ["expired token is rejected"]. Name scenarios by the behavior they establish. Names like test1 explain nothing on failure, so describe the behavior.

mid: shared helpers — ["create valid account"]. List shared helpers and what setup they hold. Sharing setup that obscures the scenario hurts readability, so limit it to what clarifies.

maximal: hide assertions in helpers — false. Set hiding assertions in helpers to false. An assertion buried in a helper makes failures hard to interpret, so keep it in the test.
