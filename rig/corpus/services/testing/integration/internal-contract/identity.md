# testing.integration.internal-contract — identity

Policy grade: internal contract owns integration.internal-contract. Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.

Keep sibling services in integration under their own verdicts. Anchor the review on the configured input at `rig-services/testing.integration.internal-contract.json`; malformed input is still attributed to that path.

Disposition: convention. Inspect the limit: internal contract configuration validation only; declared policy does not prove running internal contract behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.integration.internal-contract:policy-boundary. Given source-code is present and integration.internal-contract is selected, pass only when the repository binding evaluates integration.internal-contract and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent integration concern.

Service-specific evidence cues:
Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.

Owned scope: `integration.internal-contract`.

Offer: Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.

Input: `rig-services/testing.integration.internal-contract.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: internal contract configuration validation only; declared policy does not prove running internal contract behavior. Select an approved repository-owned command to verify that behavior.

minimal: producer schema — "schemas/order.json".

mid: consumer versions — ["v1","v2"].

maximal: allow breaking change — false.
