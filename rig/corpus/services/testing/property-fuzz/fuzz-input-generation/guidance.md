# fuzz-input-generation

Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.

Owned scope: `property-fuzz.fuzz-input-generation`. Input: `rig-services/testing.property-fuzz.fuzz-input-generation.json`.

Coverage ceiling: Configuration validation only, so it confirms input seeds, a reproduction seed and the unbounded-size flag are declared; it does not fuzz anything.

minimal: input seeds — ["empty","unicode","truncated"]. List the input seeds used. Without a corpus fuzzing starts blind, so name the seed inputs.

mid: reproduction seed — 42. Record the reproduction seed, a fixed value such as 42. A discovered failure must be replayable, so keep the seed.

maximal: unbounded input size — false. Set unbounded input size to false. Unbounded inputs exhaust resources, so cap size.
