# testing.integration.internal-contract — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for internal contract; it does not widen ownership beyond integration.internal-contract. For internal contract, inspect these context signals: consumer_versions. Binding checks: internal-contract-integration-context.

Read the existing repository's internal contract convention, then name the source path or command that establishes it. For internal contract, inspect the repository's actual spec, source, test, or configuration for consumer_versions; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring integration services outside the internal contract decision for integration.internal-contract.

Acceptance target: fixture:testing.integration.internal-contract:repository-context. Given integration.internal-contract has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent integration concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.
minimal: producer schema — "schemas/order.json".
mid: consumer versions — ["v1","v2"].
maximal: allow breaking change — false.
