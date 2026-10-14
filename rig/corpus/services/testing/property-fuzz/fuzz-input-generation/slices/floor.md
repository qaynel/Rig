# testing.property-fuzz.fuzz-input-generation — floor and mutation-floor slice

Policy grade slice. This slice bounds fuzz input generation to property-fuzz.fuzz-input-generation. It uses `fuzz-input-generation-slice-floor` and checks input_seeds (nonempty): input seeds must name the concrete repository contract..

For fuzz input generation, choose a repository example that satisfies input_seeds at the floor and mutation-floor floor, plus a failure where input seeds must name the concrete repository contract. is false. For fuzz input generation, wire `floor and mutation-floor` to `rig-services/testing.property-fuzz.fuzz-input-generation.json` and keep its verdict on input_seeds; missing evidence is a named gap, with ceiling fuzz input generation configuration validation only; declared policy does not prove running fuzz input generation behavior. Choose a repository-owned check that observes fuzz input generation from rig-services/testing.property-fuzz.fuzz-input-generation.json..

Service-specific evidence cues:
Offer: Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.
minimal: input seeds — ["empty","unicode","truncated"].
mid: reproduction seed — 42.
maximal: unbounded input size — false.
