# testing.property-fuzz.fuzz-input-generation — identity

Policy grade: fuzz-input-generation owns property-fuzz.fuzz-input-generation. Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.

Input: `rig-services/testing.property-fuzz.fuzz-input-generation.json`. Configuration validation only, so it confirms input seeds, a reproduction seed and the unbounded-size flag are declared; it does not fuzz anything.

Disposition: executable.
Acceptance target: policy:testing.property-fuzz.fuzz-input-generation:minimal:fuzz-input-generation-source-code-boundary.
Declared predicates: fuzz-input-generation-source-code-boundary: `input_seeds` is nonempty (a string or array).
