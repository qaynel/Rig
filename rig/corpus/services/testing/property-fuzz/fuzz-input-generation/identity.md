# testing.property-fuzz.fuzz-input-generation — identity

Policy grade: fuzz input generation owns property-fuzz.fuzz-input-generation. Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.

Keep neighboring property-fuzz services outside the fuzz input generation decision for property-fuzz.fuzz-input-generation. Inspect the configured input at `rig-services/testing.property-fuzz.fuzz-input-generation.json`; malformed input is still attributed to that path.

Disposition: convention. Tie acceptance to the limit: fuzz input generation configuration validation only; declared policy does not prove running fuzz input generation behavior. Choose a repository-owned check that observes fuzz input generation from rig-services/testing.property-fuzz.fuzz-input-generation.json.

Acceptance target: fixture:testing.property-fuzz.fuzz-input-generation:policy-boundary. Given source-code is present and property-fuzz.fuzz-input-generation is selected, pass only when the repository binding evaluates property-fuzz.fuzz-input-generation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent property fuzz concern.

Service-specific evidence cues:
Offer: Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.
minimal: input seeds — ["empty","unicode","truncated"].
mid: reproduction seed — 42.
maximal: unbounded input size — false.
