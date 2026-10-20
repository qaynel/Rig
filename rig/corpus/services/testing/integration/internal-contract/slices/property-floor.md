# testing.integration.internal-contract — property-floor slice

Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.

Policy grade slice. This slice bounds internal contract to integration.internal-contract. It uses `internal-contract-slice-property-floor` and checks producer_schema (nonempty): producer schema must name the concrete repository contract.