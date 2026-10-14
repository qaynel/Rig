# mutant generator

Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.

Owned scope: `mutation.mutant-generator`.

Offer: Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.

Input: `rig-services/testing.mutation.mutant-generator.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: mutant generator configuration validation only; declared policy does not prove running mutant generator behavior. Select an approved repository-owned command to verify that behavior.

minimal: mutation operators — ["negate conditional"].

mid: target paths — ["src/parser.js"].

maximal: mutate test code — false.

