# testing.property-fuzz.fuzz-input-generation — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for fuzz input generation. It checks input_seeds (nonempty): input seeds must name the concrete repository contract.. Binding checks: fuzz-input-generation-source-code-boundary.

Read a repository-owned command or existing native check that can observe property-fuzz.fuzz-input-generation; bind it to the input named in `rig-services/testing.property-fuzz.fuzz-input-generation.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside property-fuzz.fuzz-input-generation is a failure.

Acceptance target: fixture:testing.property-fuzz.fuzz-input-generation:policy-boundary. Given source-code is present and property-fuzz.fuzz-input-generation is selected, pass only when the repository binding evaluates property-fuzz.fuzz-input-generation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent property fuzz concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.

Owned scope: `property-fuzz.fuzz-input-generation`.

Offer: Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.

Input: `rig-services/testing.property-fuzz.fuzz-input-generation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: fuzz input generation configuration validation only; declared policy does not prove running fuzz input generation behavior. Select an approved repository-owned command to verify that behavior.

minimal: input seeds — ["empty","unicode","truncated"].

mid: reproduction seed — 42.

maximal: unbounded input size — false.
