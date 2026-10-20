# testing.property-fuzz.fuzz-input-generation — identity

Policy grade: fuzz input generation owns property-fuzz.fuzz-input-generation. Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.

Keep neighboring property-fuzz services outside the fuzz input generation decision for property-fuzz.fuzz-input-generation. Inspect the configured input at `rig-services/testing.property-fuzz.fuzz-input-generation.json`; malformed input is still attributed to that path.

Disposition: executable. Tie acceptance to the limit: fuzz input generation configuration validation only; declared policy does not prove running fuzz input generation behavior. Choose a repository-owned check that observes fuzz input generation from rig-services/testing.property-fuzz.fuzz-input-generation.json.

Acceptance target: policy:testing.property-fuzz.fuzz-input-generation:minimal:fuzz-input-generation-source-code-boundary.

Declared predicates: fuzz-input-generation-source-code-boundary: `input_seeds` is nonempty (a string or array).
