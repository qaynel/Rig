# testing.integration.internal-contract — property-floor slice

Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.

Policy grade slice `internal-contract-slice-property-floor`: Declare the producer schema consumers rely on. Without it compatibility has no reference, so point to the schema file.
