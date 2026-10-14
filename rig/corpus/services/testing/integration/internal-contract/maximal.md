# testing.integration.internal-contract — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for internal contract. The evidence must preserve the producer_schema, consumer_versions, allow_breaking_change inputs that determined the result. Binding checks: internal-contract-evidence-receipt.

Ground the decision in a second run against unchanged internal contract inputs. Record the producer_schema, consumer_versions, allow_breaking_change inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this internal contract result is stale. The ceiling remains: internal contract configuration validation only; declared policy does not prove running internal contract behavior. Choose a repository-owned check that observes internal contract from rig-services/testing.integration.internal-contract.json.

Acceptance target: fixture:testing.integration.internal-contract:evidence-replay. Given the integration.internal-contract binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.
minimal: producer schema — "schemas/order.json".
mid: consumer versions — ["v1","v2"].
maximal: allow breaking change — false.
