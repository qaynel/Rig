# testing.property-fuzz.invariant-identification — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for invariant identification. The evidence must preserve the invariants, input_domain, derive_expected_from_subject inputs that determined the result. Binding checks: invariant-identification-evidence-receipt.

Trace the verdict to a second run against unchanged invariant identification inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: invariant identification configuration validation only; declared policy does not prove running invariant identification behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.property-fuzz.invariant-identification:evidence-replay. Given the property-fuzz.invariant-identification binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.

Owned scope: `property-fuzz.invariant-identification`.

Offer: State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.

Input: `rig-services/testing.property-fuzz.invariant-identification.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: invariant identification configuration validation only; declared policy does not prove running invariant identification behavior. Select an approved repository-owned command to verify that behavior.

minimal: invariants — ["sum of debits equals credits"].

mid: input domain — "nonnegative integer amounts".

maximal: derive expected from subject — false.
