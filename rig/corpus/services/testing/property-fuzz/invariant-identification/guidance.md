# invariant identification

State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.

Owned scope: `property-fuzz.invariant-identification`.

Offer: State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.

Input: `rig-services/testing.property-fuzz.invariant-identification.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: invariant identification configuration validation only; declared policy does not prove running invariant identification behavior. Select an approved repository-owned command to verify that behavior.

minimal: invariants — ["sum of debits equals credits"].

mid: input domain — "nonnegative integer amounts".

maximal: derive expected from subject — false.

