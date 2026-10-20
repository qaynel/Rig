# testing.property-fuzz.fuzz-input-generation — property-floor slice

Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.

Policy grade slice. This slice bounds fuzz input generation to property-fuzz.fuzz-input-generation. It uses `fuzz-input-generation-slice-property-floor` and checks input_seeds (nonempty): input seeds must name the concrete repository contract.