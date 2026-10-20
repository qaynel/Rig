# internal-contract

Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.

Owned scope: `integration.internal-contract`. Input: `rig-services/testing.integration.internal-contract.json`.

Coverage ceiling: Configuration validation only, so it confirms the producer schema, consumer versions and the breaking-change flag are declared; it does not compare live schemas.

minimal: producer schema — "schemas/order.json". Declare the producer schema consumers rely on. Without it compatibility has no reference, so point to the schema file.

mid: consumer versions — ["v1","v2"]. List the consumer versions that must keep working. An empty list ignores existing callers, so name each version.

maximal: allow breaking change — false. Set allowing breaking change to false. Breaking a consumer needs a deliberate transition, not a producer-only fixture update.
