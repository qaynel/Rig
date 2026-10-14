# testing.property-fuzz.invariant-identification — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for invariant identification. The evidence must preserve the invariants, input_domain, derive_expected_from_subject inputs that determined the result. Binding checks: invariant-identification-evidence-receipt.

Trace the verdict to a second run against unchanged invariant identification inputs. Record the invariants, input_domain, derive_expected_from_subject inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this invariant identification result is stale. The ceiling remains: invariant identification configuration validation only; declared policy does not prove running invariant identification behavior. Choose a repository-owned check that observes invariant identification from rig-services/testing.property-fuzz.invariant-identification.json.

Acceptance target: fixture:testing.property-fuzz.invariant-identification:evidence-replay. Given the property-fuzz.invariant-identification binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.
minimal: invariants — ["sum of debits equals credits"].
mid: input domain — "nonnegative integer amounts".
maximal: derive expected from subject — false.
