# testing.mutation.mutant-generator — property-floor slice

Policy grade slice. This slice bounds mutant generator to mutation.mutant-generator. It uses `mutant-generator-slice-property-floor` and checks mutation_operators (nonempty): mutation operators must name the concrete repository contract..

Read a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.mutation.mutant-generator.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than mutant generator configuration validation only; declared policy does not prove running mutant generator behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.

Owned scope: `mutation.mutant-generator`.

Offer: Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.

Input: `rig-services/testing.mutation.mutant-generator.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: mutant generator configuration validation only; declared policy does not prove running mutant generator behavior. Select an approved repository-owned command to verify that behavior.

minimal: mutation operators — ["negate conditional"].

mid: target paths — ["src/parser.js"].

maximal: mutate test code — false.
