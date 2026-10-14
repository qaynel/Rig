# fuzz input generation

Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.

Owned scope: `property-fuzz.fuzz-input-generation`.

Offer: Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.

Input: `rig-services/testing.property-fuzz.fuzz-input-generation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: fuzz input generation configuration validation only; declared policy does not prove running fuzz input generation behavior. Select an approved repository-owned command to verify that behavior.

minimal: input seeds — ["empty","unicode","truncated"].

mid: reproduction seed — 42.

maximal: unbounded input size — false.

