# testing.property-fuzz.fuzz-input-generation — maximal

Maximal adds a replayable evidence receipt for fuzz input generation. The evidence must preserve the input_seeds, reproduction_seed, unbounded_input_size inputs that determined the result.

Use a second run against unchanged fuzz input generation inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: fuzz input generation configuration validation only; declared policy does not prove running fuzz input generation behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.property-fuzz.fuzz-input-generation:evidence-replay. Given the property-fuzz.fuzz-input-generation binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
