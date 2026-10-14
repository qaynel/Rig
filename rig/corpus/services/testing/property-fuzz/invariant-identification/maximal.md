# testing.property-fuzz.invariant-identification — maximal

Maximal adds a replayable evidence receipt for invariant identification. The evidence must preserve the invariants, input_domain, derive_expected_from_subject inputs that determined the result.

Trace the verdict to a second run against unchanged invariant identification inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: invariant identification configuration validation only; declared policy does not prove running invariant identification behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.property-fuzz.invariant-identification:evidence-replay. Given the property-fuzz.invariant-identification binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
