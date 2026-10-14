# testing.integration.internal-contract — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for internal contract; it does not widen ownership beyond integration.internal-contract. The context signals are consumer_versions. Binding checks: internal-contract-integration-context.

Read the existing repository's internal contract convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in integration under their own verdicts.

Acceptance target: fixture:testing.integration.internal-contract:repository-context. Given integration.internal-contract has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent integration concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.

Owned scope: `integration.internal-contract`.

Offer: Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.

Input: `rig-services/testing.integration.internal-contract.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: internal contract configuration validation only; declared policy does not prove running internal contract behavior. Select an approved repository-owned command to verify that behavior.

minimal: producer schema — "schemas/order.json".

mid: consumer versions — ["v1","v2"].

maximal: allow breaking change — false.
