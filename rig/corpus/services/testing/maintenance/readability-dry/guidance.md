# readability dry

Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Owned scope: `maintenance.readability-dry`.

Offer: Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Input: `rig-services/testing.maintenance.readability-dry.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: readability dry configuration validation only; declared policy does not prove running readability dry behavior. Select an approved repository-owned command to verify that behavior.

minimal: scenario names — ["expired token is rejected"].

mid: shared helpers — ["create valid account"].

maximal: hide assertions in helpers — false.
