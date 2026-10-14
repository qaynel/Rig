# testing.property-fuzz.invariant-identification — property-floor slice

Policy grade slice. This slice bounds invariant identification to property-fuzz.invariant-identification. It uses `invariant-identification-slice-property-floor` and checks invariants (nonempty): invariants must name the concrete repository contract..

Inspect a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.property-fuzz.invariant-identification.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than invariant identification configuration validation only; declared policy does not prove running invariant identification behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.

Owned scope: `property-fuzz.invariant-identification`.

Offer: State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.

Input: `rig-services/testing.property-fuzz.invariant-identification.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: invariant identification configuration validation only; declared policy does not prove running invariant identification behavior. Select an approved repository-owned command to verify that behavior.

minimal: invariants — ["sum of debits equals credits"].

mid: input domain — "nonnegative integer amounts".

maximal: derive expected from subject — false.
