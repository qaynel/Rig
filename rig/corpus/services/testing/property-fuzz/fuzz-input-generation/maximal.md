# testing.property-fuzz.fuzz-input-generation — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for fuzz input generation. The evidence must preserve the input_seeds, reproduction_seed, unbounded_input_size inputs that determined the result. Binding checks: fuzz-input-generation-evidence-receipt.

Use a second run against unchanged fuzz input generation inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: fuzz input generation configuration validation only; declared policy does not prove running fuzz input generation behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.property-fuzz.fuzz-input-generation:evidence-replay. Given the property-fuzz.fuzz-input-generation binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.

Owned scope: `property-fuzz.fuzz-input-generation`.

Offer: Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.

Input: `rig-services/testing.property-fuzz.fuzz-input-generation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: fuzz input generation configuration validation only; declared policy does not prove running fuzz input generation behavior. Select an approved repository-owned command to verify that behavior.

minimal: input seeds — ["empty","unicode","truncated"].

mid: reproduction seed — 42.

maximal: unbounded input size — false.
